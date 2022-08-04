
const express = require('express')

const db = require('../db/db')

const router = express.Router()

//select all comments (WIP)
router.get('/', (req, res) => {
    const sql = 'SELECT comments.id, body, users_id, parent_id, created, deal_id, username FROM comments JOIN users ON comments.users_id = users.id'
    db.query(sql).then((db_res) => {
        res.json(db_res.rows)
    })
})

module.exports = router