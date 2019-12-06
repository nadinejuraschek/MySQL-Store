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
// prompt user to buy products
function customerPrompt() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "product_id",
                message: "What is the ID of the product you are interested in?"
            }]).then(function (inquirerResponse) {
                    console.log("You have selected: " + res[inquirerResponse.product_id-1].product_name);
                inquirer.prompt([
                    {
                        name: "product_quantity",
                        message: "How many would you like to purchase?"
                    }]).then(function (inquirerResponse) {
                    console.log("Quantity: " + inquirerResponse.product_quantity);
                });
        });
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
}
connection.connect(function(err) {
    if (err) {
         throw err
     };
     // console.log("connected as id ", connection.threadId);
     displayWelcome();
     displayProducts();
     customerPrompt();
     connection.end();
  });

