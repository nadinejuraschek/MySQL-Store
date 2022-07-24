import { PROMPTS } from './prompts.js';
import chalk from 'chalk';
import { connection } from '../database/index.js';
import inquirer from 'inquirer';
import { updateQuant } from '../utils/products.js';

export const customerPrompt = async () => {
  await connection.query('SELECT * FROM products').then(res => {
    inquirer
      .prompt(PROMPTS.ID)
      .then(inquirerResponse => {
        const originalID = inquirerResponse.order_id;
        const productID = inquirerResponse.order_id - 1;

        console.log(
          chalk.yellow('You have selected: ' + res[0][productID].product_name)
        );

        inquirer.prompt(PROMPTS.QUANTITY).then(async inquirerResponse => {
          const orderedQuant = inquirerResponse.order_quantity;
          const stockQuant = res[0][productID].stock_quantity;

          console.log('Ordered Quantity: ' + orderedQuant);

          if (orderedQuant > stockQuant) {
            console.log(
              chalk.yellow(
                'Unfortunately, we are running too low on this product to complete your order. Please change the quantity of your order.'
              )
            );
            keepShopping();
          } else {
            const remainingQuant = stockQuant - orderedQuant;
            const message = () => {
              console.log('Remaining Quantity: ' + remainingQuant);
              console.log(
                chalk.green(
                  'Your order has been placed! Thank you for shopping with us!'
                )
              );
            };
            await updateQuant(originalID, remainingQuant, message);
            keepShopping();
          }
        });
      })
      .catch(err => {
        if (err) throw err;
      });
  });
};

const keepShopping = () => {
  inquirer.prompt(PROMPTS.KEEP_SHOPPING).then(inquirerResponse => {
    if (inquirerResponse.keepShopping.toUpperCase() == 'YES') {
      customerPrompt();
    } else {
      connection.end();
    }
  });
};
