-- CREATE DATABASE deals;
-- cd deals
-- psql deals < schema.sql
-- then do the following:
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS deals CASCADE;
DROP TABLE IF EXISTS deals_status CASCADE;
DROP TABLE IF EXISTS comments CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255),
    password_hash VARCHAR(255),
    date_joined TIMESTAMP
);

CREATE TABLE deals (
    id SERIAL PRIMARY KEY,
    deal_name VARCHAR(50),
    seller VARCHAR(255),
    current_price INTEGER,
    original_price INTEGER,
    list_date TIMESTAMP,
    expire_date TIMESTAMP,
    delivery_type TEXT,
    image_name TEXT,
    users_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    body VARCHAR(255),
    users_id INT REFERENCES users(id) ON DELETE CASCADE,
    parent_id INT,
    created TIMESTAMP,
    deal_id INT REFERENCES deals(id) ON DELETE CASCADE
);

CREATE TABLE deals_status (
    id SERIAL PRIMARY KEY,
    deal_id INT REFERENCES deals(id) ON DELETE CASCADE,
    deal_status BOOLEAN
);
