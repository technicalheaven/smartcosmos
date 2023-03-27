'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize)
    {
  try{
    await Promise.all([
      
      queryInterface.addColumn('deviceManager', 'uuid', {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue:null,
        after:"tenantId",
      })
    ])
  }
  catch (err){
    console.log("error at 20221130083236-Update_DeviceManager_Add_New_Key.js",err);
  }
  },

  async down (queryInterface)
  {
    try {
       return Promise.all([queryInterface.removeColumn('deviceManager', 'uuid')]);
      }
      catch (err){
        console.log("error at 20221130083236-Update_DeviceManager_Add_New_Key.js down",err);
      }
  },
};
