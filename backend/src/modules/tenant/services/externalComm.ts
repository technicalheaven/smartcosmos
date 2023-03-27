import axios from 'axios';
import { logger } from '../../../libs/logger';
import { Exception } from '../../../middlewares/resp-handler';
var constant = require('../../../middlewares/resp-handler/constants');
var localConstant = require('../utils/constants');
import { config } from '../../../config';

class TenantExternalComm {

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
      logger.error("Error while getting tenant data vai Tenant ExternalComm_22");
      if (!error.response.data.statusCode) throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Tenant of id ${tenantId} doesn't exist.`);
      else return Promise.reject(error);
    }
  }

    async syncTenantDataAdd(tenantId: any, tenantData: any) {
        try{
          
              let payload = { tenantId: tenantId, data: tenantData };
              let res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/sync/tenants`, payload,{headers: {
                'service-token': process.env.SERVICE_TOKEN!!
            }});
              logger.info("Tenant Data send to Sync-service Successfully");
              return Promise.resolve(res);
        }
        catch(error:any)
        {
            logger.error("Error at Tenant Data send to Sync-service vai Tenant ExternalComm");
            return Promise.reject(error);
        }
    }
    
    async syncTenantDataUpdate(tenantId: any, tenantData: any) {
         try{   
             let payload = { tenantId: tenantId, data: tenantData };
             let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/sync/tenant/${tenantId}`, payload,{headers: {
              'service-token': process.env.SERVICE_TOKEN!!
          }});
            logger.info("Updated Tenant Data send to Sync-service Successfully");
            return Promise.resolve(res);            }
            catch(error:any)
            {
                logger.error("Error at Updated Tenant Data send to Sync-service vai Tenant ExternalComm");
                return Promise.reject(error);
            }
    }
    async syncTenantDataDelete(tenantId: any) 
    {
        try{
            
            let res = await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/sync/tenant/${tenantId}`,{data:{tenantId:tenantId},headers: {
              'service-token': process.env.SERVICE_TOKEN!!
          }});
            logger.info("Deleted Tenant Data ID send to Sync-service Successfully");
            return Promise.resolve(res);
        }
        catch(error:any)
        {
            logger.error("Error at Deleted Tenant Data send to Sync-service vai Tenant ExternalComm");
            return Promise.reject(error);
        }
    }

  async deleteTenantDataCompletely(tenantId: any) {
    try {
      let res = 'Tenant Data has been deleted';
      //  res = await axios.delete('http://localhost:8080/smartcosmos/sync/tenant', tenantId);
      logger.info("Tenant Data has been deleted");
      return Promise.resolve(res);
    }
    catch (error: any) {
      logger.error("Error at Deleted Tenant Data from every where vai Tenant ExternalComm_80");
      return Promise.reject(error);
    }
  }


  // delete Site
  async deleteSite(tenantID: any) {
    try {
      let res = await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/site/tenant/${tenantID}`, {
        headers: {'service-token': process.env.SERVICE_TOKEN!! }
      });
      logger.info("deleteSite_data_Deleted")
      return Promise.resolve(res);
    }
    catch (error: any) {
      logger.error("TenantExterCommError_deleteSite vai Tenant ExternalComm_101");
      return Promise.reject(localConstant.SITE_NOT_DELETE);
    }
  }
  async deleteUser(tenantID: any) {
    try {
      let res = await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/user/tenant/${tenantID}`, {
        headers: {
          'service-token': process.env.SERVICE_TOKEN!!
        }
      });
       logger.info("res_deleteUser deleted",);
      return Promise.resolve(res);
    }
    catch (error: any) {
      logger.error("TenantExterCommError_deleteUser vai Tenant ExternalComm_116");
      return Promise.reject(localConstant.USER_NOT_DELETE);
    }
  }

  async deleteProduct(tenantID: any) {
    try {
      let res = await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/product/tenant/${tenantID}`, {
        headers: {
          'service-token': process.env.SERVICE_TOKEN!!
        }
      });
      logger.info("deleteProduct_data_Deleted")
      return Promise.resolve(res);
    }
    catch (error: any) {
      logger.error("Error at deleteProduct vai Tenant ExternalComm_132");
      return Promise.reject(localConstant.PRODUCT_NOT_DELETE);
    }
  }
  async deleteDevice(tenantID: any) {
    try {
      let res = await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/device/tenant/${tenantID}`, {
        headers: {
          'service-token': process.env.SERVICE_TOKEN!!
        }
      });
      logger.info("res_deleteDevice deleted");
      return Promise.resolve(res);
    }
    catch (error: any) {
       logger.error("TenantExterCommError_deleteDevice vai Tenant ExternalComm_147");
      return Promise.reject(localConstant.DEVICE_NOT_DELETE);
    }
  }
  async deleteZone(tenantID: any) {
    try {
      let res = await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/zones/tenant/${tenantID}`, {
        headers: {
          'service-token': process.env.SERVICE_TOKEN!!
        }
      });
      logger.info("deleteZone_data_Deleted")
      return Promise.resolve(res);
    }
    catch (error: any) {
      logger.error("TenantExterCommError_deleteZone vai Tenant ExternalComm_162");
      return Promise.reject(localConstant.ZONE_NOT_DELETE);
    }
  }
  async deleteProcess(tenantID: any) {
    try {
      let res = await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/processes/tenant/${tenantID}`, {
        headers: {
          'service-token': process.env.SERVICE_TOKEN!!
        }
      });
      logger.info("deleteProcess_data_Deleted")
      return Promise.resolve(res);
    }
    catch (error: any) {
      logger.error("deleteProcess  Process deleted Tenant ExternalComm_177");
      return Promise.reject(localConstant.PROCESS_DELETED);
    }
  }
 

  async unassignDeviceViaTenantId(tenantId: any) {
    
    try {
      let payload = { tenantId: tenantId };
      const res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/${localConstant.DEVICE_END_POINTS.DEVICEBYTENANTID}`, payload, {
        headers: {
          'service-token': process.env.SERVICE_TOKEN!!
        }
      });
      return Promise.resolve(res)
    } catch (error) {
      logger.info("TenantExterCommError_unassignDeviceViaTenantId vai Tenant ExternalComm_22")
      return Promise.reject(error)
    }
  }




  // for restore

  // restore Site
  // restore Site
  async restoreSite(tenantID: any) {
    try {
      let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/site/tenant/${tenantID}`, {
        headers: {
          'service-token': process.env.SERVICE_TOKEN!!
        }
      });
      return Promise.resolve(res);
    }
    catch (error: any) {
      logger.error("Error at Restoring site Data");
      return Promise.reject(localConstant.SITE_NOT_RESTORE);
    }
  }
  // for restore User
  async restoreUser(tenantID: any) {
    try {
      let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/user/tenant/${tenantID}`, {
        headers: {
          'service-token': process.env.SERVICE_TOKEN!!
        }
      });
      return Promise.resolve(res);
    }
    catch (error: any) {
      logger.error("Error at Restoring User Data");
      return Promise.reject(localConstant.USER_NOT_RESTORE);
    }
  }
  // for restoring product
  async restoreProduct(tenantID: any) {
    try {
      let res = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/product/tenant/${tenantID}`, {
        headers: {
          'service-token': process.env.SERVICE_TOKEN!!
        }
      });
      return Promise.resolve(res);
    }
    catch (error: any) {
      logger.error("Error at Restoring product Data");
      return Promise.reject(localConstant.PRODUCT_NOT_RESTORE);
    }
  }


  async deleteSiteData(tenantId: any) {
    try {

      //let response=await Promise.allSettled([this.deleteSite(tenantId),this.deleteUser(tenantId),this.deleteProduct(tenantId),this.deleteDevice(tenantId),this.deleteZone (tenantId),await this.deleteProcess(tenantId)]);      
      //let response=await Promise.allSettled([this.deleteSite(tenantId),this.deleteUser(tenantId),this.deleteProduct(tenantId)]);      
      await this.deleteProduct(tenantId);
      await this.deleteUser(tenantId);
      await this.deleteSite(tenantId);
      await this.deleteZone (tenantId);
      await this.deleteDevice(tenantId);
      await this.deleteProcess(tenantId);
      logger.info("Tenant Deleted Second Deleted");

      logger.info("Data Deleted from site, user,device, zone and products")
      return Promise.resolve(localConstant.DATA_DELETED);

    }
    catch (error: any) {
      logger.error("Error at deleting SiteData, ZoneData, DeviceData, UserData, ProductData via tenant ID from Tenant ExternalComm_268");
      return Promise.resolve(localConstant.DATA_DELETED);
      //return Promise.reject(error);
    }

  }



  // FETCHING PREDEFINED PROCESSES
  async getPredefinedProcesses() {
    try {
      const res = await axios.get(`${config.BASE_URL}${config.API_PREFIX}/preDefinedProcess`, {
        headers: {
          'service-token': process.env.SERVICE_TOKEN!!
        }
      });
      return Promise.resolve(res);
    }
    catch (error: any) {
      logger.error("Error while getting predefined processes");
      return Promise.reject(error);
    }
  }

  async postPredefinedProcess(req: any) {
    try {
      const res = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/preDefinedProcess`, req, {
        headers: {
          'service-token': process.env.SERVICE_TOKEN!!,
        }
      },
      );
      logger.info("Tenant Process Data send to Sync-serivce Successfully");
      return Promise.resolve(res);
    }
    catch (error: any) {
      logger.error("Error postPredefinedProcess___");
      return Promise.reject(error);
    }
  }

  async deleteTagData(tenantID: any){
    try {
      
      let res = await axios.delete(`${config.BASE_URL}${config.API_PREFIX}/report/dashboard/tenant/${tenantID}`, {
        headers: {
          'service-token': process.env.SERVICE_TOKEN!!
        }
      });
      logger.info("Tag Data Deleted")
      return Promise.resolve(res);
    }
    catch (error: any){

    }
  }


}



export const tenantExternalCommInstance = new TenantExternalComm();