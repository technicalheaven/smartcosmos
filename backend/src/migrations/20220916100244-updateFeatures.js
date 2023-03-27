'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
      try{
      return Promise.all([
          queryInterface.changeColumn('features', 'isActive', {
              type: Sequelize.ENUM,
              values: ['Yes', 'No'],
              allowNull: false,
              defaultValue:'Yes',
          }),
          queryInterface.changeColumn('features', 'id', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        })
      ])
    }catch(error)
    {
      console.log("error at 20220916100244-updateFeatures.js",error)
    }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};