DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

DROP TABLE products;
CREATE TABLE products (
item_id INTEGER AUTO_INCREMENT,
product_name varchar(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INTEGER(7) NOT NULL,
PRIMARY KEY(item_id)
);