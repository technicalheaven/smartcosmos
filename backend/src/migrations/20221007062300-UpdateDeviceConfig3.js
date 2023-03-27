'use strict';

import { logger } from "../libs/logger/index";


module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('deviceConfig', 'deviceManagerUrl', {
        type: Sequelize.STRING,
        allowNull: true,
        after: "url"
      }),
      await queryInterface.addColumn('deviceConfig', 'lastSyncAt', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue:null,
      })
    
    } catch(err) {

      console.log('error at 20221007062300-UpdateDeviceConfig3.js ',err)

    }
  },
  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('deviceConfig', 'deviceManagerUrl')
    await queryInterface.removeColumn('deviceConfig', 'lastSyncAt')

  },
}
