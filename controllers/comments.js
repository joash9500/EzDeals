
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
    console.log(req.body)
    const data = req.body.data
    const sql = "INSERT INTO comments (body, users_id, parent_id, deal_id, created) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id, created, parent_id"
    db.query(sql, [data.body, data.users_id, data.parent_id, data.deal_id]).then((db_res) => {
        console.log(db_res)
        res.json(db_res)
    })
})

router.delete('/', (req, res) => {
    console.log(req.body)
    const id = req.body.id
    const sql = "DELETE FROM comments WHERE id = $1"
    db.query(sql, [id]).then((db_res) => {
        res.json({msg: 'success', database: db_res})
    })
})

router.put('/', (req, res) => {
    console.log("update", req.body)
    const data = req.body.data
    const sql = "UPDATE comments SET body = $1 WHERE id = $2"
    db.query(sql, [data.comment, data.comment_id]).then((db_res) => {
        res.json({msg: 'update comment was sucessful', database: db_res})
    })
})

module.exports = router