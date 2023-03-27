'use strict';

const { Role } = require('../config/db')
import { logger } from '../libs/logger'

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    try{
      await Role.update({ description: "Supervisor can  control the device , process and device manager and below users ," }, { where: { name: "Supervisor" } })
      await Role.update({ description: "Project Manager can  control the device , process and device manager and below users ," }, { where: { name: "Project Manager" } })    }
    catch (err) {
      
    }
    
  },

  async down (queryInterface, Sequelize) {
    
  }
};
