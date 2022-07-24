export const PROMPTS = {
  ID: [
    {
      name: 'order_id',
      message: 'What is the ID of the product you are interested in?',
    },
  ],
  QUANTITY: [
    {
      name: 'order_quantity',
      message: 'How many would you like to purchase?',
    },
  ],
  KEEP_SHOPPING: [
    {
      name: 'keepShopping',
      type: 'rawlist',
      message: 'Would you like to keep shopping?',
      choices: ['YES', 'NO'],
    },
  ],
};
