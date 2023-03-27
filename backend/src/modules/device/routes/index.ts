import { Request, Response } from 'express';
import { config } from '../../../config';
import { tenantContactValidator } from '../../tenant/validator/tenantContact';
import { DeviceController } from '../controllers/device';
import { DeviceManagerController } from '../controllers/deviceManager';
import { DeviceTypeModelController } from '../controllers/deviceTypeModel';
import {deviceModelValidator} from'../validator/device';
import {TenantController} from '../controllers/tenant';
import { SiteController } from '../controllers/site';
import { ZoneController } from '../controllers/zone';
import { UserController } from '../controllers/user';
import { ProcessController } from '../controllers/process';
import { ProductController } from '../controllers/product';
import { Validation } from '../../../core/auth';


export const deviceRoutes = ({app, logger, models}: any) =>{
      const deviceController = new DeviceController({logger, models});
      const deviceManagerController = new DeviceManagerController({logger, models});
      const deviceTypeModelController = new DeviceTypeModelController({logger, models});
      const tenantController = new TenantController({logger, models});
      const siteController = new SiteController({logger, models});
      const zoneController = new ZoneController({logger, models});
      const userController = new UserController({logger, models});
      const processController = new ProcessController({logger, models});
      const productController = new ProductController({logger, models});
      const validate = new Validation()
      
  
     
      app.get(`${config.API_PREFIX}/devices`, validate.checkValidation, (req: Request, res: Response) => {
        deviceController.readAll(req, res);
      });

      app.post(`${config.API_PREFIX}/device`, validate.checkValidation,deviceModelValidator.makeValidation('create'), (req: Request, res: Response) => {
        deviceController.create(req, res);
      });

      app.get(`${config.API_PREFIX}/device/:id`,  validate.checkValidation, (req: Request, res: Response) => {
        deviceController.readOne(req, res);
      });

      app.get(`${config.API_PREFIX}/deviceSiteZoneProcess/zone/:id`,  validate.checkValidation, (req: Request, res: Response) => {
        deviceController.readDeviceByZoneId(req, res);
      });

      app.get(`${config.API_PREFIX}/deviceSiteZoneProcess/site/:id`,  validate.checkValidation, (req: Request, res: Response) => {
        deviceController.readDeviceBySiteId(req, res);
      });

      app.patch(`${config.API_PREFIX}/deviceSiteZoneProcess/device/:id` , validate.checkValidation, (req: Request, res: Response) => {
        deviceController.updateDeviceSiteZoneProcess(req, res);
      });

      app.get(`${config.API_PREFIX}/deviceSiteZoneProcess/device/:id` , validate.checkValidation, (req: Request, res: Response) => {
        deviceController.getDeviceSiteZoneProcess(req, res);
      });

      app.get(`${config.API_PREFIX}/deviceCount`,  validate.checkValidation, (req: Request, res: Response) => {
        deviceController.deviceCount(req, res);
      });

      app.patch(`${config.API_PREFIX}/device/:id` , validate.checkValidation,deviceModelValidator.makeValidation('update'), (req: Request, res: Response) => {
        deviceController.update(req, res);
      });
      
      app.delete(`${config.API_PREFIX}/device/:id`,validate.checkValidation, (req: Request, res: Response) => {
        deviceController.delete(req, res);
      });

      app.get(`${config.API_PREFIX}/device-count/:id`,validate.checkValidation, (req: Request, res: Response) => {
        deviceController.getAllDeviceCount(req, res);
      });

    
      app.patch(`${config.API_PREFIX}/devices/assign`, validate.checkValidation, (req: Request, res: Response) => {
        deviceController.assignSiteZone(req, res);
      });

      app.patch(`${config.API_PREFIX}/devices/unassign`, validate.checkValidation, (req: Request, res: Response) => {
        deviceController.assignSiteZone(req, res);
      });

      
      app.patch(`${config.API_PREFIX}/devices/process/:processId`, validate.checkValidation, (req: Request, res: Response) => {
        deviceController.unassignDeviceViaProcessId(req, res);
      });

      app.patch(`${config.API_PREFIX}/devices/unassign-via-zoneid`, validate.checkValidation, (req: Request, res: Response) => {
        deviceController.unassignDeviceViaZoneId(req, res);
      });

      
      app.patch(`${config.API_PREFIX}/devices/unassign-via-tenantid`, validate.checkValidation, (req: Request, res: Response) => {
        deviceController.unassignDeviceViaTenantId(req, res);
      });


      app.patch(`${config.API_PREFIX}/devices/unassign-via-siteid`, validate.checkValidation, (req: Request, res: Response) => {
        deviceController.unassignDeviceViaSiteId(req, res);
      });

      

      app.patch(`${config.API_PREFIX}/device/status/:id`,  (req: Request, res: Response) => {
        deviceController.updateStatus(req, res);
      });
      

      // check running process on device
      
      app.get(`${config.API_PREFIX}/device/site/:id`, validate.checkValidation, (req: Request, res: Response) => {
         deviceController.checkRunningProcessUsingSiteId(req, res);
      });
      // check running process on device via zone id
      app.get(`${config.API_PREFIX}/device/zone/:id`, validate.checkValidation, (req: Request, res: Response) => {
        deviceController.checkRunningProcessUsingZoneId(req, res);
     });

      
      // delete device usining tenant id
      app.delete(`${config.API_PREFIX}/device/tenant/:id`, validate.checkValidation, (req: Request, res: Response) => {
        deviceController.deleteViaTenantId(req, res);
      });

      app.patch(`${config.API_PREFIX}/device/tenant/:id`, validate.checkValidation, (req: Request, res: Response) => {
        deviceController.restoreViaTenantId(req, res);
      });

       // delete device usining site id
       app.patch(`${config.API_PREFIX}/device/site/:id`, validate.checkValidation, (req: Request, res: Response) => {
        deviceController.deleteViaSiteId(req, res);
      });
      
     

      // adding routes for sync
      // for device

      app.post(`${config.API_PREFIX}/sync/devices`, (req: Request, res: Response) => {
        deviceController.syncDevice(req, res);
      });
      app.patch(`${config.API_PREFIX}/sync/device/:id`, (req: Request, res: Response) => {
        deviceController.syncDeviceUpdate(req, res);
      });
      app.post(`${config.API_PREFIX}/sync/device-delete`, (req: Request, res: Response) => {
        deviceController.syncDeviceDelete(req, res);
      });
      app.post(`${config.API_PREFIX}/sync/device-bulkdelete`, (req: Request, res: Response) => {
        deviceController.syncDeviceBulkdelete(req, res);
      });

      
      // for tenant
      app.post(`${config.API_PREFIX}/sync/tenants`, (req: Request, res: Response) => {
        tenantController.syncTenant(req, res);
      });
      app.patch(`${config.API_PREFIX}/sync/tenant/:id`, (req: Request, res: Response) => {
        tenantController.syncTenantUpdate(req, res);
      });
      app.delete(`${config.API_PREFIX}/sync/tenant/:id`, (req: Request, res: Response) => {
        tenantController.syncTenantdelete(req, res);
      });
     

      // SiteController
      app.post(`${config.API_PREFIX}/sync/sites`, (req: Request, res: Response) => {
        siteController.syncSite(req, res);
      });
      app.patch(`${config.API_PREFIX}/sync/site/:id`, (req: Request, res: Response) => {
        siteController.syncSiteUpdate(req, res);
      });
      app.post(`${config.API_PREFIX}/sync/site-delete`, (req: Request, res: Response) => {
        siteController.syncSitedelete(req, res);
      });

      app.post(`${config.API_PREFIX}/sync/site-bulkdelete`, (req: Request, res: Response) => {
        siteController.syncSiteBulkdelete(req, res);
      });


      // zone
      app.post(`${config.API_PREFIX}/sync/zone`, (req: Request, res: Response) => {
        zoneController.syncZone(req, res);
      });
      app.patch(`${config.API_PREFIX}/sync/zone/:id`, (req: Request, res: Response) => {
        zoneController.syncZoneUpdate(req, res);
      });
      app.post(`${config.API_PREFIX}/sync/zone-delete`, (req: Request, res: Response) => {
        zoneController.syncZonedelete(req, res);
      });
      app.post(`${config.API_PREFIX}/sync/zone-bulkdelete`, (req: Request, res: Response) => {
        zoneController.syncZoneBulkdelete(req, res);
      });

      // userController
      app.post(`${config.API_PREFIX}/sync/user`, (req: Request, res: Response) => {
        userController.syncUser(req, res);
      });
      app.patch(`${config.API_PREFIX}/sync/user/:id`, (req: Request, res: Response) => {
        userController.syncUserUpdate(req, res);
      });
      app.post(`${config.API_PREFIX}/sync/user-delete`, (req: Request, res: Response) => {
        userController.syncUserdelete(req, res);
      });
      app.post(`${config.API_PREFIX}/sync/user-bulkdelete`, (req: Request, res: Response) => {
        userController.syncUserulkdelete(req, res);
      });
      
      //processController
      app.post(`${config.API_PREFIX}/sync/process`, (req: Request, res: Response) => {
        processController.syncProcess(req, res);
      });
      app.patch(`${config.API_PREFIX}/sync/process/:id`, (req: Request, res: Response) => {
        processController.syncProcessUpdate(req, res);
      });
      app.post(`${config.API_PREFIX}/sync/process-delete`, (req: Request, res: Response) => {
        processController.syncProcessdelete(req, res);
      });
      app.post(`${config.API_PREFIX}/sync/process-bulkdelete`, (req: Request, res: Response) => {
        processController.syncProcessBulkdelete(req, res);
      });

      // for product controller

      app.post(`${config.API_PREFIX}/sync/product`, (req: Request, res: Response) => {
        productController.syncProduct(req, res);
      });
      app.patch(`${config.API_PREFIX}/sync/product/:id`, (req: Request, res: Response) => {
        productController.syncProductUpdate(req, res);
      });

      app.patch(`${config.API_PREFIX}/sync/product/upc/:upc`, (req: Request, res: Response) => {
        productController.syncProductUpdateByUpc(req, res);
      });
      app.delete(`${config.API_PREFIX}/sync/product/:id`, (req: Request, res: Response) => {
        productController.syncProductdelete(req, res);
      });
      app.post(`${config.API_PREFIX}/sync/product-bulk-delete`, (req: Request, res: Response) => {
        productController.syncProductBulkdelete(req, res);
      });
      
      
            

    //device Manager Routs
    
    app.get(`${config.API_PREFIX}/devicemanagers`, validate.checkValidation, (req: Request, res: Response) => {
      deviceManagerController.readAll(req, res);
    });

    app.post(`${config.API_PREFIX}/devicemanager`, validate.checkValidation,deviceModelValidator.makeValidation('deviceManagerCreate'), (req: Request, res: Response) => {
      deviceManagerController.create(req, res);
    });

    app.get(`${config.API_PREFIX}/devicemanager/:id`, validate.checkValidation,(req: Request, res: Response) => {
      deviceManagerController.readOne(req, res);
    });

    app.patch(`${config.API_PREFIX}/devicemanager/:id` , validate.checkValidation,(req: Request, res: Response) => {
      deviceManagerController.update(req, res);
    });
    
    app.delete(`${config.API_PREFIX}/devicemanager/:id`, validate.checkValidation,(req: Request, res: Response) => {
      deviceManagerController.delete(req, res);
    });

    // sync device Manager
    app.post(`${config.API_PREFIX}/sync/device-manager`, (req: Request, res: Response) => {
      deviceManagerController.syncDeviceManager(req, res);
    });
    app.patch(`${config.API_PREFIX}/sync/device-manager/:id`, (req: Request, res: Response) => {
      deviceManagerController.syncDeviceManagerUpdate(req, res);
    });
    app.delete(`${config.API_PREFIX}/sync/device-manager/:id`, (req: Request, res: Response) => {
      deviceManagerController.syncDeviceManagerDelete(req, res);
    });

    
    // device Type Model Creation 
    app.get(`${config.API_PREFIX}/device-type`, validate.checkValidation, (req: Request, res: Response) => {
      deviceTypeModelController.uniuqeType(req, res);
    });
    app.get(`${config.API_PREFIX}/device-models`, validate.checkValidation, (req: Request, res: Response) => {
      deviceTypeModelController.readAll(req, res);
    });
    app.post(`${config.API_PREFIX}/device-model`, validate.checkValidation,deviceModelValidator.makeValidation('deviceTypeModelCreate'), (req: Request, res: Response) => {
      deviceTypeModelController.create(req, res);
    });

    app.get(`${config.API_PREFIX}/device-model/:id`,validate.checkValidation, (req: Request, res: Response) => {
      deviceTypeModelController.readOne(req, res);
    });

    app.patch(`${config.API_PREFIX}/device-model/:id` , validate.checkValidation, (req: Request, res: Response) => {
      deviceTypeModelController.update(req, res);
    });
    
    app.delete(`${config.API_PREFIX}/device-model/:id`, validate.checkValidation, (req: Request, res: Response) => {
      deviceTypeModelController.delete(req, res);
    });
    
} 