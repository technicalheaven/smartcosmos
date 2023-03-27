import { ConnectParticipant } from 'aws-sdk';
import { parse } from 'url';
import Crypto from '../lib/crypto';
import { RollingCodeValidationException, TagNotActivatedException, TagNotFoundException } from './exceptions';
import secureAuthExternalComm from './externalCommunication';

class ValidationService {
  static HEX_RADIX = 16;
  logger:any;
  models:any;
  constructor({ models, logger}:any) {
    this.logger = logger;
    // TODO: Future support for elasticsearch integration

    //this.remotes = remotes;
    this.models = models;
  }

  /**
   * Extracts the `counter` and `signature` for a given `sig`,
   * also sends back whether the sig is represents a valid rolling code interaction
   * @param tagId
   * @param num
   * @param sig
   * @returns {{counter: any, signature: any, isRollingCodeTag: boolean}}
   */
    /* TODO: optimization
     we should consider keeping the counter and signature as Buffer and use them directly in subsequent processing
      */
  extractCounterSignature = async (tagId:any, num:any, sig:any) => {
    console.log("extractCounterSignature", tagId);
    const tagIdBytes = Buffer.from(tagId, 'hex');
    
    var arr = [];
    for (var i = 0; i < tagId.length; i++) {
           arr[i] = (tagId.charCodeAt(i).toString(16)).slice(-4);
    }
    let tagBUff = arr.join("")
    this.logger.debug("sig",sig)
    this.logger.debug("000",typeof(tagIdBytes))

    // const tagBuff = parseInt(tagId, 16)

    switch (tagIdBytes[0]) {
      case 0x04: // NXP
      // num = 0002x45
        const numItems = num.split('x');
        switch (numItems.length) {
          case 1:
            this.logger.info("1 ok",Crypto.aesCmac,num,sig)
            return {
                crypto: Crypto.aesCmac,
                counter: num,
                signature: sig,
                isRollingCodeTag: true,
                isTamperProofTag: false
            };
          case 2:
            this.logger.info("2",Crypto.aesCmac,num,sig)
            return {
              crypto: Crypto.counter,
              counter: numItems[0],
              signature: sig,
              ttMessage: numItems[1],
              isRollingCodeTag: false,
              isTamperProofTag: true
            };
          default:
            this.logger.info("3",Crypto.aesCmac,num,sig)
            return {
              crypto: null,
              counter: null,
              signature: null,
              isRollingCodeTag: false,
              isTamperProofTag: false
            };
        }
      case 0x16: // EM
      case 0x17: // SMARTRAC
        return {
          crypto: Crypto.sha1hmac,
          counter: num,
          signature: sig,
          isRollingCodeTag: true
        };
      case 0x39: // Silicon Craft SIC43NT
        const sigBytes = Buffer.from(sig, 'hex');
        switch (sigBytes.length) {
          case 8:
            return {
              crypto: Crypto.mickey,
              counter: sigBytes.slice(0, 4).toString('hex'),
              signature: sigBytes.slice(4, 8).toString('hex'),
              isRollingCodeTag: true,
              isTamperProofTag: false
            };
          case 9:
            return {
              crypto: Crypto.mickey,
              counter: sigBytes.slice(1, 5).toString('hex'),
              signature: sigBytes.slice(5, 9).toString('hex'),
              ttMessage: sigBytes.slice(0, 1).toString('hex'),
              isRollingCodeTag: true,
              isTamperProofTag: true
            };
        }
    }
    throw new TagNotFoundException(tagId);
  };

  isTampered = (tagId:any, ttMessage:any) => {
    const ttValue = parseInt(ttMessage, ValidationService.HEX_RADIX);
    if (ttValue === null || isNaN(ttValue)) {
      throw new RollingCodeValidationException(tagId, `TT Message was missing or has an invalid format.`);
    }
    return 0 !== ttValue;
  };

  /**
   * Returns a boolean indicating whether the `counter` is greater than the `lastCounter`
   * @param tagId
   * @param crypto
   * @param counter
   * @param lastCounter
   * @returns {boolean}
   */
  isValidCounter = (tagId:any, crypto:any, counter:any, lastCounter:any) => {
            
          this.logger.debug("isValidCounter",tagId, crypto, counter, lastCounter )
          try  {
            if (!crypto) {
              this.logger.error(`Unsupported crypto for tag ID ${tagId}`);
              throw new RollingCodeValidationException(tagId, 'Unsupported crypto definition.');
            }
            if (counter === null || counter.length !== crypto.cntLength) 
            {
              throw new RollingCodeValidationException(tagId, 'Counter was missing or was an invalid format.');
            }  
            else if (lastCounter === null || lastCounter.length !== crypto.cntLength) {
              throw new RollingCodeValidationException(tagId, 'Last counter was missing or was an invalid format.');
            }
            const counterHex = parseInt(counter, ValidationService.HEX_RADIX);
            const lastCounterHex = parseInt(lastCounter, ValidationService.HEX_RADIX);
            this.logger.info( counterHex, lastCounterHex );
            this.logger.debug("isValidCounter_Last",counterHex, lastCounterHex)
            return counterHex >= lastCounterHex;
            }
            catch(error:any)
            { 
              this.logger.error("Error In isValidCounter",error)
            } 
  };

