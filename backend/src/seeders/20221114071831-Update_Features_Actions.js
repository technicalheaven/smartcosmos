'use strict';

const { v4: uuidv4 } = require("uuid");
const {FeatureAction } = require('../config/db');
import { logger } from '../libs/logger'



module.exports = {
    async up(queryInterface, Sequelize) {

        try {
                  const data= await FeatureAction.findOne({where:{name:'Digitization'}})
                  if(data.dataValues.name==='Digitization')
                  {
                    await FeatureAction.destroy({where:{name:'Digitization'}})
                  }
            } 
            catch (err)   
            {
            logger.error("Error in Deleting FeatureAction Actions Digitization the data")
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
