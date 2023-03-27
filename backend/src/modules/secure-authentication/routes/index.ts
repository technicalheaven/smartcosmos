import { Express, Request, Response } from 'express';
import ValidationController from '../controllers/ValidationController';
import { config } from '../../../config';
import { Validation } from '../../../core/auth';


export const SecureAuthRoutes = ({app, logger, models}: any) =>{
    const validationController = new ValidationController({ models,logger});
    const validate = new Validation()
     // ?num=&tagid&skey
    app.get(`${config.API_PREFIX}/secure-auth`,(req: Request, res: Response) => {
        validationController.validateTag(req, res);
        return res
    });

}
