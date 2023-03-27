import R from 'ramda';
import AuthenticationData from './authenticationData';
import TamperDetectionData from './tamperDetectionData';
import HttpStatus from 'http-status';
import errorPage from "../pages/error";
import validPage from "../pages/valid";

class ValidationResponse {
  tagId:any;
  code:any;
  title:any;
  message:any;
  isValid:any
  isRollingCodeTag:any;
  tamperDetection:any;
  authentication:any;
  constructor(state = {}) {
    const { error, tagId, isRollingCodeTag, isValid, isTamperProofTag, tampered, title }:any = state;
    this.tagId = tagId;
    this.isValid = isValid
    console.log("ValidationResponse__","error=>", error, "tagId=>",tagId, "isRollingCodeTag=>",isRollingCodeTag, 
    "isValid=>",isValid, "isTamperProofTag=>",isTamperProofTag, "tampered=>",tampered, "title=>",title);
    if (error) {
      this.code = error.code || HttpStatus.BAD_REQUEST;
      this.title = error.title || 'Invalid Tag';
      this.message = error.message || 'Invalid Tag Parameters';
      return;
    }
    /* DEPRECATED */ this.isRollingCodeTag = isRollingCodeTag;
    this.authentication = new AuthenticationData({ isRollingCodeTag, isValid });
    this.tamperDetection = new TamperDetectionData({ isTamperProofTag, tampered });
    if (this.isValid) {
      if (tampered) {
        this.code = HttpStatus.GONE;
        this.title = 'Tampered tag';
        this.message = 'Tampered tag';
      } else {
        this.code = HttpStatus.OK;
        this.title = ValidationResponse.tagType(this);
        this.message = ValidationResponse.tagType(this);
      }
    } else {
      this.code = HttpStatus.BAD_REQUEST;
      this.title = title || 'Invalid Tag';
      this.message = tagId ? `Tag ${tagId} Validation Error` : 'Invalid Tag';
    }
  }

  toResponse = (asJSON:any) => {
    return this.code === 200 ?
      ValidationResponse.successResponseObject({asJSON, ...this}) :
      ValidationResponse.errorResponseObject({asJSON, ...this});
  };

  static errorResponseObject = ({ asJSON, ...data }:any) => {
    return {
      code: data.code,
      contentType: asJSON ? 'application/json' : 'text/html',
      data: asJSON ? data : errorPage(data),
    };
  };

  static successResponseObject = ({ asJSON, ...data }:any) => {
    return {
      code: data.code,
      contentType: asJSON ? 'application/json' : 'text/html',
      data: asJSON ? data : validPage(data),
    };
  };

  static tagType = (data:any) => {
    const supportsAuth = !!R.path(['authentication', 'supported'], data);
    const supportsTamper = !!R.path(['tamperDetection', 'supported'], data);
    if (supportsAuth) {
      return supportsTamper
        ? 'Valid Smart Cosmos rolling code + tamper-proof tag'
        : 'Valid Smart Cosmos rolling code tag';
    }
    if (supportsTamper) {
      return 'Valid Smart Cosmos tamper-proof tag';
    }
    return 'Genuine Smart Cosmos tag';
  };
}

export default ValidationResponse;
