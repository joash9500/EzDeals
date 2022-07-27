# Node/Express App - Heroku Guide

### Minimum Express app

This guide assumes you have run the following commands in your project folder to create a Node/Express app:

1. `npm init -y`
2. `npm install express pg`

And your `server.js` file has at least the following populated to start an app:
```js
const express = require('express');
const pg = require('pg')

const port = 3000;
const app = express();

app.get('/', (req, res) => {
  res.send('hello')
});

app.listen(port, () => {
  console.log(`server listening on port: ${port}`)
});
```

### Prep application for deployment
1. Add this **start** script to your `package.json` file:
```json
"scripts": {
  "start": "node server.js"
},
```

2. Replace the `port` variable in your `server.js` file with this line:
```js
const port = process.env.PORT || 3000;
```

3. Replace your database connection code with the following:
```js
let db;
if (process.env.NODE_ENV === 'production') {
  db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
} else {
  db = new pg.Pool({
    database: 'my_local_database_name',
    password: 'optional_password' // If you have a password on your local db
  })
}
```

4. Create a `Procfile`

Create a file called `Procfile` (note the capital P) it should contain this:
```
web: npm start
```

5. Add the following environment variables in your Heroku dashboard [by following this](https://devcenter.heroku.com/articles/config-vars#using-the-heroku-dashboard) (it might already be there):
```
NODE_ENV=production
EXPRESS_SESSION_SECRET_KEY=<generated your own random secret key>
```

### Deploy to Heroku
1. [Download Heroku](https://devcenter.heroku.com/articles/getting-started-with-ruby#set-up)
2. After installing, run in terminal: `heroku login`
3. Make sure you are in your app's root directory, its the one with the `server.js` file and the `.git` folder should be in the same place.
4. Create heroku app: `heroku create`
5. Deploy app: `git push heroku main`

Each one of you can have your own Heroku project so you can each test it out independently (if you like), but you also might like to have one that's the 'official' one that is shared and only uses the `main` branch. See: https://devcenter.heroku.com/articles/github-integration#automatic-deploys

### Database + Config values

You'll need to add a database for your new app:

```
heroku addons:create heroku-postgresql:hobby-dev
```

For more database stuff, see the [Project 2 Heroku Cheatsheet](https://gist.git.generalassemb.ly/katie/2b04e662ffc32713aad1b07747aceed9)

#### Troubleshooting
* `heroku logs` to see what's wrong
* `heroku pg:psql` manually access database to run SQL.
