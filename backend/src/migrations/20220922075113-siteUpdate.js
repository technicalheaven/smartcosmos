'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
          queryInterface.changeColumn('sites', 'longitude', {
              type: Sequelize.STRING,
              allowNull: true,
          }),
          queryInterface.changeColumn('sites', 'latitude', {
            type: Sequelize.STRING,
            allowNull: true,
        })
      ])
    }catch(error)
    {
      console.log("error at 20220922075113-siteUpdate.js",error)
    }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};