//AMAZON s3 server setup (to upload images)
// https://www.youtube.com/watch?v=NZElg91l_ms&ab_channel=SamMeech-Ward

const multer = require('multer')
const router = require('./listings')
//destination set for images to be stored in uploads folder...
const upload = multer({dest: 'uploads/'})

//using multa to upload the 'image' object
// router.post('/', upload.single('image'), (req, res) => {
//     //data of uploaded file is stored in
//     const file = req.file
//     //description of data
//     const description  = req.body.description

//     res.send("image uploaded")
// })

module.exports = router