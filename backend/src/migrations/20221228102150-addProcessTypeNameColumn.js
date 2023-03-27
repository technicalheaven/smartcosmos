
module.exports = {
  async up (queryInterface, Sequelize)
    {
      try{
    await Promise.all([
      
      queryInterface.addColumn('processes', 'processTypeName', {
        type: Sequelize.STRING,
        allowNull: true,
        after : "processType",
        defaultValue: null
      })
    ]);
   } catch(err) {
    console.log('Error at AddProcessTypeName up',err)
   }
  },

  async down (queryInterface)
  {
    try{    
    return Promise.all([queryInterface.removeColumn('processes', 'processTypeName')]);
      } catch(err) {
        console.log('Error at AddProcessTypeName down',err)
      }
  },
};