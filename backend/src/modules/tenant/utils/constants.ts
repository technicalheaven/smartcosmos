import { TRACKNTRACE } from "../../tag/utils/constant";

module.exports = {

    TENANT_END_POINTS:{
        TENANTBYID : 'tenant',
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

    DEVICE_END_POINTS:{
        DEVICEBYID : 'devices/unassign',
        DEVICEBYTENANTID : 'devices/unassign-via-tenantid',
        DEVICEBYZONEID : 'devices/unassign-via-zoneid',
        DEVICEBYSITEID : 'devices/unassign-via-siteid',
    },
    
    // for external communication
    SITE_NOT_DELETE:'Site not deleted',
    USER_NOT_DELETE:'User not deleted',
    DEVICE_NOT_DELETE:'Device not deleted',
    ZONE_NOT_DELETE:'Zone not deleted',
    PROCESS_NOT_DELETE:'Process not deleted',
    PRODUCT_NOT_DELETE:'Product not deleted',
    
    SITE_NOT_RESTORE:'Site not restore',
    USER_NOT_RESTORE:'User not restore',
    DEVICE_NOT_RESTORE:'Device not restore',
    PROCESS_NOT_RESTORE:'Process not restore',
    PRODUCT_NOT_RESTORE:'Product not restore',

    DATA_DELETED:'Data deleted',
    DATA_NOT_DELETED:'Data not deleted',

    // for service file
    TENANT_EXIST:'Entered tenant name already exists !',
    TENANT_ID_REQUIRED:'Tenant id is required',
    TENANT_NOT_FOUND:'Tenant Not Found',
    TENANT_DELETED:'Tenant deleted successfully',
    PROCESS_DELETED:'Process deleted successfully',
    TENANT_NOT_DELETED:'Tenant not deleted',
    TENANT_PHONE_EXIST:'Tenant contact number already exist',
    TENANT_EMAIL_EXIST:'Tenant email address already exist',
    RECORD_NOT_FOUND:'Tenant contact record not found',
    TENANT_CONTACT_ID_NEED:'Tenant contact id required',
    TENANT_CONTACT_NOT_FOUND:'Tenant contact data not found',
    TENANT_CONTACT_DELETED:'Tenant contact data has been deleted',
    TENANT_CONTACT_EMAIL_EXIST:'Site contact email already exist',
    TENANT_DEFALUT_TYPE:'tenant',
    TENANT_SUPER_TYPE_SEEDER:'smartcosmos',
    TENANT_PRE_DEFINE_PROCESS_ERROR:'Error in creating pre-define process',
    TRACKNTRACE: 'TrackNTrace'
}