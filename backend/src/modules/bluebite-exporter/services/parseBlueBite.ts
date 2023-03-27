import { forEach } from "lodash";
import URL from 'url';
import { uuid } from "uuidv4";
import { stripKey } from "../common/util";
import { logger } from '../../../libs/logger';


const ACTION = {
  UPDATE: 'update',
  UPSERT: 'upsert',
}; 

const OPERATOR = {
  CALLBACK: 'callback',
};

export default class BlueBiteParser{

  renderToBlueBiteFormat = (messageBody:any = {}, nfcFeatures:any) => {
    const { metadata = {}, status } = messageBody;
    const { baseTagData, baseTag }:any = this.createTagData(messageBody);
    const blueBiteMessage = {
      version: '1',
      enablement: [
        ...this.createNfcEnablementData(metadata.nfc, { baseTag, baseTagData }, nfcFeatures),
      //  ...this.createQrEnablementData(metadata.qrcode, { baseTag, baseTagData }),
      ],
    };
    return JSON.stringify(blueBiteMessage, null, 2);
  };

  createTagData = (messageBody:any) => {
    const { enablementId, status, lastOperationTimestamp, product, tenant, site, station, metadata = {} } = messageBody;
    const tagData = [
      this.actionObject('smt_enablementID', enablementId),
      this.actionObject('smt_status', status),
      this.actionObject('smt_operationTimestamp', lastOperationTimestamp),
      ...this.productActionObjects(product),
      ...this.tenantActionObjects(tenant),
      ...this.siteActionObjects(site),
      ...this.stationActionObjects(station),
      ...this.barcodeActionObjects(metadata.barcode),
      ...this.inputActionObjects(metadata.input),
    ];
    const tag:any = [];
    // product metadata
    if (messageBody.metadata && messageBody.metadata.product) {
      forEach(messageBody.metadata.product[0], (value, key) => {
        switch(stripKey(key)) {
          case 'experienceid':
            tag.push(this.actionObject('experience_id', value, ACTION.UPDATE));
            break;
          case 'experiencestudioid':
            tag.push(this.actionObject('studio_id', value, ACTION.UPDATE));
            break;
          case 'experiencetenantid':
            tag.push(this.actionObject('organization_id', value, ACTION.UPDATE));
            break;
          default:
            tagData.push(this.actionObject(`smt_product_${key}`, value));
        }
      });
    }
    return { baseTagData: tagData, baseTag: tag };
  }

  createQrEnablementData = (qrMetadata = [], { baseTag = [], baseTagData = [] }) => {
    return qrMetadata.map((qrcode:any) => ({
      id: uuid(),
      filters: [
        this.operatorObject('url', qrcode.code),
      ],
      tag: baseTag,
      tag_data: [
        ...baseTagData,
        this.actionObject('smt_metaQrcodeKey', qrcode.key),
        this.actionObject('smt_metaQrcodeCode', qrcode.code),
        this.actionObject('smt_metaQrcodeType', qrcode.type),
        this.actionObject('smt_metaQrcodeSubtype', qrcode.subtype),
      ],
    }));
  };
  
  createNfcEnablementData = (nfcMetadata = [], { baseTag = [], baseTagData = [] }, nfcFeatures:any) => {
    return nfcMetadata.map((nfc:any) => ({
       id: uuid(),
      filters: [
        this.operatorObject('url', this.normalizeUrl(nfc.url)),
      ],
      tag: [
        ...baseTag,
        this.actionObject('tag_verifier_enabled', nfcFeatures[nfc.id].tag_verifier_enabled ? '1' : '0', ACTION.UPDATE),
        this.actionObject('tamper_detection_enabled', nfcFeatures[nfc.id].tamper_detection_enabled ? '1' : '0', ACTION.UPDATE)
      ],
      tag_data: [
        ...baseTagData,
        this.actionObject('smt_metaNfcId', nfc.id),
        this.actionObject('smt_metaNfcKey', nfc.key),
      ],
    }));
  }

  normalizeUrl = (inputUrl:any) => {
    try {
      const parsedUrl:any = URL.parse(inputUrl);
      let urlPath:any = parsedUrl.pathname;
      if (urlPath.endsWith('/')) {
        parsedUrl.pathname = urlPath.slice(0, urlPath.length - 1);
      }
      return parsedUrl.format();
    } catch (err) {
      return inputUrl;
    }
  }

  actionObject = (key:any, value = '', action = ACTION.UPSERT) => ({ key, value, action });

  operatorObject = (key:any, value = '', operator = OPERATOR.CALLBACK) => ({ key, value, operator });

  productActionObjects = (product:any) => {
    return product ? [
      this.actionObject('smt_productName', product.name),
      this.actionObject('smt_productDescription', product.description),
      this.actionObject('smt_productImageUrl', product.imageUrl? product?.imageUrl: "" ),
    ] : [];
  }

  tenantActionObjects = (tenant:any) => {
    return tenant ? [
      this.actionObject('smt_tenantId', tenant.id),
      this.actionObject('smt_tenantName', tenant.name),
    ] : [];
  };
  
  siteActionObjects = (site:any) => {
    if (!site || !site.id) {
      return [];
    }
  
    const basesiteObjects = [
      this.actionObject('smt_siteId', site.id),
      this.actionObject('smt_siteName', site.name),
    ];
  
    const geolocationObjects = site.geoLocation ? [
      this.actionObject('smt_siteGeoLocationLat', site.geoLocation.lat?.toString()),
      this.actionObject('smt_siteGeoLocationLon', site.geoLocation.lon?.toString()),
    ] : [];
  
    return [
      ...basesiteObjects,
      ...geolocationObjects,
    ];
  }

  stationActionObjects = (station:any) => {
    return station ? [
      this.actionObject('smt_stationDeploymentId', station.deploymentId),
      this.actionObject('smt_stationName', station.name),
    //  this.actionObject('smt_stationDescription', station.description),
      this.actionObject('smt_stationDescription', station.description? station.description: ""),
    ] : [];
  }

  barcodeActionObjects = (barcodeMetadata = []) => {
    return barcodeMetadata.reduce((acc:any, barcode:any, index:any) => {
      return [
        ...acc,
        this.actionObject(`smt_metaBarcodeKey_${index}`, barcode.key),
        this.actionObject(`smt_metaBarcodeCode_${index}`, barcode.code),
        this.actionObject(`smt_metaBarcodeType_${index}`, barcode.type),
        this.actionObject(`smt_metaBarcodeSubtype_${index}`, barcode.subtype)
      ];
    }, []);
  }
  
  inputActionObjects = (inputMetadata = []) => {
    let inputData: [] = inputMetadata[0];
    return inputData.reduce((acc:any, input:any, index:any) => {
      return [
        ...acc,
        this.actionObject(`smt_metaInputKey_${index}`, input.key),
        this.actionObject(`smt_metaInputValue_${index}`, input.value),
      ];
    }, []);
  }

}