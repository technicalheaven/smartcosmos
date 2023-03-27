'use strict';

const { v4: uuidv4 } = require("uuid");
const {FeatureAction, Feature } = require('../config/db');
import { logger } from '../libs/logger'



module.exports = {
    async up(queryInterface, Sequelize) {

        try {
              const data= await Feature.findOne({where:{name:'TrackNTrace'}})
              if(data.dataValues.name==='TrackNTrace')
              {
                await FeatureAction.update({name:'Print Label', description:'Print Label'},{where:{name:'File Upload',featureId:data.dataValues.id}})
              } 
            } 
            catch (err)   
            {
            logger.error("Error in Add New FeatureAction Actions For Track and Trace")
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
