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
    database: "travelEasy_db",
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
                    var originalID =  inquirerResponse.order_id;
                    var productID = inquirerResponse.order_id-1;
                    console.log("Original ID: " + originalID);
                    console.log("Product ID: " + productID);
                    console.log("You have selected: " + res[productID].product_name);
                inquirer.prompt([
                    {
                        name: "order_quantity",
                        message: "How many would you like to purchase?"
                    }]).then(function (inquirerResponse) {
                        var orderedQuant = inquirerResponse.order_quantity;
                        var stockQuant = res[productID].stock_quantity;
                    console.log("Ordered Quantity: " + orderedQuant);
                        if (orderedQuant > stockQuant) {
                            console.log("Unfortunately, we are running too low on this product to complete your order. Please change the quantity of your order.");
                            keepShopping();
                        } else {
                            var remainingQuant = stockQuant - orderedQuant;
                            connection.query( "UPDATE products SET ? WHERE ?",
                                [
                                  {
                                    stock_quantity: remainingQuant
                                  },
                                  {
                                    item_id: originalID
                                  }
                                ], function() {
                                        console.log("Remaining Quantity: " + remainingQuant);
                                        console.log("Your order has been placed! Thank you for shopping with us!");
                                        keepShopping();
                                    });
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

function keepShopping() {
    inquirer.prompt([
        {
            name: "keepShopping",
            type: "rawlist",
            message: "Would you like to keep shopping?",
            choices: ["YES", "NO"]
        }
    ]).then(function (inquirerResponse) {
       if (inquirerResponse.keepShopping.toUpperCase() == "YES") {
           customerPrompt();
       } else {
           connection.end();
       }
    });
}

// run app
connection.connect(function(err) {
    if (err) {
         throw err
     };
     // console.log("connected as id ", connection.threadId);
     displayWelcome();
     displayProducts();
     customerPrompt();
});

