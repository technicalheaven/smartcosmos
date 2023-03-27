import { Request, Response } from "express";
import { Exception } from "../../../middlewares/resp-handler";
import constants from "../../../middlewares/resp-handler/constants";
import DigitizedTag from "../models/digitizedTag";
import DuplicateDigitizedTag from "../models/duplicateDigitizedTag";
import ProcessWorkFlowSchema from "../../process/models/processWorkflow";
import Tag from "../models/tags";
import Batch from "../models/batch";
import { tagAlreadyExist, tagDeleted, tagNotFound, BatchNotFound, tagUploadSuccessfully, TRACKNTRACE, DIGITIZATION, FullCount, TransferASN, RecievedASN, RecievedBlind, BulkInsertLimit, processAlreadyRunningInZone, processStateNotFount, encodeMaxCount } from "../utils/constant";
import { sequelize } from "../../../config/db";
import TnTData from "../models/TnTData";
var constant = require('../../../middlewares/resp-handler/constants');
import { ExternalCommInstance } from "./externalComm";
import { findDuplicates, isJsonString } from "../../../helpers";
import { BlobServiceClient } from "@azure/storage-blob";
import { logger } from '../../../libs/logger';
import path = require("path");
import { orderBy } from "lodash";
import { CreatedAt } from "sequelize-typescript";
import Container from "../models/container";
import { threadId } from "worker_threads";
import axios from "axios";
import { Logger } from "@azure/msal-node";
import ProcessState from "../models/processState";
import { exportBuleBite } from "../../bluebite-exporter/services/exportBlueBite";
var fs = require("fs");
const uuid = require('uuid')
var json2xls = require('json2xls')
const { parse } = require('json2csv');
const mapping = require('./mapping/secureTag.mapping');
const ensureUri = require('../utils/ndefDecoder');
import { markerCodeMaxCount, addInputMaxCount } from '../utils/constant';
var moment = require("moment-timezone");

const {
    ObjectEvent,
    cbv,
    setup,
    EPCISDocument,
    capture,
    BizTransactionElement,
} = require('epcis2.js');

// you can override the global parameter with the setup function
setup({
    apiUrl: 'https://api.evrythng.io/v2/epcis/',
    EPCISDocumentContext: 'https://ref.gs1.org/standards/epcis/2.0.0/epcis-context.jsonld',
    EPCISDocumentSchemaVersion: '2.0',
    headers: {
        'content-type': 'application/json',
        authorization: 'iqRMRVsxQKxYHMLEGhaQJktfix9LBJkrkLxZGkFNubxspCZmnPHdfvyrtLoZt6sbBVbBqRaoizfsadgg',
    },
});

const storage: any = process.env.AZURE_TAG_STORAGE_CONNECTION_STRING
let ExportChunkValue01:any=process.env.EXPORTCHUNKSLIMIT
const ExportChunkValue=parseInt(ExportChunkValue01);
export class TagService {
    async readAll(req: Request) {
        try {
            let query: any = this.paginatorMongo(req.query)
            let { tenantId, batchId, status, search, tagId, type, manufacturers, value, sortBy, sortOrder } = req.query
            let whereObj: any = {}

            if (tenantId) whereObj.tenantId = tenantId
            if (batchId) whereObj.batchId = batchId
            if (status) whereObj.status = status
            if (tagId) whereObj.tagId = tagId

            if (value) whereObj.tagId = { '$regex': `${value}`, '$options': 'i' }
            if (manufacturers) whereObj.manufacturerName = manufacturers
            if (type) whereObj.tagType = type
            if (search) {
                whereObj.manufacturerName = /search/i
            }


            if (undefined == sortBy) { sortBy = 'manufacturerName' }
            if (undefined == sortOrder) { sortOrder = 'ASC' }

            let field: any = sortBy;
            let sortingOrder: number = 1;
            if (sortOrder == 'DESC') {
                sortingOrder = -1;
            }
            else if (sortOrder == 'ASC') {
                sortingOrder = 1
            }

            let tags = await Tag.find(whereObj)
                .sort({ [field]: sortingOrder == 1 ? 1 : -1 })
                .skip(query.offset).limit(query.limit)

            let filteredCount = await Tag.countDocuments(whereObj)

            let response: any =
            {
                count: filteredCount,
                data: tags,
            }

            return Promise.resolve(response)

        } catch (error: any) {
            logger.info("Error in ReadAll function in tags")
            return Promise.reject(error.message)
        }
    }

