
const express = require('express')

const db = require('../db/db')

const router = express.Router()

//select all comments (WIP)
router.get('/', (req, res) => {
    console.log('running: ',req.query)
    const sql = 'SELECT comments.id, body, users_id, parent_id, created, deal_id, username FROM comments JOIN users ON comments.users_id = users.id WHERE deal_id = $1'
    db.query(sql, [req.query.deal_id]).then((db_res) => {
        res.json(db_res.rows)
    })
})

router.post('/', (req, res) => {
    const data = req.body.data
    const sql = "INSERT INTO comments (body, users_id, parent_id, deal_id, created) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING id, created"
    db.query(sql, [data.body, data.users_id, data.parent_id, data.deal_id]).then((db_res) => {
        console.log(db_res)
        res.json(db_res)
    })
})

module.exports = router