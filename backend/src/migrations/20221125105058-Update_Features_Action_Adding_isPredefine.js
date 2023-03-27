const { NONE } = require("sequelize");
const { NotNull } = require("sequelize-typescript");
const {FeatureAction } = require('../config/db');

module.exports = {
  async up (queryInterface, Sequelize)
    {
   try{
      await Promise.all([
      
      queryInterface.addColumn('featureActions', 'isPredefined', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue:false,
        after:"isActive",
      })
     
    ])
    } catch(err) {
      console.log('Error at 20221125105058-Update_Features_Action_Adding_isPredefine.js',err)
    }
  },

  async down (queryInterface)
  {
    try{
     return Promise.all([queryInterface.removeColumn('featureActions', 'isPredefined')]);
      } catch(err) {
        console.log('Error at 20221125105058-Update_Features_Action_Adding_isPredefine.js down',err)
      }
  },
};