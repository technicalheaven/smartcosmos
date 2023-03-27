
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
        DEVICEBYID : 'devices/unassign',
        DEVICEBYTENANTID : 'devices/unassign-via-tenantid',
        DEVICEBYZONEID : 'devices/unassign-via-zoneid',
        DEVICEBYSITEID : 'devices/unassign-via-siteid',
        RUNNINGSTATUSVIAZONEID : 'device/zone',
    },
    
    SITE_END_POINTS:{
        SITEBYID : 'site',
    },

    ZONETYPE_END_POINTS:{
        ZONETYPE : 'zoneTypesCheck',
    },

    ZONE_END_POINTS:{
        ZONEBYID : 'zone',
    },
    

    TIMEOUT:5000,

    // for external communication
    ZONE_EXIST:'Entered zone name already exists !',
    ZONE_DOES_NOT_EXIST:'Zone with zoneId does not exist',
    PROCESS_RUNING_ON_Zone:'A process already runing on this Zone',
    UNASSINGED_SITE:'Firstly anassign site from this Zone',
    UNASSINGED_ZONE:'Firstly anassign zone from this Zone',
    ZONE_DELETED:'Zone has been deleted successfully',
    ZONE_ASSIGNED:'Zone has been assigned successfully',
    ZONE_UNASSIGNED:'Zone has been unassigned successfully',
    TENANT_NOT_FOUND:'Tenant Not Found',
    TENANT_IS_NOT_ALLOWED:'Tenant is not allowed for update',
    START:'Running',
    ZONETYPE_NOT_EXIST:'Zonetype not exist',
    ZONE_NOT_FOUND:'Zone not found',
    SITE_NOT_FOUND:'Site not found',
    REMOVE_SITE_DEPENDENCY:'Firstly remove dependency for deleting this zone',
}