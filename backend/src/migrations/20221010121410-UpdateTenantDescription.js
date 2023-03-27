'use strict';
import { logger } from "../libs/logger/index";

module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
        queryInterface.changeColumn('tenants', 'description', {
          type: Sequelize.STRING,
          allowNull: true,
      }),
      ])
    } catch(err) {

      console.log('error at 20221010121410-UpdateTenantDescription.js',err)

    }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};