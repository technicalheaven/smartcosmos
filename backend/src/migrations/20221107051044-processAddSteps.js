'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
          queryInterface.addColumn('processes', 'steps', {
            type: Sequelize.TEXT('long'),
            allowNull: true,
        }),
      ])
    } catch(err) {
      console.log('error at 20221107051044-processAddSteps.js',err)
  
    }
  },

  down: (queryInterface, Sequelize) => {
  }
};