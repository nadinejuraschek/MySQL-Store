/*************************************
NPM PACKAGES
*************************************/
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require('console.table');

/*************************************
MYSQL
*************************************/
// connect to database
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

function displayProducts() {
    console.log("Product Overview:");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.table(res);
    });
};

/*************************************
INQUIRER
*************************************/
// 
function start() {
    displayWelcome();
    inquirer.prompt([
        {
            name: "selectAction",
            type: "rawlist",
            message: "Select a Management Tool:",
            choices: ["View Products for Sale", "View Low Inventory", "Add Inventory", "Add Products"]
        }
    ]).then(function(inquirerResponse) {
        if (inquirerResponse.selectAction == "View Products for Sale") {
            console.log("Product Overview:");
            connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;
                console.table(res);
                start();
            });
        } else if (inquirerResponse.selectAction == "View Low Inventory") {
            displayLowInventory();
            start();
        } else if (inquirerResponse.selectAction == "Add Inventory") {
                // addInventory();
            start();
        } else if (inquirerResponse.selectAction == "Add Products") {
                // addProducts();
            start();
        } else {
            connection.end();
        };
    });
};

/*************************************
MAIN CODE
*************************************/
// welcome message
function displayWelcome() {
    console.log("Welcome to TravelEasy!");
    console.log("The Online Store That Makes Packing for Your Travel Needs a Breeze");
    console.log("---------------------------------------------");
    console.log("MANAGEMENT APPLICATION");
    console.log("---------------------------------------------");
}

function displayLowInventory() {
    console.log("Low Inventory Items:");
    connection.query("SELECT * FROM products WHERE stock_quantity < 50", function(err, res) {
        if (err) throw err;
        console.table(res);
    });
};

// run app
connection.connect(function(err) {
    if (err) {
         throw err
     };
     console.log("connected as id ", connection.threadId);
     start();
});