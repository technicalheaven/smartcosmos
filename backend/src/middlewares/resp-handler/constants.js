const SALT_LENGTH = 10
module.exports = {
  STATUS_CODE: {
    ERROR: 0,
    SUCCESS: 1,
    INVALID_TOKEN: 1000,
  },
  RESPONSE_STATUS: {
    SUCCESS: 200,
    SUCCESS_CREATED: 201,
    SUCCESS_NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    NOT_ALLOWED: 405,
    INTERNAL_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    ALREADY_EXISTS: 409,
    PCP_CONSTRAINT: 400
  },
  ERROR_TYPE: {
    NOT_FOUND: 'NotFoundError',
    UNAUTHORIZED: 'UnauthorizeError',
    INTERNAL_SERVER_ERROR: 'InternalServerError',
    BAD_REQUEST: 'BadRequestError',
    FORBIDDEN: 'ForbiddenError',
    NOT_IMPLEMENTED: 'NotImplementedError',
    ALREADY_EXISTS: 'AlreadyExistsError',
    NOT_ALLOWED: 'MethodNotAllowedError',
    PCP_CONSTRAINT: 'PcpConstraintError'

  },
  USER_ROLE: {
    provider: "Provider",
    platfromAdmin: "Platform Admin",
    patient: "Patient",
    family: "Family",
    PlatformSuperAdmin: 'Platform Super Admin',
    OrganizationAdmin: "Organization Admin"
  },

  DeleteFamilySubject: 'Delete Family Of a Patient Request',
  OnboardFmilysubject: 'On Boarding of the Patient Family',
  DeleteTemplate: './template/unassignFamily.html',
  OnboardTemplate: './template/familyDetail.html',

  DefaultStartDate: 'January 1, 1970 00:00:00',


  BiometricData_PROCESS_FAILED: "Failed to process Biometric data",
  Notification_Failure: "Notification Failure",
  Invited:"invited",



  KEYFALSE : 'false',
  KEYTRUE : 'true',
  ImportUserLimit:101,
  PAGINATION_START_PAGE:'1',
  PAGINATION_START_MAX_LIMIT:'1000',
  PAGINATION_DEFAULT_ORDER:'ASC',
  ISENABLED_TRUE:'1',
  ISENABLED_FALSE:'0',
  ISACTIVE_TRUE:'1',
  ISACTIVE_FALSE:'0',
  SALT_LENGTH
  
}

