import AWS from 'aws-sdk';
import { isEmpty } from 'lodash';
import { stripKey } from '../common/util';
import {enablementStatus as STATUS, S3Config} from '../config'
import BlueBiteParser from './parseBlueBite';
import enablementData from './enablement.json';
import { logger } from '../../../libs/logger';
const SCHEME_PATTERN = 'http(?:s)?:\/\/';
const SUBDOMAIN_PATTERN = '([a-zA-Z0-9-]+\\.)*';
const DOMAIN_PATTERN = '(mtag\\.io|bb\\.io|fn\\.io)[\\/|\\?].*';
const PATTERN = `${SCHEME_PATTERN}${SUBDOMAIN_PATTERN}${DOMAIN_PATTERN}`;
const BLUE_BITE_REGEX = new RegExp(PATTERN);

const ID_PARAM_REGEX = new RegExp('([0-9A-F]){14}', 'i');
const SIG_PARAM_REGEX = new RegExp('([0-9A-F]){18}', 'i');

export  class ExportBlueBiteService {

  logger: any;
  S3Config: any;
  s3: any;
  parser : any

  constructor( S3Config : any) {
    this.logger ;
    this.S3Config = S3Config;
    AWS.config.update(this.S3Config);
    this.parser = new BlueBiteParser();
    this.s3 = new AWS.S3();
    const now = new Date();
    const msgBody = enablementData;
    const msg = '';


    // this.writeEnablementToBlueBiteS3Bucket(this.bucketName(now), msgBody, msg);
  }


  async writeEnablementToBlueBiteS3Bucket (now: any, msgBody: any, msg: any)  {
    const nfcFeatures = await this.getNfcFeatures(msgBody);
    logger.debug("nfcFeatures inside writeEnablementToBlueBiteS3Bucket", nfcFeatures)
    this.pushToS3(this.bucketName(now), msgBody, msg, nfcFeatures);
    return true;
  };

  pushToS3 = (bucket: any, msgBody: any, msg: any, nfcFeatures: any) => {
    const now = new Date()
    const nowString = now.toISOString().replace(/:/g, '-').replace(/\./g, '-');
    // const s3data = this.parser.renderToBlueBiteFormat(msgBody, nfcFeatures)
    // console.log("S3data....", s3data);
    // return;
    
    this.s3.putObject({
      Bucket: bucket,
      Key: `${msgBody.enablementId}-${nowString}.json`,
      Body: this.parser.renderToBlueBiteFormat(msgBody, nfcFeatures),
    // Body: JSON.stringify(enablementData),
    }, (err: any, data: any) => {
      if (err) {
        logger.error(`error putting enablement in S3 bucket `, err);
        throw err;
      } else {
        logger.debug(`enablement ${msgBody.enablementId} successfully pushed to S3 bucket`);        
      }
    });
  };


  // TODO update this to reflect reality when tamperProof data is available from DI
  getNfcFeatures = async (msgBody:any) => {
    if (msgBody && msgBody.metadata && msgBody.metadata.nfc) {
      try {
        let results:any = {};
        for (const nfc of msgBody.metadata.nfc) {
          const features = await this.nfcFeatureCheck(nfc);
          results[nfc.id] = features;
        }
        return results;
      } catch (err) {
        logger.error({ err, msgBody }, 'Error fetching tag metadata');
      }
    }
    return {};
  };

  nfcFeatureCheck = async (nfcMetadata:any) => {
    const noFeatureCheckPossible = {
      // tagId: nfcMetadata.tagId,
      tagId: nfcMetadata.id,
      tag_verifier_enabled: false,
      tamper_detection_enabled: false
    };
    await this.checkSkeyInDigitalIdentity(nfcMetadata.id);
    if (!nfcMetadata.url || isEmpty(nfcMetadata.url)) {
      return noFeatureCheckPossible;
    }
   // let tag_verifier_enabled = true;
   // let tamper_detection_enabled = false;
    let nfcUrl:any;
    try {
      nfcUrl = new URL(nfcMetadata.url);
    } catch (err) {
      this.logger.error({ err }, `Unparseable URL for tag ID ${nfcMetadata.id}`);
      return noFeatureCheckPossible;
    }
    switch (nfcUrl.pathname) {
      case '/ns03':
        noFeatureCheckPossible.tag_verifier_enabled = true;
        break;
      case '/ns04':
        noFeatureCheckPossible.tag_verifier_enabled = true;
        noFeatureCheckPossible.tamper_detection_enabled = true;
        break;
      case '/ns05':
        noFeatureCheckPossible.tag_verifier_enabled = true;
        break;
      case '/ns02':
        if (nfcUrl.searchParams.get('id').match(ID_PARAM_REGEX)
          && nfcUrl.searchParams.get('sig').match(SIG_PARAM_REGEX)) {
            noFeatureCheckPossible.tag_verifier_enabled = true;
            noFeatureCheckPossible.tamper_detection_enabled = true;
          break;
        }
      default:
        break;
    }
    return  noFeatureCheckPossible
    
  };


  isBlueBiteEnablement = (msg:any) => {
    const { status, metadata = {}, enablementId } = msg;

    if ([STATUS.DUPLICATE, STATUS.DE_ENABLED].includes(status)) {
      this.logger.info(`enablement ${enablementId} IS NOT Blue Bite because status is ${status}`);
      return false;
    }
    if (!metadata.product || !this.checkMetadataForExperienceTenantId(metadata.product)) {
      this.logger.info(`enablement ${enablementId} IS NOT Blue Bite because Experience Tenant ID not set`);
      return false;
    }

    if (metadata.nfc && this.checkMetadataForBlueBiteUrl(metadata.nfc, 'url')) {
      this.logger.info(`enablement ${enablementId} IS Blue Bite because nfc contains bb/mtag/fn URL`);
      return true;
    }

    if (metadata.qrcode && this.checkMetadataForBlueBiteUrl(metadata.qrcode, 'code')) {
      this.logger.info(`enablement ${enablementId} IS Blue Bite because qrCode contains bb/mtag/fn URL`);
      return true;
    }

    this.logger.info(`enablement ${enablementId} IS NOT Blue Bite by default`);
    return false;
  };

  bucketName = (date: any) => {
    const { bucketName, bucketFolder } = this.S3Config;
    const year = date.getUTCFullYear().toString();
    const month = (date.getUTCMonth() + 1).toString();
    const day = date.getUTCDate().toString();
    return `${bucketName}/${bucketFolder}/${year}/${month}/${day}`;
  };

  checkSkeyInDigitalIdentity = async (tagId:any) => {
    try {
      const digitalIdentityResult:any = {};
      if (digitalIdentityResult.skey !== 'undefined' && !isEmpty(digitalIdentityResult.skey)) {
        this.logger.error(`Tag ID ${tagId} has no skey in Digital Identity`);
      }
    } catch (err:any) {
          this.logger.error({ err }, `Error fetching metadata for tag ID ${tagId} from DI`);
          throw err;
      }
    }
  

  checkMetadataForBlueBiteUrl = (metadataArray:any, urlProperty:any) => {
    for (const metadataObject of metadataArray) {
      if (this.urlMatchesPattern(metadataObject[urlProperty])) {
        return true;
      }
    }
    return false;
  };

  checkMetadataForExperienceTenantId =(productMetadata:any) => {
      return Object.keys(productMetadata)
        .some(key => stripKey(key) === 'experiencetenantid');
  };

  urlMatchesPattern = (url:any) =>  typeof url === 'string' && BLUE_BITE_REGEX.test(url);
}
export const exportBuleBite = new ExportBlueBiteService(S3Config)
