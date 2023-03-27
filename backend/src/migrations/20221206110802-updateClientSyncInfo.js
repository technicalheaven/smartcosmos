'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
              queryInterface.addColumn('clientSyncInfo', 'stateMachineSyncedAt', {
                type: Sequelize.DATE,
                allowNull: true,
              }),
              queryInterface.addColumn('clientSyncInfo', 'nodeWorkflowSyncedAt', {
                type: Sequelize.DATE,
                allowNull: true,
              }),
      ])
    }
    catch (err){
      console.log("error at 20221206110802-updateClientSyncInfo.js",err);
    }
  },

  down: (queryInterface, Sequelize) => {
    try{
    return Promise.all([
        queryInterface.removeColumn('clientSyncInfo', 'stateMachineSyncedAt'),
        queryInterface.removeColumn('clientSyncInfo', 'nodeWorkflowSyncedAt'),
    ])
    }
    catch (err){
      console.log("error at 20221206110802-updateClientSyncInfo.js down",err);
    }
}
};