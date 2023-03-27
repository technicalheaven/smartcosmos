import { config } from "./index";
import { BaseUrls } from "../types";

const baseUrls: BaseUrls = {
  local: "http://localhost:8080/api/v1",
  dev: "https://dev.lifecycles.io/api/v1",
  qa: "https://qa.lifecycles.io/api/v1",
  demo: "https://demo.lifecycles.io/api/v1",
  prod: "https://solution.lifecycles.io/api/v1",
};

export const baseURL = baseUrls[config.ENV];

export enum apiRoutes {
  LOGIN = '/login',
  FORGOT_PASSWORD_MAIL = '/forgotpasswordsendemail',
  FORGOT_PASSWORD = '/forgotpassword',
  CHANGE_PASSWORD = '/changepassword',
  RESEND_INVITE = '/resendinvite',
  AUTH = '/auth',
  ADDUSER = '/user',
  UPDATE_USER = '/user',
  GETUSERBYID = '/user',
  GETALLUSERS = '/users',
  DELETEUSER = '/user',
  REFRESH_TOKEN = '/refreshToken',
  ADDTENANT = '/tenant',
  UPDATE_TENANT = '/tenant',
  GETTENANTBYID = '/tenant',
  GETALLTENANTS = '/tenants',
  DELETE_TENANT = '/tenant',
  GETALLROLES = '/roles',
  GETROLELIST = '/roleslist',
  GETROLES = '/rolesdetails',
  GETROLEDETAILS = '/rolesdetails',
  GETALLSITES = '/sites',
  GETSITEBYID = '/site',
  GET_TENANT_PRODUCTS = '/products',
  GET_TENANT_PROCESSES = '/process',
  FEATURE_ACTIONS = '/feature/%s',
  UPDATE_PRODUCT_UPC = '/product/upc/%s',
  EXPORT_PRODUCTS = '/product/export/%s',
  ADDSITE = '/site',
  UPDATESITE = '/site',
  DELETESITE = '/site',
  USER_PROFILE_IMAGE = '/user/image/profile',
  GETALLDEVICE = '/devices',
  ADD_DEVICE = '/device',
  ADD_PROCESS = '/process',
  UPDATE_DEVICE = '/device',
  UPDATE_PROCESS = '/process',
  GETDEVICETYPE = "/device-type",
  GETDEVICEMODAL = "/device-models",
  DELETE_DEVICE = '/device',
  DELETE_PROCESS = '/process',
  GETALLZONES = '/zone',
  ADD_ZONE = '/zone',
  UPDATE_ZONE = '/zone',
  DELETE_ZONE = '/zone',
  PRODUCTS_UPLOAD = '/product/%s/upload',
  UPDATE_DEVICE_STATUS = '/device/status',
  ADD_DEVICE_MANAGER = "/devicemanager",
  GETALLDEVICEMANAGERS = "/devicemanagers",
  UPDATE_DEVICE_MANAGER = "/devicemanager",
  DELETE_DEVICE_MANAGER = "/devicemanager",
  ZONE_TYPES = "/zoneTypes",
  TAGS = "/tag",
  FACTORY_TAG_UPLOAD = '/tag/upload-tags',
  FACTORY_UPLOAD_HISTORY = '/factorytags/history',
  GET_DIGITIZED_TAG = "/digitized/tag",
  GET_DUPLICATE_TAG = "/duplicatetags/tag",
  GET_ALL_TAGS = "/di-data",
  DEENABLE_TAGS = "/deEnable/tag",
  EXPORT_TAGS = "/digitized-data/export",
  FACTORY_TAG_FILTER_OPTIONS = "/factorytags/distinct-options",
  FACTORY_TAG_EXPORT = "/factorytags/export",
  DASHBOARD_REPORT = "/report/dashboard",
  EXPORT_CHUNKS_DI = "/di/diexportchunks",
  EXPORT_CHUNKS_TAGS = "/tags/tagsexportchunks",
  EXPORT_CHUNKS_PRODUCTS = "/exportchunks/%s",
}