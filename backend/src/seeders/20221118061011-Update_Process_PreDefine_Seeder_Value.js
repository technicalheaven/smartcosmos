'use strict';

const { v4: uuidv4 } = require("uuid");
const {Process } = require('../config/db');
import { logger } from '../libs/logger'



module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            await Process.update({isPredefined:1 },{where:{tenantId:' '}})
            } 
            catch (err) 
            {
            logger.error("Error in adding the data")
            }
      },

    async down(queryInterface, Sequelize) {
      
      await Process.update({isPredefined:0 },{where:{tenantId:' '}})
    }
}
