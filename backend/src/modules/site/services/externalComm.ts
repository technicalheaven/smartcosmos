import axios from 'axios';
import { logger } from '../../../libs/logger';
import { config } from '../../../config';
var localConstant = require('../utils/constant');
import Exception from '../../../middlewares/resp-handler/exception';
var constant = require('../../../middlewares/resp-handler/constants');
class SiteExternalComm {

    // check tenat
    async getTenant(tenantId: any) {
        try {
            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.TENANT_END_POINTS.TENANTBYID}/${tenantId}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            //logger.info(`Tenant Data of id ${tenantId}`, res);
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while getting tenant data ");
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_NOT_FOUND);
            else return Promise.reject(error);
        }
    }

    async getZoneCount(siteId: any) {
        try {

            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.ZONE_END_POINTS.ZONEBYSITEID}/${siteId}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
          //  logger.info(`GetZoneCount Data of id ${siteId}`, res);
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while getting zone data ");
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.ZONE_NOT_FOUND);
            else return Promise.reject(error);
        }
    }

    async getAllDevices(siteId: any) {
        try {

            const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.DEVICE_END_POINTS.DEVICEBYID}/${siteId}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            //logger.info(`GetDEviceCount Data of id ${siteId}`, res);  
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while getting zone data ");
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.DEVICE_NOT_FOUND);
        }
    }
    async getZoneSiteNameUpdated(siteId: any,siteName:any) {
        try {
            let payload = { siteId:siteId,siteName:siteName};
            const res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.ZONE_END_POINTS.ZONEBYSITEID}/${siteId}`,payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("updateSiteName Data in zone of id ${siteId}");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error while updating zone data ");
            if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.ZONE_NOT_FOUND);
            else return Promise.reject(error);
        }
    }


    async syncSiteDataAdd(siteId: any, siteData: any) {
        try {
            let payload = { siteId: siteId, data: siteData };
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/sites`, payload, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            logger.info("Site Data sent to sync service successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at Site Data sent to sync service");
            return Promise.reject(error);
        }
    }

    async syncSiteDataUpdate(siteId: any, siteData: any) {
        try {
            let payload = { siteId: siteId, data: siteData };
            let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/sync/site/${siteId}`, payload, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            logger.info("Updated site Data sent to sync service");
            return Promise.resolve(res);

        }
        catch (error: any) {
            logger.error("Error at Updated siteId Data send to Sync-service ");
            return Promise.reject(error);
        }
    }

    async syncSiteDataDelete(siteId: any, tenantId: any) {
        logger.debug("TenantId and SiteId.. in syncSiteDataDelete", tenantId, siteId)
        try {      
            let payload = { tenantId: tenantId, siteId: siteId };     
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/site-delete`, payload, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            logger.info("Deleted site ID send to Sync-service Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at send Deleted site Data to Sync-service ");
            return Promise.reject(error);
        }
    }

    async syncSiteDataBulkDelete(deletedSiteIds: any, tenantId:string) {
        try {
            let payload = { tenantId: tenantId, siteIdArray: deletedSiteIds };
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/site-bulkdelete`, payload,{
            headers: { 'service-token': process.env.SERVICE_TOKEN!! }
            });
            logger.info("Deleted site ID send to Sync-service Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at Deleted site Data send to Sync-service ");
            return Promise.reject(error);
        }
    }

    async deleteSiteDataCompletely(siteId: any) {
        try {
            let res = 'Site Data has been deleted';
            //  res = await axios.delete('http://localhost:8080/smartcosmos/sync/site', siteId);
            logger.info("Site Data has been deleted");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at Deleted Site Data from every where ");
            return Promise.reject(error);
        }
    }

    async checkUsersCanDelete(siteId: any) {
        try {
            
            let res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/user/site/${siteId}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at checkUsersCanDelete ");
            return Promise.reject(localConstant.SITE_NOT_DELETE);
        }
    }

    async checkDeviceCanDelete(siteId: any) {
        try {
           
            let res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/device/site/${siteId}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at checkDeviceCanDelete ");
            return Promise.reject(localConstant.SITE_NOT_DELETE);
        }
    }


    async deleteZoneViaTenantId(tenantID: any) {
        try {
            let res = await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/zones/tenant/${tenantID}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at deleting zone Data Syncing ");
            return Promise.reject(localConstant.SITE_NOT_DELETE);
        }
    }

    async restoreZoneViaTenantId(tenantID: any) {
        try {
            let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/zones/tenant/${tenantID}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at Restoring zone Data");
            return Promise.reject(localConstant.SITE_NOT_RESTORE);
        }
    }


    async deleteZoneViaTenantIdData(tenantId: any) {
        try {
            
            let deleteZone1 = this.deleteZoneViaTenantId(tenantId);
           // let restoreZone2 = this.restoreZoneViaTenantId(tenantID);
            let resZone: any;

            [resZone] = await Promise.all([deleteZone1]);
            
            if (resZone.status !== localConstant.RESPONSE_STATUS.SUCCESS) {
                // restoring data
              //  await Promise.all([restoreZone2,]);
               logger.error("Zone throwing error");
                throw new Exception(constant.ERROR_TYPE.FORBIDDEN, localConstant.DATA_NOT_DELETED);
            }
            else {
                return Promise.resolve(localConstant.DATA_DELETED);
            }
        }
        catch (error) {
            logger.error("Error at Deleting Zone Data from every where In site ExternalComm");
            return Promise.reject(error);
        }

    }

    // for delete site using site ID  
    async deleteZoneViaSiteId(siteId:any) 
    {
        try {
            let payload = { siteId:siteId};
            const res =  await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.ZONE_END_POINTS.DELETEZONEBYSITEID}/${siteId}`, {headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            return Promise.resolve(res)
        } catch (error) {
            logger.error("Error In external comm for Deleting Zone via Site ID",siteId)
            return Promise.reject(localConstant.ZONE_NOT_DELETED);
        }
    }
    async unassignDeviceViaSiteId(siteId:any) 
    {
            
        try {
            let payload = { siteId:siteId};
            const res =  await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.DEVICE_END_POINTS.UNASSIGNVIASITEID}`,payload, {headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async restoreZoneViaSiteId(tenantID: any) {
        try {
            let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/zones/site/${tenantID}`, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at Restoring zone Data");
            return Promise.reject(localConstant.ZONE_NOT_RESTORE);
        }
    }

    async deleteSiteViaSiteIdData(siteId: any) {
        try {
           
            
            let resZone: any;
            let resUserCheck: any;
            let resDeviceCheck: any;
            resUserCheck= await this.checkUsersCanDelete(siteId);
            resDeviceCheck= await this.checkDeviceCanDelete(siteId);
            //[resUserCheck,resDeviceCheck] = await Promise.all([this.checkUsersCanDelete(siteId), this.checkDeviceCanDelete(siteId)]);
            logger.info("userCheck.data.result");
            logger.info("deviceCheck.data.result");
           
            if(resUserCheck.data.result==='User found with this siteId'  ||  resDeviceCheck.data.result==='Process already runing on this device' )
                {   
                    throw new Exception(constant.ERROR_TYPE.FORBIDDEN, localConstant.REMOVE_SITE_DEPENDENCY);
                }   
                else
                {
                     //let resUnssignData = await this.unassignDeviceViaSiteId(siteId);
                     let resZoneData = await this.deleteZoneViaSiteId(siteId);
                    logger.info("resZoneData.status",resZoneData.status);
                   // logger.info("resUnssignData.status",resUnssignData.status);
                    // if (resZoneData.status !== localConstant.RESPONSE_STATUS.SUCCESS || resUnssignData.status !== localConstant.RESPONSE_STATUS.SUCCESS) {
                     if (resZoneData.status !== localConstant.RESPONSE_STATUS.SUCCESS) {
                        //  await Promise.all([restoreZone]);
                     throw new Exception(constant.ERROR_TYPE.FORBIDDEN, localConstant.DATA_NOT_DELETED);
                }
                else {
                    return Promise.resolve(localConstant.DATA_DELETED);
                }
            }
        }
        catch (error) {
            logger.error("Error at Deleted Zone Data from every where in deleteSiteViaSiteIdData");
            return Promise.reject(error);
        }
    }


    async createDashBoardHeaderReport(payload:any) {
        try {
        
            let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/report/dashboardHeader`, payload, {
                headers: {
                    'service-token': process.env.SERVICE_TOKEN!!
                }
            });

            logger.info("Dashboard Header Report created Successfully");
            return Promise.resolve(res);
        }
        catch (error: any) {
            logger.error("Error at creating Dashboard Header Report");
            return Promise.reject(error);
        }
    }

    async updateDeviceSiteZoneProcess(deviceId: any, zoneData: any){
        try{
            let payload = { deviceId: deviceId, data: zoneData, flag: 'site' };
            
            let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/deviceSiteZoneProcess/device/${deviceId}`, payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
            logger.info("Updated Zone Data send to DeviceSiteZoneProcess Successfully");
            return Promise.resolve(res);
        }
        catch (error: any){
            logger.error("Error in updating DeviceSiteZoneProcess");
            return Promise.reject(error);
        }
    }

    async getDeviceSiteZoneProcessBySiteId(siteId: any){
        try {
            let res =  await axios.get(`${config.BASE_URL}${config.API_PREFIX}/deviceSiteZoneProcess/site/${siteId}`,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
            } catch (error) {
            return Promise.reject(error)
        }
    }
    async updateExistingDigitizedTagWithSiteName(siteId:any,name:any){
        try {
            let payload = { siteId: siteId, siteName: name };
            let res =  await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/tags/update-sitename-in-di-data/${siteId}`,payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }})
            return Promise.resolve(res)
            } catch (error) {
            return Promise.reject(error)
        }
    }
}



export const siteExternalCommInstance = new SiteExternalComm();