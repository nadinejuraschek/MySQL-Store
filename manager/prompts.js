export const PROMPTS = {
  TOOLS: [
    {
      name: 'selectAction',
      type: 'rawlist',
      message: 'Select a Management Tool:',
      choices: [
        'View Products for Sale',
        'View Low Inventory',
        'Add Inventory',
        'Add Product',
        'Quit Manager',
      ],
    },
  ],
  ADD_INVENTORY: [
    {
      name: 'item_id',
      message:
        "Which item would you like to add inventory for? Please enter the item's ID:",
    },
    {
      name: 'addInventory',
      message: 'How many items will be added?',
    },
  ],
  ADD_PRODUCT: [
    {
      name: 'productName',
      message: "What is the product's name?",
    },
    {
      name: 'departmentName',
      message: 'Which department can it be found in?',
    },
    {
      name: 'price',
      message: 'What is the price per item?',
    },
    {
      name: 'stockQuantity',
      message: 'How many items are available?',
    },
  ],
};
