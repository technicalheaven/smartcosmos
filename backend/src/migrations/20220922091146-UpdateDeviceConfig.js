'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
          queryInterface.changeColumn('deviceConfig', 'status', {
              type: Sequelize.ENUM,
              values: ['Active-Runing', 'Active-Idle','Inactive','Deleted'],
              allowNull: false,
              defaultValue:'Active-Idle',
          })
      ])
    }catch(error)
    {
      console.log("error at 20220922091146-UpdateDeviceConfig.js",error)
    }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};