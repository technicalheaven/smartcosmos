'use strict';

const { v4: uuidv4 } = require("uuid");
const { Permission } = require('../config/db');
const { Role } = require('../config/db')
import { logger } from '../libs/logger'





module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            await queryInterface.bulkInsert("permissions", [
                {
                    id: uuidv4(),
                    name: "User",
                    description:
                        "This Permission allows a user to Create  Users",
                    method: "get",
                    action: "read",
                    route: "/api/v1/users",
                    isCustom: false,
                    createdAt: new Date(),
                },

                {
                    id: uuidv4(),
                    name: "Tenants",
                    description:
                        "This Permissions allows Information about the Tenant to be Viewed or Edited.",
                    method: "get",
                    action: "read",
                    route: "/api/v1/tenants",
                    isCustom: false,
                    createdAt: new Date(),
                },


                {
                    id: uuidv4(),
                    name: "Sites",
                    description:
                        "This Permissions allows Information about the Tenant Site to be Viewed or Edited.",
                    method: "get",
                    action: "read",
                    route: "/api/v1/sites",
                    isCustom: false,
                    createdAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: "RolesList",
                    description:
                        "This Permission allows a user to View or Edit Users, assign a users a Role",
                    method: "get",
                    action: "read",
                    route: "/api/v1/roleslist",
                    isCustom: false,
                    createdAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: "RolesDetails",
                    description:
                        "This Permission allows a user to View or Edit Users, assign a users a Role",
                    method: "get",
                    action: "read",
                    route: "/api/v1/rolesdetails",
                    isCustom: false,
                    createdAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: "Role",
                    description:
                      "This Permission allows Viewing of Roles in Smartcosmos and Edit Custom Roles. ",
                    method: "get",
                    route: "/api/v1/roles",
                    action: "read",
                    isCustom: false,
                    createdAt: new Date(),
                  },
                {
                    id: uuidv4(),
                    name: "Products",
                    description:
                        "This Permission allows Viewing of Product and Edit Product. ",
                    method: "get",
                    route: "/api/v1/products",
                    action: "read",
                    isCustom: false,
                    createdAt: new Date(),
                },

                {
                    id: uuidv4(),
                    name: "Devices",
                    description:
                        "This Permission allows Viewing of Device and Edit Device ",
                    method: "get",
                    route: "/api/v1/devices",
                    action: "read",
                    isCustom: false,
                    createdAt: new Date(),
                },

                {
                    id: uuidv4(),
                    name: "SelfInformationUpdate",
                    description:
                        "This Permission allows to change password and user details",
                    method: "post",
                    route: "/api/v1/changepassword",
                    action: "create",
                    isCustom: false,
                    createdAt: new Date(),
                },
                {
                    id: uuidv4(),
                    name: "ResendInvite",
                    description:
                        "This Permission allows to change password and user details",
                    method: "post",
                    route: "/api/v1/resendinvite",
                    action: "create",
                    isCustom: false,
                    createdAt: new Date(),
                },



            ])

            let permissionData = await Permission.findAll();
            var permIdName = {}
            for (let permission of permissionData) {
                if (permission.name == 'User' || permission.name == 'Tenants' || permission.name == 'ResendInvite' || permission.name == 'SelfInformationUpdate' || permission.name == 'Devices' || permission.name == 'RolesDetails' || permission.name == 'Products' || permission.name == 'RolesList' || permission.name == 'Sites' || permission.name == 'Role') {
                    let key = permission?.name + permission?.action
                    if(permission.name == 'User') permission.name = 'Users'
                    if(permission.name == 'Tenants') permission.name = 'Tenant'
                    if(permission.name == 'Devices') permission.name = 'Device'
                    if(permission.name == 'Products') permission.name = 'Product'
                    if(permission.name == 'Sites') permission.name = 'Site'
                    if(permission.name == 'Role') permission.name = 'Roles'
                    permIdName[key] = {
                        id: permission?.id,
                        action: permission?.action,
                        description: permission?.description,
                        name: permission?.name
                    }

                }
            }

            var rolePermArray = []
            let roleData = await Role.findAll()
            for (let role of roleData) {
                if (role.name == "Platform Super Admin") {
                    var ReadDevicesPermSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Devicesread.id,
                        name: permIdName?.Devicesread.name,
                        description: permIdName?.Devicesread.description,
                        action: permIdName?.Devicesread.action,
                        createdAt: new Date()

                    }
                    var ResendInvitePermSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ResendInvitecreate.id,
                        name: permIdName?.ResendInvitecreate.name,
                        description: permIdName?.ResendInvitecreate.description,
                        action: permIdName?.ResendInvitecreate.action,
                        createdAt: new Date()

                    }
                    var ReadRolePermSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Roleread.id,
                        name: permIdName?.Roleread.name,
                        description: permIdName?.Roleread.description,
                        action: permIdName?.Roleread.action,
                        createdAt: new Date()
                    }
                    var UserPermSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Userread.id,
                        name: permIdName?.Userread.name,
                        description: permIdName?.Userread.description,
                        action: permIdName?.Userread.action,
                        createdAt: new Date()
                    }
                    var TenantsPermSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Tenantsread.id,
                        name: permIdName?.Tenantsread.name,
                        description: permIdName?.Tenantsread.description,
                        action: permIdName?.Tenantsread.action,
                        createdAt: new Date()
                    }
                    var SitesPermSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Sitesread.id,
                        name: permIdName?.Sitesread.name,
                        description: permIdName?.Sitesread.description,
                        action: permIdName?.Sitesread.action,
                        createdAt: new Date()
                    }
                    var RolesListPermSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.RolesListread.id,
                        name: permIdName?.RolesListread.name,
                        description: permIdName?.RolesListread.description,
                        action: permIdName?.RolesListread.action,
                        createdAt: new Date()
                    }
                    var RolesDetailsPermSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.RolesDetailsread.id,
                        name: permIdName?.RolesDetailsread.name,
                        description: permIdName?.RolesDetailsread.description,
                        action: permIdName?.RolesDetailsread.action,
                        createdAt: new Date()
                    }
                    var ProductsPermSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Productsread.id,
                        name: permIdName?.Productsread.name,
                        description: permIdName?.Productsread.description,
                        action: permIdName?.Productsread.action,
                        createdAt: new Date()
                    }
                    var SelfInformationUpdatePermSa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.SelfInformationUpdatecreate.id,
                        name: permIdName?.SelfInformationUpdatecreate.name,
                        description: permIdName?.SelfInformationUpdatecreate.description,
                        action: permIdName?.SelfInformationUpdatecreate.action,
                        createdAt: new Date()
                    }
                    //   var SelfInformationUpdatesPermSa = {
                    //     id: uuidv4(),
                    //     roleId: role.id,
                    //     permissionId: permIdName.SelfInformationUpdatescreate.id,
                    //     name: permIdName?.SelfInformationUpdatescreate.name,
                    //     description: permIdName?.SelfInformationUpdatescreate.description,
                    //     action: permIdName?.SelfInformationUpdatescreate.action,
                    //     createdAt: new Date()
                    //   }

                }

                if (role.name == "Platform Admin") {
                    var ReadDevicesPermPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Devicesread.id,
                        name: permIdName?.Devicesread.name,
                        description: permIdName?.Devicesread.description,
                        action: permIdName?.Devicesread.action,
                        createdAt: new Date()

                    }
                    var ResendInvitePermPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ResendInvitecreate.id,
                        name: permIdName?.ResendInvitecreate.name,
                        description: permIdName?.ResendInvitecreate.description,
                        action: permIdName?.ResendInvitecreate.action,
                        createdAt: new Date()

                    }
                    var ReadRolePermPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Roleread.id,
                        name: permIdName?.Roleread.name,
                        description: permIdName?.Roleread.description,
                        action: permIdName?.Roleread.action,
                        createdAt: new Date()
                    }
                    var UserPermPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Userread.id,
                        name: permIdName?.Userread.name,
                        description: permIdName?.Userread.description,
                        action: permIdName?.Userread.action,
                        createdAt: new Date()
                    }
                    var TenantsPermPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Tenantsread.id,
                        name: permIdName?.Tenantsread.name,
                        description: permIdName?.Tenantsread.description,
                        action: permIdName?.Tenantsread.action,
                        createdAt: new Date()
                    }
                    var SitesPermPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Sitesread.id,
                        name: permIdName?.Sitesread.name,
                        description: permIdName?.Sitesread.description,
                        action: permIdName?.Sitesread.action,
                        createdAt: new Date()
                    }
                    var RolesListPermPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.RolesListread.id,
                        name: permIdName?.RolesListread.name,
                        description: permIdName?.RolesListread.description,
                        action: permIdName?.RolesListread.action,
                        createdAt: new Date()
                    }
                    var RolesDetailsPermPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.RolesDetailsread.id,
                        name: permIdName?.RolesDetailsread.name,
                        description: permIdName?.RolesDetailsread.description,
                        action: permIdName?.RolesDetailsread.action,
                        createdAt: new Date()
                    }
                    var ProductsPermPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Productsread.id,
                        name: permIdName?.Productsread.name,
                        description: permIdName?.Productsread.description,
                        action: permIdName?.Productsread.action,
                        createdAt: new Date()
                    }
                    var SelfInformationUpdatePermPa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.SelfInformationUpdatecreate.id,
                        name: permIdName?.SelfInformationUpdatecreate.name,
                        description: permIdName?.SelfInformationUpdatecreate.description,
                        action: permIdName?.SelfInformationUpdatecreate.action,
                        createdAt: new Date()
                    }
                    //   var SelfInformationUpdatesPermPa = {
                    //     id: uuidv4(),
                    //     roleId: role.id,
                    //     permissionId: permIdName.SelfInformationUpdatescreate.id,
                    //     name: permIdName?.SelfInformationUpdatescreate.name,
                    //     description: permIdName?.SelfInformationUpdatescreate.description,
                    //     action: permIdName?.SelfInformationUpdatescreate.action,
                    //     createdAt: new Date()
                    //   }

                }

                if (role.name == "Tenant Admin") {
                    var ReadDevicesPermTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Devicesread.id,
                        name: permIdName?.Devicesread.name,
                        description: permIdName?.Devicesread.description,
                        action: permIdName?.Devicesread.action,
                        createdAt: new Date()

                    }
                    var ResendInvitePermTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.ResendInvitecreate.id,
                        name: permIdName?.ResendInvitecreate.name,
                        description: permIdName?.ResendInvitecreate.description,
                        action: permIdName?.ResendInvitecreate.action,
                        createdAt: new Date()

                    }
                    var UserPermTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Userread.id,
                        name: permIdName?.Userread.name,
                        description: permIdName?.Userread.description,
                        action: permIdName?.Userread.action,
                        createdAt: new Date()
                    }
                    var TenantsPermTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Tenantsread.id,
                        name: permIdName?.Tenantsread.name,
                        description: permIdName?.Tenantsread.description,
                        action: permIdName?.Tenantsread.action,
                        createdAt: new Date()
                    }
                    var SitesPermTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Sitesread.id,
                        name: permIdName?.Sitesread.name,
                        description: permIdName?.Sitesread.description,
                        action: permIdName?.Sitesread.action,
                        createdAt: new Date()
                    }
                    var RolesListPermTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.RolesListread.id,
                        name: permIdName?.RolesListread.name,
                        description: permIdName?.RolesListread.description,
                        action: permIdName?.RolesListread.action,
                        createdAt: new Date()
                    }
                    var RolesDetailsPermTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.RolesDetailsread.id,
                        name: permIdName?.RolesDetailsread.name,
                        description: permIdName?.RolesDetailsread.description,
                        action: permIdName?.RolesDetailsread.action,
                        createdAt: new Date()
                    }
                    var ProductsPermTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Productsread.id,
                        name: permIdName?.Productsread.name,
                        description: permIdName?.Productsread.description,
                        action: permIdName?.Productsread.action,
                        createdAt: new Date()
                    }
                    var SelfInformationUpdatePermTa = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.SelfInformationUpdatecreate.id,
                        name: permIdName?.SelfInformationUpdatecreate.name,
                        description: permIdName?.SelfInformationUpdatecreate.description,
                        action: permIdName?.SelfInformationUpdatecreate.action,
                        createdAt: new Date()
                    }
                    //   var SelfInformationUpdatesPermTa = {
                    //     id: uuidv4(),
                    //     roleId: role.id,
                    //     permissionId: permIdName.SelfInformationUpdatescreate.id,
                    //     name: permIdName?.SelfInformationUpdatescreate.name,
                    //     description: permIdName?.SelfInformationUpdatescreate.description,
                    //     action: permIdName?.SelfInformationUpdatescreate.action,
                    //     createdAt: new Date()
                    //   }

                }


                if (role.name == "Project Manager") {
                    var ReadDevicesPermPm = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Devicesread.id,
                        name: permIdName?.Devicesread.name,
                        description: permIdName?.Devicesread.description,
                        action: permIdName?.Devicesread.action,
                        createdAt: new Date()

                    }
                    var UserPermPm = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Userread.id,
                        name: permIdName?.Userread.name,
                        description: permIdName?.Userread.description,
                        action: permIdName?.Userread.action,
                        createdAt: new Date()
                    }
                    var TenantsPermPm = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Tenantsread.id,
                        name: permIdName?.Tenantsread.name,
                        description: permIdName?.Tenantsread.description,
                        action: permIdName?.Tenantsread.action,
                        createdAt: new Date()
                    }
                    var SitesPermPm = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Sitesread.id,
                        name: permIdName?.Sitesread.name,
                        description: permIdName?.Sitesread.description,
                        action: permIdName?.Sitesread.action,
                        createdAt: new Date()
                    }

                    var ProductsPermPm = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Productsread.id,
                        name: permIdName?.Productsread.name,
                        description: permIdName?.Productsread.description,
                        action: permIdName?.Productsread.action,
                        createdAt: new Date()
                    }
                    var SelfInformationUpdatePermPm = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.SelfInformationUpdatecreate.id,
                        name: permIdName?.SelfInformationUpdatecreate.name,
                        description: permIdName?.SelfInformationUpdatecreate.description,
                        action: permIdName?.SelfInformationUpdatecreate.action,
                        createdAt: new Date()
                    }
                    //   var SelfInformationUpdatesPermPm = {
                    //     id: uuidv4(),
                    //     roleId: role.id,
                    //     permissionId: permIdName.SelfInformationUpdatescreate.id,
                    //     name: permIdName?.SelfInformationUpdatescreate.name,
                    //     description: permIdName?.SelfInformationUpdatescreate.description,
                    //     action: permIdName?.SelfInformationUpdatescreate.action,
                    //     createdAt: new Date()
                    //   }

                }

                if (role.name == "Supervisor") {
                    var ReadDevicesPermSm = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Devicesread.id,
                        name: permIdName?.Devicesread.name,
                        description: permIdName?.Devicesread.description,
                        action: permIdName?.Devicesread.action,
                        createdAt: new Date()

                    }

                    var TenantsPermSm = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Tenantsread.id,
                        name: permIdName?.Tenantsread.name,
                        description: permIdName?.Tenantsread.description,
                        action: permIdName?.Tenantsread.action,
                        createdAt: new Date()
                    }
                    var SitesPermSm = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Sitesread.id,
                        name: permIdName?.Sitesread.name,
                        description: permIdName?.Sitesread.description,
                        action: permIdName?.Sitesread.action,
                        createdAt: new Date()
                    }

                    var ProductsPermSm = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.Productsread.id,
                        name: permIdName?.Productsread.name,
                        description: permIdName?.Productsread.description,
                        action: permIdName?.Productsread.action,
                        createdAt: new Date()
                    }
                    var SelfInformationUpdatePermSm = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.SelfInformationUpdatecreate.id,
                        name: permIdName?.SelfInformationUpdatecreate.name,
                        description: permIdName?.SelfInformationUpdatecreate.description,
                        action: permIdName?.SelfInformationUpdatecreate.action,
                        createdAt: new Date()
                    }
                    //   var SelfInformationUpdatesPermSm = {
                    //     id: uuidv4(),
                    //     roleId: role.id,
                    //     permissionId: permIdName.SelfInformationUpdatescreate.id,
                    //     name: permIdName?.SelfInformationUpdatescreate.name,
                    //     description: permIdName?.SelfInformationUpdatescreate.description,
                    //     action: permIdName?.SelfInformationUpdatescreate.action,
                    //     createdAt: new Date()
                    //   }

                }





            }


                rolePermArray.push(SelfInformationUpdatePermSm)
                //   rolePermArray.push(SelfInformationUpdatesPermSm)
                rolePermArray.push(ProductsPermSm)
                rolePermArray.push(SitesPermSm)
                rolePermArray.push(TenantsPermSm)
                rolePermArray.push(ReadDevicesPermSm)


                rolePermArray.push(SelfInformationUpdatePermPm)
                //   rolePermArray.push(SelfInformationUpdatesPermPm)
                rolePermArray.push(ProductsPermPm)
                rolePermArray.push(SitesPermPm)
                rolePermArray.push(TenantsPermPm)
                rolePermArray.push(ReadDevicesPermPm)
                rolePermArray.push(UserPermPm)

                rolePermArray.push(SelfInformationUpdatePermTa)
                //   rolePermArray.push(SelfInformationUpdatesPermTa)
                rolePermArray.push(ProductsPermTa)
                rolePermArray.push(SitesPermTa)
                rolePermArray.push(TenantsPermTa)
                rolePermArray.push(ReadDevicesPermTa)
                rolePermArray.push(UserPermTa)
                rolePermArray.push(ResendInvitePermTa)
                rolePermArray.push(RolesDetailsPermTa)
                rolePermArray.push(RolesListPermTa)

                rolePermArray.push(SelfInformationUpdatePermPa)
                //   rolePermArray.push(SelfInformationUpdatesPermPa)
                rolePermArray.push(ProductsPermPa)
                rolePermArray.push(SitesPermPa)
                rolePermArray.push(ReadRolePermPa)
                rolePermArray.push(TenantsPermPa)
                rolePermArray.push(ReadDevicesPermPa)
                rolePermArray.push(UserPermPa)
                rolePermArray.push(ResendInvitePermPa)
                rolePermArray.push(RolesDetailsPermPa)
                rolePermArray.push(RolesListPermPa)


                rolePermArray.push(SelfInformationUpdatePermSa)
                //   rolePermArray.push(SelfInformationUpdatesPermSa)
                rolePermArray.push(ProductsPermSa)
                rolePermArray.push(SitesPermSa)
                rolePermArray.push(ReadRolePermSa)
                rolePermArray.push(TenantsPermSa)
                rolePermArray.push(ReadDevicesPermSa)
                rolePermArray.push(UserPermSa)
                rolePermArray.push(ResendInvitePermSa)
                rolePermArray.push(RolesDetailsPermSa)
                rolePermArray.push(RolesListPermSa)



            await queryInterface.bulkInsert('rolePermissions',
                rolePermArray)
        } catch (err) {
            logger.error("err")
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
