import { Sequelize } from "sequelize-typescript";
const Umzug = require('umzug');
import 'dotenv/config';
import { Dialect } from 'sequelize/types';
import dbconfig from './config.json';
// Import models
import { User } from '../modules/user/models/user';
import { Tenant } from '../modules/tenant/models/tenant';
import { TenantContact } from '../modules/tenant/models/tenantContact';
import { TenantFeature } from '../modules/tenant/models/tenantFeature';
import { Product } from "../modules/product/models/product";
import { Feature } from '../modules/tenant/models/feature';
import { FeatureAction } from '../modules/tenant/models/featureAction';
import { Site } from '../modules/site/models/site';
import { SiteContact } from '../modules/site/models/siteContact';
import { SiteTenant } from '../modules/site/models/siteTenant';
import { UserRole } from "../modules/user/models/userRole";
import { Role } from "../modules/user/models/role";
import { Zone } from "../modules/zone/models/zone";
import { ZoneType } from "../modules/zone/models/zoneTypes";
import { Permission } from "../modules/user/models/permission"
import { RolePermission } from "../modules/user/models/rolePermission"
import { ResetPassword } from "../modules/user/models/resetPassword";
import { Process } from "../modules/process/models/process";
import { ProcessDevice } from "../modules/process/models/processDevice";
import { ProcessAction } from "../modules/process/models/processAction";
import path from "path";
import { logger } from "../libs/logger";
import { DeviceConfig } from "../modules/device/models/deviceConfig"
import { DeviceSiteZoneProcess } from "../modules/device/models/deviceSiteZoneProcess"
import { DeviceManager } from "../modules/device/models/deviceManager"
import { DeviceTypeModel } from "../modules/device/models/deviceTypeModel"
import { ClientSyncInfo } from '../modules/device/sync-service/models/clientSyncInfo'
import {Enablement} from "../modules/report/models/enablement"
import {TagCount} from "../modules/report/models/tagCount"
import {EnablementByProcess} from "../modules/report/models/enablementByProcess"
import {EnablementByProduct} from "../modules/report/models/enablementByProduct"
import { DashboardHeaderCount } from "../modules/report/models/dashboardHeaderCount";
import { intializeSyncService } from "../modules/device/sync-service/services/sync";
import { seedMongoDbData } from "../mongoseeder/mongoseeder";




type dbconfigType = {
  [key: string]: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: Dialect;
  }
}
const config: dbconfigType = JSON.parse(JSON.stringify(dbconfig));
const env: string = process.env.NODE_ENV || "production";


const { host, database, dialect, username, password } = config[env];
const sequelize = new Sequelize({
  host,
  database,
  dialect,
  dialectOptions: {
    multipleStatements: true
  },
  username,
  password,
  logging: false,
 // timezone: '+05:30', 
  pool: {
    max: 10000,
    min: 0, 
    acquire: 60000,
    idle: 10000,
    evict: 10000

  }
});
 


export const initDB = async () => {
 console.log("Database initDB")
  await sequelize.authenticate();
  //await sequelize.sync({ alter: true });
}; 

export const runMirgrationSeederMYSQL =  async () =>{
  try{
    await sequelize.authenticate()
    logger.info('Connection has been established successfully ( DB ) .')
    if(process.env.NODE_ENV != 'test'){
      logger.info('Migration start running .')
      await migrate.up();
      logger.info('All migrations performed successfully ( DB )')
      await seedMongoDbData();
      logger.info("All Mongooes seeders running successfully");
      await seed.up();
      logger.info('Data seed successfull. ( DB )')
      return Promise.resolve();
    }
  }
  catch(error)
  {
    logger.error("Error in running migration",error);
  }
    
 
}





sequelize.addModels([User, Tenant, TenantContact, TenantFeature, Feature, FeatureAction, Site, SiteTenant, SiteContact, Product, UserRole, Role, Zone, ZoneType, Permission ,RolePermission, ResetPassword,Process,ProcessDevice,DeviceConfig,DeviceSiteZoneProcess,DeviceManager,DeviceTypeModel,ProcessAction,Enablement, TagCount, EnablementByProcess, EnablementByProduct, DashboardHeaderCount,ClientSyncInfo]);




const models = {
  User,
  Tenant,
  TenantContact,
  TenantFeature,
  Feature,
  FeatureAction,
  Site, SiteTenant, SiteContact,
  Product,
  UserRole,
  Role,
  Zone,
  ZoneType,
  Permission,
  RolePermission,
  ResetPassword,
  Process,
  ProcessDevice,
  DeviceConfig,
  DeviceSiteZoneProcess,
  DeviceManager,
  DeviceTypeModel,
  ClientSyncInfo,
  Enablement,
  TagCount,
  EnablementByProcess,
  EnablementByProduct,
  DashboardHeaderCount,
  ProcessAction
}

export { sequelize, models, User, Role, Tenant, TenantContact, TenantFeature, Feature, FeatureAction, Product, Zone,ZoneType,Permission,RolePermission,ResetPassword, Site, SiteTenant, SiteContact,Process,ProcessDevice,DeviceConfig,DeviceSiteZoneProcess,DeviceManager,DeviceTypeModel, Enablement, TagCount, EnablementByProcess, EnablementByProduct, DashboardHeaderCount,ProcessAction,ClientSyncInfo};

export { sequelize as databaseInstance }


const migrate = new Umzug({
  migrations: {
    // indicates the folder containing the migration .js files
    path: path.join(__dirname, '../migrations'),
    pattern: /\.js$/,
    // inject sequelize's QueryInterface in the migrations
    params: [sequelize.getQueryInterface(), Sequelize],
  },
  // indicates that the migration data should be store in the database
  // itself through sequelize. The default configuration creates a table
  // named `SequelizeMeta`.
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
  },
  logger: console,
})

const seed = new Umzug({
  migrations: {
    // indicates the folder containing the migration .js files
    path: path.join(__dirname, '../seeders'),
    pattern: /\.js$/,
    // inject sequelize's QueryInterface in the migrations
    params: [sequelize.getQueryInterface(), sequelize],
  },
  // indicates that the migration data should be store in the database
  // itself through sequelize. The default configuration creates a table
  // named `SequelizeMeta`.
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
  },
})
