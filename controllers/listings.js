//routers to be accessed by server.js
const express = require('express')
//get the db module
const db = require('../db/db')
//initiate router
const router = express.Router()

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM deals'
    db.query(sql).then((db_res) => {
        res.json(db_res.rows)
    })
})

router.get('/active', (req, res) => {
    const sql = 'SELECT * FROM deals JOIN deals_status ON deals.id = deals_status.deal_id WHERE deal_status = $1 '
    db.query(sql, ['t']).then((db_res)=> {
        res.json(db_res.rows)
    })
})

router.post('/:user_id/add', (req, res) => {

    //request data
    const del_name = req.body.deal_name
    const seller = req.body.seller
    const curr_price = req.body.current_price
    const orig_price = req.body.original_price
    const exp_date = req.body.expire_date
    const deliv_type = req.body.delivery_type

    //get user id from the request url
    const uid = req.params.user_id

    const sql = 'INSERT INTO deals (deal_name, seller, current_price, original_price, list_date, expire_date, delivery_type, users_id) VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6, $7)'

    if (!del_name || !seller || !curr_price || !orig_price || exp_date || deliv_type ) {
        res.status(400).json({msg: 'incomplete fields'})
    } else {
        db.query(sql, [del_name, seller, curr_price, orig_price, exp_date, deliv_type, uid]).then((dbRes) => {
            res.json({msg: 'add listing was successful'})
        }).catch((err) => {
            res.status(500).json({msg: 'unkown error occured when add new listing', err})
        })
    }
})

module.exports = router

//example psql query strings
'SELECT * FROM deals JOIN deals_status ON deals.id = deals_status.deal_id WHERE deal_status = $1 AND users_id = $2'