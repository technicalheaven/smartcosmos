'use strict';
import { logger } from '../libs/logger'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try{
      await queryInterface.removeColumn('tagsCount', 'siteId');
    }
    catch (err){
      console.log("error at 20221130061837-tagCount_remove_siteId.js",err);
    }
  },

  async down (queryInterface, Sequelize) {
    
  }
};
