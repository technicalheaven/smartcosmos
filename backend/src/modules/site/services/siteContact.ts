import { Response, Request } from "express";
import BaseService from '../../../core/services/base';
import { Exception, respHndlr } from "../../../middlewares/resp-handler";
import { paginator } from '../../../libs/pagination';
var constant = require('../../../middlewares/resp-handler/constants');
var localConstant = require('../utils/constant');
import { databaseInstance } from '../../../config/db'
import sequelize, { Op } from "sequelize";

export class SiteContactService extends BaseService {
  constructor({ model, models, logger }: any) {
    super({ model, models, logger });

  }

  // get site contact dataList
  async readOneSiteContact(req: Request) {
    try {

      const exisitingSiteContact = await this.model.findAll({
        where: { id: req.params.id } });
      if (!exisitingSiteContact) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Site Contact with id ${req.params.id} doesn't exist`)
      }
      return Promise.resolve(exisitingSiteContact)
    } catch (err: any) {
      this.logger.error("Error at readOneSiteContact ", err.message);
      return Promise.reject(err.message)
    }
  }

  async readAllSiteContact(req: Request) {
    try {

      let query = paginator(req.query, ['firstName', 'phone','email'])
      query.order = [['firstName', 'ASC'],]

      let where = {}
      
      let {
        status,
        phone,
        firstName,
        email
      } = req.query

      
      // for site Contact Table
      if (status != undefined) {
        where = {
          ...where,
          firstName: {
            [Op.eq]: firstName,
          },
        }
      }
      if (firstName != undefined) {
        where = {
          ...where,
          firstName: {
            [Op.eq]: firstName,
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

      var siteContactList = await this.model.findAndCountAll({
        where: {
          ...query.where,
          ...where
        },
        limit: query.limit,
        distinct: true,
        offset: query.offset,
        order: query.order,
      })
      this.logger.info("siteContactList Row Data");
     
      return Promise.resolve(siteContactList)

    } catch (error: any) {
      this.logger.error("Error at readAllSiteContact ", error.message);
      return Promise.reject(error.message)

    }
  }

  async createSiteContact(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      const { firstName, phone, email, siteId }: any = req.body || req;

      // checking existing site name
      const SiteExists = await this.model.findAll({
        where: { siteId: siteId }, transaction: _transaction });
      if (!SiteExists) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_NOT_FOUND)
      }

      // 3. To check using email number
        const SiteEmailExist = await this.model.findAll({
          where: { email: email, siteId:{[Op.not]:siteId} }, transaction: _transaction });

        if (SiteEmailExist.length > 0) {
          throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.SITE_EMAIL_EXIST)
        }

      //const siteContactResponse =  await this.model.create({ siteId: siteId, firstName: siteContactName, phone: phone, email: email, phoneType: '' }, { transaction: _transaction })
     
      const siteContactResponse =  await this.model.create({ ...req.body }, { transaction: _transaction })
     
      await _transaction.commit();
      const siteInsertResponse = await this.model.findAll({
        where: { id: siteContactResponse.id }});

      return Promise.resolve(siteInsertResponse)

    }
    catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at createSiteContact ", err.message);
      return Promise.reject(err.message)

    }
  }

  async updateSiteContact(req: Request) {
  
    const _transaction = await databaseInstance.transaction();
    try {
      const { siteContactName, phone, email, status,siteId }: any = req.body || req;

      let id = req.params.id;
      if (id === null || id === "") {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_ID_REQUIRED);
      }
      const siteContactRecordExist = await this.model.findOne({ where: { id: id }, transaction: _transaction });
      if (siteContactRecordExist === '' || siteContactRecordExist === null) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_CONTACT_NOT_FOUND);
      }

      // check if email id is changed
      const SiteContactEmailExist = await this.model.findAll({ where: { email: email, siteId:{[Op.not]:siteId} },transaction: _transaction });
     // if (email !== siteContactRecordExist.email) 
     // {
        if (SiteContactEmailExist.length > 0) {
          throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.SITE_CONTACT_EMAIL_EXIST)
        }
    //  }

        //firstName: siteContactName, phone: phone, email: email, phoneType: '',status:status
        await this.models.SiteContact.update(req.body , { where: { id: id }, transaction: _transaction })
        await _transaction.commit();
      
        // getting updated result for return
        const updatedSiteContact = await this.model.findAll({
          where: { id: req.params.id }  });
        // format response data
        
        return Promise.resolve(updatedSiteContact)
      
    }
    catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at updateSiteContact ", err.message);
      return Promise.reject(err.message)
    }
  }

  async deleteSiteContact(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      let id = req.params.id;
      if (id === null || id === "") {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_ID_REQUIRED);
      }
      let exisitingSite = await this.model.findByPk(id, { transaction: _transaction })


      if (!exisitingSite) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_NOT_FOUND);
      }

        await this.model.destroy({ where: { id: id }, transaction: _transaction });
        await _transaction.commit();
        return Promise.resolve(localConstant.SITE_CONTACT_DELETED)

    } catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at deleteSiteContact ", err.message);
      return Promise.reject(err.message)
    }

  }

  

}