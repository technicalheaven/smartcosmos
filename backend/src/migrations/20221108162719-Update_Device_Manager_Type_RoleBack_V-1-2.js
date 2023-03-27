'use strict';

import { logger } from "../libs/logger/index";


module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('deviceManager', 'type'),
      await queryInterface.addColumn('deviceManager', 'type', {
        type: Sequelize.ENUM,
        values: ['onPremise', 'onCloud'],
        allowNull: false,
        defaultValue:'onPremise',
        after: "url"
      })
    
    } catch(err) {

      console.log('Error-In-20221108162719-Update_Device_Manager_Type_RoleBack_V-1-2.js',err)

    }
  },
  down: async (queryInterface, Sequelize) => {

  },
}
