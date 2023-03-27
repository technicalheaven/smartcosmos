import { Request, Response } from 'express';
import { config } from '../../../config';
import { Validation } from '../../../core/auth';
import { SiteController } from '../controllers/site';
import { SiteContactController } from '../controllers/siteContact';
import {siteValidator} from'../validator/site';
import {siteContactValidator} from'../validator/siteContact';

export const siteRoutes = ({app, logger, models}: any) =>{
      const siteController = new SiteController({logger, models});
      const siteContactController = new SiteContactController({logger, models});
      const validate = new Validation()
     
  
     
      app.get(`${config.API_PREFIX}/sites`,  validate.checkValidation,(req: Request, res: Response) => {
        siteController.readAll(req, res);
      });

      app.post(`${config.API_PREFIX}/site`, validate.checkValidation, siteValidator.makeValidation('create'), (req: Request, res: Response) => {
        siteController.create(req, res);
      });

      app.get(`${config.API_PREFIX}/site/:id`, validate.checkValidation, (req: Request, res: Response) => {
        siteController.readOne(req, res);
      });

      app.get(`${config.API_PREFIX}/siteCount`, validate.checkValidation, (req: Request, res: Response) => {
        siteController.siteCount(req, res);
      });

      app.get(`${config.API_PREFIX}/tenantsite/:tenantId/:siteId`, validate.checkValidation, (req: Request, res: Response) => {
        siteController.getTenantSite(req, res);
      });

      app.patch(`${config.API_PREFIX}/site/:id` , validate.checkValidation, siteValidator.makeValidation('update'), (req: Request, res: Response) => {
        siteController.update(req, res);
      });
      
      app.delete(`${config.API_PREFIX}/site/:id`, validate.checkValidation, (req: Request, res: Response) => {
        
        siteController.delete(req, res);
      });

      app.patch(`${config.API_PREFIX}/site/status/:id`, (req: Request, res: Response) => {
        siteController.updateSiteStatus(req, res);
      });

      
      app.delete(`${config.API_PREFIX}/site/tenant/:id`, (req: Request, res: Response) => {
        siteController.deleteTenant(req, res);
      });

      app.patch(`${config.API_PREFIX}/site/device/assign`, (req: Request, res: Response) => {
        siteController.assignDevice(req, res);
      });

      app.patch(`${config.API_PREFIX}/site/device/unassign`, (req: Request, res: Response) => {
        siteController.assignDevice(req, res);
      });

      // for site contact crud

    
      app.get(`${config.API_PREFIX}/site-contacts`, (req: Request, res: Response) => {
        siteContactController.readAll(req, res);
      });

      app.post(`${config.API_PREFIX}/site-contact`,siteContactValidator.makeValidation('create'), (req: Request, res: Response) => {
        siteContactController.create(req, res);
      });

      app.get(`${config.API_PREFIX}/site-contact/:id`, (req: Request, res: Response) => {
        siteContactController.readOne(req, res);
      });

      app.patch(`${config.API_PREFIX}/site-contact/:id` ,siteContactValidator.makeValidation('update'), (req: Request, res: Response) => {
        siteContactController.update(req, res);
      });
      
      app.delete(`${config.API_PREFIX}/site-contact/:id`, (req: Request, res: Response) => {
        siteContactController.delete(req, res);
      });
     
      
} 