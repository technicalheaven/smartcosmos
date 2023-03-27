'use strict';

const { v4: uuidv4 } = require("uuid");
const { Role } = require('../config/db')
const { Permission } = require('../config/db');
import { logger } from '../libs/logger'



module.exports = {
  async up(queryInterface, Sequelize) {
      try {
          await Role.update({isPlatformRole:0 },{where:{name:'API Operator'}})
          await Role.update({isPlatformRole:0 },{where:{name:'API Operator(Read Only)'}})
          await Role.update({isPlatformRole:0 },{where:{name:'Factory Tag Operator'}})
         
          } 
          catch (err) 
        {
          logger.error("Error in adding the data")
          }
    },

  async down(queryInterface, Sequelize) {
    
   
  }
}


