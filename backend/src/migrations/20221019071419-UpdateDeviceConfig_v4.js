'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
          queryInterface.changeColumn('deviceConfig', 'type', {
            type: Sequelize.STRING,
            allowNull: false,
          }),
          queryInterface.changeColumn('deviceConfig', 'model', {
            type: Sequelize.STRING,
            allowNull: false,
        })
      ])
    } catch(err) {
      console.log('error at 20221019071419-UpdateDeviceConfig_v4.js',err)
  
    }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};