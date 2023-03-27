'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
          queryInterface.addColumn('deviceSiteZoneProcess', 'siteName', {
            type: Sequelize.STRING,
            allowNull: true,
            after: "siteId"
        }),
        queryInterface.addColumn('deviceSiteZoneProcess', 'zoneName', {
          type: Sequelize.STRING,
          allowNull: true,
          after: "zoneId"
      })
      ])
    }catch(error)
    {
      console.log("error at 20220920163929-updateDeviceSiteZoneProcess.js",error)
    }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};