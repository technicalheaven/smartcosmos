'use strict';

const { v4: uuidv4 } = require("uuid");
const { Permission } = require('../config/db');
const { Role } = require('../config/db')
import { logger } from '../libs/logger'



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    try {
      await queryInterface.bulkInsert("permissions", [
          {
              id: uuidv4(),
              name: "DeviceManager",
              description:
                  "This Permission allows a tenant to get DeviceManager list",
              method: "get",
              action: "reads",
              route: "/api/v1/devicemanagers",
              isCustom: false,
              createdAt: new Date(),
          },
          {
            id: uuidv4(),
            name: "DeviceManager",
            description:
                "This Permission allows a tenant to get particular DeviceManager data",
            method: "get",
            action: "read",
            route: "/api/v1/devicemanager",
            isCustom: false,
            createdAt: new Date(),
        },
          {
            id: uuidv4(),
            name: "DeviceManager",
            description:
                "This Permission allows a tenant to Create DeviceManager",
            method: "post",
            action: "create",
            route: "/api/v1/devicemanager",
            isCustom: false,
            createdAt: new Date(),
        },
        {
              id: uuidv4(),
              name: "DeviceManager",
              description:
                  "This Permission allows a tenant to update DeviceManager",
              method: "patch",
              action: "edit",
              route: "/api/v1/devicemanager",
              isCustom: false,
              createdAt: new Date(),
          },
          {
            id: uuidv4(),
            name: "DeviceManager",
            description:
                "This Permission allows a tenant to delete DeviceManager",
            method: "delete",
            action: "delete",
            route: "/api/v1/devicemanager",
            isCustom: false,
            createdAt: new Date(),
        },
        
              {
                id: uuidv4(),
                name: "DeviceType",
                description:
                    "This Permission allows a tenant to get all Device Type",
                method: "get",
                action: "read",
                route: "/api/v1/device-type",
                isCustom: false,
                createdAt: new Date(),
            },
            {
              id: uuidv4(),
              name: "DeviceModel",
              description:
                  "This Permission allows a tenant to get all Device Model",
              method: "get",
              action: "reads",
              route: "/api/v1/device-models",
              isCustom: false,
              createdAt: new Date(),
            },
            {
              id: uuidv4(),
              name: "DeviceModel",
              description:
                  "This Permission allows a tenant to get all Device Model",
              method: "get",
              action: "read",
              route: "/api/v1/device-model",
              isCustom: false,
              createdAt: new Date(),
            },
            {
              id: uuidv4(),
              name: "DeviceModel",
              description:
                  "This Permission allows a tenant to create Device Model",
              method: "post",
              action: "create",
              route: "/api/v1/device-model",
              isCustom: false,
              createdAt: new Date(),
            },
            {
              id: uuidv4(),
              name: "DeviceModel",
              description:
                  "This Permission allows a tenant to update Device Model",
              method: "patch",
              action: "update",
              route: "/api/v1/device-model",
              isCustom: false,
              createdAt: new Date(),
            },
            {
              id: uuidv4(),
              name: "DeviceModel",
              description:
                  "This Permission allows a tenant to delete  Device Model",
              method: "delete",
              action: "delete",
              route: "/api/v1/device-model",
              isCustom: false,
              createdAt: new Date(),
            },
      

        ])

        let permissionData = await Permission.findAll();
            var permIdName = {}
            for (let permission of permissionData) {
                if (permission.name == 'DeviceManager' || permission.name == 'DeviceType' || permission.name == 'DeviceModel') {
                    let key = permission?.name + permission?.action
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
                    var ReadDevceiManagerreadPermPSA = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceManagerread.id,
                        name: permIdName?.DeviceManagerread.name,
                        description: permIdName?.DeviceManagerread.description,
                        action: permIdName?.DeviceManagerread.action,
                        createdAt: new Date()

                    }
                    var ReadDevceiManagerreadsPermPSA = {
                      id: uuidv4(),
                      roleId: role.id,
                      permissionId: permIdName.DeviceManagerreads.id,
                      name: permIdName?.DeviceManagerreads.name,
                      description: permIdName?.DeviceManagerreads.description,
                      action: permIdName?.DeviceManagerreads.action,
                      createdAt: new Date()

                  }
                  var ReadDevceiManagercreatePermPSA = {
                    id: uuidv4(),
                    roleId: role.id,
                    permissionId: permIdName.DeviceManagercreate.id,
                    name: permIdName?.DeviceManagercreate.name,
                    description: permIdName?.DeviceManagercreate.description,
                    action: permIdName?.DeviceManagercreate.action,
                    createdAt: new Date()

                  }
                  var ReadDevceiManagerpatchPermPSA = {
                    id: uuidv4(),
                    roleId: role.id,
                    permissionId: permIdName.DeviceManageredit.id,
                    name: permIdName?.DeviceManageredit.name,
                    description: permIdName?.DeviceManageredit.description,
                    action: permIdName?.DeviceManageredit.action,
                    createdAt: new Date()

                  }
                  var ReadDevceiManagerdeletePermPSA = {
                    id: uuidv4(),
                    roleId: role.id,
                    permissionId: permIdName.DeviceManagerdelete.id,
                    name: permIdName?.DeviceManagerdelete.name,
                    description: permIdName?.DeviceManagerdelete.description,
                    action: permIdName?.DeviceManagerdelete.action,
                    createdAt: new Date()

                  }

                  var ReadDevceiManagerDeviceTypereadPermPSA = {
                    id: uuidv4(),
                    roleId: role.id,
                    permissionId: permIdName.DeviceTyperead.id,
                    name: permIdName?.DeviceTyperead.name,
                    description: permIdName?.DeviceTyperead.description,
                    action: permIdName?.DeviceTyperead.action,
                    createdAt: new Date()

                  }
                  var ReadDevceiManagerDeviceModelreadPermPSA = {
                    id: uuidv4(),
                    roleId: role.id,
                    permissionId: permIdName.DeviceModelread.id,
                    name: permIdName?.DeviceModelread.name,
                    description: permIdName?.DeviceModelread.description,
                    action: permIdName?.DeviceModelread.action,
                    createdAt: new Date()
                  }
                  var ReadDevceiManagerDeviceModelreadsPermPSA = {
                    id: uuidv4(),
                    roleId: role.id,
                    permissionId: permIdName.DeviceModelreads.id,
                    name: permIdName?.DeviceModelreads.name,
                    description: permIdName?.DeviceModelreads.description,
                    action: permIdName?.DeviceModelreads.action,
                    createdAt: new Date()
                  }
                  var ReadDevceiManagerDeviceModelcreatePermPSA = {
                    id: uuidv4(),
                    roleId: role.id,
                    permissionId: permIdName.DeviceModelcreate.id,
                    name: permIdName?.DeviceModelcreate.name,
                    description: permIdName?.DeviceModelcreate.description,
                    action: permIdName?.DeviceModelcreate.action,
                    createdAt: new Date()
                  }
                  
                  var ReadDevceiManagerDeviceModelupdatePermPSA = {
                    id: uuidv4(),
                    roleId: role.id,
                    permissionId: permIdName.DeviceModelupdate.id,
                    name: permIdName?.DeviceModelupdate.name,
                    description: permIdName?.DeviceModelupdate.description,
                    action: permIdName?.DeviceModelupdate.action,
                    createdAt: new Date()
                  }
                  var ReadDevceiManagerDeviceModeldeletePermPSA = {
                    id: uuidv4(),
                    roleId: role.id,
                    permissionId: permIdName.DeviceModeldelete.id,
                    name: permIdName?.DeviceModeldelete.name,
                    description: permIdName?.DeviceModeldelete.description,
                    action: permIdName?.DeviceModeldelete.action,
                    createdAt: new Date()
                  }

                  }

                if (role.name == "Platform Admin") {
                  var ReadDevceiManagerreadPermPA = {
                    id: uuidv4(),
                    roleId: role.id,
                    permissionId: permIdName.DeviceManagerread.id,
                    name: permIdName?.DeviceManagerread.name,
                    description: permIdName?.DeviceManagerread.description,
                    action: permIdName?.DeviceManagerread.action,
                    createdAt: new Date()

                }
                var ReadDevceiManagerreadsPermPA = {
                  id: uuidv4(),
                  roleId: role.id,
                  permissionId: permIdName.DeviceManagerreads.id,
                  name: permIdName?.DeviceManagerreads.name,
                  description: permIdName?.DeviceManagerreads.description,
                  action: permIdName?.DeviceManagerreads.action,
                  createdAt: new Date()

              }
              var ReadDevceiManagercreatePermPA = {
                id: uuidv4(),
                roleId: role.id,
                permissionId: permIdName.DeviceManagercreate.id,
                name: permIdName?.DeviceManagercreate.name,
                description: permIdName?.DeviceManagercreate.description,
                action: permIdName?.DeviceManagercreate.action,
                createdAt: new Date()

              }
              var ReadDevceiManagerpatchPermPA = {
                id: uuidv4(),
                roleId: role.id,
                permissionId: permIdName.DeviceManageredit.id,
                name: permIdName?.DeviceManageredit.name,
                description: permIdName?.DeviceManageredit.description,
                action: permIdName?.DeviceManageredit.action,
                createdAt: new Date()

              }
              var ReadDevceiManagerdeletePermPA = {
                id: uuidv4(),
                roleId: role.id,
                permissionId: permIdName.DeviceManagerdelete.id,
                name: permIdName?.DeviceManagerdelete.name,
                description: permIdName?.DeviceManagerdelete.description,
                action: permIdName?.DeviceManagerdelete.action,
                createdAt: new Date()

              }
              var ReadDevceiManagerDeviceTypereadPermPA = {
                id: uuidv4(),
                roleId: role.id,
                permissionId: permIdName.DeviceTyperead.id,
                name: permIdName?.DeviceTyperead.name,
                description: permIdName?.DeviceTyperead.description,
                action: permIdName?.DeviceTyperead.action,
                createdAt: new Date()

              }
              var ReadDevceiManagerDeviceModelreadPermPA = {
                id: uuidv4(),
                roleId: role.id,
                permissionId: permIdName.DeviceModelread.id,
                name: permIdName?.DeviceModelread.name,
                description: permIdName?.DeviceModelread.description,
                action: permIdName?.DeviceModelread.action,
                createdAt: new Date()
              }
              var ReadDevceiManagerDeviceModelreadsPermPA = {
                id: uuidv4(),
                roleId: role.id,
                permissionId: permIdName.DeviceModelreads.id,
                name: permIdName?.DeviceModelreads.name,
                description: permIdName?.DeviceModelreads.description,
                action: permIdName?.DeviceModelreads.action,
                createdAt: new Date()
              }
              var ReadDevceiManagerDeviceModelcreatePermPA = {
                id: uuidv4(),
                roleId: role.id,
                permissionId: permIdName.DeviceModelcreate.id,
                name: permIdName?.DeviceModelcreate.name,
                description: permIdName?.DeviceModelcreate.description,
                action: permIdName?.DeviceModelcreate.action,
                createdAt: new Date()
              }
              
              var ReadDevceiManagerDeviceModelupdatePermPA = {
                id: uuidv4(),
                roleId: role.id,
                permissionId: permIdName.DeviceModelupdate.id,
                name: permIdName?.DeviceModelupdate.name,
                description: permIdName?.DeviceModelupdate.description,
                action: permIdName?.DeviceModelupdate.action,
                createdAt: new Date()
              }
              var ReadDevceiManagerDeviceModeldeletePermPA = {
                id: uuidv4(),
                roleId: role.id,
                permissionId: permIdName.DeviceModeldelete.id,
                name: permIdName?.DeviceModeldelete.name,
                description: permIdName?.DeviceModeldelete.description,
                action: permIdName?.DeviceModeldelete.action,
                createdAt: new Date()
              }

                }

                if (role.name == "Tenant Admin") {
                        var ReadDevceiManagerreadPermTA = {
                          id: uuidv4(),
                          roleId: role.id,
                          permissionId: permIdName.DeviceManagerread.id,
                          name: permIdName?.DeviceManagerread.name,
                          description: permIdName?.DeviceManagerread.description,
                          action: permIdName?.DeviceManagerread.action,
                          createdAt: new Date()

                      }
                      var ReadDevceiManagerreadsPermTA = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceManagerreads.id,
                        name: permIdName?.DeviceManagerreads.name,
                        description: permIdName?.DeviceManagerreads.description,
                        action: permIdName?.DeviceManagerreads.action,
                        createdAt: new Date()

                    }
                    var ReadDevceiManagercreatePermTA = {
                      id: uuidv4(),
                      roleId: role.id,
                      permissionId: permIdName.DeviceManagercreate.id,
                      name: permIdName?.DeviceManagercreate.name,
                      description: permIdName?.DeviceManagercreate.description,
                      action: permIdName?.DeviceManagercreate.action,
                      createdAt: new Date()

                    }
                    var ReadDevceiManagerpatchPermTA = {
                      id: uuidv4(),
                      roleId: role.id,
                      permissionId: permIdName.DeviceManageredit.id,
                      name: permIdName?.DeviceManageredit.name,
                      description: permIdName?.DeviceManageredit.description,
                      action: permIdName?.DeviceManageredit.action,
                      createdAt: new Date()

                    }
                    var ReadDevceiManagerdeletePermTA = {
                      id: uuidv4(),
                      roleId: role.id,
                      permissionId: permIdName.DeviceManagerdelete.id,
                      name: permIdName?.DeviceManagerdelete.name,
                      description: permIdName?.DeviceManagerdelete.description,
                      action: permIdName?.DeviceManagerdelete.action,
                      createdAt: new Date()

                    }
                    var ReadDevceiManagerDeviceTypereadPermTA = {
                      id: uuidv4(),
                      roleId: role.id,
                      permissionId: permIdName.DeviceTyperead.id,
                      name: permIdName?.DeviceTyperead.name,
                      description: permIdName?.DeviceTyperead.description,
                      action: permIdName?.DeviceTyperead.action,
                      createdAt: new Date()
      
                    }
                    var ReadDevceiManagerDeviceModelreadPermTA = {
                      id: uuidv4(),
                      roleId: role.id,
                      permissionId: permIdName.DeviceModelread.id,
                      name: permIdName?.DeviceModelread.name,
                      description: permIdName?.DeviceModelread.description,
                      action: permIdName?.DeviceModelread.action,
                      createdAt: new Date()
                    }
                    var ReadDevceiManagerDeviceModelreadsPermTA = {
                      id: uuidv4(),
                      roleId: role.id,
                      permissionId: permIdName.DeviceModelreads.id,
                      name: permIdName?.DeviceModelreads.name,
                      description: permIdName?.DeviceModelreads.description,
                      action: permIdName?.DeviceModelreads.action,
                      createdAt: new Date()
                    }
                    var ReadDevceiManagerDeviceModelcreatePermTA = {
                      id: uuidv4(),
                      roleId: role.id,
                      permissionId: permIdName.DeviceModelcreate.id,
                      name: permIdName?.DeviceModelcreate.name,
                      description: permIdName?.DeviceModelcreate.description,
                      action: permIdName?.DeviceModelcreate.action,
                      createdAt: new Date()
                    }
                    
                    var ReadDevceiManagerDeviceModelupdatePermTA = {
                      id: uuidv4(),
                      roleId: role.id,
                      permissionId: permIdName.DeviceModelupdate.id,
                      name: permIdName?.DeviceModelupdate.name,
                      description: permIdName?.DeviceModelupdate.description,
                      action: permIdName?.DeviceModelupdate.action,
                      createdAt: new Date()
                    }
                    var ReadDevceiManagerDeviceModeldeletePermTA = {
                      id: uuidv4(),
                      roleId: role.id,
                      permissionId: permIdName.DeviceModeldelete.id,
                      name: permIdName?.DeviceModeldelete.name,
                      description: permIdName?.DeviceModeldelete.description,
                      action: permIdName?.DeviceModeldelete.action,
                      createdAt: new Date()
                    }    
                }


                if (role.name == "Project Manager") {
                          var ReadDevceiManagerreadPermPM = {
                            id: uuidv4(),
                            roleId: role.id,
                            permissionId: permIdName.DeviceManagerread.id,
                            name: permIdName?.DeviceManagerread.name,
                            description: permIdName?.DeviceManagerread.description,
                            action: permIdName?.DeviceManagerread.action,
                            createdAt: new Date()

                        }
                        var ReadDevceiManagerreadsPermPM = {
                          id: uuidv4(),
                          roleId: role.id,
                          permissionId: permIdName.DeviceManagerreads.id,
                          name: permIdName?.DeviceManagerreads.name,
                          description: permIdName?.DeviceManagerreads.description,
                          action: permIdName?.DeviceManagerreads.action,
                          createdAt: new Date()

                      }
                      var ReadDevceiManagercreatePermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceManagercreate.id,
                        name: permIdName?.DeviceManagercreate.name,
                        description: permIdName?.DeviceManagercreate.description,
                        action: permIdName?.DeviceManagercreate.action,
                        createdAt: new Date()

                      }
                      var ReadDevceiManagerpatchPermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceManageredit.id,
                        name: permIdName?.DeviceManageredit.name,
                        description: permIdName?.DeviceManageredit.description,
                        action: permIdName?.DeviceManageredit.action,
                        createdAt: new Date()

                      }
                      var ReadDevceiManagerdeletePermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceManagerdelete.id,
                        name: permIdName?.DeviceManagerdelete.name,
                        description: permIdName?.DeviceManagerdelete.description,
                        action: permIdName?.DeviceManagerdelete.action,
                        createdAt: new Date()

                      }
                      var ReadDevceiManagerDeviceTypereadPermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceTyperead.id,
                        name: permIdName?.DeviceTyperead.name,
                        description: permIdName?.DeviceTyperead.description,
                        action: permIdName?.DeviceTyperead.action,
                        createdAt: new Date()
        
                      }
                      var ReadDevceiManagerDeviceModelreadPermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceModelread.id,
                        name: permIdName?.DeviceModelread.name,
                        description: permIdName?.DeviceModelread.description,
                        action: permIdName?.DeviceModelread.action,
                        createdAt: new Date()
                      }
                      var ReadDevceiManagerDeviceModelreadsPermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceModelreads.id,
                        name: permIdName?.DeviceModelreads.name,
                        description: permIdName?.DeviceModelreads.description,
                        action: permIdName?.DeviceModelreads.action,
                        createdAt: new Date()
                      }
                      var ReadDevceiManagerDeviceModelcreatePermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceModelcreate.id,
                        name: permIdName?.DeviceModelcreate.name,
                        description: permIdName?.DeviceModelcreate.description,
                        action: permIdName?.DeviceModelcreate.action,
                        createdAt: new Date()
                      }
                      
                      var ReadDevceiManagerDeviceModelupdatePermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceModelupdate.id,
                        name: permIdName?.DeviceModelupdate.name,
                        description: permIdName?.DeviceModelupdate.description,
                        action: permIdName?.DeviceModelupdate.action,
                        createdAt: new Date()
                      }
                      var ReadDevceiManagerDeviceModeldeletePermPM = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceModeldelete.id,
                        name: permIdName?.DeviceModeldelete.name,
                        description: permIdName?.DeviceModeldelete.description,
                        action: permIdName?.DeviceModeldelete.action,
                        createdAt: new Date()
                      } 

                }

                if (role.name == "Supervisor") 
                {
                          var ReadDevceiManagerreadPermSU = {
                            id: uuidv4(),
                            roleId: role.id,
                            permissionId: permIdName.DeviceManagerread.id,
                            name: permIdName?.DeviceManagerread.name,
                            description: permIdName?.DeviceManagerread.description,
                            action: permIdName?.DeviceManagerread.action,
                            createdAt: new Date()

                        }
                        var ReadDevceiManagerreadsPermSU = {
                          id: uuidv4(),
                          roleId: role.id,
                          permissionId: permIdName.DeviceManagerreads.id,
                          name: permIdName?.DeviceManagerreads.name,
                          description: permIdName?.DeviceManagerreads.description,
                          action: permIdName?.DeviceManagerreads.action,
                          createdAt: new Date()

                      }
                      var ReadDevceiManagercreatePermSU = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceManagercreate.id,
                        name: permIdName?.DeviceManagercreate.name,
                        description: permIdName?.DeviceManagercreate.description,
                        action: permIdName?.DeviceManagercreate.action,
                        createdAt: new Date()

                      }
                      var ReadDevceiManagerpatchPermSU = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceManageredit.id,
                        name: permIdName?.DeviceManageredit.name,
                        description: permIdName?.DeviceManageredit.description,
                        action: permIdName?.DeviceManageredit.action,
                        createdAt: new Date()

                      }
                      var ReadDevceiManagerdeletePermSU = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceManagerdelete.id,
                        name: permIdName?.DeviceManagerdelete.name,
                        description: permIdName?.DeviceManagerdelete.description,
                        action: permIdName?.DeviceManagerdelete.action,
                        createdAt: new Date()

                      }
                      var ReadDevceiManagerDeviceTypereadPermSU = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceTyperead.id,
                        name: permIdName?.DeviceTyperead.name,
                        description: permIdName?.DeviceTyperead.description,
                        action: permIdName?.DeviceTyperead.action,
                        createdAt: new Date()
        
                      }
                      var ReadDevceiManagerDeviceModelreadPermSU = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceModelread.id,
                        name: permIdName?.DeviceModelread.name,
                        description: permIdName?.DeviceModelread.description,
                        action: permIdName?.DeviceModelread.action,
                        createdAt: new Date()
                      }
                      var ReadDevceiManagerDeviceModelreadsPermSU = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceModelreads.id,
                        name: permIdName?.DeviceModelreads.name,
                        description: permIdName?.DeviceModelreads.description,
                        action: permIdName?.DeviceModelreads.action,
                        createdAt: new Date()
                      }
                      var ReadDevceiManagerDeviceModelcreatePermSU = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceModelcreate.id,
                        name: permIdName?.DeviceModelcreate.name,
                        description: permIdName?.DeviceModelcreate.description,
                        action: permIdName?.DeviceModelcreate.action,
                        createdAt: new Date()
                      }
                      
                      var ReadDevceiManagerDeviceModelupdatePermSU = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceModelupdate.id,
                        name: permIdName?.DeviceModelupdate.name,
                        description: permIdName?.DeviceModelupdate.description,
                        action: permIdName?.DeviceModelupdate.action,
                        createdAt: new Date()
                      }
                      var ReadDevceiManagerDeviceModeldeletePermSU = {
                        id: uuidv4(),
                        roleId: role.id,
                        permissionId: permIdName.DeviceModeldelete.id,
                        name: permIdName?.DeviceModeldelete.name,
                        description: permIdName?.DeviceModeldelete.description,
                        action: permIdName?.DeviceModeldelete.action,
                        createdAt: new Date()
                      } 
                  }
                    
                } 
                    rolePermArray.push(ReadDevceiManagerreadPermPSA)
                    rolePermArray.push(ReadDevceiManagerreadsPermPSA)
                    rolePermArray.push(ReadDevceiManagercreatePermPSA)
                    rolePermArray.push(ReadDevceiManagerpatchPermPSA)
                    rolePermArray.push(ReadDevceiManagerdeletePermPSA)

                    rolePermArray.push(ReadDevceiManagerDeviceTypereadPermPSA)
                    rolePermArray.push(ReadDevceiManagerDeviceModelreadPermPSA)
                    rolePermArray.push(ReadDevceiManagerDeviceModelreadsPermPSA)
                    rolePermArray.push(ReadDevceiManagerDeviceModelcreatePermPSA)
                    rolePermArray.push(ReadDevceiManagerDeviceModelupdatePermPSA)
                    rolePermArray.push(ReadDevceiManagerDeviceModeldeletePermPSA)

                    
                    rolePermArray.push(ReadDevceiManagerreadsPermPA)
                    rolePermArray.push(ReadDevceiManagerreadPermPA)
                    rolePermArray.push(ReadDevceiManagercreatePermPA)
                    rolePermArray.push(ReadDevceiManagerpatchPermPA)
                    rolePermArray.push(ReadDevceiManagerdeletePermPA)
                    
                    rolePermArray.push(ReadDevceiManagerDeviceTypereadPermPA)
                    rolePermArray.push(ReadDevceiManagerDeviceModelreadPermPA)
                    rolePermArray.push( ReadDevceiManagerDeviceModelreadsPermPA)
                    rolePermArray.push(ReadDevceiManagerDeviceModelcreatePermPA)
                    rolePermArray.push(ReadDevceiManagerDeviceModelupdatePermPA)
                    rolePermArray.push(ReadDevceiManagerDeviceModeldeletePermPA)

                    
                    rolePermArray.push(ReadDevceiManagerreadsPermTA)
                    rolePermArray.push(ReadDevceiManagerreadPermTA)
                    rolePermArray.push(ReadDevceiManagercreatePermTA)
                    rolePermArray.push(ReadDevceiManagerpatchPermTA)
                    rolePermArray.push(ReadDevceiManagerdeletePermTA)

                    rolePermArray.push(ReadDevceiManagerDeviceTypereadPermTA)
                    rolePermArray.push(ReadDevceiManagerDeviceModelreadPermTA)
                    rolePermArray.push(ReadDevceiManagerDeviceModelreadsPermTA)
                    rolePermArray.push(ReadDevceiManagerDeviceModelcreatePermTA)
                    rolePermArray.push(ReadDevceiManagerDeviceModelupdatePermTA)
                    rolePermArray.push(ReadDevceiManagerDeviceModeldeletePermTA)


                    rolePermArray.push(ReadDevceiManagerreadsPermPM)
                    rolePermArray.push(ReadDevceiManagerreadPermPM)
                    rolePermArray.push(ReadDevceiManagercreatePermPM)
                    rolePermArray.push(ReadDevceiManagerpatchPermPM)
                    rolePermArray.push(ReadDevceiManagerdeletePermPM)

                    rolePermArray.push(ReadDevceiManagerDeviceTypereadPermPM)
                    rolePermArray.push(ReadDevceiManagerDeviceModelreadPermPM)
                    rolePermArray.push(ReadDevceiManagerDeviceModelreadsPermPM)
                    rolePermArray.push(ReadDevceiManagerDeviceModelcreatePermPM)
                    rolePermArray.push(ReadDevceiManagerDeviceModelupdatePermPM)
                    rolePermArray.push(ReadDevceiManagerDeviceModeldeletePermPM)

                    rolePermArray.push(ReadDevceiManagerreadsPermSU)
                    rolePermArray.push(ReadDevceiManagerreadPermSU)
                    rolePermArray.push(ReadDevceiManagercreatePermSU)
                    rolePermArray.push(ReadDevceiManagerpatchPermSU)
                    rolePermArray.push(ReadDevceiManagerdeletePermSU)

                    rolePermArray.push(ReadDevceiManagerDeviceTypereadPermSU)
                    rolePermArray.push(ReadDevceiManagerDeviceModelreadPermSU)
                    rolePermArray.push(ReadDevceiManagerDeviceModelreadsPermSU)
                    rolePermArray.push(ReadDevceiManagerDeviceModelcreatePermSU)
                    rolePermArray.push(ReadDevceiManagerDeviceModelupdatePermSU)
                    rolePermArray.push(ReadDevceiManagerDeviceModeldeletePermSU)

                    await queryInterface.bulkInsert('rolePermissions',
                    rolePermArray)

        }
        catch (err) {
          logger.error("err")
      }

  },

  async down (queryInterface, Sequelize) 
  {

  }
};
