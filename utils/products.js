import { connection } from '../database/index.js';

export const displayProducts = async () => {
  console.log('Product Overview:');
  await connection
    .query('SELECT * FROM products')
    .then(res => {
      if (res[0].length === 0) {
        return console.log('There are no items in stock.');
      }

      const tableArray = [];
      res[0].map(item => {
        const {
          item_id,
          department_name,
          price,
          product_name,
          stock_quantity,
        } = item;

        tableArray.push({
          id: item_id,
          name: product_name,
          department: department_name,
          price: price,
          quantity: stock_quantity,
        });
      });
      console.table(tableArray);
    })
    .catch(err => {
      if (err) throw err;
    });
};

export const updateQuant = async (id, newQuant, message) => {
  await connection
    .query('UPDATE products SET ? WHERE ?', [
      {
        stock_quantity: newQuant,
      },
      {
        item_id: id,
      },
    ])
    .then(() => {
      message();
    })
    .catch(err => {
      if (err) throw err;
    });
};
