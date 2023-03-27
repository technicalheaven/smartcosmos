import { Express, Request, Response } from 'express';
import { ProcessController } from '../controllers/process';
import { ProcessActionController } from '../controllers/processAction';
import { config } from '../../../config';
import { processValidator } from '../validator/processValidator';
import { Validation } from '../../../core/auth';
import { WorkflowController } from '../controllers/workflow';
import { StateMachineController } from '../controllers/stateMachine';
import { NodeWFController } from '../controllers/nodeWorkflows';


export const ProcessRoutes = ({ app, logger, models }: any) => {
   
    const processController = new ProcessController({ logger, models });
    const processActionController = new ProcessActionController({ logger, models });
    const workflowController = new WorkflowController({logger, models})
    const stateMachineController = new StateMachineController({logger, models});
    const nodeWFController = new NodeWFController({logger, models})
    const validate = new Validation()

    app.get(`${config.API_PREFIX}/preDefinedProcess`, (req: Request, res: Response) => {
        processController.readPredefinedProcesses(req, res);
    });

    app.post(`${config.API_PREFIX}/preDefinedProcess`, validate.checkValidation, (req: Request, res: Response) => {
        processController.createPredefinedProcess(req, res);
    });

    app.get(`${config.API_PREFIX}/process`, validate.checkValidation, (req: Request, res: Response) => {
        processController.readAll(req, res);
    });

    app.post(`${config.API_PREFIX}/process`, validate.checkValidation, processValidator.makeValidation('create'),  (req: Request, res: Response) => {
        processController.create(req, res);
    });




    app.get(`${config.API_PREFIX}/process/:id`, validate.checkValidation, (req: Request, res: Response) => {
        processController.readOne(req, res);
    });

    app.get(`${config.API_PREFIX}/processCount`, validate.checkValidation, (req: Request, res: Response) => {
        processController.processCount(req, res);
    });

    app.get(`${config.API_PREFIX}/tenantprocess/:tenantId/:id`, validate.checkValidation, (req: Request, res: Response) => {
        processController.getTenantProcess(req, res);
    });

    app.patch(`${config.API_PREFIX}/process/:id`, validate.checkValidation, processValidator.makeValidation('update'), (req: Request, res: Response) => {
        processController.update(req, res);
    });

    app.delete(`${config.API_PREFIX}/process/:id`, validate.checkValidation, (req: Request, res: Response) => {
        processController.delete(req, res);
    });

    app.delete(`${config.API_PREFIX}/processes/site/:siteId`, (req: Request, res: Response) => {
        processController.deleteProcessBySiteId(req, res);
    });

    app.delete(`${config.API_PREFIX}/processes/zone/:zoneId`, (req: Request, res: Response) => {
        processController.deledeleteProcessByZoneId(req, res);
    });

    app.delete(`${config.API_PREFIX}/processes/tenant/:tenantId`, (req: Request, res: Response) => {
        processController.deleteProcessByTenantId(req, res);
    });

    app.patch(`${config.API_PREFIX}/processes/:id`, processValidator.makeValidation('unAssign'), (req: Request, res: Response) => {
        processController.unassignProcess(req, res);
    });

    app.get(`${config.API_PREFIX}/processActions`, (req: Request, res: Response) => {
        processActionController.readAll(req, res);
    });

    app.get(`${config.API_PREFIX}/processAction/:id`, (req: Request, res: Response) => {
        processActionController.readOne(req, res);
    });


    app.get(`${config.API_PREFIX}/workflows`, (req: Request, res: Response) => {
        workflowController.readAll(req, res);
    });

    app.get(`${config.API_PREFIX}/statemachines`, (req: Request, res: Response) => {
        stateMachineController.readAll(req, res);
    });

    app.get(`${config.API_PREFIX}/nodeworkflows`, (req: Request, res: Response) => {
        nodeWFController.readAll(req, res);
    });



}
