module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
      return Promise.all([
          queryInterface.changeColumn('featureActions', 'isActive', {
              type: Sequelize.ENUM,
              values: ['Yes', 'No'],
              allowNull: false,
              defaultValue:'Yes',
          }),
          queryInterface.changeColumn('featureActions', 'id', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        })

      ])
    }catch(error)
    {
      console.log("error at 20220916100638-updateFeatureAction.js",error)
    }
  },

  down: (queryInterface, Sequelize) => {
      
  }
};