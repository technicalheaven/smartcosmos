import { Express, Request, Response } from 'express';
import { ZoneController } from '../controllers/zone';
import { ZoneTypeController } from '../controllers/zoneType';
import { config } from '../../../config';
import { zoneValidator } from '../validator/zoneValidator';
import { Validation } from '../../../core/auth';
export const zoneRoutes = ({app, logger, models}: any) =>{
      const zoneController = new ZoneController({logger,models});
      const zonetypeController = new ZoneTypeController({logger,models})
      const validate = new Validation()
      
      app.get(`${config.API_PREFIX}/zone`, validate.checkValidation, (req: Request, res: Response) => {
        zoneController.readAll(req, res);
      });

      app.get(`${config.API_PREFIX}/zone/:id`, validate.checkValidation, (req: Request, res: Response) => {
        zoneController.readOne(req, res);
      });

      app.post(`${config.API_PREFIX}/zone` , validate.checkValidation, zoneValidator.makeValidation('create'), (req: Request, res: Response) => {
        zoneController.create(req, res);
      });

      app.patch(`${config.API_PREFIX}/zone/:id`, validate.checkValidation, zoneValidator.makeValidation('update'), (req: Request, res: Response) => {
        zoneController.update(req, res);
      });
       
       
      app.patch(`${config.API_PREFIX}/zone/site/:siteId`, (req: Request, res: Response) => {
        zoneController.updateSiteName(req, res);
      });

      app.delete(`${config.API_PREFIX}/zone/:id`, validate.checkValidation, zoneValidator.makeValidation('delete'), (req: Request, res: Response) => {
        zoneController.delete(req, res);
      });

      app.delete(`${config.API_PREFIX}/zones/site/:siteId`,  (req: Request, res: Response) => {
        zoneController.deleteSite(req, res);
      });
      // for restore
      app.patch(`${config.API_PREFIX}/zones/site/:siteId`,  (req: Request, res: Response) => {
        zoneController.restorezoneViaSiteId(req, res);
      });

      app.delete(`${config.API_PREFIX}/zones/tenant/:tenantId`, (req: Request, res: Response) => {
        zoneController.deleteTenant(req, res);
      });
      // for restore
      app.patch(`${config.API_PREFIX}/zones/tenant/:tenantId`, (req: Request, res: Response) => {
        zoneController.restorezoneViaTenantId(req, res);
      });


      // for getting number of zone
      app.get(`${config.API_PREFIX}/zone/site/:id`, (req: Request, res: Response) => {
        zoneController.getNumberOfZone(req, res);
      });

      // for zoneType CRUD 

      app.get(`${config.API_PREFIX}/zoneTypes`, validate.checkValidation, (req: Request, res: Response) => {
        zonetypeController.readAll(req, res);
      });

      app.get(`${config.API_PREFIX}/zoneType/:id`, validate.checkValidation, (req: Request, res: Response) => {
        zonetypeController.readOne(req, res);
      });
      app.get(`${config.API_PREFIX}/zoneTypesCheck/:zoneType`,  (req: Request, res: Response) => {
        zonetypeController.readByName(req, res);
      });


      app.post(`${config.API_PREFIX}/zoneType` , (req: Request, res: Response) => {
        zonetypeController.create(req, res);
      });

      app.patch(`${config.API_PREFIX}/zoneType/:id`, (req: Request, res: Response) => {
        zonetypeController.update(req, res);
      });

      app.delete(`${config.API_PREFIX}/zoneType/:id`, (req: Request, res: Response) => {
        zonetypeController.delete(req, res);
      });
      
       
      app.post(`${config.API_PREFIX}/zone/allcheck`, (req: Request, res: Response) => {
        zoneController.combineCheckOnTenantSiteZone(req, res);
      });

}