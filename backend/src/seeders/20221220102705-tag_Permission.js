'use strict';
const { Permission } = require('../config/db');
const { Role } = require('../config/db')
const { RolePermission } = require('../config/db')
const { v4: uuidv4 } = require("uuid")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(query, Sequelize) {

    await query.bulkInsert("permissions", [
      {
        id: uuidv4(),
        name: "readTag",
        description:
          "This Permission allows a user to read tags.",
        method: "get",
        action: "read",
        route: "/api/v1/tag",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "readDigitizedTag",
        description:
          "This Permission allows a user to read digitized tags.",
        method: "get",
        action: "read",
        route: "/api/v1/digitized/tag",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "readDuplicatetags",
        description:
          "This Permission allows a user to read duplicate tags.",
        method: "get",
        action: "read",
        route: "/api/v1/duplicatetags/tag",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "readTrackntrace",
        description:
          "This Permission allows a user to read trackntrace tags.",
        method: "get",
        action: "read",
        route: "/api/v1/trackntrace/tag",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "readCommonDuplicateDigitized",
        description:
          "This Permission allows a user to read commonDuplicateDigitized tags.",
        method: "get",
        action: "read",
        route: "/api/v1/di-data",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "uploadTag",
        description:
          "This Permission allows a user to upload tags.",
        method: "post",
        action: "create",
        route: "/api/v1/upload/tag",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "uploadDigitizedTag",
        description:
          "This Permission allows a user to upload digitized tags.",
        method: "post",
        action: "create",
        route: "/api/v1/digitized/tag",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "uploadProcessTrackntraceTag",
        description:
          "This Permission allows a user to upload process trackntrace tags.",
        method: "post",
        action: "create",
        route: "/api/v1/trackntrace/tag",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "uploadTrackntraceTag",
        description:
          "This Permission allows a user to upload trackntrace tags.",
        method: "post",
        action: "create",
        route: "/api/v1/trackntrace/add",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "deleteTag",
        description:
          "This Permission allows a user to delete tags.",
        method: "delete",
        action: "delete",
        route: "/api/v1/trackntrace/add",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "exportDigitizedData",
        description:
          "This Permission allows a user to export digitized data.",
        method: "get",
        action: "read",
        route: "/api/v1/digitized-data/export",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "exportFactoryTagsData",
        description:
          "This Permission allows a user to export factory tags data.",
        method: "get",
        action: "read",
        route: "/api/v1/factorytags/export",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "readDistinct",
        description:
          "This Permission allows a user to read distinct options data.",
        method: "get",
        action: "read",
        route: "/api/v1/factorytags/distinct-options",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "createLastExpectedCount",
        description:
          "This Permission allows a user to create last expected count.",
        method: "post",
        action: "create",
        route: "/api/v1/tnt/lastvalidcount",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "deEnableTag",
        description:
          "This Permission allows a user to de enabled tag.",
        method: "patch",
        action: "edit",
        route: "/api/v1/deEnable/tag",
        isCustom: false,
        createdAt: new Date(),
      },
    ])

    let permissionData = await Permission.findAll()
    var permIdName = {}
    for (let permission of permissionData) {
      {

        if (
           ( permission?.route == '/api/v1/deEnable/tag') || 
            (permission?.route == '/api/v1/trackntrace/tag') ||
            (permission?.route == '/api/v1/digitized/tag') ||
            (permission?.route == '/api/v1/upload/tag') ||
            (permission?.route == '/api/v1/di-data') ||  
            (permission?.route == '/api/v1/tag') ||
            (permission?.route == '/api/v1/trackntrace/add') ||
            (permission?.route == '/api/v1/duplicatetags/tag')
            ){

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
      if(role.name == "Platform Super Admin"){
        var ReadTagPermPSA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readTagread.id,
          name: permIdName?.readTagread.name,
          description: permIdName?.readTagread.description,
          action: permIdName?.readTagread.action,
          createdAt: new Date()
        }

        var ReadDigitizedTagPermPSA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readDigitizedTagread.id,
          name: permIdName?.readDigitizedTagread.name,
          description: permIdName?.readDigitizedTagread.description,
          action: permIdName?.readDigitizedTagread.action,
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

        var ReadTrackntraceTagPermPSA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readTrackntraceread.id,
          name: permIdName?.readTrackntraceread.name,
          description: permIdName?.readTrackntraceread.description,
          action: permIdName?.readTrackntraceread.action,
          createdAt: new Date()
        }

        var ReadCommonDuplicateDigitizedPermPSA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readCommonDuplicateDigitizedread.id,
          name: permIdName?.readCommonDuplicateDigitizedread.name,
          description: permIdName?.readCommonDuplicateDigitizedread.description,
          action: permIdName?.readCommonDuplicateDigitizedread.action,
          createdAt: new Date()
        }

        var uploadTagPermPSA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadTagcreate.id,
          name: permIdName?.uploadTagcreate.name,
          description: permIdName?.uploadTagcreate.description,
          action: permIdName?.uploadTagcreate.action,
          createdAt: new Date()
        }

        var uploadDigitizedTagPermPSA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadDigitizedTagcreate.id,
          name: permIdName?.uploadDigitizedTagcreate.name,
          description: permIdName?.uploadDigitizedTagcreate.description,
          action: permIdName?.uploadDigitizedTagcreate.action,
          createdAt: new Date()
        }

        var uploadProcessTrackntraceTagPermPSA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadProcessTrackntraceTagcreate.id,
          name: permIdName?.uploadProcessTrackntraceTagcreate.name,
          description: permIdName?.uploadProcessTrackntraceTagcreate.description,
          action: permIdName?.uploadProcessTrackntraceTagcreate.action,
          createdAt: new Date()
        }

        var deEnabledTagPSA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.deEnableTagedit.id,
          name: permIdName?.deEnableTagedit.name,
          description: permIdName?.deEnableTagedit.description,
          action: permIdName?.deEnableTagedit.action,
          createdAt: new Date()
        }

        var uploadTrackntraceTagPSA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadTrackntraceTagcreate.id,
          name: permIdName?.uploadTrackntraceTagcreate.name,
          description: permIdName?.uploadTrackntraceTagcreate.description,
          action: permIdName?.uploadTrackntraceTagcreate.action,
          createdAt: new Date()
        }

        var removeTrackntraceTagPSA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.deleteTagdelete.id,
          name: permIdName?.deleteTagdelete.name,
          description: permIdName?.deleteTagdelete.description,
          action: permIdName?.deleteTagdelete.action,
          createdAt: new Date()
        }

      }

      if(role.name == "Platform Admin"){
        var ReadTagPermPA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readTagread.id,
          name: permIdName?.readTagread.name,
          description: permIdName?.readTagread.description,
          action: permIdName?.readTagread.action,
          createdAt: new Date()
        }

        var ReadDigitizedTagPermPA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readDigitizedTagread.id,
          name: permIdName?.readDigitizedTagread.name,
          description: permIdName?.readDigitizedTagread.description,
          action: permIdName?.readDigitizedTagread.action,
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

        var ReadTrackntraceTagPermPA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readTrackntraceread.id,
          name: permIdName?.readTrackntraceread.name,
          description: permIdName?.readTrackntraceread.description,
          action: permIdName?.readTrackntraceread.action,
          createdAt: new Date()
        }

        var ReadCommonDuplicateDigitizedPermPA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readCommonDuplicateDigitizedread.id,
          name: permIdName?.readCommonDuplicateDigitizedread.name,
          description: permIdName?.readCommonDuplicateDigitizedread.description,
          action: permIdName?.readCommonDuplicateDigitizedread.action,
          createdAt: new Date()
        }

        var uploadTagPermPA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadTagcreate.id,
          name: permIdName?.uploadTagcreate.name,
          description: permIdName?.uploadTagcreate.description,
          action: permIdName?.uploadTagcreate.action,
          createdAt: new Date()
        }

        var uploadDigitizedTagPermPA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadDigitizedTagcreate.id,
          name: permIdName?.uploadDigitizedTagcreate.name,
          description: permIdName?.uploadDigitizedTagcreate.description,
          action: permIdName?.uploadDigitizedTagcreate.action,
          createdAt: new Date()
        }

        var uploadProcessTrackntraceTagPermPA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadProcessTrackntraceTagcreate.id,
          name: permIdName?.uploadProcessTrackntraceTagcreate.name,
          description: permIdName?.uploadProcessTrackntraceTagcreate.description,
          action: permIdName?.uploadProcessTrackntraceTagcreate.action,
          createdAt: new Date()
        }

        var deEnabledTagPA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.deEnableTagedit.id,
          name: permIdName?.deEnableTagedit.name,
          description: permIdName?.deEnableTagedit.description,
          action: permIdName?.deEnableTagedit.action,
          createdAt: new Date()
        }

        var uploadTrackntraceTagPA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadTrackntraceTagcreate.id,
          name: permIdName?.uploadTrackntraceTagcreate.name,
          description: permIdName?.uploadTrackntraceTagcreate.description,
          action: permIdName?.uploadTrackntraceTagcreate.action,
          createdAt: new Date()
        }

        var removeTrackntraceTagPA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.deleteTagdelete.id,
          name: permIdName?.deleteTagdelete.name,
          description: permIdName?.deleteTagdelete.description,
          action: permIdName?.deleteTagdelete.action,
          createdAt: new Date()
        }
      }

      if(role.name == "Tenant Admin"){
        var ReadTagPermTA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readTagread.id,
          name: permIdName?.readTagread.name,
          description: permIdName?.readTagread.description,
          action: permIdName?.readTagread.action,
          createdAt: new Date()
        }

        var ReadDigitizedTagPermTA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readDigitizedTagread.id,
          name: permIdName?.readDigitizedTagread.name,
          description: permIdName?.readDigitizedTagread.description,
          action: permIdName?.readDigitizedTagread.action,
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

        var ReadTrackntraceTagPermTA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readTrackntraceread.id,
          name: permIdName?.readTrackntraceread.name,
          description: permIdName?.readTrackntraceread.description,
          action: permIdName?.readTrackntraceread.action,
          createdAt: new Date()
        }

        var ReadCommonDuplicateDigitizedPermTA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readCommonDuplicateDigitizedread.id,
          name: permIdName?.readCommonDuplicateDigitizedread.name,
          description: permIdName?.readCommonDuplicateDigitizedread.description,
          action: permIdName?.readCommonDuplicateDigitizedread.action,
          createdAt: new Date()
        }

        var uploadTagPermTA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadTagcreate.id,
          name: permIdName?.uploadTagcreate.name,
          description: permIdName?.uploadTagcreate.description,
          action: permIdName?.uploadTagcreate.action,
          createdAt: new Date()
        }

        var uploadDigitizedTagPermTA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadDigitizedTagcreate.id,
          name: permIdName?.uploadDigitizedTagcreate.name,
          description: permIdName?.uploadDigitizedTagcreate.description,
          action: permIdName?.uploadDigitizedTagcreate.action,
          createdAt: new Date()
        }

        var uploadProcessTrackntraceTagPermTA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadProcessTrackntraceTagcreate.id,
          name: permIdName?.uploadProcessTrackntraceTagcreate.name,
          description: permIdName?.uploadProcessTrackntraceTagcreate.description,
          action: permIdName?.uploadProcessTrackntraceTagcreate.action,
          createdAt: new Date()
        }

        var deEnabledTagTA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.deEnableTagedit.id,
          name: permIdName?.deEnableTagedit.name,
          description: permIdName?.deEnableTagedit.description,
          action: permIdName?.deEnableTagedit.action,
          createdAt: new Date()
        }

        var uploadTrackntraceTagTA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadTrackntraceTagcreate.id,
          name: permIdName?.uploadTrackntraceTagcreate.name,
          description: permIdName?.uploadTrackntraceTagcreate.description,
          action: permIdName?.uploadTrackntraceTagcreate.action,
          createdAt: new Date()
        }

        var removeTrackntraceTagTA = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.deleteTagdelete.id,
          name: permIdName?.deleteTagdelete.name,
          description: permIdName?.deleteTagdelete.description,
          action: permIdName?.deleteTagdelete.action,
          createdAt: new Date()
        }
      }

      if(role.name == "Project Manager"){
        var ReadTagPermPM = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readTagread.id,
          name: permIdName?.readTagread.name,
          description: permIdName?.readTagread.description,
          action: permIdName?.readTagread.action,
          createdAt: new Date()
        }
        var ReadDigitizedTagPermPM = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readDigitizedTagread.id,
          name: permIdName?.readDigitizedTagread.name,
          description: permIdName?.readDigitizedTagread.description,
          action: permIdName?.readDigitizedTagread.action,
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

        var ReadTrackntraceTagPermPM = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readTrackntraceread.id,
          name: permIdName?.readTrackntraceread.name,
          description: permIdName?.readTrackntraceread.description,
          action: permIdName?.readTrackntraceread.action,
          createdAt: new Date()
        }

        var ReadCommonDuplicateDigitizedPermPM = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readCommonDuplicateDigitizedread.id,
          name: permIdName?.readCommonDuplicateDigitizedread.name,
          description: permIdName?.readCommonDuplicateDigitizedread.description,
          action: permIdName?.readCommonDuplicateDigitizedread.action,
          createdAt: new Date()
        }

        var uploadTagPermPM = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadTagcreate.id,
          name: permIdName?.uploadTagcreate.name,
          description: permIdName?.uploadTagcreate.description,
          action: permIdName?.uploadTagcreate.action,
          createdAt: new Date()
        }

        var uploadDigitizedTagPermPM = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadDigitizedTagcreate.id,
          name: permIdName?.uploadDigitizedTagcreate.name,
          description: permIdName?.uploadDigitizedTagcreate.description,
          action: permIdName?.uploadDigitizedTagcreate.action,
          createdAt: new Date()
        }

        var uploadProcessTrackntraceTagPermPM = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadProcessTrackntraceTagcreate.id,
          name: permIdName?.uploadProcessTrackntraceTagcreate.name,
          description: permIdName?.uploadProcessTrackntraceTagcreate.description,
          action: permIdName?.uploadProcessTrackntraceTagcreate.action,
          createdAt: new Date()
        }

        var deEnabledTagPM = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.deEnableTagedit.id,
          name: permIdName?.deEnableTagedit.name,
          description: permIdName?.deEnableTagedit.description,
          action: permIdName?.deEnableTagedit.action,
          createdAt: new Date()
        }

        var uploadTrackntraceTagPM = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadTrackntraceTagcreate.id,
          name: permIdName?.uploadTrackntraceTagcreate.name,
          description: permIdName?.uploadTrackntraceTagcreate.description,
          action: permIdName?.uploadTrackntraceTagcreate.action,
          createdAt: new Date()
        }

        var removeTrackntraceTagPM = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.deleteTagdelete.id,
          name: permIdName?.deleteTagdelete.name,
          description: permIdName?.deleteTagdelete.description,
          action: permIdName?.deleteTagdelete.action,
          createdAt: new Date()
        }
      }

      if( role.name == "Supervisor" ){
        var ReadTagPermS = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readTagread.id,
          name: permIdName?.readTagread.name,
          description: permIdName?.readTagread.description,
          action: permIdName?.readTagread.action,
          createdAt: new Date()
        }

        var ReadDigitizedTagPermS = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readDigitizedTagread.id,
          name: permIdName?.readDigitizedTagread.name,
          description: permIdName?.readDigitizedTagread.description,
          action: permIdName?.readDigitizedTagread.action,
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

        var ReadTrackntraceTagPermS = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readTrackntraceread.id,
          name: permIdName?.readTrackntraceread.name,
          description: permIdName?.readTrackntraceread.description,
          action: permIdName?.readTrackntraceread.action,
          createdAt: new Date()
        }

        var ReadCommonDuplicateDigitizedPermS = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.readCommonDuplicateDigitizedread.id,
          name: permIdName?.readCommonDuplicateDigitizedread.name,
          description: permIdName?.readCommonDuplicateDigitizedread.description,
          action: permIdName?.readCommonDuplicateDigitizedread.action,
          createdAt: new Date()
        }

        var uploadTagPermS = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadTagcreate.id,
          name: permIdName?.uploadTagcreate.name,
          description: permIdName?.uploadTagcreate.description,
          action: permIdName?.uploadTagcreate.action,
          createdAt: new Date()
        }

        var uploadDigitizedTagPermS = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadDigitizedTagcreate.id,
          name: permIdName?.uploadDigitizedTagcreate.name,
          description: permIdName?.uploadDigitizedTagcreate.description,
          action: permIdName?.uploadDigitizedTagcreate.action,
          createdAt: new Date()
        }

        var uploadProcessTrackntraceTagPermS = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadProcessTrackntraceTagcreate.id,
          name: permIdName?.uploadProcessTrackntraceTagcreate.name,
          description: permIdName?.uploadProcessTrackntraceTagcreate.description,
          action: permIdName?.uploadProcessTrackntraceTagcreate.action,
          createdAt: new Date()
        }

        var deEnabledTagS = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.deEnableTagedit.id,
          name: permIdName?.deEnableTagedit.name,
          description: permIdName?.deEnableTagedit.description,
          action: permIdName?.deEnableTagedit.action,
          createdAt: new Date()
        }

        var uploadTrackntraceTagS = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.uploadTrackntraceTagcreate.id,
          name: permIdName?.uploadTrackntraceTagcreate.name,
          description: permIdName?.uploadTrackntraceTagcreate.description,
          action: permIdName?.uploadTrackntraceTagcreate.action,
          createdAt: new Date()
        }

        var removeTrackntraceTagS = {
          id: uuidv4(),
          roleId: role.id,  
          permissionId: permIdName.deleteTagdelete.id,
          name: permIdName?.deleteTagdelete.name,
          description: permIdName?.deleteTagdelete.description,
          action: permIdName?.deleteTagdelete.action,
          createdAt: new Date()
        }
      }
    }

    rolePermArray.push(ReadTagPermPSA)
    rolePermArray.push(ReadTagPermPA)
    rolePermArray.push(ReadTagPermTA)
    rolePermArray.push(ReadTagPermPM)
    rolePermArray.push(ReadTagPermS)

    rolePermArray.push(ReadDigitizedTagPermPSA)
    rolePermArray.push(ReadDuplicateTagPermPSA)
    rolePermArray.push(ReadTrackntraceTagPermPSA)
    rolePermArray.push(ReadCommonDuplicateDigitizedPermPSA)
    rolePermArray.push(uploadTagPermPSA)

    rolePermArray.push(uploadDigitizedTagPermPSA)
    rolePermArray.push(uploadProcessTrackntraceTagPermPSA)
    rolePermArray.push(deEnabledTagPSA)
    rolePermArray.push(uploadTrackntraceTagPSA)
    rolePermArray.push(removeTrackntraceTagPSA)

    rolePermArray.push(ReadDigitizedTagPermPA)
    rolePermArray.push(ReadDuplicateTagPermPA)
    rolePermArray.push(ReadTrackntraceTagPermPA)
    rolePermArray.push(ReadCommonDuplicateDigitizedPermPA)
    rolePermArray.push(uploadTagPermPA)

    rolePermArray.push(uploadDigitizedTagPermPA)
    rolePermArray.push(uploadProcessTrackntraceTagPermPA)
    rolePermArray.push(deEnabledTagPA)
    rolePermArray.push(uploadTrackntraceTagPA)
    rolePermArray.push(removeTrackntraceTagPA)

    rolePermArray.push(ReadDigitizedTagPermTA)
    rolePermArray.push(ReadDuplicateTagPermTA)
    rolePermArray.push(ReadTrackntraceTagPermTA)
    rolePermArray.push(ReadCommonDuplicateDigitizedPermTA)
    rolePermArray.push(uploadTagPermTA)

    rolePermArray.push(uploadDigitizedTagPermTA)
    rolePermArray.push(uploadProcessTrackntraceTagPermTA)
    rolePermArray.push(deEnabledTagTA)
    rolePermArray.push(uploadTrackntraceTagTA)
    rolePermArray.push(removeTrackntraceTagTA)

    rolePermArray.push(ReadDigitizedTagPermPM)
    rolePermArray.push(ReadDuplicateTagPermPM)
    rolePermArray.push(ReadTrackntraceTagPermPM)
    rolePermArray.push(ReadCommonDuplicateDigitizedPermPM)
    rolePermArray.push(uploadTagPermPM)

    rolePermArray.push(uploadDigitizedTagPermPM)
    rolePermArray.push(uploadProcessTrackntraceTagPermPM)
    rolePermArray.push(deEnabledTagPM)
    rolePermArray.push(uploadTrackntraceTagPM)
    rolePermArray.push(removeTrackntraceTagPM)

    rolePermArray.push(ReadDigitizedTagPermS)
    rolePermArray.push(ReadDuplicateTagPermS)
    rolePermArray.push(ReadTrackntraceTagPermS)
    rolePermArray.push(ReadCommonDuplicateDigitizedPermS)
    rolePermArray.push(uploadTagPermS)


    rolePermArray.push(uploadDigitizedTagPermS)
    rolePermArray.push(uploadProcessTrackntraceTagPermS)
    rolePermArray.push(deEnabledTagS)
    rolePermArray.push(uploadTrackntraceTagS)
    rolePermArray.push(removeTrackntraceTagS)

  },

  async down(queryInterface, Sequelize) {

  }
};
