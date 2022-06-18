CREATE TABLE users (id varchar(64) NOT NULL, 
    name varchar(64) NOT NULL,
    email varchar(64) NOT NULL,
    password varchar(64) NOT NULL, 
    phone varchar(64),
    status INT DEFAULT 0,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE activation (
    id INT PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
    activation_name varchar(63) NOT NULL
);

CREATE TABLE gender (
    id INT PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
    gender_name varchar(63) NOT NULL
);


--edit column
ALTER TABLE users ALTER COLUMN first_name VARCHAR(64) NOT NULL;

CREATE TABLE categories(
    id INT PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(64) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE admins(
    id VARCHAR(64) NOT NULL,
    name VARCHAR(64) NOT NULL,
    email VARCHAR(64) NOT NULL,
    password VARCHAR(64) NOT NULL,
    phone varchar(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE carts(
    id INT PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
    id_user VARCHAR(255) NOT NULL,
    id_product INT NOT NULL,
    qty INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE transactions(
    id INT PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
    id_cart INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    status INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);
-- 0 : belun bayar
-- 1 : sudah bayar & menunggu konfirmasi Pembayaran oleh admin toko
-- 2 : Pembayaran Confirmed
-- 3 : Order sedag diproses
-- 4 : Barang dalam pengiriman
-- 5 : Barang tiba ditujuan
-- 6 : Barang ada komplain


CREATE TABLE products(
    id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(64) NOT NULL,
    description VARCHAR(128) NULL,
    qty INT DEFAULT 0,
    price INT DEFAULT 0,
    id_category INT,
    image VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY(id)
);

SELECT products.*, categories.name AS name_category FROM products INNER JOIN categories ON products.id_category = categories.id;

SELECT carts.*, products.name AS name_product FROM carts INNER JOIN products ON carts.id_product = products.id WHERE carts.id_user = 2;

--join 3 tables
SELECT carts.*, products.name AS product_name, products.price AS product_price, users.first_name FROM carts INNER JOIN products ON carts.id_product = products.id INNER JOIN users ON carts.id_user = users.id WHERE carts.id_user = 1;

--get seharusnya di transactions users.id ganti saja dengan id dari variabel (gabungan 3 tabel)
SELECT transactions.id, transactions.id_cart, transactions.name, transactions.phone, carts.id_product,carts.id_user, carts.qty, users.first_name FROM transactions INNER JOIN carts ON transactions.id_cart = carts.id INNER JOIN users ON carts.id_user = users.id WHERE id_user = users.id;

--get seharusnya di transactions users.id ganti saja dengan id dari variabel (gabungan 4 tabel)
SELECT transactions.id, transactions.id_cart, transactions.name, transactions.phone, carts.id_product,carts.id_user, carts.qty, users.first_name, users.last_name, products.name AS product_name FROM transactions INNER JOIN carts ON transactions.id_cart = carts.id INNER JOIN users ON carts.id_user = users.id INNER JOIN products ON carts.id_product = products.id WHERE id_user = users.id;

SELECT COUNT(*) FROM (
    SELECT transactions.id, transactions.id_cart, transactions.name, transactions.phone, carts.id_product,carts.id_user, carts.qty, users.first_name, users.last_name, products.name FROM transactions INNER JOIN carts ON transactions.id_cart = carts.id INNER JOIN users ON carts.id_user = users.id INNER JOIN products ON carts.id_product = products.id WHERE id_user = 1
) as count_data;