    async readById(req: Request) {
        try {
            let { tagId } = req.params
            let tagExist = await Tag.findOne({ tagId: tagId })
            if (!tagExist) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound + tagId)
            }
            return Promise.resolve(tagExist)
        } catch (error: any) {
            return Promise.reject(error.message)
        }
    }
    // return tag batch histrory 
    async readBatchByTenantId(req: Request) {
        try {
            let { tenantId } = req.params;
            let { userId } = req.query;
            let query = this.paginatorMongo(req.query);
            let tagExist: any = await Batch.find({ tenantId: tenantId, userId: userId }).skip(query.offset).limit(query.limit)
            if (tagExist.length <= 0) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, BatchNotFound)
            }
            let filteredCount = await Batch.countDocuments({ tenantId: tenantId, userId: userId })
            let response: any =
            {
                count: filteredCount,
                data: tagExist,
            }

            return Promise.resolve(response)
        } catch (error: any) {
            return Promise.reject(error.message)
        }
    }

    // get distinct tag type
    async readDistinctTagType(req: Request) {

        try {
            let tagExist: any;

            let { tenantId, type, tagType } = req.query
            if ((type === 'tagType' || type === 'manufacturerName') && tagType === undefined) {
                tagExist = await Tag.distinct(type, { tenantId: tenantId });
            }
            else if ((type === 'tagType' || type === 'manufacturerName') && tagType !== undefined) {
                tagExist = await Tag.distinct('manufacturerName', { tenantId: tenantId, tagType: tagType });
            }


            return Promise.resolve(tagExist)
        }
        catch (error: any) {
            return Promise.reject(error.message)
        }

    }

    async readAllDigitized(req: Request) {
        try {
            let query = this.paginatorMongo(req.query)
            let { tenantId, deviceId, processId, productId, siteId, zoneId, status, createdAt, activationTimestamp, code } = req.query
            let whereObj: any = {}

            if (tenantId) whereObj.tenantId = tenantId
            if (deviceId) whereObj.deviceId = deviceId
            if (processId) whereObj.processId = processId
            if (productId) whereObj.projectId = productId
            if (siteId) whereObj.siteId = siteId
            if (zoneId) whereObj.zoneId = zoneId
            if (status) whereObj.status = status
            if (createdAt) whereObj.createdAt = createdAt
            if (activationTimestamp) whereObj.createdAt = activationTimestamp
            if (code) whereObj.additionalData[0].code = code

            let digitizedTags = await DigitizedTag.find(whereObj).skip(query.offset).limit(query.limit)

            let filteredCount = await DigitizedTag.countDocuments(whereObj)
            let response: any =
            {
                count: filteredCount,
                data: digitizedTags,
            }

            return Promise.resolve(response)
        } catch (error: any) {
            return Promise.reject(error.message)
        }
    }

    async readByIdDigitized(req: Request) {
        try {
            let { diId } = req.params
            let digitizedTagExist = await DigitizedTag.findOne({ diId: diId })
            if (!digitizedTagExist) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound + diId)
            }
            return Promise.resolve(digitizedTagExist)
        } catch (error: any) {
            return Promise.reject(error.message)
        }
    }

    async readByIdCheckDigitizedTag(req: Request) {
        try {
            let { diId } = req.params
            let digitizedTagExist = await DigitizedTag.findOne({ diId: diId })

            let responseData: any = {};
            if (!digitizedTagExist) {

                responseData.status = "Tag not found";
            }

            if (digitizedTagExist?.status == 'enabled') {
                responseData.status = "Enabled";
            }
            else if (digitizedTagExist?.status == 'de-enabled') {
                responseData.status = "De-enabled";
            }

            return Promise.resolve(responseData);
        } catch (error: any) {
            return Promise.reject(error.message)
        }
    }

    // read all track and trace data
    async readAllTrackNTrace(req: Request) {
        try {
            let query = this.paginatorMongo(req.query)
            let { tenantId, deviceId, processId, productId, siteId, zoneId, status, diId, code } = req.query
            let whereObj: any = {}

            if (tenantId) whereObj.tenantId = tenantId
            if (deviceId) whereObj.deviceId = deviceId
            if (processId) whereObj.processId = processId
            if (productId) whereObj.projectId = productId
            if (siteId) whereObj.siteId = siteId
            if (zoneId) whereObj.zoneId = zoneId
            if (status) whereObj.status = status
            if (diId) whereObj.diId = diId
            if (code) whereObj.additionalData[0].code = code

            let trackNTraceTags = await TnTData.find(whereObj).skip(query.offset).limit(query.limit)

            let filteredCount = await TnTData.countDocuments(whereObj)
            let response: any =
            {
                count: filteredCount,
                data: trackNTraceTags,
            }

            return Promise.resolve(response)
        } catch (error: any) {
            return Promise.reject(error.message)
        }
    }
    // read track and trace data via tag ID
    async readByIdTrackNTrace(req: Request) {
        try {
            let { diId } = req.params
            let trackNTraceTagExist = await TnTData.find({ diId: diId })
            if (trackNTraceTagExist.length <= 0) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound + diId)
            }
            return Promise.resolve(trackNTraceTagExist)
        } catch (error: any) {
            return Promise.reject(error.message)
        }
    }
    // read all DuplicateDigitizedTag by 
    async readAllDuplicateDigitizedTag(req: Request) {
        try {
            let query = this.paginatorMongo(req.query)
            let { tenantId, deviceId, processId, productId, siteId, zoneId, status, createdAt, activationTimestamp } = req.query
            let whereObj: any = {}

            if (tenantId) whereObj.tenantId = tenantId
            if (deviceId) whereObj.deviceId = deviceId
            if (processId) whereObj.processId = processId
            if (productId) whereObj.projectId = productId
            if (siteId) whereObj.siteId = siteId
            if (zoneId) whereObj.zoneId = zoneId
            if (status) whereObj.status = status
            if (createdAt) whereObj.createdAt = createdAt
            if (activationTimestamp) whereObj.createdAt = activationTimestamp

            let DuplicateDigitizedData = await DuplicateDigitizedTag.find(whereObj).skip(query.offset).limit(query.limit)

            let filteredCount = await DuplicateDigitizedTag.countDocuments(whereObj)
            let response: any =
            {
                count: filteredCount,
                data: DuplicateDigitizedData,
            }

            return Promise.resolve(response)
        } catch (error: any) {
            return Promise.reject(error.message)
        }
    }

    // read DuplicateDigitized tag by id
    async readByIdDuplicateDigitized(req: Request) {
        try {
            let { diId } = req.params;
            let DuplicateDigitizedTagExist = await DuplicateDigitizedTag.findOne({ diId: diId })
            if (!DuplicateDigitizedTagExist) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound + diId)
            }
            return Promise.resolve(DuplicateDigitizedTagExist)
        } catch (error: any) {
            return Promise.reject(error.message)
        }
    }

    // common read
    async commonDuplicateDigitizedRead(req: Request) {
        try {
            const startTime = new Date().getTime();
            logger.debug("Start commonDuplicateDigitizedRead Start Time", startTime)
            let query = this.paginatorMongo(req.query)
            let { status, type, field, value, tenantId, processId, from, to }: any = req.query
            let whereObj: any = {}
            let whereObj2: any = {}
            let whereObj3: any = {}
            let whereObj4: any = {}
            let data: any;

            if (field != undefined && value !== undefined) whereObj[`${field}`] = { '$regex': `${value}`, '$options': 'i' }
            if (field != undefined && value !== undefined) whereObj2[`${field}`] = { '$regex': `${value}`, '$options': 'i' }
            if (field != undefined && value !== undefined) whereObj3[`${field}`] = { '$regex': `${value}`, '$options': 'i' }
            if (field != undefined && value !== undefined) whereObj4[`${field}`] = { '$regex': `${value}`, '$options': 'i' }

            whereObj2.status = 'enabled';
            whereObj3.status = 'de-enabled';
            if (tenantId) {
                whereObj.tenantId = tenantId;
                whereObj2.tenantId = tenantId;
                whereObj3.tenantId = tenantId;
                whereObj4.tenantId = tenantId;

            }
            if (processId) {
                whereObj.processId = processId;
                whereObj2.processId = processId;
                whereObj3.processId = processId;
                whereObj4.processId = processId;
            }


            if (to != undefined) {


                to = new Date(to);
                to.setUTCHours(23, 59, 59, 999)
                if (from != undefined && from !== to) {
                    from = new Date(from);
                    whereObj.createdAt = { $gte: from, $lte: to }
                    whereObj2.createdAt = { $gte: from, $lte: to }
                    whereObj3.createdAt = { $gte: from, $lte: to }
                    whereObj4.createdAt = { $gte: from, $lte: to }
                } else {
                    whereObj.createdAt = { $gte: to }
                    whereObj2.createdAt = { $gte: to }
                    whereObj3.createdAt = { $gte: to }
                    whereObj4.createdAt = { $gte: to }
                }
            }

            let filteredCount
            let totalFetchedDocument
            const est: any = new Date().getTime();
            let totalEnabledCount = await DigitizedTag.countDocuments(whereObj2);
            logger.debug('Time elapsed in count total enabled tag', new Date().getTime() - est);
            const dst: any = new Date().getTime();
            let digitizedCountDeEnabled = await DigitizedTag.countDocuments(whereObj3);
            logger.debug('Time elapsed in count total de-enabled tag', new Date().getTime() - dst);
            const dupst: any = new Date().getTime();
            let duplicateData = await DuplicateDigitizedTag.countDocuments(whereObj4);
            logger.debug('Time elapsed in count total duplicate tag', new Date().getTime() - dupst);

            if (type === 'enabled' || type === 'ENABLED') {
                whereObj.status = 'enabled'

                //totalFetchedDocument = await DigitizedTag.countDocuments(whereObj);
                totalFetchedDocument = totalEnabledCount;
                const fest: any = new Date().getTime();
                data = await DigitizedTag.find(whereObj).skip(query.offset).sort({ 'createdAt': -1 }).limit(query.limit);
                logger.debug('Time elapsed in fetching total enabled tag', new Date().getTime() - fest);

                if (!data) {
                    throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound)
                }
            }
            if (type === 'de-enabled') {
                whereObj.status = 'de-enabled'

                // filteredCount = await DigitizedTag.countDocuments(whereObj4);
                totalFetchedDocument = digitizedCountDeEnabled;
                const defest = new Date().getTime();
                data = await DigitizedTag.find(whereObj).skip(query.offset).sort({ 'createdAt': -1 }).limit(query.limit);
                logger.debug('Time elapsed in fetching total de-enabled tag', new Date().getTime() - defest);


                if (!data) {
                    throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound)
                }
            }
            if (type === 'duplicate') {

                // filteredCount = await DuplicateDigitizedTag.countDocuments(whereObj);
                totalFetchedDocument = duplicateData
                const dupfest = new Date().getTime();
                data = await DuplicateDigitizedTag.find(whereObj).skip(query.offset).sort({ 'createdAt': -1 }).limit(query.limit)
                logger.debug('Time elapsed in fetching total duplicate tag', new Date().getTime() - dupfest);

                if (!data) {
                    throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound)
                }

            }

            data = await this.formatDIData(data);

            let totalCount: any =
            {
                enabled: totalEnabledCount,
                deEnabled: digitizedCountDeEnabled,
                duplicate: duplicateData
            }

            let response: any =
            {
                totalCount: totalCount,
                count: totalFetchedDocument,
                data: data,
            }
            logger.debug("End commonDuplicateDigitizedRead End Time", new Date().getTime() - startTime)
            return Promise.resolve(response)
        } catch (error: any) {
            logger.info("Error in getting digitized data")
            return Promise.reject(error.message)
        }
    }



    async create(req: Request) {
        try {
            let { tagId } = req.body
            let tagExist = await Tag.findOne({ tagId: tagId })
            if (tagExist) {
                throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, tagAlreadyExist + tagId)
            }

            let tag = await Tag.create(req.body)
            return Promise.resolve(tag)
        } catch (error: any) {
            return Promise.reject(error.message)
        }
    }

    async bulkUploadTags(req: Request, xlsxData: any) {
        const t = await sequelize.transaction();
        const { tenantId, userId, filename, tenantName, userName, S3fileLink } = req.body;

        try {
            logger.info("bulkUploadTags=>")
            let secureKeyCount: any = 0
            let standardKeyCount: any = 0
            // checking tenant exist or not
            await ExternalCommInstance.getTenantById(tenantId);
            await ExternalCommInstance.getUserById(userId);
            // checking uploaded file length


            let historyReferenceId = uuid.v4();
            if (!xlsxData.length) { throw "Data not available in uploaded file."; }
            else {

                let batchId_;
                let tagsData: any = [], total = 0;
                tagsData = xlsxData.filter((obj: any) => obj['manufacturerName'] !== undefined || obj['customerName'] !== undefined || obj['batchId'] !== undefined || obj['tagId'] !== undefined || obj['tagInfo'] !== undefined || obj['tagType'] !== undefined || obj['tagClass'] !== undefined || obj['hash'] !== undefined || obj['secureKey'] !== undefined || obj['inlayItemName'] !== undefined || obj['inlayType'] !== undefined || obj['vendorName'] !== undefined || obj['orderId'] !== undefined || obj['orderDate'] !== undefined || obj['orderQuantity'] !== undefined || obj['orderQuantityUnit'] !== undefined || obj['deliveryDate'] !== undefined || obj['deliveryItemName'] !== undefined || obj['deliveryQuantity'] !== undefined || obj['deliveryQuantityUnit'] !== undefined).map(({
                    manufacturerName = "",
                    customerName = "",
                    batchId = "",
                    tagId = "",
                    tagInfo = "",
                    tagType = "",
                    tagClass = "",
                    hash = "",
                    secureKey = "",
                    inlayItemName = "",
                    inlayType = "",
                    vendorName = "",
                    orderId = "",
                    orderDate = "",
                    orderQuantity = "",
                    orderQuantityUnit = "",
                    deliveryDate = "",
                    deliveryItemName = "",
                    deliveryQuantity = "",
                    deliveryQuantityUnit = "",
                    operationTime = ""
                }: any) => ({
                    tenantId,
                    tenantName,
                    userId,
                    userName,
                    manufacturerName,
                    customerName,
                    fileName: filename,
                    //fileName: S3fileLink,
                    batchId,
                    tagId,
                    tagInfo,
                    tagType,
                    tagClass,
                    hash,
                    secureKey,
                    inlayItemName,
                    inlayType,
                    vendorName,
                    orderId,
                    orderDate,
                    orderQuantity,
                    orderQuantityUnit,
                    deliveryDate,
                    deliveryItemName,
                    deliveryQuantity,
                    deliveryQuantityUnit,
                    historyReferenceId,
                    status: 'Inactive',
                    isActivated: false,
                    operationTime: new Date(),
                    lastValidCounter: '000000'
                }));

                let validationData: any = [];
                let duplicateData: any = [];
                let addedData: any = [];
                let totalCount = tagsData.length

                for (var i = 0; i < tagsData.length; i++) {
                    let obj = tagsData[i];
                    if (obj.manufacturerName === undefined || obj.tagId === undefined || obj.tagId === "" || obj.batchId === undefined || obj.secureKey === undefined || obj.deliveryDate === undefined || obj.deliveryQuantity === undefined || obj.deliveryQuantityUnit === undefined) {

                        let validationDataMessage: any =
                        {
                            tagId: obj.tagId,
                            message: 'Validation error incomplete information at ' + obj.tagId
                        }
                        validationData.push(validationDataMessage);
                    }
                }
                logger.info("tagsData Count", tagsData.length)

                let localCounter = 0
                let localCounter2 = 0
                let bulkInsertArray = [];
                let dataForInsert = [];
                for (var i = 0; i < tagsData.length; i++) {

                    let obj = tagsData[i];
                    let errorCheck = 0;
                    const { tagId, secureKey, batchId } = obj;
                    batchId_ = batchId;
                    let tagExist = await Tag.findOne({ tagId: tagId })
                    if (tagExist) {
                        let duplicateDataMessage: any =
                        {
                            tagId: tagId,
                            message: 'Duplicate tag at tagId: ' + tagId
                        }
                        errorCheck++;
                        duplicateData.push(duplicateDataMessage);
                    }
                    // checking duplicate secure key
                    let tagDuplicateExist;
                    if (secureKey !== '' || secureKey !== undefined) {
                        tagDuplicateExist = await Tag.findOne({ $and: [{ secureKey: secureKey }, { tagId: { $ne: tagId } }] });
                        if (tagDuplicateExist) {
                            let duplicateDataMessage: any =
                            {
                                tagId: tagId,
                                message: 'Duplicate secureKey at tagId: ' + tagId + ' and secureKey: ' + secureKey
                            }
                            if (errorCheck === 0) {
                                duplicateData.push(duplicateDataMessage);
                            }
                        }
                    }
                    if (!tagExist && !tagDuplicateExist) {

                        if ((obj.secureKey) != null && (obj.secureKey) != '') {
                            secureKeyCount = secureKeyCount + 1
                        }

                        else {
                            standardKeyCount = standardKeyCount + 1
                        }
                        if (obj.tagId != "" && obj.tagId != null) {
                            let validData: any =
                            {
                                tagId: tagId,
                                message: 'Tag added to the database'
                            }
                            dataForInsert.push(obj);
                            addedData.push(validData);
                        }

                    }

                }
                // tag insertion
                for (let j = 0; j < dataForInsert.length; j++) {
                    let obj = dataForInsert[j];
                    // for bulk insert
                    bulkInsertArray.push(obj);
                    localCounter++;
                    localCounter2++;
                    // 1 500 11
                    if (localCounter === BulkInsertLimit && dataForInsert.length >= BulkInsertLimit) {
                        Tag.insertMany(bulkInsertArray, function (error: any, docs: any) {
                            if (error) {
                                logger.error("Error in insertion", error.message)
                            }
                        });
                        localCounter = 0;
                        bulkInsertArray = [];
                    }
                    else if (localCounter < BulkInsertLimit && dataForInsert.length > BulkInsertLimit && localCounter2 == dataForInsert.length) {
                        Tag.insertMany(bulkInsertArray, function (error: any, docs: any) {
                            if (error) {
                                logger.error("Error in insertion", error.message)
                            }
                        });
                        localCounter = 0;
                        bulkInsertArray = [];
                    }
                    else if (dataForInsert.length < BulkInsertLimit && localCounter2 == dataForInsert.length) {
                        Tag.insertMany(bulkInsertArray, function (error: any, docs: any) {

                            if (error) {
                                logger.error("Error in insertion", error.message)
                            }
                        });
                        localCounter = 0;
                        bulkInsertArray = [];
                    }

                }




                logger.info("after inserting the tags")
                //historyReferenceId,
                //validationData
                // batchId_



                let errorCount = totalCount - addedData.length;
                let uploadCount = addedData.length;


                let invalidDataArr = [...validationData, ...duplicateData];
                let S3InvalidTagDataLink = await this.writeInvalidTagsCSV(invalidDataArr, batchId_, tenantId, tenantName);
                logger.info("after creating invalid tags file")
                let batchInertData: any =
                {
                    historyReferenceId: historyReferenceId,
                    tenantId: tenantId,
                    tenantName: tenantName,
                    userId: userId,
                    userName: userName,
                    batchId: batchId_,
                    uploadCount: uploadCount,
                    errorCount: errorCount,

                    fileName: filename,
                    //fileName:   S3fileLink,
                    fileLink: S3fileLink,
                    errorReportLink: S3InvalidTagDataLink,
                    status: 'Active',
                    operationTime: new Date()
                }
                // insert data into batch database
                await Batch.create(batchInertData)
                logger.info("after batch writing")

                let counts = {
                    secure: secureKeyCount,
                    standard: standardKeyCount
                }

                let tagReportCreation = await ExternalCommInstance.creatingReportTag(tenantId, counts)
                logger.info("after creatingReportTag report external comm")
                // let invalidDataArr = [...validationData, ...duplicateData];
                // let S3InvalidTagDataLink = await this.writeInvalidTagsCSV(invalidDataArr, batchId_, tenantId, tenantName);

                let response: any =
                {
                    validationData: validationData,
                    duplicateData: duplicateData,
                    addedData: addedData,
                    message: 'Data uploaded successfully',
                    errorReportLink: S3InvalidTagDataLink,
                    uploadFile: S3fileLink

                }
                //  const options = { ordered: true };
                //await Tag.insertMany(tagsData, options);
                logger.info("before final response")
                return Promise.resolve(response);
            }
        }
        catch (error: any) {
            logger.info("Error in upload tag files ", error)
            return Promise.reject(error.message);
        }
    }



    async digitize(req: Request) {
        logger.debug("Req body Inside digitize function ", req.body)
        try {
            let body = req.body;
            let { diId, productUPC } = body
            let digitizedTag: any;

            let tenantId = body.tenantId
            let siteId = body.siteId
            let processId = body.processId
            let beforeStatus = ""
            let status = "enabled"
            let digitedNFC
            let addtionalDataFormat = body.additionalData
            body.additionalData = addtionalDataFormat

            if (!body?.status) {
                body.status = "enabled";
            }
            let duplicateDigitizedTag: any;
            let digitizedTagExist = await DigitizedTag.findOne({ diId: diId, status: 'enabled' })
            if (digitizedTagExist) {
                logger.info("creating duplicate tags tagId", diId)

                let duplicateExist = await DuplicateDigitizedTag.find({ diId: diId });
                if (duplicateExist.length > 0) {
                    for (let duplicateData of duplicateExist) {
                        let filter = { _id: duplicateData._id };
                        duplicateDigitizedTag = await DuplicateDigitizedTag.updateOne(filter, { $set: { updatedAt: new Date() } });
                    }
                } else {
                    duplicateDigitizedTag = await DuplicateDigitizedTag.create(body);
                }

                duplicateDigitizedTag["duplicate"] = true;
                return Promise.resolve(duplicateDigitizedTag)
            } else {
                logger.info("Creating Digitize Tag... for tag Id", diId)
                digitizedTag = await DigitizedTag.create(body);
                let deEnableTagExist = await DigitizedTag.findOne({ diId: diId, status: 'de-enabled' })

                await this.trackNTrace(req);
                let tagExist = await Tag.findOne({ tagId: diId })
                if (tagExist) {
                    await Tag.updateOne({ tagId: diId }, { $set: { status: 'active', isActivated: true } })
                }

                if (deEnableTagExist) {
                    await DigitizedTag.findOneAndDelete({ diId: diId, status: 'de-enabled' });
                    if (tagExist) {
                        await ExternalCommInstance.creatingReportEnablement(tenantId, siteId, processId, productUPC, 'de-enabled', status, 'secure');
                    }
                    if (!tagExist) {
                        await ExternalCommInstance.creatingReportEnablement(tenantId, siteId, processId, productUPC, 'de-enabled', status, 'unsecure');
                    }

                }
                if (!deEnableTagExist) {
                    if (tagExist) {
                        let enablmentReportCreation = await ExternalCommInstance.creatingReportEnablement(tenantId, siteId, processId, productUPC, beforeStatus, status, 'secure');
                    }
                    if (!tagExist) {
                        let enablmentReportCreation = await ExternalCommInstance.creatingReportEnablement(tenantId, siteId, processId, productUPC, beforeStatus, status, 'unsecure');
                    }

                }
                // let enablmentReportCreation = await ExternalCommInstance.creatingReportEnablement(tenantId, siteId, processId, productUPC, beforeStatus, status)
                digitedNFC = await this.createBlueBiteEnablement(digitizedTag._id);
                const now = new Date();
                await exportBuleBite.writeEnablementToBlueBiteS3Bucket(now, digitedNFC, "message") // when new enablement done blue bite will be called
            }


            return Promise.resolve(digitizedTag);
        } catch (error: any) {
            return Promise.reject(error.message)
        }
    }

    async commonDataProcessing(req: Request) {
        // logger.debug("Req body data inside commonDataProcessing....>>>", req.body)
        // data: {
        //     tenantId:'',
        //     processId:'',
        //     processType:'',
        //     processTypeName
        //     siteId:'',
        //     zoneId:'',
        //     userId:'',
        //     deviceId:'',
        //     timestamp:'',
        //     tagInfo:[{
        //                  tagId:'',            
        //                  tagType:'',            
        //                  tagUrl:'',            
        //                  epc:'',            
        //                  upc:'',            
        //                  addInput:'',            
        //                  productId:'',          
        //                  association:[{
        //                                       code:'',
        //                                       type:'',

        //                              }],
        //                  encode:{
        //   url:'',
        //    companyPreFix:'',
        //    itemReference:''
        //                          }

        //                  }],
        //       processData:{
        //                     count:'',
        //                     chunkIdentifier:'',
        //                     finalChunk:'',
        //                     fileUrl:''
        //                   },          
        //     } 
        try {
            let readData = req.body;
            let processTypeName;
            let processName: any
            let userName: any
            let deviceName: any
            let processExit: any
            // getting process Type from process management
            if (readData?.data?.processType != '') {
                // calling external comm
                // processExit = await ExternalCommInstance.getFeatureNameById(readData?.data?.processType);
                processName = await ExternalCommInstance.getProcessNameById(readData?.data?.processId)

                // if (processExit) {
                //     processTypeName = processExit?.data?.result[0]?.name;
                // }


                processTypeName = processName?.data?.result?.processTypeName

            }
            let processAction = processName?.data?.result?.name

            //getting username
            if (readData?.data?.userId != '') {
                let userNameData: any = await ExternalCommInstance.getUserById(readData?.data?.userId)
                userName = userNameData?.data?.result?.name;

            }
            //getting username
            if (readData?.data?.deviceId != '') {
                let deviceNameData: any = await ExternalCommInstance.getDeviceById(readData?.data?.deviceId)

                deviceName = deviceNameData?.data?.result[0]?.name;

            }
            // getting siteName and Zone Name  
            let zoneTypeData = await ExternalCommInstance.getZoneById(readData.data.zoneId);
            let zoneName = zoneTypeData?.data?.result?.name;

            let siteData = await ExternalCommInstance.getSiteById(readData.data.siteId)

            let siteName = siteData?.data?.result[0]?.name

            // for track and trace
            if (processTypeName == TRACKNTRACE) {
                let finalchunk: any
                let chunkIdentifier: any
                let tntData: any =
                {
                    body:
                    {
                        tenantId: readData.data.tenantId,
                        processId: readData.data.processId,
                        processType: processTypeName,
                        siteId: readData.data.siteId,
                        siteName: siteName,
                        zoneId: readData.data.zoneId,
                        zoneName: zoneName,
                        userId: readData.data.userId,
                        userName: userName,
                        deviceId: readData.data.deviceId,
                        deviceName: deviceName,
                        action: processAction,

                    }
                }
                // adding Tag Details like

                if ((readData.data.tagInfo).length > 0) {

                    for (let i = 0; i < (readData.data.tagInfo).length; i++) {

                        tntData.body.timestamp = readData.data.tagInfo[i].timeStamp;
                        tntData.body.diId = readData.data.tagInfo[i].tagId;
                        tntData.body.diInfo = readData.data.tagInfo[i].tagType;
                        tntData.body.productId = readData.data.tagInfo[i].upc,
                            tntData.body.additionalData =
                            {
                                addInput: readData.data.tagInfo[i].addInput,
                                association: readData.data.tagInfo[i].association,
                                encode: readData.data.tagInfo[i].encode,
                            }
                        tntData.body.count = readData.data.processData.count;
                        tntData.body.chunkIdentifier = readData.data.processData.chunkIdentifier;
                        tntData.body.finalChunk = readData.data.processData.finalChunk;
                        tntData.body.fileUrl = readData.data.processData.fileUrl;

                        // if (processAction == FullCount) {
                        // calling track and trace insert function 

                        let result = await this.trackNTrace(tntData);
                        // }
                    }

                    finalchunk = readData.data.processData.finalChunk
                    chunkIdentifier = readData.data.processData.chunkIdentifier

                    if (finalchunk === true) {
                        let processStateData: any = {
                            body:
                            {
                                processId: readData.data.processId,
                                siteId: readData.data.siteId,
                                zoneId: readData.data.zoneId,
                                userId: readData.data.userId,
                                deviceId: readData.data.deviceId,
                                action: processAction,

                            }
                        };

                        await this.updateProcessState(processStateData);
                        // calling another method for creating file and uplchunkIdentifieroading into s3
                        await this.creatingInventoryFile(chunkIdentifier, processTypeName);
                    }

                }



            }
            // for digitized 
            if (processTypeName == DIGITIZATION) {
                logger.debug("Inside if condition of DIGITIZATION..>>>")
                let tntData: any =
                {
                    body:
                    {
                        tenantId: readData.data.tenantId,
                        processId: readData.data.processId,
                        processType: readData.data.processTypeName,
                        siteId: readData.data.siteId,
                        siteName: siteName,
                        zoneId: readData.data.zoneId,
                        zoneName: zoneName,
                        userId: readData.data.userId,
                        userName: userName,
                        deviceId: readData.data.deviceId,
                        deviceName: deviceName,
                        operationTime:  readData.data.timestamp,
                        status: readData.data.status
                    }
                }

                let digitizeRes;
                // adding Tag Details like
                if ((readData.data.tagInfo).length > 0) {
                    for (let i = 0; i < (readData.data.tagInfo).length; i++) {
                        // adding product data, productUpc,experienceId, experienceTenantId, experienceStudioId
                        let productData: any = await ExternalCommInstance.getProductById(readData?.data?.tagInfo[i]?.productId);
                        tntData.body.diId = readData.data.tagInfo[i].tagId;
                        tntData.body.diInfo = readData.data.tagInfo[i].tagType;
                        tntData.body.primaryId = readData.data.tagInfo[i].tagId;
                        tntData.body.primaryIdType = readData.data.tagInfo[i].tagType;
                        tntData.body.primaryURL = readData.data.tagInfo[i].tagUrl;
                        tntData.body.productId = readData.data.tagInfo[i].productId,
                            tntData.body.productExperienceId = productData?.data?.result?.experienceId,
                            tntData.body.productExperienceStudioId = productData?.data?.result?.experienceStudioId,
                            tntData.body.productExperienceTenantId = productData?.data?.result?.experienceTenantId,
                            tntData.body.productUPC = productData?.data?.result?.upc,
                            tntData.body.productDescription = productData?.data?.result?.description,
                            tntData.body.additionalData =
                            {
                                association: readData.data.tagInfo[i].association,
                                addInput: readData.data.tagInfo[i].addInput,
                                encode: readData.data.tagInfo[i].encode,
                                // metaInfo: readData.data.tagInfo[i]?.metaInfo,
                            }
                        tntData.body.count = readData?.data?.processData?.count;
                        tntData.body.chunkIdentifier = readData?.data?.processData?.chunkIdentifier;
                        tntData.body.finalChunk = readData.data.processData.finalChunk;
                        tntData.body.fileUrl = readData?.data?.processData?.fileUrl;
                        // calling digitize insert function                    
                        digitizeRes = await this.digitize(tntData);

                    }
                }

                return Promise.resolve(digitizeRes);
            }
        } catch (error: any) {
            logger.error("Error at commonDataProcessing => ", error)
            return Promise.reject(error.message)
        }
    }

    async trackNTrace(req: Request) {

        try {
            if (!req.body.status || req.body.status == undefined) {
                req.body.status = "enabled";
            }
            let trackNTraceTag
            let { userId, userName, tenantId, deviceId, deviceName, processId, productId, siteId, siteName, zoneId, zoneName, diId, diInfo, status, operationTime, processType, additionalData, count, chunkIdentifier, finalChunk, fileUrl, action, createdAt, updatedAt } = req.body
            // let tagExist = await Tag.findOne({ tagId: diId })
            // if (!tagExist) {
            //     throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound + diId)
            // }

            // // if (trackNTraceExist) {
            //     let objectEvent = this.objectEvent(req.body)
            //     let epcisDocument = trackNTraceExist.epcisDocument.addEvent(objectEvent)
            //     return Promise.resolve(await TnTData.findOneAndUpdate({ diId: diId }, { epcisDocument: epcisDocument }))
            // // }

            // const epcisDocument = new EPCISDocument();
            // logger.debug(" 3.1 ",epcisDocument)
            // let objectEvent = this.objectEvent(req.body)
            // logger.debug("3.2")
            // epcisDocument.setCreationDate(timestamp).addEvent(objectEvent);

            additionalData = additionalData
            // status = true

            let body = { userId, userName, tenantId, deviceId, deviceName, processId, productId, siteId, siteName, zoneId, zoneName, diId, diInfo, operationTime, status, additionalData, count, chunkIdentifier, finalChunk, fileUrl, action, createdAt, updatedAt }
            let trackNTraceExist: any = await TnTData.find({ diId: diId })

            if (trackNTraceExist.length > 0) {

                let previousSiteId = trackNTraceExist[0]?.siteId
                let previousZoneId = trackNTraceExist[0]?.zoneId



                if (trackNTraceExist[0]?.action == TransferASN) {
                    if (previousSiteId == siteId && previousZoneId == zoneId) {
                        // await TnTData.create(body)
                        return true
                    }

                    else {
                        // const currentAction = action
                        body.action = RecievedASN
                        trackNTraceTag = await TnTData.create(body)
                        body.action = FullCount
                        trackNTraceTag = await TnTData.create(body)
                        return true
                    }

                }
                const epcisDocument = new EPCISDocument();
                let epicsObject: any = await this.createEpicsObject(req.body, true);
                let mergedBody = { ...body, ...epicsObject };
                let objectEvent = this.objectEvent(mergedBody)

                epcisDocument.setCreationDate(operationTime).addEvent(objectEvent);
                mergedBody.epcisDocument = epcisDocument;
                trackNTraceTag = await TnTData.create(mergedBody)
                return Promise.resolve(trackNTraceTag)
            }

            const epcisDocument = new EPCISDocument();

            let epicsObject: any = await this.createEpicsObject(req.body, false);
            let mergedBody = { ...body, ...epicsObject };

            let objectEvent = await this.objectEvent(mergedBody);

            epcisDocument.setCreationDate(operationTime).addEvent(objectEvent);
            mergedBody.epcisDocument = epcisDocument;

            // body.action = FullCount
            trackNTraceTag = await TnTData.create(mergedBody)
            return Promise.resolve(trackNTraceTag)

        } catch (error: any) {
            return Promise.reject(error.message)
        }
    }

    // uploading inventory file to s3
    async creatingInventoryFile(chunkIdentifier: any, processType: any) {
        let dataResponse: any;
        let previousDataResponse: any
        let previousDataChunk: any
        let siteId
        let zoneId
        let tenantId

        if (processType == DIGITIZATION) {
            dataResponse = await DigitizedTag.find({ chunkIdentifier: chunkIdentifier }, { diId: 1, primaryUrl: 1, productId: 1, _id: 0 })
        }
        if (processType == TRACKNTRACE) {
            dataResponse = await TnTData.find({ chunkIdentifier: chunkIdentifier })

            siteId = dataResponse[0]?.siteId

            zoneId = dataResponse[0]?.zoneId


            tenantId = dataResponse[0]?.tenantId


            previousDataChunk = await TnTData.find({ chunkIdentifier: { $ne: chunkIdentifier }, siteId: siteId, zoneId: zoneId, tenantId: tenantId }).sort({ "createdAt": -1, }).limit(1);
            if (previousDataChunk != '') {
                let cIdentifier = previousDataChunk[0].chunkIdentifier
                previousDataResponse = await TnTData.find({ chunkIdentifier: cIdentifier })
            }
            else {
                previousDataResponse = 0
            }

        }
        // logger.info("siteId 1.1 ======> ", siteId);
        let siteData = await ExternalCommInstance.getSiteById(siteId)
        // logger.info("site data 1.1 ======> ", siteData);
        let siteName = siteData?.data?.result[0]?.name


        let zoneData = await ExternalCommInstance.getZoneById(zoneId)
        let zoneName = zoneData?.data?.result?.name


        let tenantData = await ExternalCommInstance.getTenantById(tenantId)
        let tenantName = tenantData?.data?.result?.name


        let sku = dataResponse[0]?.productId
        let epc_uri = dataResponse[0]?.diId
        let serialNo = ''
        let item = ''
        let description = ''
        let dateLastSeen
        if (previousDataResponse == 0) { dateLastSeen = new Date() }

        dateLastSeen = previousDataResponse[0]?.createdAt


        let dateofFile = dataResponse[0]?.createdAt

        let actual = 0
        let expected = 0
        let diff: any = ''
        let diffPerc: any = ''
        let dateRemoved = ''

        //difference between current and previous data response
        if (previousDataResponse != 0) {
            let diffarray = await this.filterByReference(dataResponse, previousDataResponse)
            dateRemoved = diffarray.res[0].createdAt

            actual = diffarray?.currentDataLength
            expected = diffarray?.prevDataLength


            diff = actual - expected
            diffPerc = (actual / expected) * 100
        }

        let response = {
            siteName,
            zoneName,
            sku,
            actual,
            expected,
            dateofFile
        }

        let responseForSiteLevel = {
            siteName,
            sku,
            actual,
            expected,
            diff,
            diffPerc,
            dateofFile

        }

        let responseForDiscrepancyFile = {
            siteName,
            zoneName,
            sku,
            epc_uri,
            serialNo,
            item,
            description,
            dateLastSeen,
            dateRemoved
        }

        //to write data to csv file for site zone inventory file
        let csv_File = await this.writeToCSV(response, chunkIdentifier)

        let csv_siteFile = await this.writeSiteCSV(responseForSiteLevel)

        let csv_discrepancyFile = await this.writeDiscrepancyCSV(responseForDiscrepancyFile)

        //to upload file to s3 for inventory site zone file
        let uploadSiteZoneFile = await this.uploadToS3(csv_File, tenantId, tenantName, 'sitezone')

        //to upload file to s3 for inventory site file
        let uploadSiteFile = await this.uploadToS3(csv_siteFile, tenantId, tenantName, 'site')


        //to upload file to s3 for discrepancy file
        let uploadDiscrepancyFile = await this.uploadToS3(csv_discrepancyFile, tenantId, tenantName, 'discrepancy')



        return true



    }

    async filterByReference(dataResponse: any, prevDataResponse: any) {
        try {
            let resp: any = [];
            let res
            let response


            let currentDataLength = dataResponse.length
            let prevDataLength = prevDataResponse.length

            if ((dataResponse.length) > (prevDataResponse.length)) {

                res = dataResponse.filter((el: any) => {
                    return !prevDataResponse.find((element: any) => {
                        return element.diId === el.diId;
                    });
                });
                let finalData: any = {
                    res: res,
                    currentDataLength: currentDataLength,
                    prevDataLength: prevDataLength
                }

                return finalData
            }

            else if ((dataResponse.length) < (prevDataResponse.length)) {
                response = prevDataResponse.filter((element: any) => {
                    return !dataResponse.find((el: any) => {
                        return el.diId === element.diId
                    })
                })

                let finalData: any = {
                    res: response,
                    currentDataLength: currentDataLength,
                    prevDataLength: prevDataLength
                }
                return finalData

            }
            return Promise.resolve({})
        }


        catch (error: any) {

            return Promise.reject(error.message)
        }
    }

    async writeToCSV(externalData: any, name: any) {
        try {


            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            var hh = String(today.getHours())
            var mi = String(today.getMinutes())
            var ss = String(today.getSeconds())

            let filename = "InventoryPositionSiteZone" + dd + mm + yyyy + '-' + hh + ':' + mi + ':' + ss + '.csv';


            const fields = ['siteName', 'zoneName', 'sku', 'actual', 'expected', 'dateofFile'];
            const opts = { fields };


            var csvFile = parse(externalData, opts);

            let writingFile = fs.writeFileSync(path.resolve(__dirname, `../../../../tagUploads/InventoryFiles/${filename}`), csvFile)
            return filename

        }
        catch (error: any) {
            logger.error("error in writing csv file for site level")
            return Promise.reject(error.message)
        }
    }

    async writeSiteCSV(externalData: any) {
        try {

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            var hh = String(today.getHours())
            var mi = String(today.getMinutes())
            var ss = String(today.getSeconds())

            let filename = "InventoryPositionSite" + dd + mm + yyyy + '-' + hh + ':' + mi + ':' + ss + '.csv';

            const fields = ['siteName', 'sku', 'actual', 'expected', 'diff', 'diffPerc', 'dateofFile'];
            const opts = { fields };


            var csvFile = parse(externalData, opts);



            let writingFile = fs.writeFileSync(path.resolve(__dirname, `../../../../tagUploads/InventoryFileSite/${filename}`), csvFile)


            return filename


        }
        catch (error: any) {
            logger.error("error in writing csv file for site level", error.message)
            return Promise.reject(error.message)
        }
    }

    async writeDiscrepancyCSV(externalData: any) {
        try {

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            var hh = String(today.getHours())
            var mi = String(today.getMinutes())
            var ss = String(today.getSeconds())

            let filename = "InventoryDiscrepencySiteZone" + dd + mm + yyyy + '-' + hh + ':' + mi + ':' + ss + '.csv';

            const fields = ['siteName', 'zoneName', 'sku', 'epc_uri', 'serialNo', 'item', 'description', 'dateLastSeen', 'dateRemoved'];
            const opts = { fields };

            var csvFile = parse(externalData, opts);


            let writingFile = fs.writeFileSync(path.resolve(__dirname, `../../../../tagUploads/DiscrepancyFiles/${filename}`), csvFile)


            return filename


        }
        catch (error: any) {
            logger.error("error in writing csv file for discrepancy")
            return Promise.reject(error.message)
        }
    }

    async uploadToS3(csvFile: any, tenantId: any, tenantName: any, name: any) {
        try {
            //  let S3path = await this.uploadToS3(filename, tenantId, tenantName, 'tagData');
            let nameOfTenant = tenantName.toLowerCase()

            var replacedTenantName = nameOfTenant.split(' ').join('-');

            let containerNameFromTenant = `${replacedTenantName.toLowerCase()}-${tenantId}`
            let containerName: any = containerNameFromTenant;

            const blobServiceClient = BlobServiceClient.fromConnectionString(storage);
            let containerClient
            let filePath
            if (name == 'sitezone') {
                filePath = path.resolve(__dirname, `../../../../tagUploads/InventoryFiles/${csvFile}`)
            }
            else if (name == 'site') {
                filePath = path.resolve(__dirname, `../../../../tagUploads/InventoryFileSite/${csvFile}`)
            }
            else if (name == 'discrepancy') {
                filePath = path.resolve(__dirname, `../../../../tagUploads/DiscrepancyFiles/${csvFile}`)
            }

            else if (name == 'tagData') {
                filePath = path.resolve(__dirname, `../../../../tagUploads/tagInvalidData/${csvFile}`)
            }

            let csv = fs.readFileSync(filePath);
            let encode_csv = csv.toString('base64');
            let obj = Buffer.from(encode_csv, 'base64')

            let body = {
                containerName: containerName,
                storageName: process.env.STORAGENAME
            }

            const containerOptions: any = {
                access: 'container'
            };

            let containerNameExists = await Container.find({ containerName: containerName })

            if (containerNameExists.length > 0) {
                containerClient = blobServiceClient.getContainerClient(containerName);
            }

            else {

                let createContainer = await Container.create(body)
                // Create the container
                let createContainerResponse = await blobServiceClient.createContainer(containerName, containerOptions);
                containerClient = blobServiceClient.getContainerClient(containerName);

                // Create the container
                //const createContainerResponse = await containerClient.create();
                logger.info(
                    `Container was created successfully.\n\trequestId:${createContainerResponse}\n\tURL: ${containerClient.url}`
                );
            }


            const blobClient = containerClient.getBlockBlobClient(`${csvFile}`);


            // const blobClient = containerClient.getBlockBlobClient(`${csvFile}`);
            const uploadBlobResponse: any = await blobClient.uploadData(obj)




            const returnedBlobUrls = `https://${process.env.STORAGENAME}.blob.core.windows.net/${containerNameFromTenant}/${csvFile}`

            return Promise.resolve(returnedBlobUrls)
        }
        catch (error: any) {
            logger.error("error in uploading file to S3", error.message)
            return Promise.reject(error.message)
        }
    }




    async delete(req: Request) {
        try {
            let { tagId } = req.params
            let tagExist = await Tag.findOne({ tagId: tagId })
            if (!tagExist) {
                throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, tagNotFound + tagId)
            }

            await Tag.deleteOne({ tagId: tagId })
            await DigitizedTag.deleteOne({ diId: tagId })
            await TnTData.deleteMany({ diId: tagId })
            return Promise.resolve(tagDeleted + tagId)
        } catch (error: any) {
            return Promise.reject(error.message)
        }
    }

    paginatorMongo(params: any) {
        if (undefined == params.page || 0 == Number(params.page)) {
            params.page = constants.PAGINATION_START_PAGE;
        }
        if (undefined == params.limit || 0 == Number(params.limit)) {
            params.limit = constants.PAGINATION_START_MAX_LIMIT;
        }

        let nLimit: number = +params.limit
        let offset = +Math.abs(+params.page - 1) * nLimit

        return { limit: nLimit, offset }
    }

    objectEvent(value: any) {
        try {
            let { eventTime, epcList, action, eventId, bizStep, disposition, readPoint, bizTransaction } = value
            const objectEvent = new ObjectEvent();
            const bizTransactions = new BizTransactionElement({
                type: 'po',
                bizTransaction: bizTransaction,
            });

            objectEvent
                .setEventTime(eventTime)
                .addEPC(epcList)
                .setAction(action)
                .setEventID(eventId)
                .setBizStep(bizStep)
                .setDisposition(disposition)
                .setReadPoint(readPoint)
                .addBizTransaction(bizTransactions);

            return objectEvent
        }
        catch (error: any) {
            return error;
        }

    }

    async uploadFiletoS3(req: Request) {

        let sourceFile: any = req?.file

        try {

            let tenantId = req?.body?.tenantId
            let nameOfTenant = (req?.body?.tenantName).toLowerCase()

            var replacedTenantName = nameOfTenant.split(' ').join('-');

            let containerName = `${replacedTenantName.toLowerCase()}-${tenantId}`

            //const containerName: any = process.env.TAGCONTAINER;
            const blobServiceClient = BlobServiceClient.fromConnectionString(storage);
            // const returnedBlobUrls: string[] = [];
            let returnedBlobUrls
            if (sourceFile == undefined)
                throw new Exception(constant.SUCCESS_NO_CONTENT, 'File is required')

            if (sourceFile) {

                // body for Mongo Container Collection
                let body = {
                    containerName: containerName,
                    storageName: process.env.STORAGENAME
                }
                //  Check if Container Name exist in Mongo Container Collection or not
                let containerNameExists = await Container.find({ containerName: containerName })
                const containerOptions: any = {
                    access: 'container'
                };
                let containerClient;
                //  If Container Already Exist
                if (containerNameExists.length > 0) {
                    // Get a reference to a container
                    containerClient = blobServiceClient.getContainerClient(containerName);
                }
                else {
                    // Creating Container for Mongo Container Collection
                    let createContainer = await Container.create(body)

                    // containerClient = blobServiceClient.getContainerClient(containerName);
                    // Creating the container for S3
                    let createContainerResponse = await blobServiceClient.createContainer(containerName, containerOptions);
                    // Get a reference to a container
                    containerClient = blobServiceClient.getContainerClient(containerName);
                    // const createContainerResponse = await containerClient.create();
                    logger.info(
                        `Container was created successfully.\n\trequestId:${createContainerResponse}\n\tURL: ${containerClient}`
                    );
                }
                const blobClient = containerClient.getBlockBlobClient(`${sourceFile.filename}`);
                // const blobClient = containerClient.getBlockBlobClient(sourceFile.filename);
                // set mimetype as determined from browser with file upload control
                const options = { blobHTTPHeaders: { blobContentType: sourceFile.mimetype } };
                var img = fs.readFileSync(sourceFile.path);
                var encode_img = img.toString('base64');
                let obj = Buffer.from(encode_img, 'base64')
                // upload file
                const uploadBlobResponse: any = await blobClient.uploadData(obj, options);
                returnedBlobUrls = `https://${process.env.STORAGENAME}.blob.core.windows.net/${containerName}/${sourceFile.filename}`
                // returnedBlobUrls = `https://${process.env.TAGSTORAGENAME}.blob.core.windows.net/${process.env.TAGCONTAINER}/${sourceFile.filename}`

            }
            return returnedBlobUrls

        } catch (err: any) {
            logger.error('Error in Uploading Tags File:', err.message)
            return Promise.reject(err.message)
        }
    }

    async getDiExportChunkNumber(req:Request, res:Response)
        {
        try{
            let { status, type, field, value, tenantId, tags, processId, from, to, offset, timeZone }: any = req.query
            if (tags !== undefined) {
                tags = tags.split(",");
            }
            if (offset === undefined) {
                offset = 0;
            }
            if (timeZone === undefined) {
                timeZone = 'Asia/Kolkata';
            }
            const markerCodeMAXCOUNT = markerCodeMaxCount;
            const addInputMAXCOUNT = addInputMaxCount;
            const encodeMAXCOUNT = encodeMaxCount;

            let whereObj: any = {}

            if (field) whereObj[`${field}`] = value
            if (tenantId) whereObj.tenantId = tenantId;
            if (field) whereObj[`${field}`] = { '$regex': `${value}`, '$options': 'i' }
            if (tags) {
                whereObj._id = { $in: tags };
            }

            if (processId != undefined) {
                whereObj.processId = processId;
            }

            if (to != undefined) {
                to = new Date(to);
                to.setUTCHours(23, 59, 59, 999)
                if (from != undefined && from !== to) {
                    from = new Date(from);
                    whereObj.createdAt = { $gte: from, $lte: to }
                }
                else {
                    whereObj.createdAt = { $gte: to }
                }
            }
            let responseResult:any=[];
            if (type === 'enabled') {
                whereObj.status = 'enabled'
                responseResult = await DigitizedTag.find(whereObj).sort({ "createdAt": -1, }).count();
            }
            if (type === 'de-enabled') {
                whereObj.status = 'de-enabled'
                responseResult = await DigitizedTag.find(whereObj).sort({ "createdAt": -1, }).count();
            }
            if (type === 'duplicate') {
                responseResult = await DuplicateDigitizedTag.find(whereObj).sort({ "createdAt": -1, }).count();
            }
            let data={
                totalCount:responseResult,
                chunkSize:ExportChunkValue,
            }
            return Promise.resolve(data)
        }catch(error:any)
            {
                logger.error("Error in getting di export chunk size ",error.messgae);
                return Promise.reject(error.message);
            }   
        }

    public async exportData(req: Request, res: Response) {
        try {

            let exportResponse: any = [];
            exportResponse = await this.exportDataLoadMore(req, res);
            logger.debug("Succesfully generate the data for export tags");
            const filename = `digitized-tags-data.xlsx`;
            var xls = json2xls(exportResponse);
            fs.writeFileSync(filename, xls, 'binary');
            res.download(filename, (err: any) => {
                if (err) {
                    fs.unlinkSync(filename)
                    res.send("Unable to download the excel file")
                }
                fs.unlinkSync(filename)
            })

        } catch (error: any) {
            logger.info("Error in generating digitized (DI) export response data", error.message)
            return Promise.reject(error.message)
        }
    }

    async exportDataLoadMore(req: Request, res: Response) {
        try {

            let exportResponse: any = [];
            let responseResult: any;
            let { status, type, field, value, tenantId, tags, processId, from, to, offset, timeZone }: any = req.query
            if (tags !== undefined) {
                tags = tags.split(",");
            }
            if (offset === undefined) {
                offset = 0;
            }
            if (timeZone === undefined) {
                timeZone = 'Asia/Kolkata';
            }
            const markerCodeMAXCOUNT = markerCodeMaxCount;
            const addInputMAXCOUNT = addInputMaxCount;
            const encodeMAXCOUNT = encodeMaxCount;

            let whereObj: any = {}

            if (field) whereObj[`${field}`] = value
            if (tenantId) whereObj.tenantId = tenantId;
            if (field) whereObj[`${field}`] = { '$regex': `${value}`, '$options': 'i' }
            if (tags) {
                whereObj._id = { $in: tags };
            }

            if (processId != undefined) {
                whereObj.processId = processId;
            }

            if (to != undefined) {
                to = new Date(to);
                to.setUTCHours(23, 59, 59, 999)
                if (from != undefined && from !== to) {
                    from = new Date(from);
                    whereObj.createdAt = { $gte: from, $lte: to }
                }
                else {
                    whereObj.createdAt = { $gte: to }
                }
            }

            do {
                responseResult = [];

                if (type === 'enabled') {
                    whereObj.status = 'enabled'
                    responseResult = await DigitizedTag.find(whereObj).sort({ "createdAt": -1, }).skip(offset).limit(ExportChunkValue);
                }
                if (type === 'de-enabled') {
                    whereObj.status = 'de-enabled'
                    responseResult = await DigitizedTag.find(whereObj).sort({ "createdAt": -1, }).skip(offset).limit(ExportChunkValue);
                }
                if (type === 'duplicate') {
                    responseResult = await DuplicateDigitizedTag.find(whereObj).sort({ "createdAt": -1, }).skip(offset).limit(ExportChunkValue);
                }
                let ml = 0;
                for (const data of responseResult) {
                    let zoneName;
                    let siteName;
                    siteName = data?.siteName;
                    zoneName = data?.zoneName;

                    if (data.additionalData === undefined) {
                        data.additionalData = []
                    }
                    if (typeof (data.additionalData) === 'string') {
                        data.additionalData = JSON.parse(data?.additionalData)
                    }

                    var createdAtTime = moment.tz(data.createdAt, timeZone);
                    const createdAtTimeUpdated = createdAtTime.format("DD MMM YY hh:mm A");


                    var operationTime = moment.tz(data.operationTime, timeZone);
                    const operationTimeUpdated = operationTime.format("DD MMM YY hh:mm A");

                    let tempObject: any =
                    {

                        'CREATE DATE': createdAtTimeUpdated,
                        'TAG ID': data.diId,
                        'NFC URL': data.primaryURL,
                        'UPC/SKU': data.productUPC,
                        'PRODUCT DESCRIPTION': data.productDescription,
                        'EXPERIENCE ID': data.productExperienceId,
                        'EXPERIENCE STUDIO ID': data.productExperienceStudioId,
                        'EXPERIENCE TENANT ID': data.productExperienceTenantId,
                        'SITE': siteName,
                        'ZONE': zoneName,
                        'STATUS': data.status,
                        'USER NAME': data.userName,
                        'DEVICE NAME': data.deviceName,
                        'OPERATION TIMESTAMP': operationTimeUpdated,

                    }
                    let markerObj: any = {};
                    if (data?.additionalData.association === undefined) {
                        data.additionalData.association = []
                    }
                    for (let j = 0; j < markerCodeMAXCOUNT; j++) {
                        markerObj[`MARKER CODE ${j + 1}`] = data?.additionalData?.association[j]?.code;
                        markerObj[`MARKER TYPE ${j + 1}`] = data?.additionalData?.association[j]?.type;
                        markerObj[`MARKER META INFO ${j + 1}`] = data?.additionalData?.association[j]?.metaInfo;


                    }
                    tempObject = { ...tempObject, ...markerObj };

                    let addInputObj: any = {};
                    if (data?.additionalData.addInput === undefined) {
                        data.additionalData.addInput = {}
                    }
                    for (let j = 0; j < addInputMAXCOUNT; j++) {
                        addInputObj[`ADD INPUTKEY ${j + 1}`] = data?.additionalData?.addInput[j]?.key;
                        addInputObj[`ADD INPUTVALUE ${j + 1}`] = data?.additionalData?.addInput[j]?.value;


                    }

                    tempObject = { ...tempObject, ...addInputObj };

                    let encodeObj: any = {};
                    if (data?.additionalData.encode === undefined) {
                        data.additionalData.encode = []
                    }
                    for (let j = 0; j < encodeMAXCOUNT; j++) {
                        encodeObj[`ENCODED URL ${j + 1}`] = data?.additionalData?.encode[j]?.url;
                        encodeObj[`ENCODED COMPANYPREFIX ${j + 1}`] = data?.additionalData?.encode[j]?.companyPreFix;
                        encodeObj[`ENCODED ITEMREFERENCE ${j + 1}`] = data?.additionalData?.encode[j]?.itemReference;
                    }

                    tempObject = { ...tempObject, ...encodeObj };



                    exportResponse.push(tempObject);

                }
                offset = offset + ExportChunkValue;
            } while (responseResult.length === ExportChunkValue);
            // returing response
            return Promise.resolve(exportResponse);

        }
        catch (error: any) {
            logger.error("Error in creating exprot data using exportDataLoadMore method in DI export service ", error.message)
            return Promise.reject(error.message);
        }

    }
    async siteName(siteID: any) {
        let siteExist: any = await ExternalCommInstance.getSiteById(siteID);
        return siteExist?.data?.result[0]?.name;
    }
    async zoneName(zoneID: any) {
        let zoneExist: any = await ExternalCommInstance.getZoneById(zoneID);
        return zoneExist?.data?.result?.name;
    }

    async getTagsExportChunkNumber(req:Request, res:Response)
        {
            try
            {    
                let responseResult: any;
                let query = this.paginatorMongo(req.query)
                let { tenantId, batchId, status, search, tagId, tagType, manufacturerName, timeZone, offset }: any = req.query
                let whereObj: any = {}
                if (timeZone === undefined) {
                    timeZone = 'Asia/Kolkata';
                }
                if (offset === undefined) {
                    offset = 0;
                }
                if (tenantId) whereObj.tenantId = tenantId
                if (batchId) whereObj.batchId = batchId
                if (status) whereObj.status = status
                if (tagId) whereObj.tagId = tagId
                if (manufacturerName) whereObj.manufacturerName = manufacturerName
                if (tagType) whereObj.tagType = tagType
                if (search) {
                    whereObj.manufacturerName = /search/i
                }
                responseResult = await Tag.find(whereObj).sort({ createdAt: -1 }).count();

                let data={
                    totalCount:responseResult,
                    chunkSize:ExportChunkValue,
                }
                return Promise.resolve(data)


            }catch(error:any)
                {
                    logger.error("Error in getting tags export chunk count",error.message)
                    return Promise.reject(error.message);
                }


        }
    async exportTagData(req: Request, res: Response) {
        try {

            let data = [];
            data = await this.exportTagDataReamMore(req, res);
            console.log("Response from exportTagDataReamMore=>", data)
            const filename = `search-tags-data.xlsx`;

            var xls = json2xls(data);


            fs.writeFileSync(filename, xls, 'binary');

            res.download(filename, (err: any) => {
                if (err) {
                    fs.unlinkSync(filename)
                    res.send("Unable to download the excel file")
                }
                fs.unlinkSync(filename)
            })



        } catch (error: any) {
            logger.error("Error in Exporting Tag Data", error);
            return Promise.reject(error.message)
        }
    }

    async exportTagDataReamMore(req: Request, res: Response) {
        try {
            let exportResponse: any = [];
            let responseResult: any;
            let query = this.paginatorMongo(req.query)
            let { tenantId, batchId, status, search, tagId, tagType, manufacturerName, timeZone, offset }: any = req.query
            let whereObj: any = {}
            if (timeZone === undefined) {
                timeZone = 'Asia/Kolkata';
            }
            if (offset === undefined) {
                offset = 0;
            }
            if (tenantId) whereObj.tenantId = tenantId
            if (batchId) whereObj.batchId = batchId
            if (status) whereObj.status = status
            if (tagId) whereObj.tagId = tagId
            if (manufacturerName) whereObj.manufacturerName = manufacturerName
            if (tagType) whereObj.tagType = tagType
            if (search) {
                whereObj.manufacturerName = /search/i
            }

            do {
                responseResult = [];
                responseResult = await Tag.find(whereObj).sort({ createdAt: -1 }).skip(offset).limit(ExportChunkValue)

                // throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound)
                for (const rows of responseResult) {
                    logger.debug("First Response =>", responseResult)
                    var createdAtTime = moment.tz(rows.createdAt, timeZone);
                    const createdAtTimeUpdated = createdAtTime.format("DD MMM YY hh:mm A");
                    let tempObject: any =
                    {
                        manufacturerName: rows.manufacturerName,
                        tagId: rows.tagId,
                        batchId: rows.batchId,
                        tagType: rows.tagType,
                        tagClass: rows.tagClass,
                        status: rows.status,
                        createdBy: rows.userName,
                        createdAt: createdAtTimeUpdated,
                    }
                    exportResponse.push(tempObject);
                }
                logger.debug("Response Data Length in exportDataLoadMore", exportResponse.length, ExportChunkValue, offset)

                offset = offset + ExportChunkValue;
            } while (responseResult.length === ExportChunkValue);
            return Promise.resolve(exportResponse);
        }
        catch (error: any) {
            logger.error("Error in creating exprot data using exportTagDataReamMore method in manufacturing export service ", error.message)
            return Promise.reject(error.message);
        }

    }

    async createBlueBiteEnablement(id: any) {
        try {
            let obj = {
                "enablementId": "",
                "product": {
                    "name": "",
                    "description": "",
                    "imageUrl": ""
                },
                "tenant": {
                    "id": "",
                    "name": ""
                },
                "site": {
                    "id": "",
                    "name": "",
                    "geoLocation": {
                        "lat": "",
                        "lon": ""
                    }
                },
                "station": {
                    "deploymentId": "",
                    "name": "",
                    "description": ""
                },
                "barcode": {
                    "key": "",
                    "code": "",
                    "type": "",
                    "subtype": ""
                },
                "qrcode": {
                    "key": "",
                    "code": "",
                    "type": "",
                    "subtype": ""
                },
                "nfc": {
                    "id": "",
                    "key": "",
                    "url": ""
                },
                "input": {
                    "key": "",
                    "value": ""
                },
                "metadata": {
                    "nfc": [],
                    "qrcode": [],
                    "barcode": [],
                    "input": [],
                    "product": []
                },
                "status": "enabled",
                "lastOperationTimestamp": "2022-10-07T04:36:01.000Z"
            }


            let data: any = await DigitizedTag.findOne({ _id: id });
            // data = JSON.parse(JSON.stringify(data));
            if (data.primaryIdType.includes('NFC')) {
                obj.enablementId = id;
                let productData: any = await ExternalCommInstance.getProductById(data?.productId);
                if (productData) {
                    obj.product.name = productData?.data?.result?.name;
                    obj.product.description = productData?.data?.result?.description;
                    obj.product.imageUrl = productData?.data?.result?.imageURL;
                }
                let tenantData: any = await ExternalCommInstance.getTenantById(data?.tenantId);
                obj.tenant.id = data?.tenantId;
                if (tenantData) {
                    obj.tenant.name = tenantData?.data?.result?.name;
                }

                let siteData: any = await ExternalCommInstance.getSiteById(data?.siteId);
                obj.site.id = data?.siteId;
                if (siteData) {
                    obj.site.name = siteData?.data?.result[0]?.name;
                    obj.site.geoLocation.lat = siteData?.data?.result[0]?.latitude;
                    obj.site.geoLocation.lon = siteData?.data?.result[0]?.longitude;
                }

                let deviceData: any = await ExternalCommInstance.getDeviceDetails(data?.deviceId, "mac");
                obj.station.deploymentId = data?.deviceId;
                if (deviceData) {
                    obj.station.name = deviceData?.data?.result[0]?.name;
                    obj.station.description = deviceData?.data?.result[0]?.description;
                }

                let additionalData = data.additionalData;



                obj.barcode.key = data?.primaryId;
                obj.barcode.code = additionalData?.association[0]?.code;
                obj.barcode.type = additionalData?.association[0]?.type;
                obj.barcode.subtype = additionalData?.association[0].type;

                obj.qrcode.key = data?.primaryId;
                obj.qrcode.code = additionalData?.association[0]?.code;
                obj.qrcode.type = additionalData?.association[0]?.type;
                obj.qrcode.subtype = additionalData?.association[0]?.type;



                obj.nfc.id = data?.primaryId;
                obj.nfc.key = data?.primaryIdType;
                obj.nfc.url = data?.primaryURL;

                obj.input.key = additionalData?.addInput;
                obj.input.value = additionalData?.addInput;

                let nfcMetaData: any = [];
                nfcMetaData.push(obj.nfc);
                obj.metadata.nfc = nfcMetaData;

                let qrcodeMetaData: any = [];
                qrcodeMetaData.push(obj.qrcode);
                obj.metadata.qrcode = qrcodeMetaData;

                let barcodeMetaData: any = [];
                barcodeMetaData.push(obj.barcode);
                obj.metadata.barcode = barcodeMetaData;

                let inputMetaData: any = [];
                inputMetaData.push(additionalData.addInput);
                obj.metadata.input = inputMetaData;

                let productMetaData: any = [];
                let productObj: any = obj.product;
                productObj.experienceId = productData?.data?.result?.experienceId;
                productObj.experienceTenantId = productData?.data?.result?.experienceTenantId;
                productObj.experienceStudioId = productData?.data?.result?.experienceStudioId;

                productMetaData.push(productObj);

                obj.metadata.product = productMetaData;

                // let processData: any = await ExternalCommInstance.getProcessNameById(data?.processId);
                // if (processData) {
                //   obj.status = processData?.data?.result?.status;
                //}

                obj.status = data?.status;

                obj.lastOperationTimestamp = data?.updatedAt;

            }
            return Promise.resolve(obj);

        }
        catch (error: any) {
            logger.error("error in createBlueBiteEnablement...", error.message)
            return Promise.reject(error.message);
        }
    }

    async writeInvalidTagsCSV(externalData: any, name: any, tenantId: any, tenantName: any) {
        try {

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            var hh = String(today.getHours())
            var mi = String(today.getMinutes())
            var ss = String(today.getSeconds())

            name = name.replaceAll(".xlsx", "");
            name = name.replaceAll(" ", "");
            let filename = name + "-Invalid-Tags-Duplicate-Tags-Data-" + dd + mm + yyyy + '-' + hh + ':' + mi + ':' + ss + '.xlsx';


            const fields = ['tagId', 'message'];
            const opts = { fields };

            //var csvFile = parse(externalData, opts);
            var xlsxFile = json2xls(externalData);


            let writingFile = await fs.writeFileSync(path.resolve(__dirname, `../../../../tagUploads/tagInvalidData/${filename}`), xlsxFile, 'binary');

            let S3path = 'Upload-file-to-s3-tagInvalidData';
            S3path = await this.uploadToS3(filename, tenantId, tenantName, 'tagData');


            return Promise.resolve(S3path);

        }
        catch (error: any) {
            logger.error("error in writing xlsx file uploading file in s3")
            return Promise.reject(error.message)
        }
    }



    async lastExpectedCount(req: any, res: any) {
        try {

            let processData = await ExternalCommInstance.getProcessNameById(req?.body?.data?.processId || req?.body?.processId)
            let processName = processData?.data?.result?.name
            let type = req?.body?.type

            let chunkData: any
            let chunkIdentifierData: any
            let chunkDataFullCount: any

            if (processName == FullCount) {

                chunkData = await TnTData.find({ action: processName, deviceId: req?.body?.data?.uuid || req?.body?.deviceId }).sort({ "createdAt": -1, }).limit(1);

                chunkIdentifierData = chunkData[0].chunkIdentifier
                chunkDataFullCount = await TnTData.find({ chunkIdentifier: chunkIdentifierData })

            }

            else {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, "process is not full count")
            }

            let count = chunkDataFullCount.length

            let result = {
                uuid: req?.body?.data?.uuid,
                count: count
            }

            let response = {
                type: type,
                result
            }



            return Promise.resolve(response)


        }
        catch (error: any) {
            logger.error("error in data from lastExpectedCount")
            return Promise.reject(error.message)
        }
    }

    async createEpicsObject(reqObj: any, tntExist: any) {
        try {

            let obj: any = {
                "eventTime": "",
                "epcList": "",
                "action": "",
                "eventId": "",
                "bizStep": "",
                "disposition": "",
                "readPoint": "",
                "bizTransaction": ""
            };

            if (reqObj?.timestamp != undefined) {
                obj.eventTime = reqObj?.timestamp
            }
            ;
            obj.epcList = reqObj?.diId;
            obj.eventId = (`${Math.floor(100000 + Math.random() * 900000)}`);
            if (tntExist) {
                obj.action = "Observe"
            }
            else {
                obj.action = "Add"
                obj.bizStep = "commissioning"
            }

            let processData: any = await ExternalCommInstance.getProcessNameById(reqObj?.processId);

            if (reqObj?.zoneId) {
                obj.disposition = "active";
            }

            if (processData?.data?.result?.name == "Transfer ASN") {
                obj.bizStep = "shipping";
                obj.disposition = "in_transit";
            }

            let zoneData = await ExternalCommInstance.getZoneById(reqObj?.zoneId);
            let zoneTypeId = zoneData?.data?.result?.zoneType;
            let zoneTypeData = await ExternalCommInstance.getZoneTypeById(zoneTypeId);
            let zoneName = zoneTypeData?.data?.result?.name;
            if (zoneName == "Sold") {
                obj.bizStep = "retail_selling";
            }



            obj.readPoint = reqObj?.zoneId;

            return Promise.resolve(obj);
        }
        catch (error: any) {
            logger.error("failed to get data inside createEpicsObject", error.message)
            return Promise.reject(error.message);
        }
    }


    async deEnabledTag(req: Request) {
        try {
            let { tags }: any = req.body
            if (tags.length == 0) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound + tags)
            }
            for (let diId of tags) {
                let tagExist = await Tag.findOne({ tagId: diId })
                if (tagExist) {
                    await Tag.updateOne({ tagId: diId }, { $set: { status: 'Inactive', isActivated: false } })
                }

                let digitizedTagExist = await DigitizedTag.findOne({ diId: diId });

                if (!digitizedTagExist) {
                    throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, DIGITIZATION + tagNotFound + diId)
                }
                await DigitizedTag.updateOne({ diId: diId }, { $set: { status: 'de-enabled' } });

                // deleting data from duplicates collection
                let duplicateExist = await DuplicateDigitizedTag.find({ diId: diId });
                if (duplicateExist.length > 0) {
                    for (let duplicateData of duplicateExist) {
                        await DuplicateDigitizedTag.deleteOne({ diId: duplicateData.diId });
                    }
                }




                if (tagExist) {
                    await ExternalCommInstance.creatingReportEnablement(digitizedTagExist?.tenantId, digitizedTagExist?.siteId, digitizedTagExist?.processId,
                        digitizedTagExist?.productUPC, digitizedTagExist?.status, 'de-enabled', 'secure');
                }
                else {
                    await ExternalCommInstance.creatingReportEnablement(digitizedTagExist?.tenantId, digitizedTagExist?.siteId, digitizedTagExist?.processId,
                        digitizedTagExist?.productUPC, digitizedTagExist?.status, 'de-enabled', 'unsecure');
                }



            }


            return Promise.resolve(`de-enabled Tag ${tags} successfully`);
        }
        catch (error: any) {
            return Promise.reject(error.message);
        }
    }



    async createProcessState(req: Request) {
        try {
            let { deviceId, processId, status, userId, siteId, zoneId } = req.body;

            let processStateExist = await ProcessState.find({ siteId: siteId, zoneId: zoneId, status: 'active-running' });


            if (processStateExist.length != 0) {
                throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, processAlreadyRunningInZone);
            }

            let processStateData = await ProcessState.create(req.body);
            // logger.info("processStateData ======> ", processStateData);

            let response = this.lastExpectedCount(req, {});

            return Promise.resolve(response);
        }
        catch (error: any) {
            return Promise.reject(error.message);
        }
    }

    async updateProcessState(req: Request) {
        try {
            //let deviceId = JSON.parse(JSON.stringify(req.params.deviceId))
            let { deviceId, processId, status, userId, siteId, zoneId } = req.body;
            let processStateExist = await ProcessState.findOne({ deviceId: deviceId, zoneId: zoneId });
            if (!processStateExist) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, processStateNotFount)
            }
            if (processStateExist) {
                await ProcessState.findOneAndUpdate({ deviceId: deviceId, zoneId: zoneId }, { $set: { status: 'completed' } })
            }


            logger.info("process state status completed successfully");
            return Promise.resolve(`process state status completed successfully`);
        }
        catch (error: any) {
            return Promise.reject(error.message);
        }
    }

    async retrieveTagMetaData(req: any) {

        try {
            const { tagId } = req.params;
            if (!tagId) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound)
            }

            const uppercaseTagId = tagId.toUpperCase()
            const tag = await Tag.findOne({ tagId: uppercaseTagId })
            if (!tag) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound)
            }
            const { ndef } = tag;        // getting data from digitization
            let digitizedData: any = await DigitizedTag.findOne({ diId: uppercaseTagId }) // 30 Jan 
            tag.tagUrl = '';
            if (digitizedData) {
                tag.tagUrl = digitizedData.primaryURL;
            }

            if (!tag.tagUrl) tag.tagUrl = ensureUri.ensureUri(ndef);
            return mapping.toSecureTagMap(tag)
        }
        catch (err: any) {
            return "Error in getting tag data";
        }
    }

    async updateLastValidCounter(req: any, res: any) {
        try {
            const tagId = req.body.payload.tagId;
            const newCount = req.body.payload.newCounter;
            if (!tagId) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound)
            }

            const uppercaseTagId = tagId.toUpperCase();
            const result: any = await Tag.findOneAndUpdate({ tagId: uppercaseTagId }, { $set: { lastValidCounter: newCount } }, { returnOriginal: false })
            if (!result) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound)
            }

            return mapping.toSecureTagMap(result)
        } catch (error: any) {
            logger.error("updateLastValidCounter__Error", error)
        }
    }

    async activateTag(tagId: any, activated: any) {
        if (!tagId) {
            throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound)
        }

        const uppercaseTagId = tagId.toUpperCase()
        const result: any = await Tag.findOneAndUpdate({ tagId: uppercaseTagId }, { $set: { activated: activated } }, { returnOriginal: false })

        if (!result.value) {
            throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound)
        }
        if (!result.value.tagUrl) ensureUri.ensureUri(result.value.ndef)
        return mapping.toSecureTagMap(result.value)
    }

    async activateBatch(batchId: any, activated: any) {
        if (!batchId) {
            throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound)
        }

        const result = await Tag.updateMany({ bId: batchId }, { $set: { activated: activated } }, {})
        const { matchedCount, modifiedCount } = result

        if (matchedCount < 1) {
            throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, tagNotFound)
        }

        return {
            batchId,
            activated,
            modifiedTagsCount: modifiedCount,
            totalTagsCount: matchedCount
        }
    }

    async isTagActivated(req: any) {
        const { tagId } = req.params;
        const uppercaseTagId = tagId.toUpperCase()
        try {
            const tag: any = await Tag.findOne({ tagId: uppercaseTagId })
            //console.log("tag____",tag.tagId, tag.activated)
            let res =
            {
                tagId: tag.tagId,
                activated: tag.isActivated
            }
            logger.debug("res__522", res);
            return res;
        }
        catch (err) {
            return 'Error in getting isTagActivated';
        }
    }

    // updateing siteName in DI data
    async updateSiteNameInDI(req: any) {
        try {
            let siteId = req.params.siteId
            let { siteName }: any = req.body || req;
            await DigitizedTag.updateMany({ siteId: siteId }, { $set: { siteName: siteName } })
            await DuplicateDigitizedTag.updateMany({ siteId: siteId }, { $set: { siteName: siteName } })
            await TnTData.updateMany({ siteId: siteId }, { $set: { siteName: siteName } })
            return Promise.resolve("Data Updated");
        }
        catch (error: any) {
            return Promise.reject(error.message);
        }

    }
    // 
    async updateZoneNameInDI(req: any) {
        try {
            let zoneId = req.params.zoneId
            let { zoneName }: any = req.body || req;
            await DigitizedTag.updateMany({ zoneId: zoneId }, { $set: { zoneName: zoneName } })
            await DuplicateDigitizedTag.updateMany({ zoneId: zoneId }, { $set: { zoneName: zoneName } })
            await TnTData.updateMany({ zoneId: zoneId }, { $set: { zoneName: zoneName } })
            return Promise.resolve("Data Updated");
        }
        catch (error: any) {
            return Promise.reject(error.message);
        }

    }


    async formatDIData(dataArr: any) {
        try {

            return dataArr.map((data: any) => {

                return {
                    _id: data._id,
                    tenantId: data?.tenantId,
                    userId: data?.userId,
                    userName: data?.userName,
                    deviceId: data?.deviceId,
                    deviceName: data?.deviceName,
                    processId: data?.processId,
                    productId: data?.productId,
                    siteId: data?.siteId,
                    siteName: data?.siteName,
                    zoneId: data?.zoneId,
                    zoneName: data?.zoneName,
                    diId: data?.diId,
                    diInfo: data?.diInfo,
                    primaryURL: data?.primaryURL,
                    primaryId: data?.primaryId,
                    primaryIdType: data?.primaryIdType,
                    additionalData: {
                        association: Array.isArray(data?.additionalData?.association) ? data?.additionalData?.association.map((x: any) => ({
                            "code": x?.code,
                            "type": x?.type,
                            "metaInfo": x?.metaInfo
                        })) : [],
                        addInput: Array.isArray(data?.additionalData?.addInput) ? data?.additionalData?.addInput.map((x: any) => ({
                            "key": x?.key,
                            "value": x?.value,
                        })) : [],
                        encode: Array.isArray(data?.additionalData?.encode) ? data?.additionalData?.encode.map((x: any) => ({
                            "url": x?.url,
                            "companyPreFix": x?.companyPreFix,
                            "itemReference": x?.itemReference,
                            "serialNo": x?.serialNo,
                        })) : [],
                    },
                    count: data?.count,
                    chunkIdentifier: data?.chunkIdentifier,
                    finalChunk: data?.finalChunk,
                    fileUrl: data?.fileUrl,
                    productDescription: data?.productDescription,
                    productExperienceId: data?.productExperienceId,
                    productExperienceStudioId: data?.productExperienceStudioId,
                    productExperienceTenantId: data?.productExperienceTenantId,
                    productUPC: data?.productUPC,
                    status: data?.status,
                    operationTime: data?.operationTime,
                    createdAt: data?.createdAt,
                    updatedAt: data?.updatedAt

                }
            });


        }
        catch (error: any) {
            return Promise.reject(error.message);
        }

    }


}


function ISODate(arg0: string) {
    throw new Error("Function not implemented.");
}
