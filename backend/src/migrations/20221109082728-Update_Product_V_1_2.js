'use strict';

import { logger } from "../libs/logger/index";


module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      queryInterface.changeColumn('products', 'name', {
        type: Sequelize.STRING,
        allowNull: false,
      })
      queryInterface.changeColumn('products', 'description', {
        type: Sequelize.STRING,
        allowNull: false,
      })
    
    } catch(err) {

     console.log('Error at 20221109082728-Update_Product_V_1_2.js',err)

    }
  },
  down: async (queryInterface, Sequelize) => {

  },
}
