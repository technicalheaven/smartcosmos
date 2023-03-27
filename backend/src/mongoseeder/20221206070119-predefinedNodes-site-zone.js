import predefinednode from "../modules/process/models/predefinedNodes";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import { logger } from '../libs/logger'



const predefineNodes = [

  new predefinednode({

    name: 'Select Site',
    state: {
      "PR3": {
        "metadata": {
          "version": ""
        },
        "properties": {
          "name": "Select Site",
          "icon": "iconImage.png",
          "validation": "",
          "validationValue": ""
        }
      }
    },

    transition: {
      "PR3": {
        "onEnter": {},
        "on": {
          "Select Site": {
            "condition": "",
            "value": "",
            "to": ""
          }
        },
        "onExit": {}
      }
    },



  }),
  new predefinednode({

    name: 'Select Zone',
    state: {
      "PR4": {
        "metadata": {
          "version": ""
        },
        "properties": {
          "name": "Select Zone",
          "icon": "iconImage.png",
          "validation": "",
          "validationValue": ""
        }
      }
    },

    transition: {
      "PR4": {
        "onEnter": {},
        "on": {
          "Select Zone": {
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

export const seedPredefinedNodesSiteZone = async () => {
  try {


    let data = await mongoSequelizeMeta.find({ name: '20221206070119-predefinedNodes-site-zone.js' });
    if (data.length <= 0) {
      for (let i = 0; i < predefineNodes.length; i++) {
        predefineNodes[i].save(function (err, result) {
          done++;
        });
      }
      // inserting the migration into mongos seqalize
      await mongoSequelizeMeta.create({ name: '20221206070119-predefinedNodes-site-zone.js' });
    }

  } catch (err) {
    logger.error("error in predefinedNodes-site-zone seeder")
  }
}