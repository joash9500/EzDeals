-- CREATE DATABASE deals;
-- cd deals
-- psql deals < schema.sql
-- then do the following:
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS deal CASCADE;
DROP TABLE IF EXISTS deal_status CASCADE;
DROP TABLE IF EXISTS comment CASCADE;

CREATE TABLE users (
    users_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255),
    password_hash VARCHAR(255),
    date_joined TIMESTAMP
);

CREATE TABLE deal (
    deal_id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    summary VARCHAR(100),
    vote_up INTEGER,
    vote_down INTEGER,
    added TIMESTAMP,
    starts TIMESTAMP, 
    ends TIMESTAMP,
    image_key TEXT,
    url_link TEXT,
    users_id INT REFERENCES users(users_id) ON DELETE CASCADE
);

CREATE TABLE comment (
    comment_id SERIAL PRIMARY KEY,
    body VARCHAR(255),
    users_id INT REFERENCES users(users_id) ON DELETE CASCADE,
    parent_id INT,
    created TIMESTAMP,
    deal_id INT REFERENCES deal(deal_id) ON DELETE CASCADE
);

CREATE TABLE deal_status (
    deal_status_id SERIAL PRIMARY KEY,
    deal_id INT REFERENCES deal(deal_id) ON DELETE CASCADE,
    is_active BOOLEAN
);
