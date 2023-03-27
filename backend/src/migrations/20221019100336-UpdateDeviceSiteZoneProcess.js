'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
              queryInterface.changeColumn('deviceSiteZoneProcess', 'siteId', {
                type: Sequelize.STRING,
                allowNull: true,
              }),
                queryInterface.changeColumn('deviceSiteZoneProcess', 'siteName', {
                  type: Sequelize.STRING,
                  allowNull: true,
              }),
                  queryInterface.changeColumn('deviceSiteZoneProcess', 'zoneId', {
                    type: Sequelize.STRING,
                    allowNull: true,
                }),
              queryInterface.changeColumn('deviceSiteZoneProcess', 'zoneName', {
                type: Sequelize.STRING,
                allowNull: true,
            })
      ])
    } catch(err) {
      console.log('error at 20221019100336-UpdateDeviceSiteZoneProcess.js',err)
  
    }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};