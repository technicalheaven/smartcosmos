import { Response, Request } from "express";
import StatusCodes from 'http-status-codes';
const { v4: uuidv4 } = require('uuid');
import BaseService from '../../../core/services/base';
import { Exception, respHndlr } from "../../../middlewares/resp-handler";
import { paginator } from '../../../libs/pagination';
var constant = require('../../../middlewares/resp-handler/constants');
import {databaseInstance} from '../../../config/db'
import { featureExternalCommInstance } from "./externalCommFeature";

export class FeatureService extends BaseService {
  constructor({ model, models, logger }: any) {
    super({ model, models, logger });
  }

  // get Feature dataList
  async readOneFeature(req: Request) {
    try {

      const exisitingFeature = await this.model.findByPk(req.params.id);
      if (!exisitingFeature) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Feature with id ${req.params.id} doesn't exist`)
      }

      const featureData = await this.model.findAll({
        where: { id: req.params.id },
        include: [{
          model: this.models.FeatureAction,
        }],
      });

      return Promise.resolve(featureData)
      
    } catch (err:any) {
      this.logger.error("Error at readOneFeature ", err.message);
      return Promise.reject(err.message)
      
    }
  }

  async readAllFeature(req: Request) {

    try {

      let {
        name,
        description,
        status,
        sortBy,
        search,
        sortOrder,
        processType
      } = req.query
      
      let query = paginator(req.query, ['name', 'description'])
      let whereObj: any = {}
      if (req.query.featureId) {
        whereObj.featureId = req.query.featureId
      }
      if (req.query.name) {
        whereObj.name = req.query.name
      }
      if (req.query.isActive) {
        whereObj.isActive = req.query.isActive
      }
      if(processType!=undefined)
        {
          whereObj.name = processType
        }
      var featuretList = await this.model.findAndCountAll({
        where: {
          ...query.where,
          ...whereObj
        },
        limit: query.limit,
        offset: query.offset,
        order: [['name', 'ASC']],
        include: [{
          model: this.models.FeatureAction,
        }]
      })
      return Promise.resolve(featuretList)
      
    } catch (error:any) {
      this.logger.error("Error at readAllfeature ", error.message);
      return Promise.reject(error.message)
    }
  }

  async createFeature(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      const {id, name, featureActions }: any = req.body || req;
      const featureDataExist = await this.model.findOne({ where: { name: name },paranoid: false, transaction: _transaction });
      if (featureDataExist) {
        throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, `Feature Already Exist`)
      }
      

      const featureCreateData = await this.model.create({ ...req.body },{ transaction: _transaction })
      const featureId=featureCreateData.id;
          
      if (featureActions.length > 0) {
            for (const value of featureActions) {
          await this.models.FeatureAction.create({ featureId: featureId, name:value.name, description:value.description, isActive: value.isActive },{ transaction: _transaction });
        };
      } 
       // getting newly createed data 
       const featureData = await this.model.findAll({
        where: { id: featureId },
        include: [{
          model: this.models.FeatureAction,
        }],
      });
      // for data synced to device management
       await featureExternalCommInstance.syncFeatureDataAdd(id, featureData);
       await _transaction.commit();
       return Promise.resolve(featureData);
    }
    catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at createfeature ", err.message);
      return Promise.resolve(err.message);
    }
  }

  async updateFeature(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      let id = req.params.id;
      if (id === null || id === "") {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Feature id is required`);
      }
      const featureRecordExist = await this.model.findOne({ where: { id: id },transaction: _transaction });
      if (featureRecordExist === '' || featureRecordExist === null) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Feature Not Found`);
      }
      else {
        
        await this.model.update(req.body, { where: { id: id }, transaction: _transaction });
        
        // getting newly createed data 
       const featureData = await this.model.findAll({
        where: { id: id },
        include: [{
          model: this.models.FeatureAction,
        }],
      });
      await featureExternalCommInstance.syncFeatureDataUpdate(id, featureData);
        
        await _transaction.commit();
        return Promise.resolve(featureData);
        
      }
    }
    catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at updateFeature", err.message);
      return Promise.reject(err.message);
    }
  }
  
  async deleteFeature(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      let id = req.params.id;
      if (id === null || id === "") {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Feature id is required`);
      }
      let exisitingFeature = await this.model.findByPk(id, { transaction: _transaction })


      if (!exisitingFeature) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Feature Not Found`);
      }
      await this.model.destroy({ where: { id: id }, transaction: _transaction });
      await featureExternalCommInstance.syncFeatureDataDelete(id);
      await _transaction.commit();
      return Promise.resolve('Feature deleted successfully');
    
    } catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error in deleting Feature ", err.message);
      return Promise.reject(err.message);
    
    }

  }
}