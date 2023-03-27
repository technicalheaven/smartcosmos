const { NONE } = require("sequelize");
const { NotNull } = require("sequelize-typescript");
const { ISACTIVE_FALSE } = require("../middlewares/resp-handler/constants");

module.exports = {
  up: (queryInterface, Sequelize) => {
    try{
    return Promise.all([
      queryInterface.addColumn('processes', 'isCustomizedLoop', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:false,
        after:"isPredefined",
      })
    ])
   } catch(err) {
    console.log('Error at 20221122070451-Update_process_Add_Key_isCustomizedLoop.js',err)
   }
  },

  down: (queryInterface) => {
     return Promise.all([queryInterface.removeColumn('processes', 'isCustomizedLoop')]);
  },
};  