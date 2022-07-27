--- DUMMY DATA

-- dummy users

INSERT INTO users (first_name, last_name, email, password_hash, date_joined) 
VALUES (
    'John',
    'Doe',
    'johndoe@gmail.com',
    'password',
    CURRENT_TIMESTAMP
);

INSERT INTO users (first_name, last_name, email, password_hash, date_joined) 
VALUES (
    'Sam',
    'Antha',
    'samantha@gmail.com',
    'password',
    CURRENT_TIMESTAMP
);

INSERT INTO users (first_name, last_name, email, password_hash, date_joined) 
VALUES (
    'Lucas',
    'Lee',
    'lucaslee@gmail.com',
    'password',
    CURRENT_TIMESTAMP
);

-- dummy postings 

INSERT INTO deals (deal_name, seller, current_price, original_price, list_date, expire_date, delivery_type, users_id) 
VALUES (
    'Nike Sale',
    'NIKE',
    120,
    200,
    CURRENT_TIMESTAMP,
    timestamp '2023-01-01 00:00:00',
    'online',
    1
);

INSERT INTO deals (deal_name, seller, current_price, original_price, list_date, expire_date, delivery_type, users_id) 
VALUES (
    'Tommy Hilfiger Sale',
    'The Iconic',
    200,
    200,
    CURRENT_TIMESTAMP,
    timestamp '2023-01-01 00:00:00',
    'online',
    1
);

INSERT INTO deals (deal_name, seller, current_price, original_price, list_date, expire_date, delivery_type, users_id) 
VALUES (
    'North Face Jackets 50% off',
    'North Face',
    350,
    350,
    CURRENT_TIMESTAMP,
    timestamp '2023-01-01 00:00:00',
    'online',
    1
);

INSERT INTO deals_status (deal_id, deal_status) 
VALUES (
    1,
    TRUE
);

INSERT INTO deals_status (deal_id, deal_status) 
VALUES (
    2,
    TRUE
);

INSERT INTO deals_status (deal_id, deal_status) 
VALUES (
    3,
    TRUE
);

