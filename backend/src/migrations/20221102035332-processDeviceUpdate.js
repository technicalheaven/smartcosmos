module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
          queryInterface.changeColumn('processDevices', 'roleId', {
              type: Sequelize.STRING,
              allowNull: false,
            }),
            queryInterface.changeColumn('processDevices', 'processId', {
              type: Sequelize.STRING,
              allowNull: true,
            }),
          queryInterface.changeColumn('processDevices', 'siteId', {
            type: Sequelize.STRING,
            allowNull: true,
          }),
        queryInterface.changeColumn('processDevices', 'zoneId', {
          type: Sequelize.STRING,
          allowNull: true,
        }),
      ])
    } catch(err) {
      console.log('error at 20221102035332-processDeviceUpdate.js',err)
  
    }
  },

  down: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
          queryInterface.changeColumn('processDevices', 'roleId',{
              type: Sequelize.UUID,
              allowNull: false,
          }),
          queryInterface.changeColumn('processDevices', 'processId',{
            type: Sequelize.UUID,
            allowNull: true,
        }),
          queryInterface.changeColumn('processDevices', 'siteId',{
            type: Sequelize.UUID,
            allowNull: true,
        }),
        queryInterface.changeColumn('processDevices', 'zoneId',{
          type: Sequelize.UUID,
          allowNull: true,
        }),
      ])
     } catch(err) {
      console.log('error at 20221102035332-processDeviceUpdate.js down',err)
  
    }
  }
};