CREATE TABLE users (id varchar(64) NOT NULL, 
    first_name varchar(64) NOT NULL, 
    last_name varchar(64) NOT NULL, 
    email varchar(64) NOT NULL,
    password varchar(64) NOT NULL, 
    phone varchar(64),
    id_status INT DEFAULT 0, 
    id_gender INT DEFAULT 0, 
    birth date, 
    user_address varchar(255),
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