  isValidSignature = (tagId:any, crypto:any, secureKey:any, counter:any, signature:any, ttMessage:any) => {
    this.logger.debug("Inside Valid Signature")
    try{
    if (!counter) {
      throw new RollingCodeValidationException(tagId, 'Counter was missing.');
    } else if (crypto.sigLength > 0 && !signature) {
      throw new RollingCodeValidationException(tagId, 'Signature was missing.');
    } else if (crypto.keyLength > 0 && !secureKey) {
      throw new RollingCodeValidationException(tagId, 'Secure key was missing.');
    }
    const counterByteArray = Buffer.from(counter, 'hex');
    const secureKeyByteArray = crypto.keyLength > 0 ? Buffer.from(secureKey, 'hex') : null;
    const signatureByteArray = crypto.sigLength > 0 ? Buffer.from(signature, 'hex') : null;
    const ttMessageByteArray = ttMessage ? Buffer.from(ttMessage, 'hex') : null;

    if (!crypto) {
      this.logger.error(`Unsupported crypto at tag ID ${tagId}`);
      throw new RollingCodeValidationException(tagId, 'Unsupported crypto definition.');
    }
    return crypto.validate(
      counterByteArray,
      Buffer.from(tagId, 'hex'),
      secureKeyByteArray,
      signatureByteArray,
      ttMessageByteArray);
    }catch(error:any)
      {
        this.logger.error("Error In isValidSignature___",error)
      }
  };

  isTagActivated = async (tid:any) => {
    const model = await secureAuthExternalComm.IsTagActivatedAsync(tid);
    if (!model) {
      throw new RollingCodeValidationException(tid, 'Tag not exist.');
    }
    return model.data.result.activated
  };

  updateTagStatus = async (tid:any, activated:any) => {
    const msg = `${activated ? 'Activating': 'Deactivating'} tag ${tid}`;;
     //  remotes.secure replaced by externalComm secureAuthExternalComm
    const tag = await secureAuthExternalComm.ActivateTagAsync(tid, activated);
    return tag.activated;
  };

  /**
   * Returns the associated tag metadata for a given `tagId`
   * @param tid
   * @returns {Promise<Model>}
   */
  tagMetadata = async (tid:any) => {
     // getting tag data via external Calling inside the project 
    // removing grpc call
    return await secureAuthExternalComm.RetrieveTagMetaDataAsync(tid);
  };

  updateLastValidCounter = async (tagId:any, newCounter:any) => { //Why we are updating
    return await secureAuthExternalComm.UpdateLastValidCounterAsync(tagId,newCounter);
  };

  redirectUrl = (tag:any) => {
    try {
      const redirect = tag.tagUrl;
      const {protocol, search, host, pathname} = parse(redirect, true, true);
      const sep = search ? '&' : '?';
      let url = redirect;
      if (!protocol) {
        url = `http://${host}${pathname}${search}`;
      }
      return `${url}${sep}id=${tag.tagId}`;
    } catch (e) {
      this.logger.error('Redirect URL is undefined');
      return null;
    }
  };

  /**
   * Returns a promise containing a boolean of whether the `tagId`, `signature`, and `counter` are valid
   * @param tagId
   * @param crypto
   * @param signature
   * @param counter
   * @param ttMessage
   * @returns {Promise<boolean>}
   */
  validateTag = async ({ tagId, crypto, signature, counter, ttMessage }:any) => {
    // Fetch the tags last counter and key information
    const tag = await this.tagMetadata(tagId);
    if (!tag) {
      throw new TagNotFoundException(tagId);
    }
    const isActive = await this.isTagActivated(tagId);
    this.logger.debug("isActiveData__1",isActive)
    if(!isActive) {
      throw new TagNotActivatedException(tagId,'Tag not activated');
    }
    const { lastValidCounter, skey: secureKey } = tag?.data?.result;
    let lastCounter = lastValidCounter;
    if (!lastCounter) {
      lastCounter = tagId.startsWith('39') ? '00000000' : '000000'
    }
    const redirect = this.redirectUrl(tag?.data?.result);
    this.logger.info( tagId, redirect, 'Fetched tag metadata');

    // Validate the counter
    const isValidCounter = this.isValidCounter(tagId, crypto, counter, lastCounter);
    if (!isValidCounter && lastCounter) {
      throw new RollingCodeValidationException(tagId, 'Invalid counter');
    }
    // Validate the signature
    const isValidSignature = this.isValidSignature(tagId, crypto, secureKey, counter, signature, ttMessage);
    if (!isValidSignature && lastCounter) {
      throw new RollingCodeValidationException(tagId, 'Invalid signature');
    }

    // Update the last valid counter for the tagId
    const updatedTag = await this.updateLastValidCounter(tagId, counter);
    return {
      isValid: isValidCounter && isValidSignature,
      redirect,
    };
  };


}

export default ValidationService;
