import { Response, Request } from "express";
import BaseService from '../../../core/services/base';
import { Exception, respHndlr } from "../../../middlewares/resp-handler";
import { paginator } from '../../../libs/pagination';
var constant = require('../../../middlewares/resp-handler/constants');
var localConstant = require('../utils/constants');
import { databaseInstance } from '../../../config/db'
import {tenantExternalCommInstance} from './externalComm';
import sequelize, { Op } from "sequelize";

export class TenantContactService extends BaseService {
  constructor({ model, models, logger }: any) {
    super({ model, models, logger });

  }

  // get Tenant contact dataList
  async readOneTenantContact(req: Request) {
    try {

      const exisitingTenantContact = await this.model.findAll({
        where: { id: req.params.id } });
      if (!exisitingTenantContact) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Tenant Contact with id ${req.params.id} doesn't exist`)
      }
      return Promise.resolve(exisitingTenantContact)
    } catch (err: any) {
      this.logger.error("Error at readOneTenantContact ", err.message);
      return Promise.reject(err.message)
    }
  }

  async readAllTenantContact(req: Request) {
     
    try {

      let query = paginator(req.query, ['firstName', 'phone','email'])
      query.order = [['firstName', 'ASC'],]

      let where = {}
      
      let {
        status,
        phone,
        name,
        email
      } = req.query

      
      // for site Contact Table
      if (status != undefined) {
        where = {
          ...where,
          firstName: {
            [Op.eq]: name,
          },
        }
      }
      if (name != undefined) {
        where = {
          ...where,
          firstName: {
            [Op.eq]: name,
          },
        }
      }
      if (phone != undefined) {
        where = {
          ...where,
          phone: {
            [Op.eq]: phone,
          },
        }
      }
      if (email != undefined) {
        where = {
          ...where,
          email: {
            [Op.eq]: email,
          },
        }
      }

      var TenantContactList = await this.model.findAndCountAll({
        where: {
          ...query.where,
          ...where
        },
        limit: query.limit,
        distinct: true,
        offset: query.offset,
        order: query.order,
      })
      this.logger.info("TenantContactList Row Data");
     
      return Promise.resolve(TenantContactList)

    } catch (error: any) {
      this.logger.error("Error at readAllTenantContact ", error.message);
      return Promise.reject(error.message)

    }
  }

  async createTenantContact(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      const { name, phone, email, tenantId }: any = req.body || req;

      // checking existing tenant or not 
      const tenantDataExist = await tenantExternalCommInstance.getTenant(tenantId);
      if (!tenantDataExist) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_NOT_FOUND)
      }

      // 3. To check using email number
        const TenantEmailExist = await this.model.findAll({
          where: { email: email, tenantId:{[Op.not]:tenantId}  }, transaction: _transaction });

        if (TenantEmailExist.length > 0) {
          throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.TENANT_EMAIL_EXIST)
        }


      const tenantContactResponse =  await this.model.create({ ...req.body }, { transaction: _transaction })
     
      await _transaction.commit();
      const tenantInsertResponse = await this.model.findAll({
        where: { id: tenantContactResponse.id }});

      return Promise.resolve(tenantInsertResponse)

    }
    catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at createTenantContact ", err.message);
      return Promise.reject(err.message)

    }
  }

  async updateTenantContact(req: Request) {

    const _transaction = await databaseInstance.transaction();
    try {
      const { name, phone, email, status,tenantId }: any = req.body || req;

      let id = req.params.id;
      if (id === null || id === "") {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_CONTACT_ID_NEED);
      }
      const tenantContactRecordExist = await this.model.findOne({ where: { id: id }, transaction: _transaction });
      if (tenantContactRecordExist === '' || tenantContactRecordExist === null) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_CONTACT_NOT_FOUND);
      }
      
       // check if email id is changed
       const TenantContactEmailExist = await this.model.findAll({ where: { email: email, tenantId:{[Op.not]:tenantId} },transaction: _transaction });
      //  if (email !== tenantContactRecordExist.email) 
      //  {
         if (TenantContactEmailExist.length > 0) {
           throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.TENANT_CONTACT_EMAIL_EXIST)
         }
       //}

        await this.model.update({ ...req.body }, { where: { id: id }, transaction: _transaction })
        await _transaction.commit();
      
        // getting updated result for return
        const updatedTenantContact = await this.model.findAll({
          where: { id: req.params.id }  });
        // format response data
        
        return Promise.resolve(updatedTenantContact)
      
    }
    catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at updateTenantContact ", err.message);
      return Promise.reject(err.message)
    }
  }

  async deleteTenantContact(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      let id = req.params.id;
      if (id === null || id === "") {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_CONTACT_ID_NEED);
      }
      let exisitingTenantContact = await this.model.findByPk(id, { transaction: _transaction })


      if (!exisitingTenantContact) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_CONTACT_NOT_FOUND);
      }

        await this.model.destroy({ where: { id: id }, transaction: _transaction });
        await _transaction.commit();
        return Promise.resolve(localConstant.TENANT_CONTACT_DELETED)

    } catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at deleteTenantContact ", err.message);
      return Promise.reject(err.message)
    }

  }

  

}