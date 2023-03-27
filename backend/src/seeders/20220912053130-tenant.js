'use strict';
const { v4: uuidv4 } = require('uuid');
import { logger } from '../libs/logger'


module.exports = {
  async up(query, sequelize) {
    try{
    await query.bulkInsert('tenants',
      [
        {
          id: uuidv4(),
          name: 'Smartcosmos',
          description: 'Smartcosmos Super Tenant',
          contact: '8899774455',
          type:'smartcosmos', 
          parent:null,
          path:null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    )
    }
    catch(error)
      {
        logger.error("Error in ", error);
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
};
