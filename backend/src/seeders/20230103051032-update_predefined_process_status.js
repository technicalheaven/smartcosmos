'use strict';

const { Process} = require('../config/db');
const { logger } = require('../libs/logger');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try{

      await Process.update({status:'Inactive'},{where:{tenantId : ' '}});

    }
    catch  (err) {
      logger.error("Fail to update predefined processes status");
    }
    
  },

  async down (queryInterface, Sequelize) {
    await Process.update({status:'Active'},{where:{tenantId : ' '}});
  }
};
