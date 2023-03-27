'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
          queryInterface.addColumn('zones', 'tenantId', {
            type: Sequelize.UUID,
            allowNull: false,
        }),
      ])
    }catch(error)
    {
      console.log("error at 20220919082348-updateZone.js",error)
    }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};