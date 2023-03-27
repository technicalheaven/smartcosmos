import PreDefinedNodes from "../modules/process/models/predefinedNodes";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";


const predefineNodes = [

  new PreDefinedNodes({

    name: 'Digitization',
    state: {
      "PR5": {
        "metadata": {
          "version": ""
        },
        "properties": {
          "name": "Digitization",
          "icon": "iconImage.png",
          "validation": "",
          "validationValue": ""
        }
      }
    },

    transition: {
      "PR5": {
        "onEnter": {},
        "on": {
          "Digitization": {
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

    name: 'TrackNTrace',
    state: {
      "PR6": {
        "metadata": {
          "version": ""
        },
        "properties": {
          "name": "TrackNTrace",
          "icon": "iconImage.png",
          "validation": "",
          "validationValue": ""
        }
      }
    },

    transition: {
      "PR6": {
        "onEnter": {},
        "on": {
          "TrackNTrace": {
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

export const seedPredefinedNodesRev2 = async () => {
  try {


    let data = await mongoSequelizeMeta.find({ name: '20221214070115-predefinedNodesRev.js' });
    if (data.length <= 0) {
      for (let i = 0; i < predefineNodes.length; i++) {
        predefineNodes[i].save(function (err, result) {
          done++;
        });
      }
      // inserting the migration into mongos seqalize
      await mongoSequelizeMeta.create({ name: '20221214070115-predefinedNodesRev.js' });
    }

  } catch (err) {
    console.error("Error at 20221214070115-predefinedNodesRev.js seeder ",err)
  }
}