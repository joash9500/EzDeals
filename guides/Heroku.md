## Heroku cheat-sheet 

### How to deploy! 
First git add and git commit, then:
```
git push heroku main
```

### Debugging with logs
```
heroku logs
```

### Adding new dependencies

If you need to install a package locally (e.g. `requests`), make sure you have activated your `venv`:
```
pip install requests
```

Heroku needs to know about this as well (so it can be installed on Heroku too). Add the library to the list in `requirements.txt`
```
Flask
gunicorn
requests
```
Then git commit that change. Then your code which uses `import requests` will work next time you deploy.

If you want to install all the packages mentioned in `requirements.txt` at once, run this:
```
pip install -r requirements.txt
```

### Database stuff

Connect to your Heroku database with `psql`:
```
heroku psql
```

Reset database (deletes ALL data):
```
heroku pg:reset
```

Copy your local database (use your own local database name) to the Heroku database: 
```
heroku pg:push local_database_name DATABASE_URL
```

If you get an error saying you don't have a database on production, run:
```
heroku addons:create heroku-postgresql:hobby-dev
```

### Configuration variables

Find out what a config variable is set to (e.g. `DATABASE_URL` or `SECRET_KEY`)
```
heroku config:get VARIBLE_NAME
```

Change a config variable:
```
heroku config:set VARIBLE_NAME=variable_value
```
