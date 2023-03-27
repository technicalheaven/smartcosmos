'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      queryInterface.changeColumn('processes', 'instruction', {
        type: Sequelize.TEXT,
        allowNull: true,
      })
      queryInterface.changeColumn('processes', 'description', {
        type: Sequelize.TEXT,
        allowNull: true,
      })
    
    } catch(err) {

     console.log('Error at 20221227092937-update_processes_table_fields_type.js',err)

    }
  },
  down: async (queryInterface, Sequelize) => {

  },
}
