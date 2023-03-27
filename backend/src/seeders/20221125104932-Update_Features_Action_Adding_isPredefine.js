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
                await FeatureAction.update({isPredefined:1},{where:{name:'Scan Barcode',featureId:data.dataValues.id}})
                await FeatureAction.update({isPredefined:1},{where:{name:'Create File',featureId:data.dataValues.id}})
              } 
            } 
            catch (err)   
            {
            logger.error("Error in Updating FeatureAction Actions ")
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
