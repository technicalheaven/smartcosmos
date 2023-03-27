import { Response, Request } from "express";
import BaseService from '../../../core/services/base';
import { Exception, respHndlr } from "../../../middlewares/resp-handler";
import { paginator } from '../../../libs/pagination';
var constant = require('../../../middlewares/resp-handler/constants');
var localConstant = require('../utils/constant');
import { databaseInstance } from '../../../config/db'
import { siteExternalCommInstance } from "./externalComm";
import sequelize, { Op } from "sequelize";
import { count } from "console";

import moment from "moment";

export class SiteService extends BaseService {
  constructor({ model, models, logger }: any) {
    super({ model, models, logger });

  }

  // get site dataList
  async readOneSite(req: Request) {
    try {

      const exisitingSite = await this.model.findAll({
        where: { id: req.params.id },
        include: [{
          model: this.models.SiteContact,
        },
        {
          model: this.models.SiteTenant,
        }
        ],
      });

      // const exisitingSite = await this.model.findByPk(req.params.id);
      if (exisitingSite.length<=0) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Site with id ${req.params.id} doesn't exist`)
      }

      let siteDataArr: any = []
      for (let i of exisitingSite) {
        let response = await this.formatSiteResponseData(i)
        siteDataArr.push(response)
      }

      return Promise.resolve(siteDataArr)

    } catch (err: any) {
      this.logger.error("Error at readOneSite ", err.message);
      return Promise.reject(err.message)

    }
  }

  // get site dataList
  async getTenantSite(req: Request) {
    try {
      const {tenantId, siteId} = req.params;
      const exisitingSite = await this.models.SiteTenant.findOne({
        where: { tenantId, siteId},
        include: [{
          model: this.model
        }],
      });

     
      if (!exisitingSite) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Site with id ${siteId} doesn't exist`)
      }

      return Promise.resolve(exisitingSite);

    } catch (err: any) {
      this.logger.error("Error at getTenantSite ", err.message);
      return Promise.reject(err.message)

    }
  }

  async siteCount(req: Request) {
    try {
      const {tenantId} = req.query;
      const whereCond = tenantId ? {tenantId} :{};
     
      return await this.models.SiteTenant.count({
        where: { ...whereCond }
      });

    } catch (err: any) {
      return Promise.reject(err.message)

    }
  }

  async readAllSite(req: Request) {

    try {

    
      let where = {}
      let WhereT = {}
      let WhereC = {}
      let {
        tenantId,
        siteId,
        name,
        status,
        phone,
        siteIdentifier,
        siteContactName,
        email,
        sortBy,
        search,
        sortOrder,
        to,
        from
      } = req.query
      let query = paginator(req.query, ['name', 'address', 'createdAt', 'updatedAt'])
      if (undefined == sortBy) { sortBy = 'name' }
      if (undefined == sortOrder) { sortOrder = 'ASC' }


      if(sortBy === 'numberOfDevice'){
        query.order = [[ { model: this.models.SiteTenant, as: 'siteTenant' } ,(sortBy), (sortOrder)]]
      }
      else if(sortBy === 'numberOfZone'){
        query.order = []
      }
      else{
        query.order =  [[String(sortBy), String(sortOrder)]]
      }

      //query.order =  [[String(sortBy), String(sortOrder)]]
    
      if(to != undefined) {
        where = from?{
            ...where,
            updatedAt: {
                [Op.between]: [from, to]
            }
        } : { ...where,
          updatedAt: {
              [Op.lte]: to
          }}
      }
      

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
      if (siteId != undefined) {
        where = {
          ...where,
          id: {
            [Op.eq]: siteId,
          },
        }
      }
      if (siteIdentifier != undefined) {
        where = {
          ...where,
          siteIdentifier: {
            [Op.eq]: siteIdentifier,
          },
        }
      }
      // siteTenant Table
      if (tenantId != undefined) {
        WhereT = {
          ...WhereT,
          tenantId: {
            [Op.eq]: tenantId,
          },
        }
      }
      // for site Contact Table
      if (siteContactName != undefined) {
        WhereC = {
          ...WhereC,
          firstName: {
            [Op.eq]: siteContactName,
          },
        }
      }
      if (phone != undefined) {
        WhereC = {
          ...WhereC,
          phone: {
            [Op.eq]: phone,
          },
        }
      }
      if (email != undefined) {
        WhereC = {
          ...WhereC,
          email: {
            [Op.eq]: email,
          },
        }
      }

      var siteList = await this.model.findAndCountAll({
        where: {
          ...query.where,
          ...where
        },
        limit: query.limit,
        distinct: true,
        offset: query.offset,
        order: query.order,
        include: [
          {
            model: this.models.SiteTenant,
            where: WhereT,
          },
          {
            model: this.models.SiteContact,
            where: WhereC
          }],
      })


      let siteDataArr: any = []
      for (let i of siteList.rows) {
        let response = await this.formatSiteResponseData(i)
        siteDataArr.push(response)
      }

      if(sortBy === 'numberOfZone'){
        if( sortOrder == 'ASC' ){
    
          siteDataArr.sort((a: any, b: any) => {
            return a.numberOfZone - b.numberOfZone;
        });
        
        }
        else if(  sortOrder == 'DESC'  ){
          siteDataArr.sort((a: any, b: any) => parseFloat(b.numberOfZone) - parseFloat(a.numberOfZone));

        }
      }


      let finalResponse =
      {
        count: siteList.count,
        rows: siteDataArr,

      }

      return Promise.resolve(finalResponse)

    } catch (error: any) {
      this.logger.error("Error at readAllSite ", error.message);
      return Promise.reject(error.message)

    }
  }

  async createSite(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      const { name, address, siteContactName, phone, email, siteIdentifier, longitude, latitude, tenantId }: any = req.body || req;

      // 1. check tenant active or not  
      const tenantDataExist = await siteExternalCommInstance.getTenant(tenantId);
 
      if (!tenantDataExist) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_NOT_FOUND)
      }
      // check site name already exit or not
      let [SiteExists,metadata] = await databaseInstance.query(`select t1.name, t2.tenantId from sites as t1 INNER JOIN  siteTenant as t2 ON t1.id=t2.siteId and t2.tenantId='${tenantId}'  where t1.name='${name}'`);
      if (SiteExists.length > 0) {
        throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.SITE_EXIST)
      }
      // 3. To check siteIdentifier
      if (siteIdentifier) {
        const SiteIdentifierExist = await this.model.findAll({
          where: { siteIdentifier: siteIdentifier },
          include: [{
            model: this.models.SiteTenant,
            where: { tenantId: tenantId }
          }], paranoid: false,
          transaction: _transaction
        });

        if (SiteIdentifierExist.length > 0) {
          throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.SITE_IDENTIFIER_EXIST)
        }

      }
      // checking email if user put any email address
     if(email!==undefined)
     { 
        const SiteEmailExist = await this.model.findAll({
          include: [{
            model: this.models.SiteContact,
            where: { email: email }
          }], paranoid: false,
          transaction: _transaction
        });

        if (SiteEmailExist.length > 0) {
          throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.SITE_EMAIL_EXIST)
        }
      }
      const siteResponse = await this.model.create({ name: name, address: address, siteIdentifier: siteIdentifier, longitude: longitude, latitude: latitude }, { transaction: _transaction })
      const siteId = siteResponse.id;
      

      await this.models.SiteContact.create({ siteId: siteId, firstName: siteContactName, phone: phone, email: email, phoneType: '' }, { transaction: _transaction })
      await this.models.SiteTenant.create({ siteId: siteId, tenantId: tenantId, numberOfDevice: '0' }, { transaction: _transaction })

      await _transaction.commit();
      
      // create DashBoardHeaderReport while creating site 
     await siteExternalCommInstance.createDashBoardHeaderReport({tenantId, siteId, entity:'site', action: 'create'});
     
      const siteInsertResponse = await this.model.findAll({
        where: { id: siteResponse.id },
        include: [{
          model: this.models.SiteContact
        },
        {
          model: this.models.SiteTenant
        }],
      });

      // prepare site data to sync
      if (siteInsertResponse) {
        let syncSiteData = {...JSON.parse(JSON.stringify(siteInsertResponse[0]))}
       
        const {id: siteId, ...fields} = syncSiteData
        syncSiteData = {
          ...fields,
          siteId,
          tenantId,
        }

        await siteExternalCommInstance.syncSiteDataAdd(siteId, syncSiteData);
        
      }

      let siteDataArr: any = []
      for (let i of siteInsertResponse) {
        let response = await this.formatSiteResponseData(i)
        siteDataArr.push(response)
      }
      let finalResponse: any =
      {
        count: 1,
        rows: siteDataArr,

      }
      return Promise.resolve(finalResponse)

    }
    catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at createSite ", err.message);
      return Promise.reject(err.message)

    }
  }

  async updateSite(req: Request) {    

    const _transaction = await databaseInstance.transaction();
    try {
      let { siteContactName, phone, email, ...siteUpdateDataReq }: any = req.body || req;
      let { name, tenantId, siteIdentifier, status }: any = req.body || req;

      let id = req.params.id;
      if (id === null || id === "") {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_ID_REQUIRED);
      }
      const siteRecordExist = await this.model.findOne({ where: { id: id }, transaction: _transaction });
      if (siteRecordExist === '' || siteRecordExist === null) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_NOT_FOUND);
      }
      else {
        // getting site existing data
        const exisitingSite = await this.model.findAll({
          where: { id: req.params.id },
          include: [{
            model: this.models.SiteContact,
          },
          {
            model: this.models.SiteTenant,
          }
          ],
        });
        // format response data
        let siteDataArr: any = []
        for (let i of exisitingSite) {
          let response = await this.formatSiteResponseData(i)
          siteDataArr.push(response)
        }

        // 1. check tenant active or not  
        const tenantDataExist = await siteExternalCommInstance.getTenant(tenantId);
        if (!tenantDataExist) {
          throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_NOT_FOUND)
        }
        // check site name, if name is change the 
        const SiteExists = await this.model.findAll({
          where: { name: name },
          include: [{
            model: this.models.SiteTenant,
            where: { tenantId: tenantId }
          }],
          transaction: _transaction
        });
        if (name !== siteDataArr[0]['name'] && name !== '') {
          if (SiteExists.length > 0) {
            throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.SITE_EXIST)
          }
        }
        // check site identifiers
        if (siteIdentifier !== undefined && siteIdentifier !== null) {
          const SiteIdentifierExist = await this.model.findAll({
            where: { siteIdentifier: siteIdentifier },
            include: [{
              model: this.models.SiteTenant,
              where: { tenantId: tenantId }
            }],
            transaction: _transaction
          });
          if (siteIdentifier !== siteDataArr[0]['siteIdentifier'] && siteIdentifier !== '') {
            if (SiteIdentifierExist.length > 0) {
              throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.SITE_IDENTIFIER_EXIST)
            }
          }
        }
        if (email !== undefined && email !== null) {
          // check site email number
          const SiteEmailExist = await this.model.findAll({
            include: [{
              model: this.models.SiteContact,
              where: { email: email }
            }],
            transaction: _transaction
          });
          if (email !== siteDataArr[0]['email'] && email !== '') {
            if (SiteEmailExist.length > 0) {
              throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.SITE_EMAIL_EXIST)
            }
          }
        }
        if (email === null || email === undefined) {
          email = siteDataArr[0]['email'];
        }
        if (siteContactName === null || siteContactName === undefined) {
          siteContactName = siteDataArr[0]['siteContactName'];
        }
        if (phone === null || phone === undefined) {
          phone = siteDataArr[0]['phone'];
        }
    
        await this.model.update(siteUpdateDataReq, { where: { id: id }, transaction: _transaction })
        await this.models.SiteContact.update({ firstName: siteContactName, phone: phone, email: email, phoneType: '', status: status }, { where: { siteId: id }, transaction: _transaction })
        if (siteDataArr[0]['numberOfZone'] !== 0) {
          await siteExternalCommInstance.getZoneSiteNameUpdated(id, name)
        }
        // for data synced to device management

        await _transaction.commit();
        // getting updated result for return
        const updatedSite = await this.model.findAll({
          where: { id: req.params.id },
          include: [{
            model: this.models.SiteContact,
          },
          {
            model: this.models.SiteTenant,
          }],
        });   
        
        if(updatedSite){
          let syncSiteUpdatedData = {...JSON.parse(JSON.stringify(updatedSite[0]))}
          const {id: siteId, ...fields} = syncSiteUpdatedData
          syncSiteUpdatedData = {
            ...fields,
            siteId,
          }
          await siteExternalCommInstance.syncSiteDataUpdate(siteId, syncSiteUpdatedData);

                // SYNCING WITH DEVICE ===> DEVICESITEZONEPROCESS TABLE
                // GETTING DEVICE ID BY ZONE ID
                let deviceData =  await siteExternalCommInstance.getDeviceSiteZoneProcessBySiteId(siteId);
               
                let deviceIdData: any = []; 
                for(let item of deviceData?.data?.result){
                    deviceIdData.push(item?.deviceId);
                }
                //  UPDATING ZONE BY FETCHED DEVICE ID
                for(let item of deviceIdData){
                    await siteExternalCommInstance.updateDeviceSiteZoneProcess(item, syncSiteUpdatedData);
                }
        }
        
       // updating tags digitized data while site name will changes
       if (name !== siteDataArr[0]['name'] && name !== '') 
       {
        this.logger.info("Hellop name_491",name);
         // calling non async method
          //siteExternalCommInstance.updateExistingDigitizedTagWithSiteName(id,name);
       }  

        // format response data
        let updatedDataArr: any = []
        for (let i of updatedSite) {
          let response = await this.formatSiteResponseData(i)
          updatedDataArr.push(response)
        }

        return Promise.resolve(updatedDataArr)
      }
    }
    catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at updateTenants ", err.message);
      return Promise.reject(err.message)
    }
  }

  async updateSiteStatus(req: Request) {

    const _transaction = await databaseInstance.transaction();
    try {

      let id = req.params.id;
      if (id === null || id === "") {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_ID_REQUIRED);
      }
      const siteRecordExist = await this.model.findOne({ where: { id: id }, transaction: _transaction });
      if (siteRecordExist === '' || siteRecordExist === null) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_NOT_FOUND);
      }
      else {

        await this.model.update(req.body, { where: { id: id }, transaction: _transaction })
        // for data synced to device management
        await siteExternalCommInstance.syncSiteDataUpdate(id, req.body);
        await _transaction.commit();
        // getting updated result for return
        const updatedSite = await this.model.findAll({
          where: { id: req.params.id },
          include: [{
            model: this.models.SiteContact,
          },
          {
            model: this.models.SiteTenant,
          }],
        });
        // format response data
        let updatedDataArr: any = []
        for (let i of updatedSite) {
          let response = await this.formatSiteResponseData(i)
          updatedDataArr.push(response)
        }
        await siteExternalCommInstance.syncSiteDataUpdate(id, updatedDataArr);
        return Promise.resolve(updatedDataArr)
      }
    }
    catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at updateSite Status ", err.message);
      return Promise.reject(err.message)
    }
  }

  async deleteSite(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {      
      let id = req.params.id;

      if (id === null || id === "") {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_ID_REQUIRED);
      }
      let exisitingSite = await this.model.findByPk(id, { 
        raw:true,
        include: [{
          model: this.models.SiteTenant
        }],
        transaction: _transaction
       })       
      
  
      if (!exisitingSite) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_NOT_FOUND);
      }


      const tenantId = exisitingSite['siteTenant.tenantId'];
      const siteId = exisitingSite['siteTenant.siteId'];

       let deleteExternal: any = await siteExternalCommInstance.deleteSiteViaSiteIdData(id);
      
       if (deleteExternal === localConstant.DATA_DELETED)
       {
        await this.model.update({ status: 'Deleted' }, { where: { id: id }, transaction: _transaction })
        await this.model.destroy({ where: { id: id }, transaction: _transaction });
        await this.models.SiteTenant.destroy({ where: { siteId: id }, transaction: _transaction });
        await this.models.SiteContact.destroy({ where: { siteId: id }, transaction: _transaction });
        
        // for data synced to device management
        await siteExternalCommInstance.syncSiteDataDelete(id, tenantId);

         // create DashBoardHeaderReport while deleting site 	
         await siteExternalCommInstance.createDashBoardHeaderReport({tenantId, siteId, entity:'site', action: 'delete'});
        await _transaction.commit();
        return Promise.resolve(localConstant.SITE_DELETED)
      } else {
        await _transaction.commit();
        throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, `Error in Site deletion`);
      }

    } catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at deleteSite deleteSite ", err.message);
      return Promise.reject(err.message)
    }

  }

  // delete site via tenant Id 
  async deleteSiteViaTenantId(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try { 
      let id = req.params.id;
      let tenantId = req.params.id
      if (id === null || id === "") {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_ID_REQUIRED);
      }
    
      this.logger.info("deleteSiteViaTenantId Tenant ID ",id)
      let deletedSiteIds:any=[];
      const allSite = await this.model.findAll({
        where: {  deletedAt: { [Op.eq]: null  } },
        include: [{
          model: this.models.SiteTenant,
          where: { tenantId: id }
        }
        ],
      });
      if(allSite.length>0)
      {
        for (const value of allSite) 
        {
          this.logger.info("site ID",value.id)
          let siteId = value.id
          deletedSiteIds.push(value.id);
          await this.model.destroy({ where:  {id: value.id }, transaction: _transaction });
          // create DashBoardHeaderReport while deleting site 	
         await siteExternalCommInstance.createDashBoardHeaderReport({tenantId, siteId, entity:'site', action: 'delete'});

          await this.models.SiteContact.destroy({ where: { siteId: value.id }, transaction: _transaction });  
          await siteExternalCommInstance.syncSiteDataDelete(value.id, id);
        }
        await this.models.SiteTenant.destroy({ where: { tenantId: id }, transaction: _transaction });
      }
      // for data synced to device management
      await _transaction.commit();
      if(deletedSiteIds.length>0)
      {      
        await siteExternalCommInstance.syncSiteDataBulkDelete(deletedSiteIds, id);
      }
      return Promise.resolve(localConstant.SITE_DELETED)
    } catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at deleteSite deleteSiteViaTenantId", err.message);
      return Promise.reject(err.message)
    }
  }

  // restore
  async retoreSiteViaTenantId(req: Request) {

    const _transaction = await databaseInstance.transaction();
    try {
      let id = req.params.id;
      if (id === null || id === "") {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_ID_REQUIRED);
      }

      const futureStartAtDate1 = new Date(moment().locale("en").format("MMM DD, YYYY HH:MM"))
      const futureStartAtDate = moment().format("YYYY-MM-DD")

      await this.model.restore({
        include: [
          {
            model: this.models.SiteTenant,
            where: { tenantId: id },
            updatedAt:
            {
              [Op.like]: '%' + futureStartAtDate + '%',
            }
          }
        ], logging: true, transaction: _transaction
      });
      // for data synced to device management
      //await siteExternalCommInstance.syncSiteDataDelete(id);
      await _transaction.commit();
      return Promise.resolve("Site restore Successfully")
    } catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Error at deleteSite retoreSiteViaTenantId", err.message);
      return Promise.reject(err.message)
    }
  }

  async retoreSiteViaSiteId(req: Request) {

    const _transaction = await databaseInstance.transaction();
    try {
      let id = req.params.id;
      if (id === null || id === "") {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_ID_REQUIRED);
      }

      await this.model.restore({
        include: [
          {
            model: this.models.SiteTenant,
            where: { siteId: id }
          }
        ], logging: true, transaction: _transaction
      });
      // for data synced to device management
      //await siteExternalCommInstance.syncSiteDataDelete(id);
      await _transaction.commit();
      return Promise.resolve("Site restore Successfully")
    } catch (err: any) {
      await _transaction.rollback();
      this.logger.error("Restore at deleteSite retoreSiteViaSiteId", err.message);
      return Promise.reject(err.message)
    }
  }



  // Update device count for Site

  async updateDeviceCount(req: Request) {

    const _transaction = await databaseInstance.transaction();
    try {
      const { siteId, totalDeviceCount }: any = req.body || req;
      let exisitingSite = await this.models.SiteTenant.findOne({ where: { siteId: siteId }, transaction: _transaction })
      if (!exisitingSite) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_NOT_FOUND);
      }
      await this.models.SiteTenant.update({ numberOfDevice: totalDeviceCount }, { where: { siteId: siteId }, transaction: _transaction })
      await _transaction.commit();
      return Promise.resolve(localConstant.DEVICE_ASSIGNMENT)
    }
    catch (error: any) {
      this.logger.error("Error in Device Assignment", error.message);
      return Promise.reject(error.message);
    }
  }

  // get zone n

  // for univeral format for all return response
  async formatSiteResponseData(data: any) {
    try {

      let zoneData = await siteExternalCommInstance.getZoneCount(data.id);
      let zoneCount = 0;

      // getting no of device
      let deviceData = await siteExternalCommInstance.getAllDevices(data.id);
      let deviceCount = 0;
      if (deviceData) {
        deviceCount = deviceData.data.result.count;
      }

      if (zoneData) {
        zoneCount = zoneData.data.result.count;
      }

      //let numberOfZone=zoneData.length;
      let response = {
        id: data.id,
        name: data.name,
        address: data.address,
        longitude: data.longitude,
        latitude: data.latitude,
        siteIdentifier: data.siteIdentifier,
        status: data.status,
        tenantId: data.siteTenant[0].tenantId,
        numberOfDevice: deviceCount,
        numberOfZone: zoneCount,
        siteContactName: data.siteContact[0].firstName,
        email: data.siteContact[0].email,
        phone: data.siteContact[0].phone,
        phoneType: data.siteContact[0].phoneType,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,

      }
      return Promise.resolve(response)
    } 
    catch (error: any) {
      this.logger.error("Error in formatSiteResponseData", error.message);
      return Promise.reject(error.message);
    }
  }

}
