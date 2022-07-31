//SETUP server
const express = require("express");
require('dotenv').config()
const port = process.env.PORT || 3001; // Note: using a different port to normal '3000'
//SETUP for sessions/cookies
const expressSession = require('express-session')
const pgSession = require('connect-pg-simple')(expressSession);
//SETUP for database
const db = require('./db/db')
const app = express();

//need this app.use in order to access requests in json format within the routers
app.use(express.json())

//set up sessions and cookies. note this needs to be written here BEFORE using it in app.use('/api/sesions'). Javascript reads from top to bottom...
app.use(expressSession({
  store: new pgSession({
      pool: db,
      createTableIfMissing: true,
  }),
  secret: process.env.EXPRESS_SESSION_SECRET_KEY,    
}))

//routers
const listingsRouter = require('./controllers/listings')
const sessionsRouter = require('./controllers/sessions')
const usersRouter = require('./controllers/users')

//use routers
app.use('/api/listings', listingsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/users', usersRouter)

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

