'use strict';

const { Role } = require('../config/db')
const { logger } = require('handlebars');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try{
      await Role.update({description: 'API Operator(Read Only) can Read with External API'},{where:{name:'API Operator(Read Only)'}})
    }
    catch (err) {
      
    }
    
  },

  async down (queryInterface, Sequelize) {
    
  }
};
