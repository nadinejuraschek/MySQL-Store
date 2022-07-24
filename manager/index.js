import { displayProducts, updateQuant } from '../utils/products.js';

import { PROMPTS } from './prompts.js';
import chalk from 'chalk';
import { connection } from '../database/index.js';
import inquirer from 'inquirer';

export const managerPrompt = () => {
  inquirer.prompt(PROMPTS.TOOLS).then(async inquirerResponse => {
    if (inquirerResponse.selectAction === 'View Products for Sale') {
      await displayProducts();
      setTimeout(() => managerPrompt(), [5000]);
    } else if (inquirerResponse.selectAction == 'View Low Inventory') {
      displayLowInventory();
      setTimeout(() => managerPrompt(), [5000]);
    } else if (inquirerResponse.selectAction == 'Add Inventory') {
      addInventory();
    } else if (inquirerResponse.selectAction == 'Add Product') {
      addProduct();
    } else if (inquirerResponse.selectAction == 'Quit Manager') {
      connection.end();
    }
  });
};

const displayLowInventory = async () => {
  console.log(chalk.yellow('Low Inventory Items:'));
  await connection
    .query('SELECT * FROM products WHERE stock_quantity < 50')
    .then(res => {
      if (res[0].length === 0) {
        return console.log(
          'There are no items with a quantity less than 50 in your stock.'
        );
      }

      const tableArray = [];
      res[0].map(({ item_id, product_name }) => {
        tableArray.push({
          id: item_id,
          name: product_name,
        });
      });
      console.table(tableArray);
    })
    .catch(err => {
      if (err) throw err;
    });
};

const addInventory = async () => {
  console.log('Add Inventory: ');
  await connection
    .query('SELECT * FROM products')
    .then(res => {
      inquirer.prompt(PROMPTS.ADD_INVENTORY[0]).then(inquirerResponse => {
        const originalID = inquirerResponse.item_id;
        const productID = inquirerResponse.item_id - 1;
        const stockQuant = res[0][productID].stock_quantity;
        const selectedProduct = res[0][productID].product_name;

        console.log(chalk.yellow('You have selected: ' + selectedProduct));

        inquirer
          .prompt(PROMPTS.ADD_INVENTORY[1])
          .then(async inquirerResponse => {
            const itemsToAdd = Number(inquirerResponse.addInventory);
            console.log('Quantity to Add: ' + itemsToAdd);
            const newQuant = stockQuant + itemsToAdd;
            const message = () =>
              console.log(
                chalk.green(
                  `The stock quantity of ${selectedProduct} is now ${newQuant}.`
                )
              );
            await updateQuant(originalID, newQuant, message);
            managerPrompt();
          });
      });
    })
    .catch(err => {
      if (err) throw err;
    });
};

const addProduct = () => {
  console.log('Add a Product:');
  inquirer.prompt(PROMPTS.ADD_PRODUCT).then(async inquirerResponse => {
    const { departmentName, price, productName, stockQuantity } =
      inquirerResponse;

    await connection
      .query(
        `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${productName}", "${departmentName}", "${price}", "${stockQuantity}")`
      )
      .then(() => {
        console.log(chalk.green('The product has been added successfully!'));
        managerPrompt();
      })
      .catch(err => {
        if (err)
          console.log(
            chalk.red(
              'Upps! There was an error when adding the product. Please try again.'
            )
          );
      });
  });
};
