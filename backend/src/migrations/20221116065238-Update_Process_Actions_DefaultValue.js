const { NONE } = require("sequelize");
const { NotNull } = require("sequelize-typescript");
const {Process } = require('../config/db');

module.exports = {
  async up (queryInterface, Sequelize)
    {
    try{
    await Promise.all([
      
      queryInterface.changeColumn('processes', 'actions', {
        type: Sequelize.JSON,
        allowNull: true,    
        defaultValue:[],
      
      }),
      queryInterface.changeColumn('processes', 'steps', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue:[],
        
      }),
    ]);
    } catch(err) {
      console.log('Error at 20221116065238-Update_Process_Actions_DefaultValue.js',err)
     }
  },

  async down (queryInterface)
  {
    // return Promise.all([queryInterface.removeColumn('processes', 'isPredefined')]);
  },
};