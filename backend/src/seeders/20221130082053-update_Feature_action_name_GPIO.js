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
                await FeatureAction.update({name:'GPIO Light', description:'GPIO Light'},{where:{name:'GPIO-Light',featureId:data.dataValues.id}})
                await FeatureAction.update({name:'GPIO Sound', description:'GPIO Sound'},{where:{name:'GPIO-Sound',featureId:data.dataValues.id}})
              } 
            } 
            catch (err)   
            {
            logger.error("Error in Updating FeatureAction Actions GPIO-Sound to GPIO Sound  and GPIO-Light to GPIO Light")
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
