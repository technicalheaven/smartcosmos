'use strict';

import { logger } from "../libs/logger/index";


module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('deviceManager', 'type', {
        type: Sequelize.ENUM,
        values: ['onPremise', 'onCloud'],
        allowNull: false,
        defaultValue:'onPremise',
        after: "url"
      }),
      await queryInterface.addColumn('deviceManager', 'lastSyncAt', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue:null,
      })

     
    
    } catch(err) {

      console.log('error at 20221007054518-UpdateDeviceManager.js ',err)

    }
  },
  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('deviceManager', 'type')
    await queryInterface.removeColumn('deviceManager', 'lastSyncAt')

  },
}
