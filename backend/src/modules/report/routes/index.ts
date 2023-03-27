import { Express, Request, Response } from 'express';
import { DashboardController } from '../controllers/dashboard';
import { config } from '../../../config';
import { Validation } from '../../../core/auth';

export const reportRoutes = ({app, logger, models}: any) =>{
      const dashboardController = new DashboardController({logger,models});
      const validate = new Validation();


      app.post(`${config.API_PREFIX}/report/tag`, validate.checkValidation, (req: Request, res: Response) => {
        dashboardController.createReportTag(req, res);
      });

      app.post(`${config.API_PREFIX}/report/enablement`, validate.checkValidation, (req: Request, res: Response) => {
        dashboardController.createReportEnablement(req, res);
      });

      // dashboard report
      app.get(`${config.API_PREFIX}/report/dashboard`, validate.checkValidation, (req: Request, res: Response) => {
        dashboardController.getReportDashboard(req, res);
      });


      // dashboard header report
      app.post(`${config.API_PREFIX}/report/dashboardHeader`, validate.checkValidation, (req: Request, res: Response) => {
        dashboardController.createHeaderReport(req, res);
      });

     // delete dashboard tag and enablement count if tenant delete
     app.delete(`${config.API_PREFIX}/report/dashboard/tenant/:id`,  validate.checkValidation,(req: Request, res: Response) => {
      dashboardController.deleteTagData(req, res);
    });

    }