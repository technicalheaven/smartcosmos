'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
        queryInterface.changeColumn('zones', 'description', {
          type: Sequelize.STRING,
          allowNull: true,
      }),
      ])
    } catch(err) {
      console.log('error at 20221011070618-UpdateZone_Description_type.js',err)

    }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};