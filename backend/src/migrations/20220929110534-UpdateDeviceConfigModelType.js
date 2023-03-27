'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
          queryInterface.changeColumn('deviceConfig', 'type', {
              type: Sequelize.ENUM,
              values: ['Fixed', 'Handheld'],
              allowNull: false,
              defaultValue:'Fixed',
          }),
          queryInterface.changeColumn('deviceConfig', 'model', {
            type: Sequelize.ENUM,
            values: ['Keonn', 'Mcon','Denso Wave','Zebra sled'],
            allowNull: false,
            defaultValue:'Keonn',
        })
      ])
    }catch(error)
    {
      console.log("error at 20220929110534-UpdateDeviceConfigModelType.js",error)
    }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};