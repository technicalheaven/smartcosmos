
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
  try{  
    return Promise.all([
      queryInterface.addColumn(
        'products', // table name
        'sku', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        'products',
        'manufacturer',
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        'products',
        'type',
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        'products',
        'categories',
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        'products',
        'subCategories',
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        'products',
        'price',
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        'products',
        'color',
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        'products',
        'size',
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        'products',
        'images',
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      // rename column
      queryInterface.renameColumn('products', 'metadata', 'otherAttributes'),

    ])
    }catch(error)
    {
      console.log("error at 20220920203444-updateProduct.js",error)
    }
  },


  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('products', 'sku'),
      queryInterface.removeColumn('products', 'manufacturer'),
      queryInterface.removeColumn('products', 'type'),
      queryInterface.removeColumn('products', 'categories'),
      queryInterface.removeColumn('products', 'subCategories'),
      queryInterface.removeColumn('products', 'price'),
      queryInterface.removeColumn('products', 'color'),
      queryInterface.removeColumn('products', 'size'),
      queryInterface.removeColumn('products', 'images'),
      queryInterface.removeColumn('products', 'otherAttributes'),


    ]);
  }
}
