const { NONE } = require("sequelize");
const { NotNull } = require("sequelize-typescript");
const {Process } = require('../config/db');

module.exports = {
  async up (queryInterface, Sequelize)
    {
    try
    {
    await Promise.all([
      
      queryInterface.changeColumn('processes', 'createdBy', {
        type: Sequelize.STRING,
        allowNull: true,    
       
      }),
      queryInterface.changeColumn('processes', 'updatedBy', {
        type: Sequelize.STRING,
        allowNull: true,
        
      }),
    ]);
    }
    catch (err){
      console.log("error at 20221207113140-Update_Process_updatedBy.js",err);
    }
  },

  async down (queryInterface)
  {
    // return Promise.all([queryInterface.removeColumn('processes', 'isPredefined')]);
  },
};