
module.exports = {

    REQUEST_METHOD:
    {
        PATCH:'patch',
        DELETE:'delete',
    },
    TENANT_END_POINTS:{
        TENANTBYID : 'tenant',
    },

    DEVICE_END_POINTS:{
        DEVICEBYID : 'device',
    },

    DEVICES_END_POINTS:{
        DEVICESBYID : 'devices/process',
    },

    PROCESS_END_POINTS:{
        PROCESSBYID : 'process',
    },

    DEVICE_ASSIGN_END_POINTS:{
        DEVICESBYID : 'devices/assign',
    },
    

    DEVICE_UNASSIGN_END_POINTS:{
        DEVICESBYID : 'devices/unassign',
    },

    PRODUCT_END_POINTS:{
        PRODUCTBYID : 'product',
    },

    ROLE_END_POINTS:{
         ROLEBYID : 'role',
    },

    SITE_END_POINTS:{
        SITEBYID : 'site',
    },

    ZONE_END_POINTS:{
        ZONEBYID : 'zone',
    },
    FEATURE_NAME:{
        FEATURE_BY_NAME:'features'
    },

    TIMEOUT:5000,

    // for external communication
    PROCESS_NOT_EXIST:'Process with this processId does not exist',
    NOT_NULL:'deviceId and roleId cannot be null',
    PROCESS_IN_PROGRESS:'process is in progress it cannot be updated',
    DEVICE_NOT_FOUND:'Device not found',
    ROLE_NOT_FOUND:'Role not found',
    PROCESS_EXIST:'Process already added',
    PROCESS_DELETED:'Process has been deleted successfully',
    PROCESS_ASSIGNED:'Process has been assigned successfully',
    PROCESS_UNASSIGNED:'Process has been unassigned successfully',
    TENANT_NOT_FOUND:'Tenant Not Found',
    PRODUCT_NOT_FOUND:'Product Not Found',
    PROCESS_UPDATED:'updated process assigned to device',
    ZONE_NOT_FOUND:'Zone not found',
    SITE_NOT_FOUND:'Site not found',
    PROCESS_NOT_CREATE:'We are not allowed to create process with this name.',
    PROCESS_NOT_UPDATE:'We are not allowed to update process with this name.',

    ProcessType: {
        DIGITIZATION:'Digitization',
        TRACKNTRACE:'TrackNTrace',
        SELECTSITE:'Select Site',
        SELECTZONE:'Select Zone',
        SELECTDEVICE:'Select Device',
        READYSTATE:'Ready',
        LOCKTAG :"LockTag",
    },
    FEATURE_NOT_FOUND:'Feature not found'

}