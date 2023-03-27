//import ESClient from "../lib/elasticsearch";
//import config from "../config";


class TelemetryService {


  // constructor({ logger }) {
  //   this.logger = logger;
  //   this.elasticsearch = new ESClient({
  //     configuration: config.elasticsearch,
  //     logger: config.logger,
  //   });
  //   this.index = config.elasticsearch.index;
  // }

  // captureTelemetry = async (data = {}) => {
  //   try {
  //     const response = await this.elasticsearch.index({
  //       index: this.indexName(new Date()),
  //       type: '_doc',
  //       body: this.buildDocument(data),
  //       refresh: true,
  //     });
  //     this.logger.info({ response }, 'telemetry information was pushed to Elasticsearch');
  //   } catch (err) {
  //     // TODO: Add metric for failed telemetry pushes
  //     this.logger.warn({ err }, 'Error pushing telemetry information to Elasticsearch');
  //   }
  //   return;
  // };

  // indexName = (date = new Date()) => `${this.index}-${date.toISOString().substr(0, 10)}`;

  // buildDocument = ({ req, counterSignature, responsePayload }) => ({
  //   timestamp: new Date().toISOString(),
  //   requestParams: this.requestFields(req),
  //   counterSignature: this.counterSignatureFields(counterSignature),
  //   result: this.resultFields(responsePayload),
  //   ...this.reqMetaFields(req),
  // });

  // requestFields = req => {
  //   const { id, num, sig } = req.query;
  //   return { id, num, sig };
  // };

  // counterSignatureFields = (counterSignature = {}) => {
  //   if (Object.keys(counterSignature).length === 0) {
  //     return undefined;
  //   }
  //   const { crypto = {}, counter, isRollingCodeTag, isTamperProofTag, signature, ttMessage } = counterSignature;
  //   return { crypto: crypto.name, counter, isRollingCodeTag, isTamperProofTag, signature, ttMessage };
  // };

  // resultFields = (payload = {}) => {
  //   const { code, message, authentication = {}, tamperDetection = {} } = payload;
  //   return {
  //     code,
  //     message,
  //     validRollingCode: authentication.result,
  //     tampered: tamperDetection.tampered,
  //   };
  // };

  // reqMetaFields = req => ({
  //   ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
  //   url: req.url,
  // });
}

export default TelemetryService;
