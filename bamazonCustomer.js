// require npm packages
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require('console.table');

// connect to MySQL database
var connection = mysql.createConnection({
    host: "localhost",

    // port
    port: 3306,

    // username
    user: "root",

    // password
    password: "password",
    database: "bamazon",
});

connection.connect(function(err) {
   if (err) {
        throw err
    };
    console.log("connected as id ", connection.threadId);
    displayProducts()
    connection.end();
 });

function displayProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.table(res);
    });
  }  

// prompt user to buy products with inquirer
// inquirer.prompt([
    // {
    //     name: "product_id",
    //     message: "What is the ID of the product you would like to buy?"
    // }
    // }]).then(function (inquirerResponse) {
    //     console.log("ID: " + inquirerResponse.product_id);
    // });

