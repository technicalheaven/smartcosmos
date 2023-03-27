const { NONE } = require("sequelize");
const { NotNull } = require("sequelize-typescript");
const {Process } = require('../config/db');

module.exports = {
  async up (queryInterface, Sequelize)
    {
    //   await ([
    //    queryInterface.removeColumn('processes', 'actions'),
    //    queryInterface.removeColumn('processes', 'steps'),
    // ]);
    try{
    await Promise.all([
      
      queryInterface.addColumn('processes', 'isPredefined', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        after:"isFinalized",
      }),
      
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
    ])
   } catch(err) {
    console.log('Error at 20221114090312-Add_IsPredefinedKey.js',err)
   }
  },

  async down (queryInterface)
  {
    // return Promise.all([queryInterface.removeColumn('processes', 'isPredefined')]);
  },
};