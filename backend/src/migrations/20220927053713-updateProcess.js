'use strict';

import { logger } from "../libs/logger/index";


module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('processes', 'processType', {
        type: Sequelize.STRING,
        allowNull: true,
        after: "name",
        defaultValue:null
      })
    
    } catch(err) {

      console.log('Error at 20220927053713-updateProcess.js',err)

    }
  },
  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('processes', 'processType')

  },
}
