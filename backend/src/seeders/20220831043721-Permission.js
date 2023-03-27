"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(query, sequelize) {
    return query.bulkInsert("permissions", [
      //User Permission
      {
        id: uuidv4(),
        name: "Users",
        description:
          "This Permission allows a user to Create  Users",
        method: "post",
        action: "create",
        route: "/api/v1/user",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Users",
        description:
          "This Permission allows a user to View or Edit Users",
        method: "get",
        action: "read",
        route: "/api/v1/user",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Users",
        description:
          "This Permission allows a user to View or Edit Users,",
        method: "patch",
        action: "edit",
        route: "/api/v1/user",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Users",
        description:
          "This Permission allows a user to View or Edit Users",
        method: "delete",
        action: "delete",
        route: "/api/v1/user",
        isCustom: false,
        createdAt: new Date(),
      },
      // Tenant Permission
      {
        id: uuidv4(),
        name: "Tenant",
        description:
          "This Permissions allows Information about the Tenant to be Viewed or Edited.",
        method: "post",
        action: "create",
        route: "/api/v1/tenant",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Tenant",
        description:
          "This Permissions allows Information about the Tenant to be Viewed or Edited.",
        method: "get",
        action: "read",
        route: "/api/v1/tenant",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Tenant",
        description:
          "This Permissions allows Information about the Tenant to be Viewed or Edited.",
        method: "patch",
        action: "edit",
        route: "/api/v1/tenant",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Tenant",
        description:
          "This Permissions allows Information about the Tenant to be Viewed or Edited.",
        method: "delete",
        action: "delete",
        route: "/api/v1/tenant",
        isCustom: false,
        createdAt: new Date(),
      },


      // Site Permissions
      {
        id: uuidv4(),
        name: "Site",
        description:
          "This Permissions allows Information about the Tenant Site to be Viewed or Edited.",
        method: "post",
        action: "create",
        route: "/api/v1/site",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Site",
        description:
          "This Permissions allows Information about the Tenant Site to be Viewed or Edited.",
        method: "get",
        action: "read",
        route: "/api/v1/site",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Site",
        description:
          "This Permissions allows Information about the Tenant Site  to be Viewed or Edited.",
        method: "patch",
        action: "edit",
        route: "/api/v1/site",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Site",
        description:
          "This Permissions allows Information about the Tenant Site  to be Viewed or Edited.",
        method: "delete",
        action: "delete",
        route: "/api/v1/site",
        isCustom: false,
        createdAt: new Date(),
      },

      // Zone Permissions
      {
        id: uuidv4(),
        name: "Zone",
        description:
          "This Permissions allows Information about the Tenant Zone to be Viewed or Edited.",
        method: "post",
        action: "create",
        route: "/api/v1/zone",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Zone",
        description:
          "This Permissions allows Information about the Tenant Zone to be Viewed or Edited.",
        method: "get",
        action: "read",
        route: "/api/v1/zone",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Zone",
        description:
          "This Permissions allows Information about the Tenant Zone to be Viewed or Edited.",
        method: "patch",
        action: "edit",
        route: "/api/v1/zone",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Zone",
        description:
          "This Permissions allows Information about the Tenant Zone to be Viewed or Edited.",
        method: "delete",
        action: "delete",
        route: "/api/v1/zone",
        isCustom: false,
        createdAt: new Date(),
      },
      // Roles
      {
        id: uuidv4(),
        name: "Roles",
        description:
          "This Permission allows Viewing of Roles in Smartcosmos and Edit Custom Roles. ",
        method: "post",
        route: "/api/v1/role",
        action: "create",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Roles",
        description:
          "This Permission allows Viewing of Roles in Smartcosmos and Edit Custom Roles. ",
        method: "get",
        route: "/api/v1/role",
        action: "read",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Roles",
        description:
          "This Permission allows Viewing of Roles in Smartcosmos and Edit Custom Roles. ",
        method: "patch",
        route: "/api/v1/role",
        action: "edit",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Roles",
        description:
          "This Permission allows Viewing of Roles in Smartcosmos and Edit Custom Roles. ",
        method: "delete",
        route: "/api/v1/role",
        action: "delete",
        isCustom: false,
        createdAt: new Date(),
      },
      // Product
      {
        id: uuidv4(),
        name: "Product",
        description:
          "This Permission allows Viewing of Product and Edit Product. ",
        method: "post",
        route: "/api/v1/product",
        action: "create",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Product",
        description:
          "This Permission allows Viewing of Product and Edit Product. ",
        method: "get",
        route: "/api/v1/product",
        action: "read",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Product",
        description:
          "This Permission allows Viewing of Product and Edit Product. ",
        method: "patch",
        route: "/api/v1/product",
        action: "edit",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Product",
        description:
          "This Permission allows Viewing of Product and Edit Product. ",
        method: "delete",
        route: "/api/v1/product",
        action: "delete",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "ProductMeta",
        description:
          "This Permission allows to upload the Metadata File",
        method: "post",
        route: "/api/v1/product",
        action: "create",
        isCustom: false,
        createdAt: new Date(),
      },

      // Process
      {
        id: uuidv4(),
        name: "Process",
        description: "This Permission allows Viewing of Process and Edit Process. ",
        method: "post",
        route: "/api/v1/process",
        action: "create",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Process",
        description: "This Permission allows Viewing of Process and Edit Process. ",
        method: "get",
        route: "/api/v1/process",
        action: "read",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Process",
        description: "This Permission allows Viewing of Process and Edit Process. ",
        method: "patch",
        route: "/api/v1/process",
        action: "edit",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Process",
        description: "This Permission allows Viewing of Process and Edit Process. ",
        method: "delete",
        route: "/api/v1/process",
        action: "delete",
        isCustom: false,
        createdAt: new Date(),
      },


      // Assign / Unassign Process
      {
        id: uuidv4(),
        name: "ProcessAssign",
        description: "This Permission allows to Assgin the Process. ",
        method: "patch",
        route: "/api/v1/process/assign",
        action: "edit",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "ProcessUnassign",
        description: "This Permission allows to Unassgin the Process. ",
        method: "patch",
        route: "/api/v1/process/unassign",
        action: "edit",
        isCustom: false,
        createdAt: new Date(),
      },

      // Device
      {
        id: uuidv4(),
        name: "Device",
        description:
          "This Permission allows Viewing of Device and Edit Device ",
        method: "post",
        route: "/api/v1/device",
        action: "create",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Device",
        description:
          "This Permission allows Viewing of Device and Edit Device ",
        method: "get",
        route: "/api/v1/device",
        action: "read",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Device",
        description:
          "This Permission allows Viewing of Device and Edit Device ",
        method: "patch",
        route: "/api/v1/device",
        action: "edit",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Device",
        description:
          "This Permission allows Viewing of Device and Edit Device ",
        method: "delete",
        route: "/api/v1/device",
        action: "delete",
        isCustom: false,
        createdAt: new Date(),
      },

      // Assign / Unassign Device
      {
        id: uuidv4(),
        name: "DeviceAssign",
        description: "This Permission allows to Assgin the Device. ",
        method: "patch",
        route: "/api/v1/device/assign",
        action: "edit",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "DeviceUnassign",
        description: "This Permission allows to Unassgin the Device. ",
        method: "patch",
        route: "/api/v1/device/unassign",
        action: "edit",
        isCustom: false,
        createdAt: new Date(),
      },






      //Audit log
      // {
      //   id: uuidv4(),
      //   name: "AuditLog",
      //   description:
      //     "This Permission allows Viewing of Audit log and Edit Auditlog. ",
      //   method: "get",
      //   route: "/api/v1/auditLog",
      //   action: "read",
      //   isCustom: false,
      //   createdAt: new Date(),
      // },
      // {
      //   id: uuidv4(),
      //   name: "AuditLog",
      //   description:
      //     "This Permission allows Viewing of Audit log and Edit Auditlog. ",
      //   method: "post",
      //   route: "/api/v1/auditLog",
      //   action: "create",
      //   isCustom: false,
      //   createdAt: new Date(),
      // },
      // {
      //   id: uuidv4(),
      //   name: "AuditLog",
      //   description:
      //     "This Permission allows Viewing of Audit log and Edit Auditlog. ",
      //   method: "patch",
      //   route: "/api/v1/auditLog",
      //   action: "edit",
      //   isCustom: false,
      //   createdAt: new Date(),
      // },
      // {
      //   id: uuidv4(),
      //   name: "AuditLog",
      //   description:
      //     "This Permission allows Viewing of Audit log and Edit Auditlog. ",
      //   method: "delete",
      //   route: "/api/v1/auditLog",
      //   action: "delete",
      //   isCustom: false,
      //   createdAt: new Date(),
      // },


      // Report
      {
        id: uuidv4(),
        name: "Report",
        description:
          "This Permission allows Viewing Of Report and Edit Report. ",
        method: "get",
        route: "/api/v1/report",
        action: "read",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Report",
        description:
          "This Permission allows Viewing Of Report and Edit Report. ",
        method: "patch",
        route: "/api/v1/report",
        action: "edit",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Report",
        description:
          "This Permission allows Viewing Of Report and Edit Report. ",
        method: "post",
        route: "/api/v1/report",
        action: "create",
        isCustom: false,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Report",
        description:
          "This Permission allows Viewing Of Report and Edit Report. ",
        method: "delete",
        route: "/api/v1/report",
        action: "delete",
        isCustom: false,
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
