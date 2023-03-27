'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
        queryInterface.addColumn('tenantFeatures', 'featureName', {
            type: Sequelize.STRING,
            allowNull: true,
            after: "featureId"
        }),
        queryInterface.changeColumn('tenantFeatures', 'isEnabled', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue:true,
      }),
      ])
    }catch(error)
    {
      console.log("error at 20220921102200-updateTenant_Features.js",error)
    }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};