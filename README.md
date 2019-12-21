# Travel Easy
An Amazon-like storefront built with Node.js and mySQL.

## What It Does
### Customer
When started, the app displays a table of all available products. It then takes in orders from the customer and depletes stock from the store's inventory.

### Manager
In Manager View, the following options are available:

* View Products for Sale
    All available items will be listed.
* View Low Inventory
    All items with an inventory lower than 50 will be displayed.
* Add to Inventory
    Items can be restocked.
* Add New Product
    New items can be added to the store.

### Supervision -- Coming Soon
In supervisor view, access to a second database called "departments" is granted and the following actions can be selected: 

* View Product Sales by Department
    Displays a summarized table of all items sold in the department.
* Create New Department
    A new department can be added.

## How to Run the App
### Customer
    ```
    node customer.js
    ```

### Manager
    ```
    node manager.js
    ```

### Supervisor -- Coming Soon
    ```
    node supervisor.js
    ```

## Technologies
* JavaScript

* Node.js
    * Inquirer
    * console.table

* MySQL