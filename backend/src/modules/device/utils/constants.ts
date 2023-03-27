
module.exports = {

    REQUEST_METHOD:
    {
        PATCH:'patch',
        DELETE:'delete',
    },
    TENANT_END_POINTS:{
        TENANTBYID : 'tenant',
        TENANTS : 'tenants'
    },
    FEATURE_END_POINTS:{
        FEATUREBYID : 'feature',
    },

    SITE_END_POINTS:{
        SITEBYID : 'site',
        SITES: 'sites'
    },
    ZONE_END_POINTS:{
        ZONES: 'zone',
        ZONEBYID : 'zone',
        ALLCHECK:'zone/allcheck',
    },
    DEVICEMANAGER_END_POINTS:{
        CHECKMANAGER:'devicemanagers?tenant=',
    },
    
    USER_END_POINTS:{
        USERS : 'users',
    },

    PRODUCT_END_POINTS:{
        PRODUCTS : 'products',
    },

    PROCESS_END_POINTS:{
        PROCESS : 'process',
        WORKFLOWS: 'workflows',
        STATEMACHINE: 'statemachines',
        NODEWF: 'nodeworkflows'

    },

    DEVICE_END_POINTS:{
        DEVICE : 'devices',
    },
    
    TAG_END_POINTS:
    {
        tagReadById:'tag',
        digitizedTagReadById:'digitized/tag',
        duplicateTagReadById:'duplicatetags/tag',
        trackNTraceTagReadById:'trackntrace/tag',
        addDigitizeData:'digitized/tag',
        commonDataProcessing:'commondataprocessing/tag',
        lastvalidcount:'tnt/lastvalidcount',
        checkDigitizedTagReadById: 'check/digitizedTag',
    },

    TIMEOUT:5000,

    // for external communication
    DEVICE_NOT_FOUND:'Device not found',
    DEVICE_EXIST:'Entered MAC address already exists !',
    DEVICE_MAC_EXIST:'MAC address already exist',
    DEVICE_EXIST_WITH_OTHER:'Device already added to another tenant',
    PROCESS_RUNING_ON_DEVICE:'Process already runing on this device',
    PROCESS_ASSIGN_ON_DEVICE:'Please unassign the device from the process',
    PROCESS_NOT_RUNING_ON_DEVICE:'Process not running on any device',
    UNASSINGED_SITE:'Firstly anassign site from this device',
    UNASSINGED_ZONE:'Firstly anassign zone from this device',
    DEVICE_DELETED:'Device has been deleted successfully',
    DEVICE_ASSIGNED:'Device has been assigned successfully',
    DEVICE_UNASSIGNED:'Device has been unassigned successfully',
    TENANT_NOT_FOUND:'Tenant Not Found',
    START:'Active-Running',
    ZONE_NOT_FOUND:'Zone not found',
    SITE_NOT_FOUND:'Site not found',
    TENANT_SITE_ZONE_NOT_MATCHED:'Tenant, Site and zone data not matched',
    DEVICE_MANAGER_NOT_FOUND:'Device manager not found',
    DEVICE_MANAGER_EXIST:'Device manager already added',
    DEVICE_MANAGER_DELETED:'Device Manager has been deleted successfully',
    DEVICE_MODEL_EXIST:'Device model already exist',
    DEVICE_MODEL_NOT_FOUND:'Device model not found',
    DEVICE_MODEL_DELETED:'Device model has been deleted successfully',
    DEVICE_URL_EXIST:'Device url already added',
    REMOVE_DEPENDANCE:'Remove dependency',
    TAGNOTFOUND:'Tag not found',
    UUIDNOTFOUND:'Device id not found',
    DEVICE_EXIST_FOR_DEVICE_MANAGER: 'Device existing for the device manager.',

    // Device Type
    HHD: 'HHD',
    ONCD: 'onCloud',
    ONPREM: 'onPremise',
    CLOUD: 'cloud',

    //DEVICE STATUS
    IDLE: 'Active-Idle',
    RUNNING: 'Active-Running',
    INACTIVE: 'Inactive',
    DELETED: 'Deleted',

    //TENANT STATUS
    ACTIVE : 'Active',

    //entity column name for client sync info table
    ClientSyncInfoColumn : {
        USERS: 'userSyncedAt',
        TENANTS: 'tenantSyncedAt',
        DEVICES: 'deviceSyncedAt',
        ZONES: 'zoneSyncedAt',
        SITES: 'siteSyncedAt',
        PROCESSES: 'processSyncedAt',
        PRODUCTS: 'productSyncedAt',
        TAGS: 'tagSyncedAt',
        WORKFLOWS: 'workflowSyncedAt',
        STATEMACHINES: 'stateMachineSyncedAt',
        NODEWFS: 'nodeWorkflowSyncedAt'
    },

    ProcessTypes: {
        DIGITIZATION: 'Digitization',
        TNT: 'TrackNTrace'
    },

    /////////// Routing key constant
    RoutingKey: {
        ALL: 'ALL'
    },

    SyncMessageType : {
        SYNCCONFIGDATA: "Sync-Config-Data",
        REQUEST: "Request",
        RESPONSE: "Response",
        NOTIFICATION: "Notification",
        OTHER: "Other"
    },
    SyncRequestType :{
        CHECKDUPLICATETAG: 'tag-duplicate',
        CHECKTAG: 'check-tag',
        OTHER: "other"
    },
    
    SyncNotificationType : {
        TAG: 'tag',
        OTHER: "other"
    }
    
}

export const lastValidCounter = '/tnt/lastvalidcount'
