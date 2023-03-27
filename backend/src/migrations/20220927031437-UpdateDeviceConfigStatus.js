'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
          queryInterface.changeColumn('deviceConfig', 'status', {
              type: Sequelize.ENUM,
              values: ['Active-Running', 'Active-Idle','Inactive','Deleted'],
              allowNull: false,
              defaultValue:'Active-Idle',
          })
      ])
    }catch(error)
    {
      console.log("error at 20220927031437-UpdateDeviceConfigStatus.js",error)
    }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};