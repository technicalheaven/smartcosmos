'use strict';
const { NodeNames } = require('../modules/process/common/utils')
const { FeatureAction, Feature ,Process} = require('../config/db')
const { v4: uuidv4 } = require('uuid');
const { WorkFlowSchemaService } = require('../modules/process/services/workflow');
import ProcessWorkFlowSchema from "../modules/process/models/processWorkflow";
 
module.exports = {
   async up(query, sequelize) {
     let scanTag;
         let scanBarcode;
         let scanTagId;
         let scanBarcodeId;
         let processType;
       try {
        
         await Process.destroy({where:{tenantId:' '}});
         let response=await ProcessWorkFlowSchema.find();
         if(response.length>0)
         {
            await ProcessWorkFlowSchema.deleteMany({});
         }
         const data = await Feature.findOne({where:{name:'TrackNTrace'}})
         console.log("processType Data",data)
         processType=data.dataValues.id;
         console.log("processType",processType)
         const Faction= await FeatureAction.findAll({where:{featureId:data.dataValues.id}})
           for (let index of Faction) {
               {
                  if (index.name == 'Scan Tag')
                  {
                   scanTag='Scan Tag';
                   scanTagId=index.id;
                  }
                  if (index.name == 'Scan Barcode')
                  {
                   scanBarcode='Scan Barcode';
                   scanBarcodeId=index.id;
                  }
               }
           }
       } catch (err) {
          
       }
 
       let processUHF = scanTagId
       let processASN = scanBarcodeId
       const TransferASNstates = {
           [processUHF]: {
               "metadata": {
                   "version": ""
               },
               "properties": {
                   "name": NodeNames.ScanTag,
                   "icon": "",
                   "validation": "",
                   "validationValue": ""
               }
           },
           [processASN]: {
               "metadata": {
                   "version": ""
               },
               "properties": {
                   "name": NodeNames.ScanBarcode,
                   "icon": "",
                   "validation": "",
                   "validationValue": ""
               }
           }
 
       };
       const TransferASNTransition = {
 
           [processUHF]: {
               "onEnter": {},
               "on": {
                 [NodeNames.ScanTag]: {
                       "condition": "",
                       "value": "",
                       "to": processASN
                   }
               },
               "onExit": {}
           },
           [processASN]: {
               "onEnter": {},
               "on": {
                   [NodeNames.ScanBarcode]: {
                       "condition": "",
                       "value": "",
                       "to": processUHF
                   }
               },
               "onExit": {}
           }
 
       };
       const ScantagStates = {
           [processUHF]: {
               "metadata": {
                   "version": ""
               },
               "properties": {
                   "name": NodeNames.ScanTag,
                   "icon": "",
                   "validation": "",
                   "validationValue": ""
               }
           }
       };
       const ScanTagTransition = {
           [processUHF]: {
               "onEnter": {},
               "on": {
                   [NodeNames.ScanTag]: {
                       "condition": "",
                       "value": "",
                       "to": processUHF
                   }
               },
               "onExit": {}
           }
       };
      
       const result = await query.bulkInsert('processes',
           [
               {
 
                   id: uuidv4(),
                   tenantId: " ",
                   name: 'Transfer ASN',
                   description: " ",
                   processType: processType,
                   initialState: processASN,
                   states: JSON.stringify({
 
                       [ processASN]: {
                            "metadata": {
                                "version": ""
                            },
                            "properties": {
                                "name": "Scan Barcode",
                                "icon": "",
                                "validation": "",
                                "validationValue": ""
                            }
                        },
                        [processUHF]: {
                            "metadata": {
                                "version": ""
                            },
                            "properties": {
                                "name": "Scan Tag",
                                "icon": "",
                                "validation": "",
                                "validationValue": ""
                            }
                        }
                    }),
                    transitions: JSON.stringify({
                        [processASN]: {
                            "onEnter": {},
                            "on": {
                                "Scan Barcode": {
                                    "condition": "",
                                    "value": "",
                                    "to": processUHF
                                }
                            },
                            "onExit": {}
                        },
                        [processUHF]: {
                            "onEnter": {},
                            "on": {
                                "Scan Tag": {
                                    "condition": "",
                                    "value": "",
                                    "to": processUHF
                                }
                            },
                            "onExit": {}
                        },
                    }),
                   assign: JSON.stringify({}),
                   stopActions: new Date(),
                   startActions: new Date(),
                   instruction: " ",
                   status: "Inactive",
                   minStationVer: " ",
                   isFinalized: true,
                   isCustomizedLoop:false,
                   actions: JSON.stringify([{ "action": processASN }, { "action": processUHF }]),
                   steps: JSON.stringify([{ "name": NodeNames.ScanBarcode, "id": processASN, "key":  NodeNames.ScanBarcode, "validation": "length12" },
                   { "name": NodeNames.ScanTag, "id": processUHF, "key": NodeNames.ScanTag }]),
                   isPredefined: true,
                   isShared:true,
                   workflowName:'',
                   createdAt: new Date()
               },
               {
 
                   id: uuidv4(),
                   tenantId: " ",
                   name: 'Full Count',
                   description: " ",
                   processType: processType,
                   initialState: processUHF,
                   states: JSON.stringify({
 
                   [processUHF]: {
                           "metadata": {
                               "version": ""
                           },
                           "properties": {
                               "name": "Scan Tag",
                               "icon": "",
                               "validation": "",
                               "validationValue": ""
                           }
 
                       }                       
 
                   }),
                   transitions: JSON.stringify({
 
                    [processUHF]: {
                           "onEnter": {},
                           "on": {
                               "Scan Tag": {
                                   "condition": "",
                                   "value": "",
                                   "to": processUHF
 
                               }
                           },
                           "onExit": {}
                       }
 
                   }),
                   assign: JSON.stringify({}),
                   stopActions: new Date(),
                   startActions: new Date(),
                   instruction: " ",
                   status: "Inactive",
                   minStationVer: " ",
                   isFinalized: true,
                   isCustomizedLoop:false,
                   actions: JSON.stringify([{ "action": processUHF }]),
                   steps: JSON.stringify([{ "name":NodeNames.ScanTag, "id": processUHF,"key": NodeNames.ScanTag
                   }]),
                   isPredefined: true,
                   isShared:true,
                   workflowName:'',
                   createdAt: new Date()
               },
               {
                   id: uuidv4(),
                   tenantId: " ",
                   name: 'Receive ASN/Blind',
                   description: " ",
                   processType: processType,
                   initialState: processUHF,
                   states: JSON.stringify({
 
                       [processUHF]: {
                           "metadata": {
                               "version": ""
                           },
                           "properties": {
                               "name": "Scan Tag",
                               "icon": "",
                               "validation": "",
                               "validationValue": ""
                           }
 
                       }                       
 
                   }),
                   transitions: JSON.stringify({
 
                    [processUHF]: {
                           "onEnter": {},
                           "on": {
                               "Scan Tag": {
                                   "condition": "",
                                   "value": "",
                                   "to": processUHF
 
                               }
                           },
                           "onExit": {}
                       }
 
                   }),
                   assign: JSON.stringify({}),
                   stopActions: new Date(),
                   startActions: new Date(),
                   instruction: " ",
                   status: "Inactive",
                   minStationVer: " ",
                   isFinalized: true,
                   isCustomizedLoop:false,
                   actions: JSON.stringify([{ "action": processUHF }]),
                   steps: JSON.stringify([{ "name": NodeNames.ScanTag, "id": processUHF, "key": NodeNames.ScanTag }]),
                   isPredefined: true,
                   isShared:true,
                   workflowName:'',
                   createdAt: new Date()
               },
               {
 
                   id: uuidv4(),
                   tenantId: " ",
                   name: 'Partial Count',
                   description: " ",
                   processType: processType,
                   initialState: processUHF,
                   states: JSON.stringify({
 
                       [processUHF]: {
                           "metadata": {
                               "version": ""
                           },
                           "properties": {
                               "name": "Scan Tag",
                               "icon": "",
                               "validation": "",
                               "validationValue": ""
                           }
 
                       }                       
 
                   }),
                   transitions: JSON.stringify({
 
                    [processUHF]: {
                           "onEnter": {},
                           "on": {
                               "Scan Tag": {
                                   "condition": "",
                                   "value": "",
                                   "to": processUHF
 
                               }
                           },
                           "onExit": {}
                       }
 
                   }),
                   assign: JSON.stringify({}),
                   stopActions: new Date(),
                   startActions: new Date(),
                   instruction: " ",
                   status: "Inactive",
                   minStationVer: " ",
                   isFinalized: true,
                   isCustomizedLoop:false,
                   actions: JSON.stringify([{"action":processUHF}]),
                   steps: JSON.stringify([{"name":"Scan Tag","id":processUHF,"key":"Scan Tag"}]),
                   isPredefined:true,
                   isShared:true,
                   workflowName:'',
                   createdAt: new Date()
               },
           ])
 
       const processes = await Process.findAll({where:{isPredefined: true, tenantId:' '}});
       
       const workflowSchemaService = new WorkFlowSchemaService();
      
       for (const process of processes) {
           const result = await workflowSchemaService.insertWorkFlow(process);
           await Process.update({workflowName:result.workflowName},{where:{id : process.id}})
       }
   },
 
 
   async down(queryInterface, Sequelize) {
       /**
        * Add commands to revert seed here.
        *
        * Example:
        * await queryInterface.bulkDelete('People', null, {});
        */
   }
};
