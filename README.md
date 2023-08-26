# project-4
An e-commerce site inspired by OzBargains.

# Technologies used
1. Typescript (bug control, quality control)
2. ReactJS (user interface, front-end)
3. MaterialUI (user interface, front-end)
4. PostgreSQL (database)
5. AWS (for image storage)
6. Javscript (backend, server)

## Server
1. "proxy" in the package.json is only for development purposes. It tells the development server to proxy any requests to the api server in development.

## Deployment requirements
1. for deployment on Railway, the ip address (or host) used is general '0.0.0.0'. Note find localhost, you can check this via the terminal typing "ping localhost", and update the "proxy" address in package.json as required.
2. for deployment on Railway with a REACT application, CI=false had to be added into the scripts in the CLIENT package.json as shown below. This will change the treatment of build errors to simple react warnings. This issue typically happens when "Automatically expose System Environment Variables" is checked in the project's Environment's Variables settings...
'''
"scripts": {
    "build": "CI=false react-scripts build"
}
''' 

## Database
1. the database is "deals" and was built using PostgresSQL 
2. the schema.sql and seed.sql are the starting data files for the app

## Features
1. CRUD for users
2. CRUD for posts including image upload into AWS and extract from AWS
3. Product "cards"
4. Comments sections
5. Add, edit and delete comments
6. Like, dislike comments

