'use strict';

const { INTEGER } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize)
    {
  try{
    await Promise.all([
      
      queryInterface.addColumn('processes', 'startLoop', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:0,
        after:"isCustomizedLoop",
      })
    ])
  }
  catch (err){
    console.log("error at 20221130081302-update_Process_table.js",err);
  }
  },

  async down (queryInterface)
  {
      try{
          return Promise.all([queryInterface.removeColumn('processes', 'startLoop')]);
        }
        catch (err){
          console.log("error at 20221130081302-update_Process_table.js down",err);
        }
  },
};
