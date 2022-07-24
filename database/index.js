import * as dotenv from 'dotenv';

import chalk from 'chalk';
import mysql from 'mysql2/promise';
import { runApp } from '../index.js';

dotenv.config();

export let connection;

export const createConnection = async () => {
  await mysql
    .createConnection({
      host: process.env.HOST,
      port: process.env.PORT,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
    })
    .then(res => {
      console.log(chalk.green('Database connected!'));
      connection = res;
    })
    .catch(err => {
      if (err) throw err;
    });
};

const createTableQuery =
  'CREATE TABLE products (item_id INT AUTO_INCREMENT PRIMARY KEY, product_name VARCHAR(255), department_name VARCHAR(255), price INT, stock_quantity INT)';

const tableExists = async () => {
  try {
    const checkForTableQuery = `SELECT 1 FROM products LIMIT 1;`;
    await connection.execute(checkForTableQuery);
  } catch (err) {
    console.log(chalk.yellow("Table 'Products' does not exist, creating..."));

    await connection
      .query(createTableQuery)
      .then(() => {
        console.log(chalk.green('Table created'));
      })
      .catch(err => {
        if (err) throw err;
      });
  }
};

export const databaseConnection = async () => {
  await tableExists();
  runApp();
};
