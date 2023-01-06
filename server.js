//SETUP server
const express = require("express");
require('dotenv').config()
const port = process.env.PORT || 8080; // Note: using a different port to normal '3000'
//SETUP for sessions/cookies
const expressSession = require('express-session')
const pgSession = require('connect-pg-simple')(expressSession);
//SETUP for database
const db = require('./db/db')
const app = express();
//need this app.use in order to access requests in json format within the express routers
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
const imagesRouter = require('./controllers/images')
const commentsRouter = require('./controllers/comments')

//use routers
app.use('/api/listings', listingsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/users', usersRouter)
app.use('/api/images', imagesRouter)
app.use('/api/comments', commentsRouter)

//need to call app.use build folder to enable react to be translated to readeable javascript for the browser
app.use(express.static("./client/build"));

//middleware logger
app.use((req, res, next) => {
  console.log(`I am middleware! Request ${req.path}`)
  next()
})

//middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Some error occured!!' })
  next(err)
})

app.listen(port,'0.0.0.0', () => {
  console.log(`Server is running on port: http://0.0.0.0:${port}`);
});

