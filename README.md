# project-4
A e-commerce site inspired by OzBargains.

# Note

## Server
1. "proxy" in the package.json is only for development purposes. It tells the development server to proxy any requests to the api server in development.
2. Since moving to fly.io for deployment, this app currently uses the IPv6 address of "::1" which is equivalent to 127.0.0.1 (in IPv4). Note to change to the correct localhost, you can check this via the terminal typing "ping localhost", and update the "proxy" address in package.json as required.

## Database
1. the database is "deals" and was built using PostgresSQL 
2. the schema.sql and seed.sql are the starting data files for the app
3. 