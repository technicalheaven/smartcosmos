'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
              queryInterface.changeColumn('siteContact', 'firstName', {
                type: Sequelize.STRING,
                allowNull: true,
              }),
        ])
      } catch(err) {
        console.log('error at 20221102070136-Update_Site_Contact_FirstName.js',err)
    
      }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};