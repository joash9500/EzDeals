--- DUMMY DATA

-- dummy users

INSERT INTO users (first_name, last_name, email, password_hash, date_joined) 
VALUES (
    'John',
    'Doe',
    'johndoe@gmail.com',
    '$2b$10$IIqpjkJJnfbmgDtbxGE7SupeX8NlfnMYZ.OcMlaeVpcqw5bSs8gH2',
    CURRENT_DATE
);

INSERT INTO users (first_name, last_name, email, password_hash, date_joined) 
VALUES (
    'Sam',
    'Antha',
    'samantha@gmail.com',
    '$2b$10$IIqpjkJJnfbmgDtbxGE7SupeX8NlfnMYZ.OcMlaeVpcqw5bSs8gH2',
    CURRENT_DATE
);

INSERT INTO users (first_name, last_name, email, password_hash, date_joined) 
VALUES (
    'Lucas',
    'Lee',
    'lucaslee@gmail.com',
    '$2b$10$IIqpjkJJnfbmgDtbxGE7SupeX8NlfnMYZ.OcMlaeVpcqw5bSs8gH2',
    CURRENT_DATE
);

-- dummy postings 

INSERT INTO deals (deal_name, seller, current_price, original_price, list_date, expire_date, delivery_type, users_id) 
VALUES (
    'Nike Sale',
    'NIKE',
    120,
    200,
    CURRENT_DATE,
    date '2023-01-01',
    'online',
    1
);

INSERT INTO deals (deal_name, seller, current_price, original_price, list_date, expire_date, delivery_type, users_id) 
VALUES (
    'Tommy Hilfiger Sale',
    'The Iconic',
    200,
    200,
    CURRENT_DATE,
    date '2023-01-01',
    'online',
    1
);

INSERT INTO deals (deal_name, seller, current_price, original_price, list_date, expire_date, delivery_type, users_id) 
VALUES (
    'North Face Jackets 50% off',
    'North Face',
    350,
    350,
    CURRENT_DATE,
    date '2022-08-2',
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
    FALSE
);

