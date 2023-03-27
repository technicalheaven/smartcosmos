import { Response, Request } from "express";
import StatusCodes from 'http-status-codes';
const { v4: uuidv4 } = require('uuid');
import BaseService from '../../../core/services/base';
import { Exception, respHndlr } from "../../../middlewares/resp-handler";
import { paginator } from '../../../libs/pagination/index';
var constant = require('../../../middlewares/resp-handler/constants');
var localConstant = require('../utils/constants');
import { databaseInstance } from '../../../config/db'
import { tenantExternalCommInstance } from "./externalComm";
import { Op, Sequelize } from "sequelize";
import { BlobServiceClient } from "@azure/storage-blob";
var fs = require("fs");
import moment from "moment";
import { TRACKNTRACE } from "../../tag/utils/constant";
const storage: any = process.env.AZURE_STORAGE_CONNECTION_STRING

export class TenantService extends BaseService {
  constructor({ model, models, logger }: any) {
    super({ model, models, logger });

  }

  // get tenant dataList
  async readOneTenant(req: Request) {
    try {

      const exisitingTenant = await this.model.findByPk(req.params.id);
      if (!exisitingTenant) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_NOT_FOUND)
      }

      const tenantData = await this.model.findOne({
        where: { id: req.params.id },
        include: [{
          model: this.models.TenantFeature,
        }],

      });
      this.logger.debug('readOnrTenent: tenant data ')
      return Promise.resolve(tenantData)

    } catch (err: any) {
      this.logger.error("Error at readOneTenant ", err.message);
      return Promise.reject(err.message)

    }
  }

  async readAllTenant(req: Request) {

    try {

      let {
        tenantId,
        type,
        name,
        description,
        status,
        sortBy,
        search,
        sortOrder,
        to,
        from,
        sync
      } = req.query


      let query = paginator(req.query, ['name', 'type', 'createdAt', 'updatedAt'])
      if (undefined == sortBy) { sortBy = 'name' }
      if (undefined == sortOrder) { sortOrder = 'ASC' }
      query.order = [[String(sortBy), String(sortOrder)]]

      let whereObj: any = {}
      if (to != undefined) {
        whereObj = from ? {
          ...whereObj,
          updatedAt: {
            [Op.between]: [from, to]
          }
        } : {
          ...whereObj,
          updatedAt: {
            [Op.lte]: to
          }
        }
      }

      if (tenantId) {
        whereObj.tenantId = tenantId
      }
      if (status) {
        whereObj.status = status
      }
      if (type) {
        whereObj.type = type
      }
      if (name) {
        whereObj.name = name
      }

      var tenantList: any = await this.model.findAndCountAll({
        where: {
          // type: { [Op.not]: localConstant.TENANT_SUPER_TYPE_SEEDER },
          ...(!sync && { type: { [Op.not]: localConstant.TENANT_SUPER_TYPE_SEEDER } }),
          ...query.where,
          ...whereObj,
        },
        include: [{
          model: this.models.TenantFeature
        }],
        limit: query.limit,
        offset: query.offset,
        order: query.order


      })


      var tenantListCount: any = await this.model.count({
        where: {
          // type: { [Op.not]: localConstant.TENANT_SUPER_TYPE_SEEDER },
          ...(!sync && { type: { [Op.not]: localConstant.TENANT_SUPER_TYPE_SEEDER } }),
          ...query.where,
          ...whereObj,
        },
      })
      // becouse of count error 
      tenantList.count = tenantListCount;
      return Promise.resolve(tenantList)

    } catch (error: any) {
      this.logger.error("Error at readAllTenant ", error.message);
      return Promise.reject(error.message)

    }
  }

  async createTenant(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      const { name, description, contact, type, parent, path, logo, features }: any = req.body || req;
      const tenantDataExist = await this.model.findOne({ where: { name: name }, paranoid: false, transaction: _transaction });
      if (tenantDataExist) {
        throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.TENANT_EXIST)
      }
      let typeP = type;
      if (typeP === '') {
        typeP = localConstant.TENANT_DEFALUT_TYPE;
      }
      const tenantCreateData = await this.model.create({ name: name, description: description, contact: contact, type: typeP, parent: parent, path: path, logo: logo }, { transaction: _transaction })
      const tenantId = tenantCreateData.id;


      // getting all feature id and inserting to each tenant feature list
      const featureList = await this.models.Feature.findAndCountAll();
      for (const value of featureList.rows) {
        this.logger.info("feature ID", value.id)
        if (value.name == TRACKNTRACE) {
          await this.models.TenantFeature.create({ tenantId: tenantId, featureId: value.id, featureName: value.name, isEnabled: constant.ISENABLED_FALSE }, { transaction: _transaction });
        }

        else {
          await this.models.TenantFeature.create({ tenantId: tenantId, featureId: value.id, featureName: value.name, isEnabled: constant.ISENABLED_TRUE }, { transaction: _transaction });
        }
      }

      await _transaction.commit();

      // getting tenant Data
      let tenantData: any = await this.model.findAll({
        where: { id: tenantId },
        include: [{
          model: this.models.TenantFeature,
        }]
      });
      tenantData = JSON.parse(JSON.stringify(tenantData))


      // prepare tenant data to sync      
      if (tenantData.length) {
        let syncTenantData = { ...tenantData[0] }
        const { id: tenantId, name: tenantName, ...fields } = syncTenantData;
        syncTenantData = {
          ...fields,
          tenantId,
          tenantName,
        }


        // for data synced to device management
        await tenantExternalCommInstance.syncTenantDataAdd(tenantId, syncTenantData);
      }

      //  FETCHING PREDEFINED PROCESSES 
      let preDefinedProcess: any = await tenantExternalCommInstance.getPredefinedProcesses();
      let preDefinedProcessdata: any = preDefinedProcess.data.result;

      preDefinedProcessdata.map(async (obj: any) => {
        obj.tenantId = tenantId;
        delete obj["id"];
        delete obj["createdBy"];
        delete obj["updatedBy"];
        delete obj["createdAt"];
        delete obj["updatedAt"];
        delete obj["deletedAt"];
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + ':' + today.getMilliseconds();
        this.logger.info("Before Calling Preedefine Process From Tenant Creation ", date + ' ' + time, "Tenant Data=>", obj);
        if (obj.tenantId !== null) {
          await tenantExternalCommInstance.postPredefinedProcess(obj);
          this.logger.info("After Calling Preedefine Process From Tenant Creation ", date + ' ' + time);
        }
        else {
          await _transaction.rollback();
          throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.TENANT_PRE_DEFINE_PROCESS_ERROR)
        }
      });


      return Promise.resolve(tenantData)

    }
    catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at createTenants ", err.message);
      return Promise.reject(err.message)

    }
  }

  async updateTenant(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      const { name, features }: any = req.body || req;
      let id = req.params.id;
      if (id === null || id === "") {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_ID_REQUIRED);
      }
      const tenantRecordExist = await this.model.findOne({ where: { id: id }, transaction: _transaction });
      if (!tenantRecordExist) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_NOT_FOUND);
      }

      // check if tenant change his name
      if (name !== undefined && name !== tenantRecordExist.name) {
        const tenantExist = await this.model.findOne({ where: { name: name, id: { [Op.not]: id } }, paranoid: false, transaction: _transaction });
        if (tenantExist) {
          throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.TENANT_EXIST);
        }
      }
      if (features !== undefined && features.length > 0) {
        for (const value of features) {
          const isEnabled = value.isEnabled;
          const id = value.id;
          await this.models.TenantFeature.update({ isEnabled: isEnabled }, { where: { id: id }, transaction: _transaction });
        }
      }
      await this.model.update(req.body, { where: { id: id }, transaction: _transaction });
      await _transaction.commit();

      // getting tenant Data
      const tenantData = await this.model.findOne({
        where: { id: id },
        include: [{
          model: this.models.TenantFeature,
        }],
      });
      if (tenantData) {
        let syncTenantData = { ...JSON.parse(JSON.stringify(tenantData)) }
        const { id: tenantId, name: tenantName, ...fields } = syncTenantData
        syncTenantData = {
          ...fields,
          tenantId,
          tenantName,
        }
        this.logger.debug("TennatDatat...", syncTenantData)
        // for data synced to device management
        await tenantExternalCommInstance.syncTenantDataUpdate(id, syncTenantData);

      }

      return Promise.resolve(tenantData)

    }
    catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at updateTenants ", err.message);
      return Promise.reject(err.message)
    }
  }

  async deleteTenant(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      let id = req.params.id;
      if (id === null || id === "") {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_ID_REQUIRED);
      }
      let exisitingTenant = await this.model.findByPk(id, { transaction: _transaction })


      if (!exisitingTenant) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_NOT_FOUND);
      }
      this.logger.info("deleteExternal_deleteTenant_before", id)
      let deleteExternal: any = await tenantExternalCommInstance.deleteSiteData(id);
      this.logger.info("deleteExternal_deleteTenant")
      if (deleteExternal !== localConstant.DATA_DELETED) {
        throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, `Error in tenant deletion`);
      }

      // Deleting tagsCount, enablementByProcesses, enablementByProducts, enablements by external comm
      await tenantExternalCommInstance.deleteTagData(id);

      await this.model.destroy({ where: { id: id }, transaction: _transaction });
      // for data synced to device management
      await tenantExternalCommInstance.syncTenantDataDelete(id);
      await _transaction.commit();
      return Promise.resolve(localConstant.TENANT_DELETED)


    } catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at deleteTenant ", err.message);
      return Promise.reject(err.message)
    }

  }

  async restoreTenant(req: Request) {

    const _transaction = await databaseInstance.transaction();
    try {
      let id = req.params.id;
      if (id === null || id === "") {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_ID_REQUIRED);
      }

      let deleteExternal: any = await tenantExternalCommInstance.deleteSiteData(id);
      if (deleteExternal !== localConstant.DATA_DELETED) {
        throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.TENANT_NOT_DELETED);
      }

      // const futureStartAtDate1 = new Date(moment().locale("en").format("MMM DD, YYYY HH:MM"))
      const futureStartAtDate = moment().format("YYYY-MM-DD")

      await this.model.restore({
        where: {
          id: id,
          updatedAt:
          {
            [Op.like]: '%' + futureStartAtDate + '%',
          }
        }, transaction: _transaction, logging: true
      });
      // for data synced to device management
      await tenantExternalCommInstance.syncTenantDataDelete(id);
      await _transaction.commit();
      return Promise.resolve("Tenant restore Successfully")


    } catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at deleteTenant ", err.message);
      return Promise.reject(err.message)
    }

  }



  // upload the tenant logo image to the Azure Storage.
  async uploadImagetoS3(req: Request, res: Response) {
    let picture: any = req?.file
    try {
      const containerName: any = process.env.CONTAINERNAME;
      const blobServiceClient = BlobServiceClient.fromConnectionString(storage);
      // const returnedBlobUrls: string[] = [];
      let returnedBlobUrls

      if (picture == undefined)
        throw new Exception(constant.SUCCESS_NO_CONTENT, 'Image is required')

      if (picture) {
        // Get a reference to a container
        const containerClient = blobServiceClient.getContainerClient(containerName);

        const blobClient = containerClient.getBlockBlobClient(picture.filename);

        // set mimetype as determined from browser with file upload control
        const options = { blobHTTPHeaders: { blobContentType: picture.mimetype } };
        var img = fs.readFileSync(picture.path);
        var encode_img = img.toString('base64');
        let obj = Buffer.from(encode_img, 'base64')

        // upload file
        const uploadBlobResponse: any = await blobClient.uploadData(obj, options);
        this.logger.info("Tenant Logo was uploaded successfully. requestId: ", uploadBlobResponse.requestId);

        // const downloadBlockBlobResponse = await blockBlobClient.download(0);
        returnedBlobUrls = `https://${process.env.STORAGENAME}.blob.core.windows.net/${process.env.CONTAINERNAME}/${picture.filename}`

      }
      return returnedBlobUrls

    } catch (err: any) {
      this.logger.error('Error in Logo Uploading: ', err.message)
      return Promise.reject(err.message)
    }
  }
}