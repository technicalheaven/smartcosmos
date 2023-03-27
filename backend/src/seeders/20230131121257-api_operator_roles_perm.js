'use strict';

const { v4: uuidv4 } = require("uuid");
const { Permission } = require('../config/db');
const { Role } = require('../config/db')
const { RolePermission } = require('../config/db')
import { logger } from '../libs/logger'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(query, Sequelize) {
    try {

      await query.bulkInsert("permissions", [
        {
          id: uuidv4(),
          name: "checkDigitizedTag",
          description:
            "This Permission allows a user to check digitized tag.",
          method: "get",
          action: "read",
          route: "/api/v1/check/digitizedTag",
          isCustom: false,
          createdAt: new Date(),
        },
  
    
        {
          id: uuidv4(),
          name: "digitizedAndTntTag",
          description:
            "This Permission allows a user to digitize and Tnt tags.",
          method: "post",
          action: "create",
          route: "/api/v1/commondataprocessing/tag",
          isCustom: false,
          createdAt: new Date(),
        },

        // {
        //   id: uuidv4(),
        //   name: "digitizedTagSite",
        //   description:
        //     "This Permission allows a user to update sitename in DI-data.",
        //   method: "patch",
        //   action: "edit",
        //   route: "/api/v1/tags/update-sitename-in-di-data",
        //   isCustom: false,
        //   createdAt: new Date(),
        // },

        // {
        //   id: uuidv4(),
        //   name: "digitizedTagZone",
        //   description:
        //     "This Permission allows a user to update zonename in DI-data.",
        //   method: "patch",
        //   action: "edit",
        //   route: "/api/v1/tags/update-zone-name-in-di-data",
        //   isCustom: false,
        //   createdAt: new Date(),
        // },

        {
          id: uuidv4(),
          name: "productExportChunk",
          description:
            "This Permission allows a user to export product chunk number.",
          method: "get",
          action: "read",
          route: "/api/v1/exportchunks",
          isCustom: false,
          createdAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "DiExportChunkNumber",
          description:
            "This Permission allows a user to read Di Export Chunk Number.",
          method: "get",
          action: "read",
          route: "/api/v1/di/diexportchunks",
          isCustom: false,
          createdAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "TagsExportChunkNumber",
          description:
            "This Permission allows a user to read Tags Export Chunk Number.",
          method: "get",
          action: "read",
          route: "/api/v1/tags/tagsexportchunks",
          isCustom: false,
          createdAt: new Date(),
        },
      ])


      let permissionData = await Permission.findAll()
      var permIdName = {}
      for (let permission of permissionData) {
        {

          if (
            (permission?.route == '/api/v1/deEnable/tag' && permission?.method == 'patch') ||
            (permission?.route == '/api/v1/duplicatetags/tag' && permission?.method == 'get') ||
            (permission?.route == '/api/v1/digitized/tag' && permission?.method == 'get') ||
            (permission?.route == '/api/v1/check/digitizedTag' && permission?.method == 'get') ||
            (permission?.route == '/api/v1/di-data' && permission?.method == 'get') ||                           //
            (permission?.route == '/api/v1/trackntrace/tag' && permission?.method == 'get') ||                   //
            (permission?.route == '/api/v1/commondataprocessing/tag' && permission?.method == 'post')   || 

            // (permission?.route == '/api/v1/trackntrace/add' && permission?.method == 'delete') ||                //
            //  (permission?.route == '/api/v1/trackntrace/tag' && permission?.method == 'post') ||                  //
            // (permission?.route == '/api/v1/digitized/tag' && permission?.method == 'post') ||
            //  (permission?.route == '/api/v1/trackntrace/add' && permission?.method == 'post') ||                  //
            
            //(permission?.route == '/api/v1/digitized-data/export' && permission?.method == 'get')                //
            //  (permission?.route == '/api/v1/tags/update-sitename-in-di-data' && permission?.method == 'patch') ||  // no
            //  (permission?.route == '/api/v1/tags/update-zone-name-in-di-data' && permission?.method == 'patch')    // no
            (permission?.route == '/api/v1/exportchunks' && permission?.method == 'get') ||
            (permission?.route == '/api/v1/di/diexportchunks' && permission?.method == 'get') ||
            (permission?.route == '/api/v1/tags/tagsexportchunks' && permission?.method == 'get') 
            ) {

            let key = permission?.name + permission?.action;
            permIdName[key] = {
              id: permission?.id,
              action: permission?.action,
              description: permission?.description,
              name: permission?.name
            };


          }

        }

      }

      var rolePermArray = []
      let roleData = await Role.findAll()
      for (let role of roleData) {

        if (role.name == "API Operator") {

          // var CreateUploadTrackntraceTagAO = {
          //   id: uuidv4(),
          //   roleId: role.id,
          //   permissionId: permIdName.uploadTrackntraceTagcreate.id,
          //   name: permIdName?.uploadTrackntraceTagcreate.name,
          //   description: permIdName?.uploadTrackntraceTagcreate.description,
          //   action: permIdName?.uploadTrackntraceTagcreate.action,
          //   createdAt: new Date()
          // }

          // var CreateUploadProcessTrackntraceTagAO = {
          //   id: uuidv4(),
          //   roleId: role.id,
          //   permissionId: permIdName.uploadProcessTrackntraceTagcreate.id,
          //   name: permIdName?.uploadProcessTrackntraceTagcreate.name,
          //   description: permIdName?.uploadProcessTrackntraceTagcreate.description,
          //   action: permIdName?.uploadProcessTrackntraceTagcreate.action,
          //   createdAt: new Date()
          // }

          var UpdatedeEnableTagAO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.deEnableTagedit.id,
            name: permIdName?.deEnableTagedit.name,
            description: permIdName?.deEnableTagedit.description,
            action: permIdName?.deEnableTagedit.action,
            createdAt: new Date()
          }

          // var CreateUploadDigitizedTagAO = {
          //   id: uuidv4(),
          //   roleId: role.id,
          //   permissionId: permIdName.uploadDigitizedTagcreate.id,
          //   name: permIdName?.uploadDigitizedTagcreate.name,
          //   description: permIdName?.uploadDigitizedTagcreate.description,
          //   action: permIdName?.uploadDigitizedTagcreate.action,
          //   createdAt: new Date()
          // }

          

          // var DeleteTagAO = {
          //   id: uuidv4(),
          //   roleId: role.id,
          //   permissionId: permIdName.deleteTagdelete.id,
          //   name: permIdName?.deleteTagdelete.name,
          //   description: permIdName?.deleteTagdelete.description,
          //   action: permIdName?.deleteTagdelete.action,
          //   createdAt: new Date()
          // }



          


          var CreateDigitizeAndTrackntraceTagAO = {   //
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.digitizedAndTntTagcreate.id,
            name: permIdName?.digitizedAndTntTagcreate.name,
            description: permIdName?.digitizedAndTntTagcreate.description,
            action: permIdName?.digitizedAndTntTagcreate.action,
            createdAt: new Date()
          }

          // var UpdatedeDITagSiteAO = {
          //   id: uuidv4(),
          //   roleId: role.id,
          //   permissionId: permIdName.digitizedTagSiteedit.id,
          //   name: permIdName?.digitizedTagSiteedit.name,
          //   description: permIdName?.digitizedTagSiteedit.description,
          //   action: permIdName?.digitizedTagSiteedit.action,
          //   createdAt: new Date()
          // }

          // var UpdatedeDITagZoneAO = {
          //   id: uuidv4(),
          //   roleId: role.id,
          //   permissionId: permIdName.digitizedTagZoneedit.id,
          //   name: permIdName?.digitizedTagZoneedit.name,
          //   description: permIdName?.digitizedTagZoneedit.description,
          //   action: permIdName?.digitizedTagZoneedit.action,
          //   createdAt: new Date()
          // }

          // 
          var ReadDigitizeTagPermAO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readDigitizedTagread.id,
            name: permIdName?.readDigitizedTagread.name,
            description: permIdName?.readDigitizedTagread.description,
            action: permIdName?.readDigitizedTagread.action,
            createdAt: new Date()
          }

          var ReadDuplicateTagPermAO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readDuplicatetagsread.id,
            name: permIdName?.readDuplicatetagsread.name,
            description: permIdName?.readDuplicatetagsread.description,
            action: permIdName?.readDuplicatetagsread.action,
            createdAt: new Date()
          }

          
          var CheckDigitizeTagPermAO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.checkDigitizedTagread.id,
            name: permIdName?.checkDigitizedTagread.name,
            description: permIdName?.checkDigitizedTagread.description,
            action: permIdName?.checkDigitizedTagread.action,
            createdAt: new Date()
          }

          var readDigitizeTagPermAO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readCommonDuplicateDigitizedread.id,
            name: permIdName?.readCommonDuplicateDigitizedread.name,
            description: permIdName?.readCommonDuplicateDigitizedread.description,
            action: permIdName?.readCommonDuplicateDigitizedread.action,
            createdAt: new Date()
          }

          

          var readTNTTagPermAO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readTrackntraceread.id,
            name: permIdName?.readTrackntraceread.name,
            description: permIdName?.readTrackntraceread.description,
            action: permIdName?.readTrackntraceread.action,
            createdAt: new Date()
          }

          // var exportDigitizedTagPermAO = {
          //   id: uuidv4(),
          //   roleId: role.id,
          //   permissionId: permIdName.exportDigitizedDataread.id,
          //   name: permIdName?.exportDigitizedDataread.name,
          //   description: permIdName?.exportDigitizedDataread.description,
          //   action: permIdName?.exportDigitizedDataread.action,
          //   createdAt: new Date()
          // }





        }

        
        if (role.name == "API Operator(Read Only)") {

          var ReadDigitizeTagPermAORO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readDigitizedTagread.id,
            name: permIdName?.readDigitizedTagread.name,
            description: permIdName?.readDigitizedTagread.description,
            action: permIdName?.readDigitizedTagread.action,
            createdAt: new Date()
          }

          var ReadDuplicateTagPermAORO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readDuplicatetagsread.id,
            name: permIdName?.readDuplicatetagsread.name,
            description: permIdName?.readDuplicatetagsread.description,
            action: permIdName?.readDuplicatetagsread.action,
            createdAt: new Date()
          }

          
          var CheckDigitizeTagPermAORO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.checkDigitizedTagread.id,
            name: permIdName?.checkDigitizedTagread.name,
            description: permIdName?.checkDigitizedTagread.description,
            action: permIdName?.checkDigitizedTagread.action,
            createdAt: new Date()
          }

          var readDigitizeTagPermAORO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readCommonDuplicateDigitizedread.id,
            name: permIdName?.readCommonDuplicateDigitizedread.name,
            description: permIdName?.readCommonDuplicateDigitizedread.description,
            action: permIdName?.readCommonDuplicateDigitizedread.action,
            createdAt: new Date()
          }

          

          var readTNTTagPermAORO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readTrackntraceread.id,
            name: permIdName?.readTrackntraceread.name,
            description: permIdName?.readTrackntraceread.description,
            action: permIdName?.readTrackntraceread.action,
            createdAt: new Date()
          }


        }

        if(role.name == "Platform Super Admin"){
          var UpdatedeEnableTagPSA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.deEnableTagedit.id,
            name: permIdName?.deEnableTagedit.name,
            description: permIdName?.deEnableTagedit.description,
            action: permIdName?.deEnableTagedit.action,
            createdAt: new Date()
          }

          var readDigitizeTagPermPSA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readCommonDuplicateDigitizedread.id,
            name: permIdName?.readCommonDuplicateDigitizedread.name,
            description: permIdName?.readCommonDuplicateDigitizedread.description,
            action: permIdName?.readCommonDuplicateDigitizedread.action,
            createdAt: new Date()
          }

          var ReadDuplicateTagPermPSA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readDuplicatetagsread.id,
            name: permIdName?.readDuplicatetagsread.name,
            description: permIdName?.readDuplicatetagsread.description,
            action: permIdName?.readDuplicatetagsread.action,
            createdAt: new Date()
          }

          var ReadDigitizeTagPermPSA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readDigitizedTagread.id,
            name: permIdName?.readDigitizedTagread.name,
            description: permIdName?.readDigitizedTagread.description,
            action: permIdName?.readDigitizedTagread.action,
            createdAt: new Date()
          }

          
          var readproductExportChunkPSA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.productExportChunkread.id,
            name: permIdName?.productExportChunkread.name,
            description: permIdName?.productExportChunkread.description,
            action: permIdName?.productExportChunkread.action,
            createdAt: new Date()
          }

          var readDiExportChunkNumberPSA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.DiExportChunkNumberread.id,
            name: permIdName?.DiExportChunkNumberread.name,
            description: permIdName?.DiExportChunkNumberread.description,
            action: permIdName?.DiExportChunkNumberread.action,
            createdAt: new Date()
          }

          var readTagsExportChunkNumberPSA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.TagsExportChunkNumberread.id,
            name: permIdName?.TagsExportChunkNumberread.name,
            description: permIdName?.TagsExportChunkNumberread.description,
            action: permIdName?.TagsExportChunkNumberread.action,
            createdAt: new Date()
          }

        }

        if(role.name == "Platform Admin"){
          var UpdatedeEnableTagPA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.deEnableTagedit.id,
            name: permIdName?.deEnableTagedit.name,
            description: permIdName?.deEnableTagedit.description,
            action: permIdName?.deEnableTagedit.action,
            createdAt: new Date()
          }

          var readDigitizeTagPermPA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readCommonDuplicateDigitizedread.id,
            name: permIdName?.readCommonDuplicateDigitizedread.name,
            description: permIdName?.readCommonDuplicateDigitizedread.description,
            action: permIdName?.readCommonDuplicateDigitizedread.action,
            createdAt: new Date()
          }

          var ReadDuplicateTagPermPA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readDuplicatetagsread.id,
            name: permIdName?.readDuplicatetagsread.name,
            description: permIdName?.readDuplicatetagsread.description,
            action: permIdName?.readDuplicatetagsread.action,
            createdAt: new Date()
          }

          var ReadDigitizeTagPermPA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readDigitizedTagread.id,
            name: permIdName?.readDigitizedTagread.name,
            description: permIdName?.readDigitizedTagread.description,
            action: permIdName?.readDigitizedTagread.action,
            createdAt: new Date()
          }

          
          var readproductExportChunkPA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.productExportChunkread.id,
            name: permIdName?.productExportChunkread.name,
            description: permIdName?.productExportChunkread.description,
            action: permIdName?.productExportChunkread.action,
            createdAt: new Date()
          }

          var readDiExportChunkNumberPA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.DiExportChunkNumberread.id,
            name: permIdName?.DiExportChunkNumberread.name,
            description: permIdName?.DiExportChunkNumberread.description,
            action: permIdName?.DiExportChunkNumberread.action,
            createdAt: new Date()
          }

          var readTagsExportChunkNumberPA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.TagsExportChunkNumberread.id,
            name: permIdName?.TagsExportChunkNumberread.name,
            description: permIdName?.TagsExportChunkNumberread.description,
            action: permIdName?.TagsExportChunkNumberread.action,
            createdAt: new Date()
          } 
        }

        if(role.name == "Tenant Admin"){
          var UpdatedeEnableTagTA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.deEnableTagedit.id,
            name: permIdName?.deEnableTagedit.name,
            description: permIdName?.deEnableTagedit.description,
            action: permIdName?.deEnableTagedit.action,
            createdAt: new Date()
          }

          var ReadDigitizedTagPermTA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readCommonDuplicateDigitizedread.id,
            name: permIdName?.readCommonDuplicateDigitizedread.name,
            description: permIdName?.readCommonDuplicateDigitizedread.description,
            action: permIdName?.readCommonDuplicateDigitizedread.action,
            createdAt: new Date()
          }

          var ReadDuplicateTagPermTA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readDuplicatetagsread.id,
            name: permIdName?.readDuplicatetagsread.name,
            description: permIdName?.readDuplicatetagsread.description,
            action: permIdName?.readDuplicatetagsread.action,
            createdAt: new Date()
          }

          var ReadDigitizeTagPermTA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readDigitizedTagread.id,
            name: permIdName?.readDigitizedTagread.name,
            description: permIdName?.readDigitizedTagread.description,
            action: permIdName?.readDigitizedTagread.action,
            createdAt: new Date()
          }

           
          var readproductExportChunkTA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.productExportChunkread.id,
            name: permIdName?.productExportChunkread.name,
            description: permIdName?.productExportChunkread.description,
            action: permIdName?.productExportChunkread.action,
            createdAt: new Date()
          }

          var readDiExportChunkNumberTA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.DiExportChunkNumberread.id,
            name: permIdName?.DiExportChunkNumberread.name,
            description: permIdName?.DiExportChunkNumberread.description,
            action: permIdName?.DiExportChunkNumberread.action,
            createdAt: new Date()
          }

          var readTagsExportChunkNumberTA = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.TagsExportChunkNumberread.id,
            name: permIdName?.TagsExportChunkNumberread.name,
            description: permIdName?.TagsExportChunkNumberread.description,
            action: permIdName?.TagsExportChunkNumberread.action,
            createdAt: new Date()
          }
        }

        if(role.name == "Project Manager"){
          var UpdatedeEnableTagPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.deEnableTagedit.id,
            name: permIdName?.deEnableTagedit.name,
            description: permIdName?.deEnableTagedit.description,
            action: permIdName?.deEnableTagedit.action,
            createdAt: new Date()
          }

          var readDigitizeTagPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readCommonDuplicateDigitizedread.id,
            name: permIdName?.readCommonDuplicateDigitizedread.name,
            description: permIdName?.readCommonDuplicateDigitizedread.description,
            action: permIdName?.readCommonDuplicateDigitizedread.action,
            createdAt: new Date()
          }

          var ReadDuplicateTagPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readDuplicatetagsread.id,
            name: permIdName?.readDuplicatetagsread.name,
            description: permIdName?.readDuplicatetagsread.description,
            action: permIdName?.readDuplicatetagsread.action,
            createdAt: new Date()
          }

          var ReadDigitizeTagPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readDigitizedTagread.id,
            name: permIdName?.readDigitizedTagread.name,
            description: permIdName?.readDigitizedTagread.description,
            action: permIdName?.readDigitizedTagread.action,
            createdAt: new Date()
          }

           

          var readproductExportChunkPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.productExportChunkread.id,
            name: permIdName?.productExportChunkread.name,
            description: permIdName?.productExportChunkread.description,
            action: permIdName?.productExportChunkread.action,
            createdAt: new Date()
          }

          var readDiExportChunkNumberPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.DiExportChunkNumberread.id,
            name: permIdName?.DiExportChunkNumberread.name,
            description: permIdName?.DiExportChunkNumberread.description,
            action: permIdName?.DiExportChunkNumberread.action,
            createdAt: new Date()
          }

          var readTagsExportChunkNumberPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.TagsExportChunkNumberread.id,
            name: permIdName?.TagsExportChunkNumberread.name,
            description: permIdName?.TagsExportChunkNumberread.description,
            action: permIdName?.TagsExportChunkNumberread.action,
            createdAt: new Date()
          }
        }

        if(role.name == "Supervisor"){
          var UpdatedeEnableTagS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.deEnableTagedit.id,
            name: permIdName?.deEnableTagedit.name,
            description: permIdName?.deEnableTagedit.description,
            action: permIdName?.deEnableTagedit.action,
            createdAt: new Date()
          }

          var readDigitizeTagPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readCommonDuplicateDigitizedread.id,
            name: permIdName?.readCommonDuplicateDigitizedread.name,
            description: permIdName?.readCommonDuplicateDigitizedread.description,
            action: permIdName?.readCommonDuplicateDigitizedread.action,
            createdAt: new Date()
          }

          var ReadDuplicateTagPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readDuplicatetagsread.id,
            name: permIdName?.readDuplicatetagsread.name,
            description: permIdName?.readDuplicatetagsread.description,
            action: permIdName?.readDuplicatetagsread.action,
            createdAt: new Date()
          }

          var ReadDigitizeTagPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.readDigitizedTagread.id,
            name: permIdName?.readDigitizedTagread.name,
            description: permIdName?.readDigitizedTagread.description,
            action: permIdName?.readDigitizedTagread.action,
            createdAt: new Date()
          }

           
          var readproductExportChunkPS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.productExportChunkread.id,
            name: permIdName?.productExportChunkread.name,
            description: permIdName?.productExportChunkread.description,
            action: permIdName?.productExportChunkread.action,
            createdAt: new Date()
          }

          var readDiExportChunkNumberPS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.DiExportChunkNumberread.id,
            name: permIdName?.DiExportChunkNumberread.name,
            description: permIdName?.DiExportChunkNumberread.description,
            action: permIdName?.DiExportChunkNumberread.action,
            createdAt: new Date()
          }

          var readTagsExportChunkNumberPS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.TagsExportChunkNumberread.id,
            name: permIdName?.TagsExportChunkNumberread.name,
            description: permIdName?.TagsExportChunkNumberread.description,
            action: permIdName?.TagsExportChunkNumberread.action,
            createdAt: new Date()
          }
        }

      }

      // rolePermArray.push(CreateUploadTrackntraceTagAO)
      // rolePermArray.push(CreateUploadProcessTrackntraceTagAO)
      rolePermArray.push(UpdatedeEnableTagAO)  //
      // rolePermArray.push(CreateUploadDigitizedTagAO)
      // rolePermArray.push(DeleteTagAO)
      rolePermArray.push(CreateDigitizeAndTrackntraceTagAO)  //
      // rolePermArray.push(UpdatedeDITagSiteAO)

      // rolePermArray.push(UpdatedeDITagZoneAO)
      rolePermArray.push(ReadDigitizeTagPermAO)
      rolePermArray.push(ReadDuplicateTagPermAO)
      rolePermArray.push(CheckDigitizeTagPermAO)

      rolePermArray.push(readDigitizeTagPermAO)
      rolePermArray.push(readTNTTagPermAO)
    //  rolePermArray.push(exportDigitizedTagPermAO)


      rolePermArray.push(readDigitizeTagPermAORO)
      rolePermArray.push(readTNTTagPermAORO)
    //  rolePermArray.push(exportDigitizedTagPermAORO)
      rolePermArray.push(ReadDigitizeTagPermAORO)
      rolePermArray.push(ReadDuplicateTagPermAORO)
      rolePermArray.push(CheckDigitizeTagPermAORO)


      rolePermArray.push(UpdatedeEnableTagPSA)
      rolePermArray.push(readDigitizeTagPermPSA)
      rolePermArray.push(ReadDuplicateTagPermPSA)
      rolePermArray.push(ReadDigitizeTagPermPSA)

      rolePermArray.push(UpdatedeEnableTagPA)
      rolePermArray.push(readDigitizeTagPermPA)
      rolePermArray.push(ReadDuplicateTagPermPA)
      rolePermArray.push(ReadDigitizeTagPermPA)

      rolePermArray.push(UpdatedeEnableTagTA)
      rolePermArray.push(ReadDigitizedTagPermTA)
      rolePermArray.push(ReadDuplicateTagPermTA)
      rolePermArray.push(ReadDigitizeTagPermTA)

      rolePermArray.push(UpdatedeEnableTagPM)
      rolePermArray.push(readDigitizeTagPermPM)
      rolePermArray.push(ReadDuplicateTagPermPM)
      rolePermArray.push(ReadDigitizeTagPermPM)

      rolePermArray.push(UpdatedeEnableTagS)
      rolePermArray.push(readDigitizeTagPermS)
      rolePermArray.push(ReadDuplicateTagPermS)
      rolePermArray.push(ReadDigitizeTagPermS)

      rolePermArray.push(readproductExportChunkPSA)
      rolePermArray.push(readDiExportChunkNumberPSA)
      rolePermArray.push(readTagsExportChunkNumberPSA)

      rolePermArray.push(readproductExportChunkPA)
      rolePermArray.push(readDiExportChunkNumberPA)
      rolePermArray.push(readTagsExportChunkNumberPA)

      rolePermArray.push(readproductExportChunkTA)
      rolePermArray.push(readDiExportChunkNumberTA)
      rolePermArray.push(readTagsExportChunkNumberTA)

      rolePermArray.push(readproductExportChunkPM)
      rolePermArray.push(readDiExportChunkNumberPM)
      rolePermArray.push(readTagsExportChunkNumberPM)

      rolePermArray.push(readproductExportChunkPS)
      rolePermArray.push(readDiExportChunkNumberPS)
      rolePermArray.push(readTagsExportChunkNumberPS)

      

      await query.bulkInsert('rolePermissions', rolePermArray)

    }


    catch (err) {
      logger.error("error in adding roles permission for API operator and API operator (read only)");
    }

  },


  async down(queryInterface, Sequelize) {

  }
};
