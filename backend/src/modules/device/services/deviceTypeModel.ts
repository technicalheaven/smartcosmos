import { Response, Request } from "express";
import StatusCodes from 'http-status-codes';
const { v4: uuidv4 } = require('uuid');
import BaseService from '../../../core/services/base';
import { Exception, respHndlr } from "../../../middlewares/resp-handler";
import { paginator } from '../../../libs/pagination/index';
var constant = require('../../../middlewares/resp-handler/constants');
var localConstant = require('../utils/constants');
import { databaseInstance } from '../../../config/db'
import { deviceExternalCommInstance } from './externalComm';
import { Sequelize,Op , QueryTypes} from "sequelize";

export class DeviceTypeModelService extends BaseService {
  constructor({ model, models, logger }: any) {
    super({ model, models, logger });

  }

  // get Device dataList
  async readOne(req: Request) {
    try {

      const exisitingDeviceTypeModel = await this.model.findByPk(req.params.id);
      if (!exisitingDeviceTypeModel) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.DEVICE_MANAGER_NOT_FOUND)
      }
      // return data
      const deviceTypeModelResponse = await this.model.findAll({  where: { id: req.params.id } });
      return Promise.resolve(deviceTypeModelResponse)

    } catch (err) {
      this.logger.error("Error at readOne in DeviceTypeModel");
      return Promise.reject("Error in reading device type model")

    }
  }

    async readDistinctType(req: Request) {
    try {

      const exisitingDeviceTypeModel = await this.model.findByPk(req.params.id);

      // this.model.findAll({
      //   attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('type')), 'type']],
      //   'id'  })

     let deviceType=   this.model.findAll({
          attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('type')), 'type']]
     })

      if (!deviceType) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.DEVICE_MANAGER_NOT_FOUND)
      }
     
      return Promise.resolve(deviceType)

    } catch (err) {
      this.logger.error("Error at readOne in DeviceTypeModel");
      return Promise.reject("Error in reading distinct device type")

    }
  }


  async readAll(req: Request) {
    try {

      let where = {}
      let WhereT = {}
      let {
        tenant,
        status,
        type,
        model,
        sortBy,
        search,
        sortOrder
      } = req.query
      
      let query = paginator(req.query, ['type', 'model','createdAt','updatedAt'])
      if (undefined == sortBy) { sortBy = 'type' }
      if (undefined == sortOrder) { sortOrder = 'ASC' }
      query.order =  [[String(sortBy), String(sortOrder)]]
      if (status != undefined) {
        where = {
          ...where,
          status: {
            [Op.eq]: status,
          },
        }
      }
      if (type != undefined) {
        where = {
          ...where,
          type: {
            [Op.eq]: type,
          },
        }
      }
      if (model != undefined) {
        where = {
          ...where,
          model: {
            [Op.eq]: model,
          },
        }
      }
    
      var deviceManagerList = await this.model.findAndCountAll({
        where: {
          ...query.where,
          ...where
        },
        limit: query.limit,
        distinct: true,
        offset: query.offset,
        order: query.order,
      })
      return Promise.resolve(deviceManagerList)

    } catch (error) {
      this.logger.error("Error at readAll Device Manager List ");
      return Promise.reject("Error in reading all device type model")

    }
  }


  async create(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      // request destructuring  
      const { type, model }: any = req.body || req;
    
    
     // check name with tenant id
      const DeviceTypeModelExists = await this.model.findAll({ where: { type: type, model:model },paranoid: false,  transaction: _transaction  });
      if (DeviceTypeModelExists.length > 0) 
      {
        throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.DEVICE_MODEL_EXIST)
      }
     // insert in deviceConfig
      const deviceTypeModelResponse = await this.model.create(req.body , { transaction: _transaction })
      const modelId = deviceTypeModelResponse.id;
      
      await _transaction.commit();
      const deviceTypeModeInsertResponse = await this.model.findAll({
        where: { id: modelId },
      });
      return Promise.resolve(deviceTypeModeInsertResponse);
    } catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at create Device Type Model");
      return Promise.reject("Error in creating device model type")
    }

  }

  // for updating
  async update(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      let modelId = req.params.id;
      
      const { type, model}: any = req.body || req;
      
      // getting data 
      const oldData = await this.model.findAll({ where: { id: modelId } });

      
        // check name with tenant id
        const DeviceTypeModelExists = await this.model.findAll({ where: { type: type, model:model, id: { [Op.ne]: modelId } },paranoid: false,  transaction: _transaction  });
        if (DeviceTypeModelExists.length > 0) 
        {
            throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.DEVICE_MODEL_EXIST)
        }
      

      //Update in Device Manager
      await this.model.update( req.body, { where: { id: modelId } }, { transaction: _transaction })
      await _transaction.commit();

      const deviceTypeModelUpdateResponse = await this.model.findAll({where: { id: modelId }  });
      return Promise.resolve(deviceTypeModelUpdateResponse);
    } catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at Device Type Model Updation");
      return Promise.reject("Error in updating device model type")
    }

  }

async delete(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      const modelId = req.params.id;
      // check if device exist or not 
      const exisitingDeviceModel = await this.model.findOne({where: { id: modelId },transaction: _transaction});
      if (!exisitingDeviceModel) {
        throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.DEVICE_MODEL_NOT_FOUND)
      }

      await this.model.destroy({ where:{id:modelId},transaction: _transaction 
      }); 
      await _transaction.commit();
      return Promise.resolve(localConstant.DEVICE_MANAGER_DELETED);
    }
    catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at Device Type Model Deletion");
      return Promise.reject("Error in delete device model type")
    }
  }

}