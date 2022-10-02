--- DUMMY DATA

-- dummy users

-- password password
INSERT INTO users (first_name, last_name, username, email, password_hash, date_joined) 
VALUES (
    'John',
    'Doe',
    'JohnDoe',
    'johndoe@gmail.com',
    '$2b$10$QoYskibVWnseDg9gHJEgC.6xqKo/48Ug3MLEQh/4aUhf/3FtHsqWK',
    CURRENT_DATE
);

INSERT INTO users (first_name, last_name, username, email, password_hash, date_joined) 
VALUES (
    'Sam',
    'Antha',
    'Samantha',
    'samantha@gmail.com',
    '$2b$10$IIqpjkJJnfbmgDtbxGE7SupeX8NlfnMYZ.OcMlaeVpcqw5bSs8gH2',
    CURRENT_DATE
);

INSERT INTO users (first_name, last_name, username, email, password_hash, date_joined) 
VALUES (
    'Lucas',
    'Lee',
    'Lucas1.0',
    'lucaslee@gmail.com',
    '$2b$10$IIqpjkJJnfbmgDtbxGE7SupeX8NlfnMYZ.OcMlaeVpcqw5bSs8gH2',
    CURRENT_DATE
);

-- dummy postings 

INSERT INTO deals (deal_name, seller, current_price, original_price, list_date, expire_date, delivery_type, image_name, users_id) 
VALUES (
    'Nike Sale',
    'NIKE',
    120,
    200,
    CURRENT_DATE,
    date '2023-01-01',
    'online',
    '7e1bb8aa4cf10589d7a460cfaf8ca874aa45476c9a44c96d42c186b3995625fb',
    1
);

INSERT INTO deals (deal_name, seller, current_price, original_price, list_date, expire_date, delivery_type, image_name, users_id) 
VALUES (
    'Tommy Hilfiger Sale',
    'The Iconic',
    100,
    200,
    CURRENT_DATE,
    date '2023-01-01',
    'online',
    '1eb4b69738772d6fc10e539c2900d839a31fd30a1207096b6b1cbb37a6a694a3',
    1
);

INSERT INTO deals (deal_name, seller, current_price, original_price, list_date, expire_date, delivery_type, image_name, users_id) 
VALUES (
    'North Face Jackets 40% off',
    'The North Face',
    200,
    400,
    CURRENT_DATE,
    date '2022-08-2',
    'online',
    '51554b222c4e8b77964f86c28d43ee03a8a0561ea7f1e4a3db7440e74e69ff3a',
    1
);

INSERT INTO comments (body, users_id, parent_id, created, deal_id)
VALUES (
    'Hey that looks amazing',
    1,
    null,
    CURRENT_TIMESTAMP,
    1
);

INSERT INTO comments (body, users_id, parent_id, created, deal_id)
VALUES (
    'I agree!',
    2,
    1,
    CURRENT_TIMESTAMP,
    1
);

INSERT INTO comments (body, users_id, parent_id, created, deal_id)
VALUES (
    'Same it looks fantastic',
    3,
    1,
    CURRENT_TIMESTAMP,
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



