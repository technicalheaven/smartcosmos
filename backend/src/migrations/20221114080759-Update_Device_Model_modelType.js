'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
          queryInterface.addColumn('deviceTypeModel', 'modelType', {
            type: Sequelize.STRING,
            allowNull: true,
            after:'model',
        }),
      ])
    } catch(err) {

      console.log('Error at 20221114080759-Update_Device_Model_modelType.js',err)
 
     }
  },

  down: (queryInterface, Sequelize) => {

    queryInterface.removeColumn('deviceTypeModel', 'modelType')
  }
};