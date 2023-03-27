module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
          queryInterface.changeColumn('processes', 'status', {
            type: Sequelize.STRING,
          allowNull: true
          }),
          queryInterface.removeColumn('processes', 'initialState')
      ])
    } catch(err) {
      console.log('error at 20221101094304-processUpdate.js',err)
  
    }
  },

  down: (queryInterface, Sequelize) => {
     
  }
};
