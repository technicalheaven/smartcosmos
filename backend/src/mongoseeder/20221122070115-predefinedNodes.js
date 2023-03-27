import PreDefinedNodes from "../modules/process/models/predefinedNodes";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import { logger } from '../libs/logger'


const predefineNodes = [

  new PreDefinedNodes({

    name: 'Select Device',
    state: {
      "PR1": {
        "metadata": {
          "version": ""
        },
        "properties": {
          "name": "Select Device",
          "icon": "iconImage.png",
          "validation": "",
          "validationValue": ""
        }
      }
    },

    transition: {
      "PR1": {
        "onEnter": {},
        "on": {
          "Select Device": {
            "condition": "",
            "value": "",
            "to": ""
          }
        },
        "onExit": {}
      }
    },



  }),
  new PreDefinedNodes({

    name: 'ReadyState',
    state: {
      "PR2": {
        "metadata": {
          "version": ""
        },
        "properties": {
          "name": "Ready",
          "icon": "iconImage.png",
          "validation": "",
          "validationValue": ""
        }
      }
    },

    transition: {
      "PR2": {
        "onEnter": {},
        "on": {
          "Ready": {
            "condition": "",
            "value": "",
            "to": ""
          }
        },
        "onExit": {}
      }
    },



  })

]

let done = 0;

export const seedPredefinedNodes = async () => {
  try {


    let data = await mongoSequelizeMeta.find({ name: '20221122070115-predefinedNodes.js' });
    if (data.length <= 0) {
      
      for (let i = 0; i < predefineNodes.length; i++) {
        predefineNodes[i].save(function (err, result) {
          done++;
        });
      }
      // inserting the migration into mongos seqalize
      await mongoSequelizeMeta.create({ name: '20221122070115-predefinedNodes.js' });
    }

  } catch (err) {
    logger.error("error in predefinedNodes seeder",err)
  }
}