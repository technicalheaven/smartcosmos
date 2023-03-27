'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
              queryInterface.changeColumn('clientSyncInfo', 'deviceId', {
                type: Sequelize.STRING,
                allowNull: false,
              }),
      ])
    } catch(err) {
      console.log('Error at 20221128110801-updateClientSyncInfo.js',err)
    }
  },

  down: (queryInterface, Sequelize) => {
    try{
    return Promise.all([
        queryInterface.changeColumn('clientSyncInfo', 'deviceId',{
            type: Sequelize.STRING,
            allowNull: false,
        })
    ])
  } catch(err) {
    console.log('Error at 20221128110801-updateClientSyncInfo.js down',err)
  }
    
}
};