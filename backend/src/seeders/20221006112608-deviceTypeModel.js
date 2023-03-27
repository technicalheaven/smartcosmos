'use strict';
const { DeviceTypeModel } = require('../config/db')
const { v4: uuidv4 } = require('uuid');
import { logger } from '../libs/logger'


module.exports = {
  async up (query, Sequelize) {
      try{
        await query.bulkInsert('deviceTypeModel',
          [
            {
              id: uuidv4(),
              type: 'Fixed Reader',
              model: 'Keonn Advan Reader 70',
              modelType:'Keonn',
              status:'Active',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: uuidv4(),
              type: 'Fixed Reader',
              model: 'Acceliot Mcon',
              modelType:'Mcon',
              status:'Active',
              createdAt: new Date(),
              updatedAt: new Date(),
            },

            {
              id: uuidv4(),
              type: 'Mobile Handheld Device',
              model: 'Denso BHT-80',
              modelType:'Denso',
              status:'Active',
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          ]
        )

        }
        catch(error)
          {
            logger.error("Error in excuting Default device type model seeder ");
          }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
