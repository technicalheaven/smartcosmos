'use strict';

const { v4: uuidv4 } = require("uuid");
const {FeatureAction, Feature } = require('../config/db');
import { logger } from '../libs/logger'



module.exports = {
    async up(queryInterface, Sequelize) {

        try {
              const data= await Feature.findOne({where:{name:'Digitization'}})
              if(data.dataValues.name==='Digitization')
              {
                await FeatureAction.update({name:'Scan QRcode', description:'Scan QRcode'},{where:{name:'Scan QR Code',featureId:data.dataValues.id}})
              } 
            } 
            catch (err)   
            {
            logger.error("Error in Updating FeatureAction Actions Scan QR Code to Scan QRcode", err)
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
