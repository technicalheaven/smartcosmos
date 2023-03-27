'use strict';

import { logger } from "../libs/logger/index";


module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('userRoles', 'homeSite', {
        type: Sequelize.STRING,
        allowNull: true,
      })
    
    } catch(err) {

      console.log('add-new-field-in-UserRoles',err)

    }
  },
  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('userRoles', 'homeSite')

  },
}
