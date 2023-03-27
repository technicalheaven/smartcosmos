import { Request, Response } from 'express';
import { config } from '../../../config';
import { TenantController } from '../controllers/tenant';
import { FeatureController } from '../controllers/feature';
import { TenantContactController } from '../controllers/tenantContact';
import {tenantValidator} from'../validator/tenant';
import {tenantContactValidator} from'../validator/tenantContact';
import { upload } from '../../../libs/fileUploader';
import { Validation } from '../../../core/auth';
export const tenantRoutes = ({app, logger, models}: any) =>{

      const tenantController = new TenantController({logger, models});
      const featureControllers = new FeatureController({logger, models});
      const tenantContactController = new TenantContactController({logger, models});
      const validate = new Validation()


      app.get(`${config.API_PREFIX}/tenants`, validate.checkValidation, (req: Request, res: Response) => {
        tenantController.readAll(req, res);
      });

     

      app.post(`${config.API_PREFIX}/tenant`,  validate.checkValidation,tenantValidator.makeValidation('create'),(req: Request, res: Response) => {
        tenantController.create(req, res);
      });

      app.get(`${config.API_PREFIX}/tenant/:id`, validate.checkValidation, (req: Request, res: Response) => {
        tenantController.readOne(req, res);
      });
      app.patch(`${config.API_PREFIX}/tenant/:id`, validate.checkValidation, tenantValidator.makeValidation('update'), (req: Request, res: Response) => {
        tenantController.update(req, res);
      });
      app.delete(`${config.API_PREFIX}/tenant/:id`,  validate.checkValidation,(req: Request, res: Response) => {
        tenantController.delete(req, res);
      });


      app.patch(`${config.API_PREFIX}/tenant/restore/:id`, (req: Request, res: Response) => {
        tenantController.restore(req, res);
      });


      // feature routes'
      app.get(`${config.API_PREFIX}/features`, (req: Request, res: Response) => {
        featureControllers.readAll(req, res);
      });

      app.post(`${config.API_PREFIX}/feature`, (req: Request, res: Response) => {
        featureControllers.create(req, res);
      });

      app.get(`${config.API_PREFIX}/feature/:id`, (req: Request, res: Response) => {
        featureControllers.readOne(req, res);
      });
      app.patch(`${config.API_PREFIX}/feature/:id`, (req: Request, res: Response) => {
        featureControllers.update(req, res);
      });
      app.delete(`${config.API_PREFIX}/feature/:id`, (req: Request, res: Response) => {
        featureControllers.delete(req, res);
      });

     
      app.get(`${config.API_PREFIX}/tenant-contacts`, (req: Request, res: Response) => {
        tenantContactController.readAll(req, res);
      });

      app.post(`${config.API_PREFIX}/tenant-contact`,tenantContactValidator.makeValidation('create'), (req: Request, res: Response) => {
        tenantContactController.create(req, res);
      });

      app.get(`${config.API_PREFIX}/tenant-contact/:id`, (req: Request, res: Response) => {
        tenantContactController.readOne(req, res);
      });

      app.patch(`${config.API_PREFIX}/tenant-contact/:id` ,tenantContactValidator.makeValidation('update'), (req: Request, res: Response) => {
        tenantContactController.update(req, res);
      });
      
      app.delete(`${config.API_PREFIX}/tenant-contact/:id`, (req: Request, res: Response) => {
        tenantContactController.delete(req, res);
      });

      // -------------------------- Image Uplaod---------------------------------
      app.post(`${config.API_PREFIX}/tenant-logo/:key`, upload.single('logo'),(req: Request, res: Response) => {
        tenantController.uploadImage(req, res);})
}