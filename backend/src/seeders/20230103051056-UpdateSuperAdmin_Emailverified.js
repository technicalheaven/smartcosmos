'use strict';

const {  User} = require('../config/db');
const { logger } = require('../libs/logger');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try{
      await User.update({emailVerifiedAt:true},{where:{name : 'SuperPlatform Admin'}});

    }
    catch  (err) {
      logger.error("Fail to update Super Admin emailverified");
    }
    
  },

  async down (queryInterface, Sequelize) {
  }
};
