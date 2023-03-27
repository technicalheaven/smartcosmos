'use strict';

const { v4: uuidv4 } = require("uuid");
const { Permission } = require('../config/db');
const { Role } = require('../config/db')
const { RolePermission } = require('../config/db')
import { logger } from '../libs/logger'



module.exports = {
  async up(query, Sequelize) {

    try {

      await query.bulkInsert("permissions", [
        {
          id: uuidv4(),
          name: "Tag",
          description:
            "This Permission allows a user to read factorytags history.",
          method: "get",
          action: "read",
          route: "/api/v1/factorytags/history",
          isCustom: false,
          createdAt: new Date(),
        },
        { 
          id: uuidv4(),
          name: "Feature",
          description:
            "This Permission allows a user to read feature.",
          method: "get",
          action: "read",
          route: "/api/v1/feature",
          isCustom: false,
          createdAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Feature",
          description:
            "This Permission allows a user to create feature.",
          method: "post",
          action: "create",
          route: "/api/v1/feature",
          isCustom: false,
          createdAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Feature",
          description:
            "This Permission allows a user to edit feature.",
          method: "patch",
          action: "edit",
          route: "/api/v1/feature",
          isCustom: false,
          createdAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Feature",
          description:
            "This Permission allows a user to delete feature.",
          method: "delete",
          action: "delete",
          route: "/api/v1/feature",
          isCustom: false,
          createdAt: new Date(),
        }
      ])


      let permissionData = await Permission.findAll()
      var permIdName = {}
      for (let permission of permissionData) {
        {

          if (
             ( permission?.route == '/api/v1/site' && permission?.method == 'get') || 
              (permission?.route == '/api/v1/sites' && permission?.method == 'get') ||
              (permission?.route == '/api/v1/factorytags/history' && permission?.method == 'get') ||
              (permission?.route == '/api/v1/tag/upload-tags' && permission?.method == 'post') || 
              (permission?.route == '/api/v1/user' && permission?.method == 'patch') || 
              // (permission?.route == '/api/v1/user/image/profile' && permission?.method == 'post') || 
              (permission?.route == '/api/v1/changepassword' && permission?.method == 'post') || 
              (permission?.route == '/api/v1/rolesdetails' && permission?.method == 'get') ||
              (permission?.route == '/api/v1/feature' )
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

        

          var ReadFactoryTagHistoryPermPSA = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Tagread.id,
            name: permIdName?.Tagread.name,
            description: permIdName?.Tagread.description,
            action: permIdName?.Tagread.action,
            createdAt: new Date()
          }

          var ReadFeaturePermPSA = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Featureread.id,
            name: permIdName?.Featureread.name,
            description: permIdName?.Featureread.description,
            action: permIdName?.Featureread.action,
            createdAt: new Date()
          }

          var CreateFeaturePermPSA = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Featurecreate.id,
            name: permIdName?.Featurecreate.name,
            description: permIdName?.Featurecreate.description,
            action: permIdName?.Featurecreate.action,
            createdAt: new Date()
          }

          var UpdateFeaturePermPSA = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Featureedit.id,
            name: permIdName?.Featureedit.name,
            description: permIdName?.Featureedit.description,
            action: permIdName?.Featureedit.action,
            createdAt: new Date()
          }

          var DeleteFeaturePermPSA = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Featuredelete.id,
            name: permIdName?.Featuredelete.name,
            description: permIdName?.Featuredelete.description,
            action: permIdName?.Featuredelete.action,
            createdAt: new Date()
          }
          
        }

        if(role.name == "Platform Admin"){
          var ReadFactoryTagHistoryPermPA = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Tagread.id,
            name: permIdName?.Tagread.name,
            description: permIdName?.Tagread.description,
            action: permIdName?.Tagread.action,
            createdAt: new Date()
          }

          var ReadFeaturePermPA = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Featureread.id,
            name: permIdName?.Featureread.name,
            description: permIdName?.Featureread.description,
            action: permIdName?.Featureread.action,
            createdAt: new Date()
          }

          var CreateFeaturePermPA = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Featurecreate.id,
            name: permIdName?.Featurecreate.name,
            description: permIdName?.Featurecreate.description,
            action: permIdName?.Featurecreate.action,
            createdAt: new Date()
          }

          var UpdateFeaturePermPA = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Featureedit.id,
            name: permIdName?.Featureedit.name,
            description: permIdName?.Featureedit.description,
            action: permIdName?.Featureedit.action,
            createdAt: new Date()
          }

          var DeleteFeaturePermPA = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Featuredelete.id,
            name: permIdName?.Featuredelete.name,
            description: permIdName?.Featuredelete.description,
            action: permIdName?.Featuredelete.action,
            createdAt: new Date()
          }

        }

        if(role.name == "Tenant Admin"){
          var ReadFactoryTagHistoryPermTA = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Tagread.id,
            name: permIdName?.Tagread.name,
            description: permIdName?.Tagread.description,
            action: permIdName?.Tagread.action,
            createdAt: new Date()
          }

          var ReadFeaturePermTA = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Featureread.id,
            name: permIdName?.Featureread.name,
            description: permIdName?.Featureread.description,
            action: permIdName?.Featureread.action,
            createdAt: new Date()
          }
        }

        if(role.name == "Project Manager"){

          var ReadFeaturePermPM = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Featureread.id,
            name: permIdName?.Featureread.name,
            description: permIdName?.Featureread.description,
            action: permIdName?.Featureread.action,
            createdAt: new Date()
          }

          var ReadFactoryTagHistoryPermPM = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Tagread.id,
            name: permIdName?.Tagread.name,
            description: permIdName?.Tagread.description,
            action: permIdName?.Tagread.action,
            createdAt: new Date()
          }
        }
        
        if( role.name == "Supervisor" ){
          var ReadFeaturePermS = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Featureread.id,
            name: permIdName?.Featureread.name,
            description: permIdName?.Featureread.description,
            action: permIdName?.Featureread.action,
            createdAt: new Date()
          }
        }


        if (role.name == "Factory Tag Operator") {
          
          var ReadSitePermFTO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Siteread.id,
            name: permIdName?.Siteread.name,
            description: permIdName?.Siteread.description,
            action: permIdName?.Siteread.action,
            createdAt: new Date()
          }

          var ReadSitesPermFTO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Siteread.id,
            name: permIdName?.Siteread.name,
            description: permIdName?.Siteread.description,
            action: permIdName?.Siteread.action,
            createdAt: new Date()
          }


          var ReadFactoryTagHistoryPermFTO = {
            id: uuidv4(),
            roleId: role.id,  
            permissionId: permIdName.Tagread.id,
            name: permIdName?.Tagread.name,
            description: permIdName?.Tagread.description,
            action: permIdName?.Tagread.action,
            createdAt: new Date()
          }

          var CreateUploadTagsPermFTO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.UploadTagcreate.id,
            name: permIdName?.UploadTagcreate.name,
            description: permIdName?.UploadTagcreate.description,
            action: permIdName?.UploadTagcreate.action,
            createdAt: new Date()
          }

          var UpdateUserPermFTO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersedit.id,
            name: permIdName?.Usersedit.name,
            description: permIdName?.Usersedit.description,
            action: permIdName?.Usersedit.action,
            createdAt: new Date()
          }


          var CreateChangePasswordPermFTO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.SelfInformationUpdatecreate.id,
            name: permIdName?.SelfInformationUpdatecreate.name,
            description: permIdName?.SelfInformationUpdatecreate.description,
            action: permIdName?.SelfInformationUpdatecreate.action,
            createdAt: new Date()
          }

          var ReadRolesDetailsPermFTO = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Rolesread.id,
            name: permIdName?.Rolesread.name,
            description: permIdName?.Rolesread.description,
            action: permIdName?.Rolesread.action,
            createdAt: new Date()
          }
          

        }
      }

      rolePermArray.push(ReadSitePermFTO)
      rolePermArray.push(ReadSitesPermFTO)
       rolePermArray.push(ReadFactoryTagHistoryPermFTO)
      rolePermArray.push(CreateUploadTagsPermFTO)
      rolePermArray.push(UpdateUserPermFTO)
      rolePermArray.push(CreateChangePasswordPermFTO)
      rolePermArray.push(ReadRolesDetailsPermFTO)


      rolePermArray.push(ReadFactoryTagHistoryPermPSA)
      rolePermArray.push(ReadFactoryTagHistoryPermPA)
      rolePermArray.push(ReadFactoryTagHistoryPermTA)
      rolePermArray.push(ReadFactoryTagHistoryPermPM)


      rolePermArray.push(ReadFeaturePermPSA)
      rolePermArray.push(CreateFeaturePermPSA)
      rolePermArray.push(UpdateFeaturePermPSA)
      rolePermArray.push(DeleteFeaturePermPSA)
      rolePermArray.push(ReadFeaturePermPA)
      rolePermArray.push(CreateFeaturePermPA)
      rolePermArray.push(UpdateFeaturePermPA)
      rolePermArray.push(DeleteFeaturePermPA)
      rolePermArray.push(ReadFeaturePermTA)
      rolePermArray.push(ReadFeaturePermS)
      rolePermArray.push(ReadFeaturePermPM)
      

      await query.bulkInsert('rolePermissions', rolePermArray)

    }
    catch (error) {
      logger.error("error");
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