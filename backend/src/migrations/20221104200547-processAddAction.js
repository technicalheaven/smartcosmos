'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
          queryInterface.addColumn('processes', 'actions', {
            type: Sequelize.JSON,
            allowNull: true,
        }),
      ])
    } catch(err) {
      console.log('error at 20221104200547-processAddAction.js',err)
  
    }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};