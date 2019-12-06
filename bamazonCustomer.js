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
                name: "order_id",
                message: "What is the ID of the product you are interested in?"
            }]).then(function (inquirerResponse) {
                    var productID = inquirerResponse.order_id-1;
                    console.log("You have selected: " + res[productID].product_name);
                inquirer.prompt([
                    {
                        name: "order_quantity",
                        message: "How many would you like to purchase?"
                    }]).then(function (inquirerResponse) {
                    console.log("Quantity: " + inquirerResponse.order_quantity);
                    var remainingQuant = res[productID].stock_quantity - inquirerResponse.order_quantity;
                    if (remainingQuant < 0) {
                        console.log("Unfortunately, we are running too low on this product to complete your order. Please change the quantity of your order.");
                    } else {
                        console.log("Your order has been placed! Thank you for shopping with us!");
                    };
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

// check quantity
// function checkQuantity() {
//     var remainingQuant = res[inquirerResponse.order_id-1].stock_quantity - inquirerResponse.order_quantity;
//     console.log("Remaining Quantity: " + remainingQuant);
//     if (remainingQuant < 0) {
//         console.log("Unfortunately, we are running too low on this product to complete your order. Please change the quantity of your order.");
//         inquirer.prompt([
//             {
//                 name: "order_quantity",
//                 message: "How many would you like to purchase?"
//             }]).then(function (inquirerResponse) {
//             console.log("Quantity: " + inquirerResponse.order_quantity);
//         });
//         checkQuantity();
//     } else {
//         console.log("Your order has been placed! Thank you for shopping with us!");
//     };
// }

// run app
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

