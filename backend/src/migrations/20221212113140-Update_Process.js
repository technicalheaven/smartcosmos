module.exports = {
  async up(queryInterface, Sequelize) {
    try{
    await Promise.all([

      queryInterface.addColumn('processes', 'isShared', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:true
      }),

      queryInterface.addColumn('processes', 'workflowName', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:''
      })
    ]).then(()=>{
      queryInterface.sequelize.query("UPDATE processes SET workflowName=name");
    });
  }
  catch (err){
    console.log("error at 20221212113140-Update_Process.js",err);
  }
  },

  async down(queryInterface) {
    try{
    await Promise.all([
      queryInterface.removeColumn('processes', 'isShared'),
      queryInterface.removeColumn('processes', 'workflowName')
    ]);
  }
  catch (err){
    console.log("error at 20221212113140-Update_Process.js down",err);
  }
  },
};