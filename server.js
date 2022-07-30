//SETUP server
const express = require("express");
require('dotenv').config()
const expressSession = require('express-session')
const pgSession = require('connect-pg-simple')(expressSession);
const db = require('./db/db')
const app = express();
const port = process.env.PORT || 3001; // Note: using a different port to normal '3000'

//routers
const listingsRouter = require('./controllers/listings')

//use routers
app.use('/', listingsRouter)

//set up sessions
app.use(expressSession({
  store: new pgSession({
      pool: db,
      createTableIfMissing: true,
  }),
  secret: process.env.EXPRESS_SESSION_SECRET_KEY,    
}))

app.use(express.static("./client/build"));

//middleware logger
app.use((req, res, next) => {
  console.log(`I am middleware! Request ${req.path}`)
  next()
})

app.get('/', (req, res) => {
  res.json({msg: 'hello!'})
})

app.get("/api/test", (req, res) => {
  res.json({ result: "success" });
});

//middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Some error occured!!' })
  next(err)
})

app.listen(port, () => {
  console.log(`Server is running on port: http://localhost:${port}`);
});

