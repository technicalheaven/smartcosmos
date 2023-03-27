
module.exports = {
  async up (queryInterface, Sequelize)
    {
      try{
    await Promise.all([
      
      queryInterface.addColumn('clientSyncInfo', 'workflowSyncedAt', {
        type: Sequelize.DATE,
        allowNull: true,
      })
    ]);
   } catch(err) {
    console.log('Error at 20221122070451-addColumnWorkflowSynced.js',err)
   }
  },

  async down (queryInterface)
  {
    try{    
    return Promise.all([queryInterface.removeColumn('clientSyncInfo', 'workflowSyncedAt')]);
      } catch(err) {
        console.log('Error at 20221122070451-addColumnWorkflowSynced.js down',err)
      }
  },
};