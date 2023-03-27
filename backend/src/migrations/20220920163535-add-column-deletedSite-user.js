'use strict';

import { logger } from "../libs/logger/index";


module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('userRoles', 'deletedSite', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "",
      })
    
    } catch(err) {

      console.log('20220920163535-add-column-deletedSite-user.js',err)

    }
  },
  down: async (queryInterface, Sequelize) => {
    try{
    await queryInterface.removeColumn('userRoles', 'deletedSite')
    } catch(err) {

      console.log('20220920163535-add-column-deletedSite-user.js down',err)

    }
  },
}
