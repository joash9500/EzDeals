//AMAZON s3 server setup (to upload images)
// https://www.youtube.com/watch?v=NZElg91l_ms&ab_channel=SamMeech-Ward

const express = require('express')
//import does not work in this version of node, so we have to use require 
const multer = require('multer')
// this imports a bare-bones version of S3 that exposes the .send operation
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
//https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_request_presigner.html
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


//random image name generator
const crypto = require('crypto');
const db = require('../db/db');
require('dotenv').config()

//encrypt the image file name. need this as image files with same name will overwrite each other when posted to amazon s3
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

//get the environment variables for AWS s3
const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
})

const router = express.Router()
//store image in memory temporarily
const storage = multer.memoryStorage()
const upload = multer({ storage: storage})

//for this app, files are uploaded one at a time
//form name for file upload (in html) is 'image' so:
router.post('/', upload.single('image'), async (req, res) => {
    console.log('req body', req.body)
    console.log('req file', req.file)
    //data of uploaded file is stored in req.file
    //in the req.file, the image is stored in the buffer so,
    //bucket name in AWS: ga-project4
    req.file.buffer

    const imageName = randomImageName()

    const params = {
        Bucket: bucketName,
        Key: imageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }
    const command = new PutObjectCommand(params)
    await s3.send(command)

    //save the image file into database, after its been served to the AMAZON s3 cloud server
    const deal_id = req.body.deal_id
    
    const sql = 'UPDATE deals SET image_name = $1 WHERE id = $2'
    db.query(sql, [imageName, deal_id]).then((dbRes) => {
        res.json({msg: 'image uploaded to amazon s3 ga-project4 and updated image name' + imageName + 'for ' + deal_id + ' in psql database', dbRes})
    })

})

router.get('/', async (req, res) => {
    // console.log(req.query.deal_id)
    const deal_id = req.query.deal_id
    const sql = 'SELECT image_name FROM deals WHERE id = $1'
    const imageName = await db.query(sql, [deal_id]).catch((err) => {
        res.json({msg: err})
    })

    // console.log(imageName.rows[0].image_name)
    const imageKey = imageName.rows[0].image_name

    const getObjectParams = {
        Bucket: bucketName,
        Key: imageKey
    }

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.json({url: url})

})

module.exports = router