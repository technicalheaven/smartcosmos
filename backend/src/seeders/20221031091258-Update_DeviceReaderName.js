'use strict';

const { v4: uuidv4 } = require("uuid");
const {DeviceTypeModel } = require('../config/db');
import { logger } from '../libs/logger'


module.exports = {
    async up(queryInterface, Sequelize) {

        try {
            await DeviceTypeModel.update({model:'AccelIot - STARFlex Reader STR-400-F'},{where:{model:'Acceliot Mcon'}})
            } 
            catch (err) 
            {
            logger.error("Error in adding the data")
            }
      },

    async down(queryInterface, Sequelize) {
      /**
       * Add commands to revert seed here.
       *
       * Example:
       * await queryInterface.bulkDelete('People', null, {});
       */
    }
}
