
import {  ValidationService } from '../services';
import { ValidationResponse } from '../models';
import { RollingCodeValidationException } from '../services/exceptions';
import { result } from 'lodash';
import { nextTick } from 'process';
var constant = require('../../../middlewares/resp-handler/constants');
import { respHndlr } from "../../../middlewares/resp-handler";


class ValidationController {
  logger:any;
  services:any;
  constructor({ models, logger }:any) {
    this.logger = logger;
    this.services = {validation: new ValidationService({ models, logger }),
      //telemetry: new TelemetryService(({ logger })),
    };
  }

  /**
   * validateTag
   *
   * This is an API call that can be used to validate a rolling code that might
   * have never been enabled on a given product.
   *
   * @param tagId
   * @returns Promise<*>
   */

  // Reuestbody localhost:8080/api/v1/secure-auth?id=04971B82286880&num=000009&sig=ED81FAAA4EBD8ECD

   
  validateTag = async (req:any, res:any) => {
    // try {
      // Send JSON when the client accepts it, otherwise send HTML by default
      const asJSON = await this.acceptsJson(req);

      // Returns as an html page or as json
      const { id, num, sig } = req.query;
      try {
        if (!id) {
          throw new RollingCodeValidationException('&lt;undefined&gt;', 'Missing id param');
        }
        const tagId = id.toUpperCase();
        // Extract the query params counter and signature being checked
        const counterSignature = await this.services.validation.extractCounterSignature(tagId, num, sig);
        this.logger.debug("Step1")
        let crypto : any = counterSignature.crypto, 
        counter: any = counterSignature.counter,
        isRollingCodeTag: any = counterSignature.isRollingCodeTag,
        isTamperProofTag :any = counterSignature.isTamperProofTag,
        signature: any = counterSignature.signature,
        ttMessage: any = counterSignature.ttMessage
        
        this.logger.debug("step 2");
        this.logger.info({ ...req.params }, `Validating Tag: Id ${tagId}, Sig: ${signature}, Rolling?: ${isRollingCodeTag ? `Yes, with ${crypto.name}` : 'No'}, Counter: ${counter}\`, Tamper Message: ${ttMessage}`);
        // Check if the tag is valid
        let { isValid, title } = await this.getValidationResult({tagId, crypto, counter, signature, ttMessage});
        this.logger.debug("step 4",isValid)
        const tampered = isTamperProofTag ? this.services.validation.isTampered(tagId, ttMessage) : null;
        const response :any= new ValidationResponse({
          tagId,
          isRollingCodeTag,
          isValid,
          isTamperProofTag,
          tampered,
          title });
        this.logger.info("Response_",response.tagId, response.isValid);
        req.responseObject = response.toResponse(asJSON);
        respHndlr.sendSuccess(res,response, constant.RESPONSE_STATUS.SUCCESS);
        // don't wait for the telemetry service to finish
       // this.services.telemetry.captureTelemetry({ req, counterSignature, responsePayload: response });
      } catch (error) {
        this.logger.error({ error }, 'Error in validation controller');
        const response = new ValidationResponse({ error });
        req.responseObject = response.toResponse(asJSON);
        respHndlr.sendError(res, error);
        // don't wait for the telemetry service to finish
        //his.services.telemetry.captureTelemetry({ req, responsePayload: response });
      }
      // next();
      // return true;
    // } catch (error) {
    //   this.logger.error(error);
    //   next(error);
    //   return Promise.reject(error)
    // }
  };

  getValidationResult = async ({tagId, crypto, counter, signature, ttMessage}:any) => {
    let isValid;
    let title;
    try {
      this.logger.debug("we are here>>");
      const validationResult = await this.services.validation.validateTag({
        tagId,
        crypto,
        counter,
        signature,
        ttMessage,
      });
      this.logger.debug("validationResult",validationResult)
      isValid = validationResult.isValid;
    } catch (errValidation:any) {
      isValid = false;
      title = errValidation.title;
    }
    return { isValid, title };
  };

  acceptsJson = (req:any) => {
    const acceptHeader = req.get('Content-Type');// 30 Jan
    return acceptHeader && acceptHeader.split(',')
      .filter((a:any) => a.startsWith('application/json') || a.startsWith('application/*'))
      .length > 0;
  };
}

export default ValidationController;
