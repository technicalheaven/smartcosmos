'use strict';

import { logger } from "../libs/logger/index";


module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('zones', 'siteName', {
        type: Sequelize.STRING,
        allowNull: false,
        after: "siteId"
      })
    
    } catch(err) {

      console.log('Error at 20220922085957-UpdateZone2.js',err)

    }
  },
  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('zones', 'siteName')

  },
}
