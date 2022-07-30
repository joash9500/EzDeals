//routers to be accessed by server.js
const express = require('express')
//get the db module
const db = require('../db/db')
//initiate router
const router = express.Router()

router.get('/api/listings', (req, res) => {
    const sql = 'SELECT * FROM deals'
    db.query(sql).then((db_res) => {
        res.json(db_res.rows)
    })
})

module.exports = router
