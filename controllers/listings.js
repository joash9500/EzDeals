//routers to be accessed by server.js
const express = require('express')
//get the db module
const db = require('../db/db')
//initiate router
const router = express.Router()

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM deal'
    db.query(sql).then((db_res) => {
        res.json(db_res.rows)
    })
})

router.get('/active', (req, res) => {
    const sql = 
    `SELECT listing.* , username
     FROM deal as listing
     JOIN deal_status as status 
     ON listing.deal_id = status.deal_status_id
     JOIN users as users
     ON listing.users_id = users.users_id
     WHERE status.is_active = $1`

    db.query(sql, ['t']).then((db_res)=> {
        res.json(db_res.rows)
    })
    
})

//NOTE: need to fix this route so its more dynamic anad able to change status from a request params! ie. change a deal to inactive or active
router.post('/active', (req,res) => {
    const sql = 'INSERT INTO deal_status (deal_status_id, is_active) VALUES ($1, $2)'
    
    db.query(sql, [req.body.deal_id, 't']).then((db_res) => {
        res.json({msg: "updated deals_status table", db_res})
    }).catch((err) => {
        res.status(500).json({msg: 'error occured when updating deal status table', err})
    })
})

router.post('/:users_id/add', (req, res) => {
    
    //request data
    const title = req.body.title
    const summary = req.body.summary
    const url_link = req.body.url_link
    const start_date = req.body.start_date
    const end_date = req.body.end_date

    //get user id from the request url
    const uid = req.params.users_id

    //this INSERT will return the id!
    const sql = 'INSERT INTO deal (title, summary, url_link, added, starts, ends, vote_up, vote_down, users_id) VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, 0, 0, $6) RETURNING deal_id'

    if (!title || !summary || !url_link || !start_date || !end_date ) {
        res.status(400).json({msg: 'incomplete fields'})
    } else {
        db.query(sql, [title, summary, url_link, start_date, end_date, uid]).then((dbRes) => {
            //return the id, after adding to database
            res.json({msg: 'add listing was successful', db: dbRes.rows[0].deal_id})
        }).catch((err) => {
            res.status(500).json({msg: 'error occured when adding new listing to deal table', err})
        })
    }
})

module.exports = router

//example psql query strings
'SELECT * FROM deals JOIN deals_status ON deals.id = deals_status.deal_id WHERE deal_status = $1 AND users_id = $2'