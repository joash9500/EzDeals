const express = require("express");
const db = require('../db/db')
const router = express.Router()
const bcrypt = require('bcrypt')

//add users => signup form
//delete users => admin form
//update users => update profile
//get list of users => admin

//hash passwords from user signups
function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

router.post('/', (req, res) => {
    //get JSON request from req.body of signup form
    let first_name = req.body.first_name
    let last_name = req.body.last_name
    let username = req.body.username
    let email = req.body.email
    let pw_hash = generateHash(req.body.password)
    //date joined will use PSQL CURRENT TIMESTAMP

    const sql = 'INSERT INTO users (first_name, last_name, username, email, password_hash, date_joined) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)'

    if (!first_name || !last_name || !username || !email || !pw_hash) {
        res.status(400).json({msg: 'incomplete fields'})
    } else {
        db.query(sql, [first_name, last_name, username, email, pw_hash]).then((dbUsers) => {
            res.json({msg: 'sign up successful'})
        }).catch((err) => {
            res.status(500).json({msg: 'unknown error occured when adding new user. possible server issue', err_msg: err})
        })
    }

})

module.exports = router
