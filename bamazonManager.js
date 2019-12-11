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
            choices: ["View Products for Sale", "View Low Inventory", "Add Inventory", "Add Product", "Quit Manager"]
        }
    ]).then(function(inquirerResponse) {
        if (inquirerResponse.selectAction == "View Products for Sale") {
            console.log("Product Overview:");
            displayProducts();
        } else if (inquirerResponse.selectAction == "View Low Inventory") {
            displayLowInventory();
        } else if (inquirerResponse.selectAction == "Add Inventory") {
            addInventory();
        } else if (inquirerResponse.selectAction == "Add Product") {
            addProduct();
        } else if (inquirerResponse.selectAction == "Quit Manager") {
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

function addInventory() {
    console.log("Add Inventory: ");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "item_id",
                message: "Which item would you like to add inventory for? Please enter the item's ID:"
            }]).then(function (inquirerResponse) {
                    var originalID =  inquirerResponse.item_id;
                    var productID = inquirerResponse.item_id-1;
                    var stockQuant = res[productID].stock_quantity;
                    var selectedProduct = res[productID].product_name;
                    console.log("Original ID: " + originalID);
                    console.log("Product ID: " + productID);
                    console.log("You have selected: " + selectedProduct);

                inquirer.prompt([
                    {
                        name: "addInventory",
                        message: "How many items will be added?"
                    }]).then(function (inquirerResponse) {
                        var itemsToAdd = Number(inquirerResponse.addInventory);
                        console.log("Quantity to Add: " + itemsToAdd);
                        var newQuant = stockQuant + itemsToAdd;
                        connection.query( "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newQuant
                            },
                            {
                                item_id: originalID
                            }
                        ], function() {
                            console.log("The stock quantity of " + selectedProduct + " is now " + newQuant + ".")
                        });
                    });
                });
    });
};

function addProduct() {
    console.log("Add a Product:");
    inquirer.prompt([
        {
            name: "productName",
            message: "What is the product's name?"
        },
        {
            name: "departmentName",
            message: "Which department can it be found in?"
        },
        {
            name: "price",
            message: "What is the price per item?"
        },
        {
            name: "stockQuantity",
            message: "How many items are available?"
        }
    ]).then(function(inquirerResponse) {
        var productName = inquirerResponse.productName;
        var departmentName = inquirerResponse.departmentName;
        var price = inquirerResponse.price;
        var stockQuantity = inquirerResponse.stockQuantity;
        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + productName + "', '" + departmentName + "', '" + price + "', '" + stockQuantity + "')", function(err, res) {
            if (err) {
                console.log("Upps! There was an error when adding the product. Please try again.");
            } else {
                console.log("The product has been added successfully!");
            }
        });
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