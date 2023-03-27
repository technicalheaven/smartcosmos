'use strict';
const { v4: uuidv4 } = require("uuid");
const { Permission } = require('../config/db');
const { Role } = require('../config/db')
import { logger } from '../libs/logger'


module.exports = {
  async up(query, sequelize) {
    try {
      let permissionData = await Permission.findAll()
      var permIdName = {}
      for (let permission of permissionData) {
        {
          let key = permission?.name + permission?.action;
          permIdName[key] = {
            id: permission?.id,
            action: permission?.action,
            description: permission?.description,
            name: permission?.name
          };
        }
      }

      var rolePermArray = []
      let roleData = await Role.findAll()
      for (let role of roleData) {
        if (role.name == "Platform Super Admin") {
          var ReadUserPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersread.id,
            name: permIdName?.Usersread.name,
            description: permIdName?.Usersread.description,
            action: permIdName?.Usersread.action,
            createdAt: new Date()
          }
          var CreateUserPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Userscreate.id,
            name: permIdName?.Userscreate.name,
            description: permIdName?.Userscreate.description,
            action: permIdName?.Userscreate.action,
            createdAt: new Date()

          }
          var EditUsersPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersedit.id,
            name: permIdName?.Usersedit.name,
            description: permIdName?.Usersedit.description,
            action: permIdName?.Usersedit.action,
            createdAt: new Date()
          }
          var DeleteUsersPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersdelete.id,
            name: permIdName?.Usersedit.name,
            description: permIdName?.Usersedit.description,
            action: permIdName?.Usersedit.action,
            createdAt: new Date()
          }


          var ReadTenantPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Tenantread.id,
            name: permIdName?.Tenantread.name,
            description: permIdName?.Tenantread.description,
            action: permIdName?.Tenantread.action,
            createdAt: new Date()

          }
          var CreateTenantPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Tenantcreate.id,
            name: permIdName?.Tenantcreate.name,
            description: permIdName?.Tenantcreate.description,
            action: permIdName?.Tenantcreate.action,
            createdAt: new Date()

          }
          var EditTenantPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Tenantedit.id,
            name: permIdName?.Tenantedit.name,
            description: permIdName?.Tenantedit.description,
            action: permIdName?.Tenantedit.action,
            createdAt: new Date()
          }
          var DeleteTenantPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Tenantdelete.id,
            name: permIdName?.Tenantdelete.name,
            description: permIdName?.Tenantdelete.description,
            action: permIdName?.Tenantdelete.action,
            createdAt: new Date()
          }

          var ReadSitePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Siteread.id,
            name: permIdName?.Siteread.name,
            description: permIdName?.Siteread.description,
            action: permIdName?.Siteread.action,
            createdAt: new Date()

          }
          var CreateSitePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Sitecreate.id,
            name: permIdName?.Sitecreate.name,
            description: permIdName?.Sitecreate.description,
            action: permIdName?.Sitecreate.action,
            createdAt: new Date()

          }
          var EditSitePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Siteedit.id,
            name: permIdName?.Siteedit.name,
            description: permIdName?.Siteedit.description,
            action: permIdName?.Siteedit.action,
            createdAt: new Date()
          }
          var DeleteSitePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Sitedelete.id,
            name: permIdName?.Sitedelete.name,
            description: permIdName?.Sitedelete.description,
            action: permIdName?.Sitedelete.action,
            createdAt: new Date()
          }


          var ReadZonePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zoneread.id,
            name: permIdName?.Zoneread.name,
            description: permIdName?.Zoneread.description,
            action: permIdName?.Zoneread.action,
            createdAt: new Date()

          }
          var CreateZonePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zonecreate.id,
            name: permIdName?.Zonecreate.name,
            description: permIdName?.Zonecreate.description,
            action: permIdName?.Zonecreate.action,
            createdAt: new Date()

          }
          var EditZonePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zoneedit.id,
            name: permIdName?.Zoneedit.name,
            description: permIdName?.Zoneedit.description,
            action: permIdName?.Zoneedit.action,
            createdAt: new Date()
          }
          var DeleteZonePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zonedelete.id,
            name: permIdName?.Zonedelete.name,
            description: permIdName?.Zonedelete.description,
            action: permIdName?.Zonedelete.action,
            createdAt: new Date()
          }

          var ReadRolePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Rolesread.id,
            name: permIdName?.Rolesread.name,
            description: permIdName?.Rolesread.description,
            action: permIdName?.Rolesread.action,
            createdAt: new Date()

          }
          var CreateRolePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Rolescreate.id,
            name: permIdName?.Rolescreate.name,
            description: permIdName?.Rolescreate.description,
            action: permIdName?.Rolescreate.action,
            createdAt: new Date()

          }
          var EditRolePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Rolesedit.id,
            name: permIdName?.Rolesedit.name,
            description: permIdName?.Rolesedit.description,
            action: permIdName?.Rolesedit.action,
            createdAt: new Date()

          }
          var DeleteRolePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Rolesdelete.id,
            name: permIdName?.Rolesdelete.name,
            description: permIdName?.Rolesdelete.description,
            action: permIdName?.Rolesdelete.action,
            createdAt: new Date()

          }

          var ReadProcessPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processread.id,
            name: permIdName?.Processread.name,
            description: permIdName?.Processread.description,
            action: permIdName?.Processread.action,
            createdAt: new Date()

          }
          var CreateProcessPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processcreate.id,
            name: permIdName?.Processcreate.name,
            description: permIdName?.Processcreate.description,
            action: permIdName?.Processcreate.action,
            createdAt: new Date()

          }
          var EditProcessPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processedit.id,
            name: permIdName?.Processedit.name,
            description: permIdName?.Processedit.description,
            action: permIdName?.Processedit.action,
            createdAt: new Date()

          }
          var DeleteProcessPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processdelete.id,
            name: permIdName?.Processdelete.name,
            description: permIdName?.Processdelete.description,
            action: permIdName?.Processdelete.action,
            createdAt: new Date()

          }
          var ProcessAssignPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.ProcessAssignedit.id,
            name: permIdName?.ProcessAssignedit.name,
            description: permIdName?.ProcessAssignedit.description,
            action: permIdName?.ProcessAssignedit.action,
            createdAt: new Date()

          }
          var ProcessUnassignPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.ProcessUnassignedit.id,
            name: permIdName?.ProcessUnassignedit.name,
            description: permIdName?.ProcessUnassignedit.description,
            action: permIdName?.ProcessUnassignedit.action,
            createdAt: new Date()

          }


          var ReadProductPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productread.id,
            name: permIdName?.Productread.name,
            description: permIdName?.Productread.description,
            action: permIdName?.Productread.action,
            createdAt: new Date()

          }
          var CreateProductPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productcreate.id,
            name: permIdName?.Productcreate.name,
            description: permIdName?.Productcreate.description,
            action: permIdName?.Productcreate.action,
            createdAt: new Date()

          }
          var EditProductPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productedit.id,
            name: permIdName?.Productedit.name,
            description: permIdName?.Productedit.description,
            action: permIdName?.Productedit.action,
            createdAt: new Date()

          }
          var DeleteProductPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productdelete.id,
            name: permIdName?.Productdelete.name,
            description: permIdName?.Productdelete.description,
            action: permIdName?.Productdelete.action,
            createdAt: new Date()

          }
          var CreateProductMetaPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.ProductMetacreate.id,
            name: permIdName?.ProductMetacreate.name,
            description: permIdName?.ProductMetacreate.description,
            action: permIdName?.ProductMetacreate.action,
            createdAt: new Date()

          }

          var ReadDevicePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Deviceread.id,
            name: permIdName?.Deviceread.name,
            description: permIdName?.Deviceread.description,
            action: permIdName?.Deviceread.action,
            createdAt: new Date()

          }
          var CreateDevicePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Devicecreate.id,
            name: permIdName?.Devicecreate.name,
            description: permIdName?.Devicecreate.description,
            action: permIdName?.Devicecreate.action,
            createdAt: new Date()

          }
          var EditDevicePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Deviceedit.id,
            name: permIdName?.Deviceedit.name,
            description: permIdName?.Deviceedit.description,
            action: permIdName?.Deviceedit.action,
            createdAt: new Date()

          }
          var DeleteDevicePermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Devicedelete.id,
            name: permIdName?.Devicedelete.name,
            description: permIdName?.Devicedelete.description,
            action: permIdName?.Devicedelete.action,
            createdAt: new Date()

          }
          var DeviceAssignPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.DeviceAssignedit.id,
            name: permIdName?.DeviceAssignedit.name,
            description: permIdName?.DeviceAssignedit.description,
            action: permIdName?.DeviceAssignedit.action,
            createdAt: new Date()

          }
          var DeviceUnassignPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.DeviceUnassignedit.id,
            name: permIdName?.DeviceUnassignedit.name,
            description: permIdName?.DeviceUnassignedit.description,
            action: permIdName?.DeviceUnassignedit.action,
            createdAt: new Date()

          }


          var ReadReportPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Reportread.id,
            name: permIdName?.Reportread.name,
            description: permIdName?.Reportread.description,
            action: permIdName?.Reportread.action,
            createdAt: new Date()

          }
          var CreateReportPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Reportcreate.id,
            name: permIdName?.Reportcreate.name,
            description: permIdName?.Reportcreate.description,
            action: permIdName?.Reportcreate.action,
            createdAt: new Date()

          }
          var EditReportPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Reportedit.id,
            name: permIdName?.Reportedit.name,
            description: permIdName?.Reportedit.description,
            action: permIdName?.Reportedit.action,
            createdAt: new Date()

          }
          var DeleteReportPermSa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Reportdelete.id,
            name: permIdName?.Reportdelete.name,
            description: permIdName?.Reportdelete.description,
            action: permIdName?.Reportdelete.action,
            createdAt: new Date()

          }


        }
        if (role.name == "Platform Admin") {
          var ReadUserPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersread.id,
            name: permIdName?.Usersread.name,
            description: permIdName?.Usersread.description,
            action: permIdName?.Usersread.action,
            createdAt: new Date()

          }
          var CreateUserPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Userscreate.id,
            name: permIdName?.Userscreate.name,
            description: permIdName?.Userscreate.description,
            action: permIdName?.Userscreate.action,
            createdAt: new Date()

          }
          var EditUsersPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersedit.id,
            name: permIdName?.Usersedit.name,
            description: permIdName?.Usersedit.description,
            action: permIdName?.Usersedit.action,
            createdAt: new Date()
          }
          var DeleteUsersPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersdelete.id,
            name: permIdName?.Usersedit.name,
            description: permIdName?.Usersedit.description,
            action: permIdName?.Usersedit.action,
            createdAt: new Date()
          }


          var ReadTenantPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Tenantread.id,
            name: permIdName?.Tenantread.name,
            description: permIdName?.Tenantread.description,
            action: permIdName?.Tenantread.action,
            createdAt: new Date()

          }
          var CreateTenantPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Tenantcreate.id,
            name: permIdName?.Tenantcreate.name,
            description: permIdName?.Tenantcreate.description,
            action: permIdName?.Tenantcreate.action,
            createdAt: new Date()

          }
          var EditTenantPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Tenantedit.id,
            name: permIdName?.Tenantedit.name,
            description: permIdName?.Tenantedit.description,
            action: permIdName?.Tenantedit.action,
            createdAt: new Date()
          }
          var DeleteTenantPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Tenantdelete.id,
            name: permIdName?.Tenantdelete.name,
            description: permIdName?.Tenantdelete.description,
            action: permIdName?.Tenantdelete.action,
            createdAt: new Date()
          }

          var ReadSitePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Siteread.id,
            name: permIdName?.Siteread.name,
            description: permIdName?.Siteread.description,
            action: permIdName?.Siteread.action,
            createdAt: new Date()

          }
          var CreateSitePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Sitecreate.id,
            name: permIdName?.Sitecreate.name,
            description: permIdName?.Sitecreate.description,
            action: permIdName?.Sitecreate.action,
            createdAt: new Date()

          }
          var EditSitePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Siteedit.id,
            name: permIdName?.Siteedit.name,
            description: permIdName?.Siteedit.description,
            action: permIdName?.Siteedit.action,
            createdAt: new Date()
          }
          var DeleteSitePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Sitedelete.id,
            name: permIdName?.Sitedelete.name,
            description: permIdName?.Sitedelete.description,
            action: permIdName?.Sitedelete.action,
            createdAt: new Date()
          }


          var ReadZonePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zoneread.id,
            name: permIdName?.Zoneread.name,
            description: permIdName?.Zoneread.description,
            action: permIdName?.Zoneread.action,
            createdAt: new Date()

          }
          var CreateZonePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zonecreate.id,
            name: permIdName?.Zonecreate.name,
            description: permIdName?.Zonecreate.description,
            action: permIdName?.Zonecreate.action,
            createdAt: new Date()

          }
          var EditZonePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zoneedit.id,
            name: permIdName?.Zoneedit.name,
            description: permIdName?.Zoneedit.description,
            action: permIdName?.Zoneedit.action,
            createdAt: new Date()
          }
          var DeleteZonePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zonedelete.id,
            name: permIdName?.Zonedelete.name,
            description: permIdName?.Zonedelete.description,
            action: permIdName?.Zonedelete.action,
            createdAt: new Date()
          }

          var ReadRolePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Rolesread.id,
            name: permIdName?.Rolesread.name,
            description: permIdName?.Rolesread.description,
            action: permIdName?.Rolesread.action,
            createdAt: new Date()

          }
          var CreateRolePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Rolescreate.id,
            name: permIdName?.Rolescreate.name,
            description: permIdName?.Rolescreate.description,
            action: permIdName?.Rolescreate.action,
            createdAt: new Date()

          }
          var EditRolePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Rolesedit.id,
            name: permIdName?.Rolesedit.name,
            description: permIdName?.Rolesedit.description,
            action: permIdName?.Rolesedit.action,
            createdAt: new Date()

          }
          var DeleteRolePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Rolesdelete.id,
            name: permIdName?.Rolesdelete.name,
            description: permIdName?.Rolesdelete.description,
            action: permIdName?.Rolesdelete.action,
            createdAt: new Date()

          }

          var ReadProcessPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processread.id,
            name: permIdName?.Processread.name,
            description: permIdName?.Processread.description,
            action: permIdName?.Processread.action,
            createdAt: new Date()

          }
          var CreateProcessPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processcreate.id,
            name: permIdName?.Processcreate.name,
            description: permIdName?.Processcreate.description,
            action: permIdName?.Processcreate.action,
            createdAt: new Date()

          }
          var EditProcessPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processedit.id,
            name: permIdName?.Processedit.name,
            description: permIdName?.Processedit.description,
            action: permIdName?.Processedit.action,
            createdAt: new Date()

          }
          var DeleteProcessPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processdelete.id,
            name: permIdName?.Processdelete.name,
            description: permIdName?.Processdelete.description,
            action: permIdName?.Processdelete.action,
            createdAt: new Date()

          }
          var ProcessAssignPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.ProcessAssignedit.id,
            name: permIdName?.ProcessAssignedit.name,
            description: permIdName?.ProcessAssignedit.description,
            action: permIdName?.ProcessAssignedit.action,
            createdAt: new Date()

          }
          var ProcessUnassignPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.ProcessUnassignedit.id,
            name: permIdName?.ProcessUnassignedit.name,
            description: permIdName?.ProcessUnassignedit.description,
            action: permIdName?.ProcessUnassignedit.action,
            createdAt: new Date()

          }


          var ReadProductPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productread.id,
            name: permIdName?.Productread.name,
            description: permIdName?.Productread.description,
            action: permIdName?.Productread.action,
            createdAt: new Date()

          }
          var CreateProductPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productcreate.id,
            name: permIdName?.Productcreate.name,
            description: permIdName?.Productcreate.description,
            action: permIdName?.Productcreate.action,
            createdAt: new Date()

          }
          var EditProductPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productedit.id,
            name: permIdName?.Productedit.name,
            description: permIdName?.Productedit.description,
            action: permIdName?.Productedit.action,
            createdAt: new Date()

          }
          var DeleteProductPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productdelete.id,
            name: permIdName?.Productdelete.name,
            description: permIdName?.Productdelete.description,
            action: permIdName?.Productdelete.action,
            createdAt: new Date()

          }
          var CreateProductMetaPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.ProductMetacreate.id,
            name: permIdName?.ProductMetacreate.name,
            description: permIdName?.ProductMetacreate.description,
            action: permIdName?.ProductMetacreate.action,
            createdAt: new Date()

          }

          var ReadDevicePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Deviceread.id,
            name: permIdName?.Deviceread.name,
            description: permIdName?.Deviceread.description,
            action: permIdName?.Deviceread.action,
            createdAt: new Date()

          }
          var CreateDevicePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Devicecreate.id,
            name: permIdName?.Devicecreate.name,
            description: permIdName?.Devicecreate.description,
            action: permIdName?.Devicecreate.action,
            createdAt: new Date()

          }
          var EditDevicePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Deviceedit.id,
            name: permIdName?.Deviceedit.name,
            description: permIdName?.Deviceedit.description,
            action: permIdName?.Deviceedit.action,
            createdAt: new Date()

          }
          var DeleteDevicePermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Devicedelete.id,
            name: permIdName?.Devicedelete.name,
            description: permIdName?.Devicedelete.description,
            action: permIdName?.Devicedelete.action,
            createdAt: new Date()

          }
          var DeviceAssignPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.DeviceAssignedit.id,
            name: permIdName?.DeviceAssignedit.name,
            description: permIdName?.DeviceAssignedit.description,
            action: permIdName?.DeviceAssignedit.action,
            createdAt: new Date()

          }
          var DeviceUnassignPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.DeviceUnassignedit.id,
            name: permIdName?.DeviceUnassignedit.name,
            description: permIdName?.DeviceUnassignedit.description,
            action: permIdName?.DeviceUnassignedit.action,
            createdAt: new Date()

          }


          var ReadReportPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Reportread.id,
            name: permIdName?.Reportread.name,
            description: permIdName?.Reportread.description,
            action: permIdName?.Reportread.action,
            createdAt: new Date()

          }
          var CreateReportPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Reportcreate.id,
            name: permIdName?.Reportcreate.name,
            description: permIdName?.Reportcreate.description,
            action: permIdName?.Reportcreate.action,
            createdAt: new Date()

          }
          var EditReportPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Reportedit.id,
            name: permIdName?.Reportedit.name,
            description: permIdName?.Reportedit.description,
            action: permIdName?.Reportedit.action,
            createdAt: new Date()

          }
          var DeleteReportPermPa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Reportdelete.id,
            name: permIdName?.Reportdelete.name,
            description: permIdName?.Reportdelete.description,
            action: permIdName?.Reportdelete.action,
            createdAt: new Date()

          }







        }
        if (role.name == "Tenant Admin") {
          var ReadUserPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersread.id,
            name: permIdName?.Usersread.name,
            description: permIdName?.Usersread.description,
            action: permIdName?.Usersread.action,
            createdAt: new Date()

          }
          var CreateUserPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Userscreate.id,
            name: permIdName?.Userscreate.name,
            description: permIdName?.Userscreate.description,
            action: permIdName?.Userscreate.action,
            createdAt: new Date()

          }
          var EditUsersPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersedit.id,
            name: permIdName?.Usersedit.name,
            description: permIdName?.Usersedit.description,
            action: permIdName?.Usersedit.action,
            createdAt: new Date()
          }
          var DeleteUsersPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersdelete.id,
            name: permIdName?.Usersedit.name,
            description: permIdName?.Usersedit.description,
            action: permIdName?.Usersedit.action,
            createdAt: new Date()
          }
          var ReadTenantPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Tenantread.id,
            name: permIdName?.Tenantread.name,
            description: permIdName?.Tenantread.description,
            action: permIdName?.Tenantread.action,
            createdAt: new Date()

          }
          var EditTenantPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Tenantedit.id,
            name: permIdName?.Tenantedit.name,
            description: permIdName?.Tenantedit.description,
            action: permIdName?.Tenantedit.action,
            createdAt: new Date()
          }
          var ReadSitePermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Siteread.id,
            name: permIdName?.Siteread.name,
            description: permIdName?.Siteread.description,
            action: permIdName?.Siteread.action,
            createdAt: new Date()

          }
          var CreateSitePermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Sitecreate.id,
            name: permIdName?.Sitecreate.name,
            description: permIdName?.Sitecreate.description,
            action: permIdName?.Sitecreate.action,
            createdAt: new Date()

          }
          var EditSitePermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Siteedit.id,
            name: permIdName?.Siteedit.name,
            description: permIdName?.Siteedit.description,
            action: permIdName?.Siteedit.action,
            createdAt: new Date()
          }
          var DeleteSitePermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Sitedelete.id,
            name: permIdName?.Sitedelete.name,
            description: permIdName?.Sitedelete.description,
            action: permIdName?.Sitedelete.action,
            createdAt: new Date()
          }
          var ReadZonePermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zoneread.id,
            name: permIdName?.Zoneread.name,
            description: permIdName?.Zoneread.description,
            action: permIdName?.Zoneread.action,
            createdAt: new Date()

          }
          var CreateZonePermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zonecreate.id,
            name: permIdName?.Zonecreate.name,
            description: permIdName?.Zonecreate.description,
            action: permIdName?.Zonecreate.action,
            createdAt: new Date()

          }
          var EditZonePermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zoneedit.id,
            name: permIdName?.Zoneedit.name,
            description: permIdName?.Zoneedit.description,
            action: permIdName?.Zoneedit.action,
            createdAt: new Date()
          }
          var DeleteZonePermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zonedelete.id,
            name: permIdName?.Zonedelete.name,
            description: permIdName?.Zonedelete.description,
            action: permIdName?.Zonedelete.action,
            createdAt: new Date()
          }

          var ReadProcessPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processread.id,
            name: permIdName?.Processread.name,
            description: permIdName?.Processread.description,
            action: permIdName?.Processread.action,
            createdAt: new Date()

          }
          var CreateProcessPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processcreate.id,
            name: permIdName?.Processcreate.name,
            description: permIdName?.Processcreate.description,
            action: permIdName?.Processcreate.action,
            createdAt: new Date()

          }
          var EditProcessPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processedit.id,
            name: permIdName?.Processedit.name,
            description: permIdName?.Processedit.description,
            action: permIdName?.Processedit.action,
            createdAt: new Date()

          }
          var DeleteProcessPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processdelete.id,
            name: permIdName?.Processdelete.name,
            description: permIdName?.Processdelete.description,
            action: permIdName?.Processdelete.action,
            createdAt: new Date()

          }

          var ProcessAssignPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.ProcessAssignedit.id,
            name: permIdName?.ProcessAssignedit.name,
            description: permIdName?.ProcessAssignedit.description,
            action: permIdName?.ProcessAssignedit.action,
            createdAt: new Date()

          }
          var ProcessUnassignPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.ProcessUnassignedit.id,
            name: permIdName?.ProcessUnassignedit.name,
            description: permIdName?.ProcessUnassignedit.description,
            action: permIdName?.ProcessUnassignedit.action,
            createdAt: new Date()

          }


          var ReadProductPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productread.id,
            name: permIdName?.Productread.name,
            description: permIdName?.Productread.description,
            action: permIdName?.Productread.action,
            createdAt: new Date()

          }
          var CreateProductPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productcreate.id,
            name: permIdName?.Productcreate.name,
            description: permIdName?.Productcreate.description,
            action: permIdName?.Productcreate.action,
            createdAt: new Date()

          }
          var EditProductPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productedit.id,
            name: permIdName?.Productedit.name,
            description: permIdName?.Productedit.description,
            action: permIdName?.Productedit.action,
            createdAt: new Date()

          }
          var DeleteProductPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productdelete.id,
            name: permIdName?.Productdelete.name,
            description: permIdName?.Productdelete.description,
            action: permIdName?.Productdelete.action,
            createdAt: new Date()

          }
          var CreateProductMetaPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.ProductMetacreate.id,
            name: permIdName?.ProductMetacreate.name,
            description: permIdName?.ProductMetacreate.description,
            action: permIdName?.ProductMetacreate.action,
            createdAt: new Date()

          }

          var ReadDevicePermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Deviceread.id,
            name: permIdName?.Deviceread.name,
            description: permIdName?.Deviceread.description,
            action: permIdName?.Deviceread.action,
            createdAt: new Date()

          }
          var CreateDevicePermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Devicecreate.id,
            name: permIdName?.Devicecreate.name,
            description: permIdName?.Devicecreate.description,
            action: permIdName?.Devicecreate.action,
            createdAt: new Date()

          }
          var EditDevicePermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Deviceedit.id,
            name: permIdName?.Deviceedit.name,
            description: permIdName?.Deviceedit.description,
            action: permIdName?.Deviceedit.action,
            createdAt: new Date()

          }
          var DeleteDevicePermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Devicedelete.id,
            name: permIdName?.Devicedelete.name,
            description: permIdName?.Devicedelete.description,
            action: permIdName?.Devicedelete.action,
            createdAt: new Date()

          }
          var DeviceAssignPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.DeviceAssignedit.id,
            name: permIdName?.DeviceAssignedit.name,
            description: permIdName?.DeviceAssignedit.description,
            action: permIdName?.DeviceAssignedit.action,
            createdAt: new Date()

          }
          var DeviceUnassignPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.DeviceUnassignedit.id,
            name: permIdName?.DeviceUnassignedit.name,
            description: permIdName?.DeviceUnassignedit.description,
            action: permIdName?.DeviceUnassignedit.action,
            createdAt: new Date()

          }

          var ReadReportPermTa = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Reportread.id,
            name: permIdName?.Reportread.name,
            description: permIdName?.Reportread.description,
            action: permIdName?.Reportread.action,
            createdAt: new Date()

          }







        }
        if (role.name == "Project Manager") {
          var ReadUserPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersread.id,
            name: permIdName?.Usersread.name,
            description: permIdName?.Usersread.description,
            action: permIdName?.Usersread.action,
            createdAt: new Date()

          }
          var CreateUserPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Userscreate.id,
            name: permIdName?.Userscreate.name,
            description: permIdName?.Userscreate.description,
            action: permIdName?.Userscreate.action,
            createdAt: new Date()

          }
          var EditUsersPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersedit.id,
            name: permIdName?.Usersedit.name,
            description: permIdName?.Usersedit.description,
            action: permIdName?.Usersedit.action,
            createdAt: new Date()
          }
          var DeleteUsersPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Usersdelete.id,
            name: permIdName?.Usersedit.name,
            description: permIdName?.Usersedit.description,
            action: permIdName?.Usersedit.action,
            createdAt: new Date()
          }
          var ReadTenantPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Tenantread.id,
            name: permIdName?.Tenantread.name,
            description: permIdName?.Tenantread.description,
            action: permIdName?.Tenantread.action,
            createdAt: new Date()

          }
          var ReadSitePermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Siteread.id,
            name: permIdName?.Siteread.name,
            description: permIdName?.Siteread.description,
            action: permIdName?.Siteread.action,
            createdAt: new Date()

          }
          var CreateSitePermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Sitecreate.id,
            name: permIdName?.Sitecreate.name,
            description: permIdName?.Sitecreate.description,
            action: permIdName?.Sitecreate.action,
            createdAt: new Date()

          }
          var EditSitePermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Siteedit.id,
            name: permIdName?.Siteedit.name,
            description: permIdName?.Siteedit.description,
            action: permIdName?.Siteedit.action,
            createdAt: new Date()
          }
          var DeleteSitePermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Sitedelete.id,
            name: permIdName?.Sitedelete.name,
            description: permIdName?.Sitedelete.description,
            action: permIdName?.Sitedelete.action,
            createdAt: new Date()
          }
          var ReadZonePermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zoneread.id,
            name: permIdName?.Zoneread.name,
            description: permIdName?.Zoneread.description,
            action: permIdName?.Zoneread.action,
            createdAt: new Date()

          }
          var CreateZonePermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zonecreate.id,
            name: permIdName?.Zonecreate.name,
            description: permIdName?.Zonecreate.description,
            action: permIdName?.Zonecreate.action,
            createdAt: new Date()

          }
          var EditZonePermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zoneedit.id,
            name: permIdName?.Zoneedit.name,
            description: permIdName?.Zoneedit.description,
            action: permIdName?.Zoneedit.action,
            createdAt: new Date()
          }
          var DeleteZonePermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zonedelete.id,
            name: permIdName?.Zonedelete.name,
            description: permIdName?.Zonedelete.description,
            action: permIdName?.Zonedelete.action,
            createdAt: new Date()
          }
          var ReadProcessPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processread.id,
            name: permIdName?.Processread.name,
            description: permIdName?.Processread.description,
            action: permIdName?.Processread.action,
            createdAt: new Date()

          }
          var CreateProcessPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processcreate.id,
            name: permIdName?.Processcreate.name,
            description: permIdName?.Processcreate.description,
            action: permIdName?.Processcreate.action,
            createdAt: new Date()

          }
          var EditProcessPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processedit.id,
            name: permIdName?.Processedit.name,
            description: permIdName?.Processedit.description,
            action: permIdName?.Processedit.action,
            createdAt: new Date()

          }
          var DeleteProcessPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processdelete.id,
            name: permIdName?.Processdelete.name,
            description: permIdName?.Processdelete.description,
            action: permIdName?.Processdelete.action,
            createdAt: new Date()

          }
          var ProcessAssignPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.ProcessAssignedit.id,
            name: permIdName?.ProcessAssignedit.name,
            description: permIdName?.ProcessAssignedit.description,
            action: permIdName?.ProcessAssignedit.action,
            createdAt: new Date()

          }
          var ProcessUnassignPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.ProcessUnassignedit.id,
            name: permIdName?.ProcessUnassignedit.name,
            description: permIdName?.ProcessUnassignedit.description,
            action: permIdName?.ProcessUnassignedit.action,
            createdAt: new Date()

          }
          var ReadProductPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productread.id,
            name: permIdName?.Productread.name,
            description: permIdName?.Productread.description,
            action: permIdName?.Productread.action,
            createdAt: new Date()

          }
          var CreateProductPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productcreate.id,
            name: permIdName?.Productcreate.name,
            description: permIdName?.Productcreate.description,
            action: permIdName?.Productcreate.action,
            createdAt: new Date()

          }
          var EditProductPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productedit.id,
            name: permIdName?.Productedit.name,
            description: permIdName?.Productedit.description,
            action: permIdName?.Productedit.action,
            createdAt: new Date()

          }
          var DeleteProductPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productdelete.id,
            name: permIdName?.Productdelete.name,
            description: permIdName?.Productdelete.description,
            action: permIdName?.Productdelete.action,
            createdAt: new Date()

          }
          var CreateProductMetaPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.ProductMetacreate.id,
            name: permIdName?.ProductMetacreate.name,
            description: permIdName?.ProductMetacreate.description,
            action: permIdName?.ProductMetacreate.action,
            createdAt: new Date()

          }

          var ReadDevicePermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Deviceread.id,
            name: permIdName?.Deviceread.name,
            description: permIdName?.Deviceread.description,
            action: permIdName?.Deviceread.action,
            createdAt: new Date()

          }
          var CreateDevicePermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Devicecreate.id,
            name: permIdName?.Devicecreate.name,
            description: permIdName?.Devicecreate.description,
            action: permIdName?.Devicecreate.action,
            createdAt: new Date()

          }
          var EditDevicePermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Deviceedit.id,
            name: permIdName?.Deviceedit.name,
            description: permIdName?.Deviceedit.description,
            action: permIdName?.Deviceedit.action,
            createdAt: new Date()

          }
          var DeleteDevicePermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Devicedelete.id,
            name: permIdName?.Devicedelete.name,
            description: permIdName?.Devicedelete.description,
            action: permIdName?.Devicedelete.action,
            createdAt: new Date()

          }
          var DeviceAssignPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.DeviceAssignedit.id,
            name: permIdName?.DeviceAssignedit.name,
            description: permIdName?.DeviceAssignedit.description,
            action: permIdName?.DeviceAssignedit.action,
            createdAt: new Date()

          }
          var DeviceUnassignPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.DeviceUnassignedit.id,
            name: permIdName?.DeviceUnassignedit.name,
            description: permIdName?.DeviceUnassignedit.description,
            action: permIdName?.DeviceUnassignedit.action,
            createdAt: new Date()

          }

          var ReadReportPermPM = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Reportread.id,
            name: permIdName?.Reportread.name,
            description: permIdName?.Reportread.description,
            action: permIdName?.Reportread.action,
            createdAt: new Date()

          }







        }
        if (role.name == "Supervisor") {

          var ReadTenantPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Tenantread.id,
            name: permIdName?.Tenantread.name,
            description: permIdName?.Tenantread.description,
            action: permIdName?.Tenantread.action,
            createdAt: new Date()

          }
          var ReadSitePermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Siteread.id,
            name: permIdName?.Siteread.name,
            description: permIdName?.Siteread.description,
            action: permIdName?.Siteread.action,
            createdAt: new Date()

          }
          var ReadZonePermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Zoneread.id,
            name: permIdName?.Zoneread.name,
            description: permIdName?.Zoneread.description,
            action: permIdName?.Zoneread.action,
            createdAt: new Date()

          }
          var ReadProcessPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Processread.id,
            name: permIdName?.Processread.name,
            description: permIdName?.Processread.description,
            action: permIdName?.Processread.action,
            createdAt: new Date()

          }
          var ProcessAssignPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.ProcessAssignedit.id,
            name: permIdName?.ProcessAssignedit.name,
            description: permIdName?.ProcessAssignedit.description,
            action: permIdName?.ProcessAssignedit.action,
            createdAt: new Date()

          }
          var ProcessUnassignPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.ProcessUnassignedit.id,
            name: permIdName?.ProcessUnassignedit.name,
            description: permIdName?.ProcessUnassignedit.description,
            action: permIdName?.ProcessUnassignedit.action,
            createdAt: new Date()

          }
          var ReadProductPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Productread.id,
            name: permIdName?.Productread.name,
            description: permIdName?.Productread.description,
            action: permIdName?.Productread.action,
            createdAt: new Date()

          }
          var ReadDevicePermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Deviceread.id,
            name: permIdName?.Deviceread.name,
            description: permIdName?.Deviceread.description,
            action: permIdName?.Deviceread.action,
            createdAt: new Date()

          }
          var DeviceAssignPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.DeviceAssignedit.id,
            name: permIdName?.DeviceAssignedit.name,
            description: permIdName?.DeviceAssignedit.description,
            action: permIdName?.DeviceAssignedit.action,
            createdAt: new Date()

          }
          var DeviceUnassignPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.DeviceUnassignedit.id,
            name: permIdName?.DeviceUnassignedit.name,
            description: permIdName?.DeviceUnassignedit.description,
            action: permIdName?.DeviceUnassignedit.action,
            createdAt: new Date()

          }
          var ReadReportPermS = {
            id: uuidv4(),
            roleId: role.id,
            permissionId: permIdName.Reportread.id,
            name: permIdName?.Reportread.name,
            description: permIdName?.Reportread.description,
            action: permIdName?.Reportread.action,
            createdAt: new Date()

          }

        }
      }

      rolePermArray.push(ReadUserPermSa)
      rolePermArray.push(CreateUserPermSa)
      rolePermArray.push(EditUsersPermSa)
      rolePermArray.push(DeleteUsersPermSa)
      rolePermArray.push(ReadTenantPermSa)
      rolePermArray.push(CreateTenantPermSa)
      rolePermArray.push(EditTenantPermSa)
      rolePermArray.push(DeleteTenantPermSa)

      rolePermArray.push(ReadSitePermSa)
      rolePermArray.push(CreateSitePermSa)
      rolePermArray.push(EditSitePermSa)
      rolePermArray.push(DeleteSitePermSa)
      rolePermArray.push(ReadZonePermSa)
      rolePermArray.push(CreateZonePermSa)
      rolePermArray.push(EditZonePermSa)
      rolePermArray.push(DeleteZonePermSa)


      rolePermArray.push(ReadRolePermSa)
      rolePermArray.push(CreateRolePermSa)
      rolePermArray.push(EditRolePermSa)
      rolePermArray.push(DeleteRolePermSa)
      rolePermArray.push(ReadProcessPermSa)
      rolePermArray.push(CreateProcessPermSa)
      rolePermArray.push(EditProcessPermSa)
      rolePermArray.push(DeleteProcessPermSa)


      rolePermArray.push(ProcessAssignPermSa)
      rolePermArray.push(ProcessUnassignPermSa)
      rolePermArray.push(CreateProductPermSa)
      rolePermArray.push(EditProductPermSa)
      rolePermArray.push(ReadProductPermSa)
      rolePermArray.push(DeleteProductPermSa)
      rolePermArray.push(CreateProductMetaPermSa)


      rolePermArray.push(ReadDevicePermSa)
      rolePermArray.push(CreateDevicePermSa)
      rolePermArray.push(EditDevicePermSa)
      rolePermArray.push(DeleteDevicePermSa)
      rolePermArray.push(DeviceAssignPermSa)
      rolePermArray.push(DeviceUnassignPermSa)
      rolePermArray.push(ReadReportPermSa)
      rolePermArray.push(CreateReportPermSa)
      rolePermArray.push(EditReportPermSa)
      rolePermArray.push(DeleteReportPermSa)

      rolePermArray.push(ReadUserPermPa)
      rolePermArray.push(CreateUserPermPa)
      rolePermArray.push(EditUsersPermPa)
      rolePermArray.push(DeleteUsersPermPa)
      rolePermArray.push(ReadTenantPermPa)
      rolePermArray.push(CreateTenantPermPa)
      rolePermArray.push(EditTenantPermPa)
      rolePermArray.push(DeleteTenantPermPa)

      rolePermArray.push(ReadSitePermPa)
      rolePermArray.push(CreateSitePermPa)
      rolePermArray.push(EditSitePermPa)
      rolePermArray.push(DeleteSitePermPa)
      rolePermArray.push(ReadZonePermPa)
      rolePermArray.push(CreateZonePermPa)
      rolePermArray.push(EditZonePermPa)
      rolePermArray.push(DeleteZonePermPa)


      rolePermArray.push(ReadRolePermPa)
      rolePermArray.push(CreateRolePermPa)
      rolePermArray.push(EditRolePermPa)
      rolePermArray.push(DeleteRolePermPa)
      rolePermArray.push(ReadProcessPermPa)
      rolePermArray.push(CreateProcessPermPa)
      rolePermArray.push(EditProcessPermPa)
      rolePermArray.push(DeleteProcessPermPa)


      rolePermArray.push(ProcessAssignPermPa)
      rolePermArray.push(ProcessUnassignPermPa)
      rolePermArray.push(CreateProductPermPa)
      rolePermArray.push(EditProductPermPa)
      rolePermArray.push(ReadProductPermPa)
      rolePermArray.push(DeleteProductPermPa)
      rolePermArray.push(CreateProductMetaPermPa)


      rolePermArray.push(ReadDevicePermPa)
      rolePermArray.push(CreateDevicePermPa)
      rolePermArray.push(EditDevicePermPa)
      rolePermArray.push(DeleteDevicePermPa)
      rolePermArray.push(DeviceAssignPermPa)
      rolePermArray.push(DeviceUnassignPermPa)
      rolePermArray.push(ReadReportPermPa)
      rolePermArray.push(CreateReportPermPa)
      rolePermArray.push(EditReportPermPa)
      rolePermArray.push(DeleteReportPermPa)





      rolePermArray.push(ReadUserPermTa)
      rolePermArray.push(CreateUserPermTa)
      rolePermArray.push(EditUsersPermTa)
      rolePermArray.push(DeleteUsersPermTa)
      rolePermArray.push(ReadTenantPermTa)
      rolePermArray.push(EditTenantPermTa)
      rolePermArray.push(ReadSitePermTa)
      rolePermArray.push(CreateSitePermTa)


      rolePermArray.push(EditSitePermTa)
      rolePermArray.push(DeleteSitePermTa)
      rolePermArray.push(ReadZonePermTa)
      rolePermArray.push(CreateZonePermTa)
      rolePermArray.push(EditZonePermTa)
      rolePermArray.push(DeleteZonePermTa)
      rolePermArray.push(ReadProcessPermTa)
      rolePermArray.push(CreateProcessPermTa)
      rolePermArray.push(EditProcessPermTa)
      rolePermArray.push(DeleteProcessPermTa)

      rolePermArray.push(ProcessAssignPermTa)
      rolePermArray.push(CreateProductPermTa)
      rolePermArray.push(ProcessUnassignPermTa)
      rolePermArray.push(ReadProductPermTa)
      rolePermArray.push(EditProductPermTa)
      rolePermArray.push(DeleteProductPermTa)
      rolePermArray.push(CreateProductMetaPermTa)
      rolePermArray.push(ReadDevicePermTa)
      rolePermArray.push(CreateDevicePermTa)
      rolePermArray.push(EditDevicePermTa)
      rolePermArray.push(DeleteDevicePermTa)
      rolePermArray.push(DeviceAssignPermTa)
      rolePermArray.push(DeviceUnassignPermTa)
      rolePermArray.push(ReadReportPermTa)




      rolePermArray.push(ReadUserPermPM)
      rolePermArray.push(CreateUserPermPM)
      rolePermArray.push(EditUsersPermPM)
      rolePermArray.push(DeleteUsersPermPM)
      rolePermArray.push(ReadTenantPermPM)
      rolePermArray.push(ReadSitePermPM)
      rolePermArray.push(EditSitePermPM)
      rolePermArray.push(DeleteSitePermPM)
      rolePermArray.push(ReadZonePermPM)
      rolePermArray.push(CreateZonePermPM)
      rolePermArray.push(EditZonePermPM)
      rolePermArray.push(DeleteZonePermPM)
      rolePermArray.push(ReadProcessPermPM)
      rolePermArray.push(CreateProcessPermPM)
      rolePermArray.push(EditProcessPermPM)


      rolePermArray.push(DeleteProcessPermPM)
      rolePermArray.push(ProcessAssignPermPM)
      rolePermArray.push(ProcessUnassignPermPM)

      rolePermArray.push(EditProductPermPM)
      rolePermArray.push(DeleteProductPermPM)
      rolePermArray.push(CreateProductMetaPermPM)
      rolePermArray.push(CreateDevicePermPM)
      rolePermArray.push(EditDevicePermPM)
      rolePermArray.push(DeleteDevicePermPM)
      rolePermArray.push(ReadDevicePermPM)
      rolePermArray.push(ReadProductPermPM)
      rolePermArray.push(CreateProductPermPM)
      rolePermArray.push(DeviceAssignPermPM)
      rolePermArray.push(DeviceUnassignPermPM)
      rolePermArray.push(ReadReportPermPM)
      rolePermArray.push(ReadTenantPermS)
      rolePermArray.push(ReadSitePermS)
      rolePermArray.push(ReadZonePermS)
      rolePermArray.push(ReadProcessPermS)
      rolePermArray.push(ProcessAssignPermS)
      rolePermArray.push(ProcessUnassignPermS)
      rolePermArray.push(ReadProductPermS)
      rolePermArray.push(ReadDevicePermS)
      rolePermArray.push(DeviceAssignPermS)
      rolePermArray.push(DeviceUnassignPermS)
      rolePermArray.push(ReadReportPermS)



      await query.bulkInsert('rolePermissions',
      rolePermArray)
    } catch (err) {
      logger.error(error)
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
