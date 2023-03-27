'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
          queryInterface.addColumn('processes', 'initialState', {
            type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: true,
          after: "description"
        }),
       // queryInterface.removeColumn('processes', 'initialState')
      ])
    } catch(err) {
      console.log('error at 20221102060854-processUpdate1.js',err)
  
    }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};