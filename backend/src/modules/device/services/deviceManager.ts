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
import { Op , QueryTypes} from "sequelize";

export class DeviceManagerService extends BaseService {
  constructor({ model, models, logger }: any) {
    super({ model, models, logger });

  }

  // get Device dataList
  async readOne(req: Request) {
    try {
     const exisitingDeviceManager = await this.model.findByPk(req.params.id);
      if (!exisitingDeviceManager) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.DEVICE_MANAGER_NOT_FOUND)
      }
      // return data
      const deviceManagerResponse = await this.model.findAll({  where: { id: req.params.id } });
      return Promise.resolve(deviceManagerResponse)

    } catch (err) {
      this.logger.error("Error at readOne in DeviceManager");
      return Promise.reject(err)

    }
  }


  async readAll(req: Request) {
    try {

      let where = {}
      let WhereT = {}
      let {
        tenant,
        status,
        name,
        description,
        type,
        url,
        sortBy,
        search,
        sortOrder
      } = req.query
      
      let query = paginator(req.query, ['name', 'tenantId', 'description','createdAt','updatedAt'])
      if (undefined == sortBy) { sortBy = 'name' }
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
      if (name != undefined) {
        where = {
          ...where,
          name: {
            [Op.eq]: name,
          },
        }
      }
      if (description != undefined) {
        where = {
          ...where,
          description: {
            [Op.eq]: description,
          },
        }
      }
      if (tenant != undefined) {
        where = {
          ...where,
          tenantId: {
            [Op.eq]: tenant,
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
      if (url != undefined) {
        where = {
          ...where,
          url: {
            [Op.eq]: url,
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
      return Promise.reject(error)

    }
  }


  async create(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      // request destructuring  
      const { name, url,tenantId ,...deviceData}: any = req.body || req;
    
      // 1. check tenant active or not  
      const tenantExist = await deviceExternalCommInstance.getTenant(tenantId);
      if (!tenantExist) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_NOT_FOUND)
      }
    
     // check name with tenant id
      const DeviceManagerExists = await this.model.findAll({ where: { name: name, tenantId:tenantId },paranoid: false,  transaction: _transaction  });
      if (DeviceManagerExists.length > 0) 
      {
        throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.DEVICE_MANAGER_EXIST)
      }
      const DeviceManagerExists2 = await this.model.findAll({ where: { url: url, tenantId:tenantId },paranoid: false,  transaction: _transaction  });
      if (DeviceManagerExists2.length > 0) 
      {
        throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.DEVICE_URL_EXIST)
      }

     // insert in deviceConfig
      const deviceManagerResponse = await this.model.create(req.body , { transaction: _transaction })
      const deviceManagerId = deviceManagerResponse.id;
     
     
      await _transaction.commit();

      const deviceManagerInsertResponse = await this.model.findAll({
        where: { id: deviceManagerId },
      });
       
      // // prepare device Manager data to sync
      // if (deviceManagerInsertResponse) {
      //   let syncDeviceManagerData = {...JSON.parse(JSON.stringify(deviceManagerInsertResponse[0]))}
      //   const {id: deviceManagerId, ...fields} = syncDeviceManagerData
      //   syncDeviceManagerData = {
      //     ...fields,
      //     deviceManagerId
      //   }
      //   console.log("syncDeviceManagerData..", syncDeviceManagerData);
        
      // }
      await deviceExternalCommInstance.syncDeviceManagerDataAdd(deviceManagerId, deviceManagerInsertResponse);
      return Promise.resolve(deviceManagerInsertResponse);
    } catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at create Device Manager");
      return Promise.reject(error)
    }

  }

  // for updating
  async update(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      let deviceManagerId = req.params.id;
      
      const { name, url, tenantId ,...deviceData}: any = req.body || req;
    
      // 1. check tenant active or not  
      const tenantExist = await deviceExternalCommInstance.getTenant(tenantId);
      if (!tenantExist) 
      {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_NOT_FOUND)
      }
      
      // getting data 
      const oldData = await this.model.findAll({ where: { id: deviceManagerId } });
      this.logger.info("oldData__",oldData[0].name)
      if(name!==null && name!==undefined && name!==oldData[0].name)
      {
        // check name with tenant id
        const DeviceManagerExists = await this.model.findAll({ where: { name: name, tenantId:tenantId },paranoid: false,  transaction: _transaction  });
        if (DeviceManagerExists.length > 0) 
        {
            throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.DEVICE_MANAGER_EXIST)
        }
      }
      if(url!==null && url!==undefined && url!==oldData[0].url)
      {
      const DeviceManagerExists2 = await this.model.findAll({ where: { url: url, tenantId:tenantId },paranoid: false,  transaction: _transaction  });
      if (DeviceManagerExists2.length > 0) 
      {
        throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.DEVICE_URL_EXIST)
      }
      }

      //Update in Device Manager
      await this.model.update( req.body, { where: { id: deviceManagerId } }, { transaction: _transaction })
      await _transaction.commit();

      const deviceUpdateResponse = await this.model.findAll({where: { id: deviceManagerId }  });
      await deviceExternalCommInstance.syncDeviceManagerDataUpdate(deviceManagerId, deviceUpdateResponse);
      return Promise.resolve(deviceUpdateResponse);
    } catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at Device Manager Updation");
      return Promise.reject(error)
    }

  }

async delete(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      const deviceManagerId = req.params.id;
      // check if device exist or not 
      const exisitingDevice = await this.model.findOne({where: { id: deviceManagerId },transaction: _transaction , logging:true});
      if (!exisitingDevice) {
        throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.DEVICE_MANAGER_NOT_FOUND)
      }
     
      
      let deviceData: any = await deviceExternalCommInstance.getDevice();
      let deviceRes = deviceData?.data?.result?.rows;

      for(let device of deviceRes){
        if(exisitingDevice?.dataValues?.url == device?.ip){
          throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.DEVICE_EXIST_FOR_DEVICE_MANAGER)
        }
      }
    

      await this.model.destroy({ where:{id:deviceManagerId},transaction: _transaction 
      }); 
      await _transaction.commit();
      
      await deviceExternalCommInstance.syncDeviceManagerDataDelete(deviceManagerId);
      return Promise.resolve(localConstant.DEVICE_MANAGER_DELETED);
    }
    catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at Device Manager Deletion");
      return Promise.reject(error)
    }
  }

}