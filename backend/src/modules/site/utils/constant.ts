module.exports = {

    TENANT_END_POINTS:{
        TENANTBYID : 'tenant',
    },

    DEVICE_END_POINTS:{
        DEVICEBYID : 'device-count',
        UNASSIGNVIASITEID : 'devices/unassign-via-siteid',
        DEVICEBYTENANTID : 'devices/unassign-via-tenantid',
    },

    ZONE_END_POINTS:{
        ZONEBYSITEID : 'zone/site',
        DELETEZONEBYSITEID : 'zones/site',
        
    },

    REQUEST_METHOD:
    {
        PATCH:'patch',
        DELETE:'delete',
    },
    RESPONSE_STATUS:
    {
        SUCCESS:200
    },
    TIMEOUT:5000,

    // for external communication
    SITE_NOT_DELETE:'Site not deleted',
    REMOVE_SITE_DEPENDENCY:'Firstly remove dependency for deleting this site',
    USER_NOT_DELETE:'User not deleted',
    DEVICE_NOT_DELETE:'Device not deleted',
    PROCESS_NOT_DELETE:'Process not deleted',
    PRODUCT_NOT_DELETE:'Product not deleted',
    
    SITE_NOT_RESTORE:'Site not restore',
    ZONE_NOT_RESTORE:'Zone not restore',
    USER_NOT_RESTORE:'User not restore',
    DEVICE_NOT_RESTORE:'Device not restore',
    PROCESS_NOT_RESTORE:'Process not restore',
    PRODUCT_NOT_RESTORE:'Product not restore',

    DATA_DELETED:'Data deleted',
    DATA_NOT_DELETED:'Data not deleted',
    DEVICE_NOT_FOUND:'Device not found',
    // for service file
    TENANT_EXIST:'Tenant Already Exist',
    TENANT_ID_REQUIRED:'Tenant id is required',
    TENANT_NOT_FOUND:'Tenant Not Found',
    TENANT_DELETED:'Tenant deleted successfully',

    SITE_EXIST:'Entered site name already exists !',
    SITE_IDENTIFIER_EXIST:'Site Identifier Exist',
    SITE_PHONE_EXIST:'Site contact phone Already Exist',
    SITE_CONTACT_NOT_FOUND:'Site contact record not found',
    SITE_ID_REQUIRED:'Site id is required',
    SITE_NOT_FOUND:'Site Not Found',
    SITE_DELETED:'Site deleted successfully',
    SITE_NOT_DELETED:'Site not delete',
    ZONE_NOT_DELETED:'Zone not delete',
    DEVICE_ASSIGNMENT:'Device assignment done successfully',
    SITE_CONTACT_DELETED:'Site contact deleted successfully',
    SITE_CONTACT_EMAIL_EXIST:'Site contact email already exist',
    SITE_EMAIL_EXIST:'Site email address already exist',
    ZONE_NOT_FOUND:'Zone Not Found',
    
}