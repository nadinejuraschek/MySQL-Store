import { createConnection, databaseConnection } from './database/index.js';

import chalk from 'chalk';
import consoleTable from 'console.table';
import { customerPrompt } from './customer/index.js';
import { displayWelcome } from './utils/welcome.js';
import inquirer from 'inquirer';
import { managerPrompt } from './manager/index.js';

export const runApp = () => {
  displayWelcome();
  inquirer
    .prompt([
      {
        name: 'operation',
        type: 'rawlist',
        message: 'Which application would you like to start?',
        choices: ['Customer', 'Manager'],
      },
    ])
    .then(answer => {
      switch (answer.operation) {
        case 'Customer':
          console.log(chalk.cyan('CUSTOMER APPLICATION'));
          console.log('---------------------------------------------');
          return customerPrompt();
        case 'Manager':
          console.log(chalk.cyan('MANAGEMENT APPLICATION'));
          console.log('---------------------------------------------');
          return managerPrompt();
        default:
          return;
      }
    });
};

const startApp = async () => {
  await createConnection();
  await databaseConnection();
};

startApp();
