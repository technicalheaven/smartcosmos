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
import { result } from "lodash";
import { ExternalCommInstance } from "../sync-service/services/externalComm";


export class DeviceService extends BaseService {
  constructor({ model, models, logger }: any) {
    super({ model, models, logger });

  }

  async readDeviceSiteZoneProcessByZoneId(req: Request){
    
    let  zoneId : any = req.params.id || req;
    
    try {
      let deviceData=await this.models.DeviceSiteZoneProcess.findAll({  
        where : {  zoneId:  zoneId}
      });

      return Promise.resolve(deviceData);
    }
    catch (error: any){
      this.logger.error("Error at reading DeviceSiteZoneProcess by zone id",error.message);
      return Promise.reject(error.message)
    }
  }

  async readDeviceSiteZoneProcessBySiteId(req: Request){
    let  siteId : any = req.params.id || req;
    
    try {
      let deviceData=await this.models.DeviceSiteZoneProcess.findAll({  
        where : {  siteId:  siteId}
      });

      return Promise.resolve(deviceData);
    }
    catch (error: any){
      this.logger.error("Error at reading DeviceSiteZoneProcess by site id",error.message);
      return Promise.reject(error.message)
    }
  }

  // get Device dataList
  async readOneDevice(req: Request) {
    try {
      let type = req.query.type
      let exisitingDevice
      if(type!==undefined || type!==null){
        exisitingDevice = await this.model.findOne({where :{[Op.or] :[{ id:req.params.id }, {mac:  req.params.id}] }});
      }else{
         exisitingDevice = await this.model.findByPk(req.params.id);
      }
      if (!exisitingDevice) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.DEVICE_NOT_FOUND)
      }
      //let deviceId=exisitingDevice?result?.id;
      // return data
      const deviceInsertResponse = await this.model.findAll({
        where: { id: exisitingDevice?.dataValues?.id  },
        include: [{
          model: this.models.DeviceSiteZoneProcess,
          
        },
          {
            model:this.models.DeviceTypeModel,
          }
        ]
      });
      return Promise.resolve(deviceInsertResponse)

    } catch (err) {
      this.logger.error("Error at readOneDevice");
      return Promise.reject("Error in reading device details")

    }
  }

  async deviceCount(req: Request) {
    try {
      const {siteId, tenantId} = req.query;
      const whereCond = tenantId ? {tenantId} : siteId  ? {siteId} : {};
     
      return await this.models.DeviceSiteZoneProcess.count({
        where: { ...whereCond }
      });

    } catch (error:any) {
      return Promise.reject(error.message)

    }
  }


  async readAllDevice(req: Request) {

    try {
      
      let where = {}
      let WhereT = {}
      let {
        tenant,
        site,
        zone,
        device,
        process,
        status,
        name,
        type,
        model,
        mac,
        sortBy,
        search,
        sortOrder,
        lastSyncAt,
        to,
        from
      } = req.query
      
      let query: any = paginator(req.query, ['name', 'type', 'mac', 'model', 'description','createdAt','updatedAt'])
      if (undefined == sortBy) { sortBy = 'name' }
      if (undefined == sortOrder) { sortOrder = 'ASC' }
      
      if(sortBy === 'zoneName' || sortBy === 'siteName'){
        query.order = [[ { model: this.models.DeviceSiteZoneProcess, as: 'deviceSiteZoneProcess' } ,(sortBy), (sortOrder)]]
      }
      else{
        query.order =  [[String(sortBy), String(sortOrder)]]
      }
     
     

      if (to != undefined) {
        where = from ? {
          ...where,
          updatedAt: {
            [Op.between]: [from, to]
          }
        } : {
          ...where,
          updatedAt: {
            [Op.lte]: to
          }
        }
      }
      if(lastSyncAt != undefined) {
        where = {
            ...where,
            updatedAt: {
                [Op.gt]: lastSyncAt
            }
        }
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
      if (mac != undefined) {
        where = {
          ...where,
          mac: {
            [Op.eq]: mac,
          },
        }
      }
      if (tenant != undefined) {
        WhereT = {
          ...where,
          tenantId: {
            [Op.eq]: tenant,
          },
        }
      }
      if (site != undefined) {
        WhereT = {
          ...WhereT,
          siteId: {
            [Op.eq]: site,
          },
        }
      }
      if (zone != undefined) {
        WhereT = {
          ...WhereT,
          zoneId: {
            [Op.eq]: zone,
          },
        }
      }
      if (device != undefined) {
        WhereT = {
          ...WhereT,
          deviceId: {
            [Op.eq]: device,
          },
        }
      }
      if (process != undefined) {
        WhereT = {
          ...WhereT,
          processId: {
            [Op.eq]: process,
          },
        }
      }
  
      var deviceList = await this.model.findAndCountAll({
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
            model: this.models.DeviceSiteZoneProcess,
            where: WhereT
          },
          {
            model:this.models.DeviceTypeModel,
          }  
        ],
      })

      return Promise.resolve(deviceList)

    } catch (error:any) {
      this.logger.error("Error at readAll Device List ",error.message);
      return Promise.reject(error.message)

    }
  }


  async createDevice(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      // request destructuring  
      const { siteId, zoneId, tenantId ,...deviceData}: any = req.body || req;
      const { mac, type }: any = req.body || req;
      let siteName='';
      let zoneName='';
      let deviceManagerUrl :any ='';
      // 1. check tenant active or not  
      const tenantExist = await deviceExternalCommInstance.getTenant(tenantId);
      if (!tenantExist) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_NOT_FOUND)
      }
      // check site
      if(siteId!==undefined &&  siteId!=='')
      {
           const siteExist = await deviceExternalCommInstance.getsite(siteId);
          if (siteExist.data.result.length===0) {
            throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_NOT_FOUND)
          }
          else
          {
            siteName=siteExist.data.result[0].name;
          }
          // check zone
          const zoneExist = await deviceExternalCommInstance.getZone(zoneId);
          if (!zoneExist) 
          {
            throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.ZONE_NOT_FOUND)
          }
          else
          {
             zoneName=zoneExist.data.result.name;
          }

          let combineData:any = 
          {
                tenantId:tenantId,
                siteId:siteId,
                zoneId:zoneId,
          }
      
        const combineCheck = await deviceExternalCommInstance.combineCheckOnTenantSiteZone(combineData);
        if(combineCheck.data.result.count===0)  
          {
            throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_SITE_ZONE_NOT_MATCHED)
          }


      }
      if(type==='Fixed Reader')
      {
        const DeviceManagerExist = await deviceExternalCommInstance.getDeviceManager(tenantId);
          if (DeviceManagerExist.data.result.count===0) 
           {
            throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.DEVICE_MANAGER_NOT_FOUND)
           }
           deviceManagerUrl=DeviceManagerExist.data.result.rows[0].url;
      }
      let temObj:any=
      {
        ...deviceData,
        deviceManagerUrl:deviceManagerUrl

      }
   
     
        // combined check for tenantid, site, 

      // check device with tenant id
      const DeviceExists = await this.model.findAll({ where: { mac: mac },paranoid: false, transaction: _transaction  });
      if (DeviceExists.length > 0) 
      {
        throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.DEVICE_EXIST)
      }

     // insert in deviceConfig
      const deviceResponse = await this.model.create(temObj, { transaction: _transaction })
      const deviceId = deviceResponse.id;
      await this.models.DeviceSiteZoneProcess.create({ deviceId: deviceId, tenantId: tenantId, siteId: siteId,siteName:siteName,zoneId: zoneId, zoneName:zoneName}, { transaction: _transaction })

      // create dashboard header report while creating device
      
      
      await _transaction.commit();
      const deviceInsertResponse = await this.model.findAll({
        where: { id: deviceId },
        include: [
          {
            model: this.models.DeviceSiteZoneProcess,
          },
          {
            model:this.models.DeviceTypeModel,
          }  
        ]
      });

      
      // prepare device data to sync
      if(deviceInsertResponse) {
        let syncDeviceData = {...JSON.parse(JSON.stringify(deviceInsertResponse[0]))}
        const {id: deviceId, name, mac, status, ip, model, ...fields} = syncDeviceData
        syncDeviceData = {
          ...fields,
          deviceId,
          mac,
          name,
          status,
          ip,
          model,
        }

        this.logger.debug("device data in realtime syncing..", syncDeviceData)
        let res=await deviceExternalCommInstance.createDashBoardHeaderReport({tenantId, siteId : siteId ?? null, entity:'device', action:'create'});
    

        await deviceExternalCommInstance.syncDeviceDataAdd(deviceId, syncDeviceData);
        
      }
      // let res=await deviceExternalCommInstance.createDashBoardHeaderReport({tenantId, siteId : siteId ?? null, entity:'device', action:'create'});
    

      // await deviceExternalCommInstance.syncDeviceDataAdd(deviceId, deviceInsertResponse);
      return Promise.resolve(deviceInsertResponse);
    } catch (error: any) {
      this.logger.error("Error in catch block in device create");
      
       await _transaction.rollback();
      this.logger.error("Error at create Device",error.message);
      return Promise.reject(error.message)
    }

  }

  // for updating
  async updateDevice(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      let deviceId = req.params.id;
      let siteName='';
      let zoneName='';
      let deviceManagerUrl :any ='';
      let combineCheck : any
      // request destructuring  
      const { siteId, zoneId='', tenantId, ...updateData }: any = req.body || req;
      const { mac,type } :any =req.body || req;
      const exisitingDevice = await this.model.findByPk(req.params.id);
      
      if(!exisitingDevice)
      {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.DEVICE_NOT_FOUND)
      }
      // 1. check tenant active or not  
      const tenantExist = await deviceExternalCommInstance.getTenant(tenantId);
      if (!tenantExist) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_NOT_FOUND)
      }
     
      if(siteId!==undefined &&  siteId!=null)
      {
        
           const siteExist = await deviceExternalCommInstance.getsite(siteId);
          if (siteExist.data.result.length===0) {
            throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_NOT_FOUND)
          }
          else
          {
            siteName=siteExist.data.result[0].name;
          }
          // check zone
          const zoneExist = await deviceExternalCommInstance.getZone(zoneId);
          if (!zoneExist) 
          {
            throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.ZONE_NOT_FOUND)
          }
          else
          {
             zoneName=zoneExist.data.result.name;
          }
         
          let combineData:any = 
          {
                tenantId:tenantId,
                siteId:siteId,
                zoneId:zoneId,
          }
        
        combineCheck = await deviceExternalCommInstance.combineCheckOnTenantSiteZone(combineData);
        
        if(combineCheck.data.result.count===0)  
          {
            throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_SITE_ZONE_NOT_MATCHED)
          }
      }

      let deviceInfo = await deviceExternalCommInstance.getDeviceById(deviceId)
      let previousSiteId = deviceInfo?.data?.result?.siteId

      
          
          if(type!==undefined &&  type==='Fixed Reader')
          {
            const DeviceManagerExist = await deviceExternalCommInstance.getDeviceManager(tenantId);
              if (DeviceManagerExist.data.result.count===0) 
               {
                throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.DEVICE_MANAGER_NOT_FOUND)
               }
               deviceManagerUrl=DeviceManagerExist.data.result.rows[0].url;
          }
          let temObj:any=
          {
            ...updateData,
            deviceManagerUrl:deviceManagerUrl
    
          }  
       
        // check device with another tenant id
        if(exisitingDevice.mac!==mac)
         {
              const DeviceExists = await this.model.findAll({
                where: { mac: mac },paranoid: false,
                transaction: _transaction,

              });
              if (DeviceExists.length > 0) 
              {
                throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.DEVICE_MAC_EXIST)
              }
         }
      //insert in deviceConfig
      const deviceResponse = await this.model.update( temObj, { where: { id: deviceId } }, { transaction: _transaction })

      await this.models.DeviceSiteZoneProcess.update({ deviceId: deviceId, tenantId: tenantId, siteId: siteId,siteName:siteName, zoneId: zoneId , zoneName:zoneName}, { where: { deviceId: deviceId, tenantId:tenantId } }, { transaction: _transaction })

      
      
     
      await _transaction.commit();

      const deviceUpdateResponse = await this.model.findAll({
        where: { id: deviceId },
        include: [{
          model: this.models.DeviceSiteZoneProcess
        },
        {
          model:this.models.DeviceTypeModel
        }
      ]
      });
      if (previousSiteId != siteId) {
        await deviceExternalCommInstance.createDashBoardHeaderReport({tenantId, siteId : siteId , entity:'device', action:'create'});
        await deviceExternalCommInstance.createDashBoardHeaderReport({tenantId, siteId : previousSiteId , entity:'device', action:'delete'});


      }

      
      if(deviceUpdateResponse) {
        let syncUpdatedDeviceData = {...JSON.parse(JSON.stringify(deviceUpdateResponse[0]))}
        const {id: deviceId, ...fields} = syncUpdatedDeviceData
        syncUpdatedDeviceData = {
          ...fields,
          deviceId,
        }

        
        await deviceExternalCommInstance.syncDeviceDataUpdate(deviceId, syncUpdatedDeviceData);

      }
      
     // await deviceExternalCommInstance.syncDeviceDataUpdate(deviceId, deviceInsertResponse);
      return Promise.resolve(deviceUpdateResponse);
    } catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at Device Updation",error.message);
      return Promise.reject(error.message)
    }

  }

  async updateDeviceSiteZoneProcess(req: Request){
    try{
      let  deviceId : any = req.params.id || req;
      let { siteId, zoneId='', siteName, zoneName, name, tenantId }: any = req.body.data || req;
      
      let data;
      if(req.body.flag == 'zone'){
        data = await this.models.DeviceSiteZoneProcess.update(
          { siteName:siteName, zoneName:name}, 
          { where: { deviceId: deviceId, tenantId:tenantId } });
      }
      else if(req.body.flag == 'site'){
        data = await this.models.DeviceSiteZoneProcess.update(
          { siteName:name}, 
          { where: { deviceId: deviceId } });
      }
        
      return Promise.resolve(data);
    }
    catch (error: any) {
      this.logger.error("Error at DeviceSiteZoneProcess Updation",error.message);
      return Promise.reject(error.message)
    }
  }

  async getDeviceSiteZoneProcess(req: Request){
    try{
      let  deviceId : any = req.params.id || req;
      
      
      let data = await this.models.DeviceSiteZoneProcess.findOne({where: {deviceId:deviceId}})
        
      return Promise.resolve(data);
    }
    catch (error: any) {
      this.logger.error("Error at getting DeviceSiteZoneProcess",error.message);
      return Promise.reject(error.message)
    }
  }

// for updating
async updateDeviceStatus(req: Request) {

  const _transaction = await databaseInstance.transaction();
  try {
    let deviceId = req.params.id;
    // request destructuring  
    const exisitingDevice = await this.model.findByPk(req.params.id);
    if(!exisitingDevice)
    {
      throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.DEVICE_NOT_FOUND)
    }
    
    const deviceResponse = await this.model.update( req.body, { where: { id: deviceId } }, { transaction: _transaction });
    
    // create dashboard header report while active /deactive device
    // const action = (req?.body?.status === 'Active') ? 'active' : 'inActive';
    // await deviceExternalCommInstance.createDashBoardHeaderReport({tenantId, siteId, entity:'device', action});

    await _transaction.commit();

    const deviceInsertResponse = await this.model.findOne({
      where: { id: deviceId },
      include: [{
        model: this.models.DeviceSiteZoneProcess
      }]
    });
   
    const syncData = await this.model.findAll({
      where: { id: deviceId },
      include: [{
        model: this.models.DeviceSiteZoneProcess
      },
      {
        model:this.models.DeviceTypeModel
      }
    ]
    });
    
    if(syncData) {
      let syncUpdatedDeviceData = {...JSON.parse(JSON.stringify(syncData[0]))}
      const {id: deviceId, ...fields} = syncUpdatedDeviceData
      syncUpdatedDeviceData = {
        ...fields,
        deviceId,
      }
      await deviceExternalCommInstance.syncDeviceDataUpdate(deviceId, syncUpdatedDeviceData);

    }
    

    return Promise.resolve(deviceInsertResponse);
  } catch (error: any) {
    await _transaction.rollback();
    this.logger.error("Error at Device status Updation",error.message);
    return Promise.reject(error.message)
  }

}
  

  async deleteDevice(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      const deviceId = req.params.id;
      // check if device exist or not 
      const deviceData = await this.models.DeviceSiteZoneProcess.findAll({where: { deviceId:deviceId}});
      this.logger.debug("deviceData in delete Device..", deviceData)
      const exisitingDevice = await this.model.findOne({
        where: { id: deviceId},
        include: [
          {
            model: this.models.DeviceSiteZoneProcess,
            where: { deviceId: deviceId }
          }
          ],
          raw: true,
        transaction: _transaction ,
      });
      if(exisitingDevice){
      const tenantId = exisitingDevice['deviceSiteZoneProcess.tenantId'];
      const siteId = exisitingDevice['deviceSiteZoneProcess.siteId'];
      const processId = exisitingDevice['deviceSiteZoneProcess.processId'];
      if (exisitingDevice.status === localConstant.START) {
        throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.PROCESS_RUNING_ON_DEVICE)
      }
      
     if (processId!==null) 
      {
        throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.PROCESS_ASSIGN_ON_DEVICE)
      }

      
      let processData: any = await deviceExternalCommInstance.getProcess();
      let processRes = processData?.data?.result?.rows;

      for(let process of processRes){
        if(process?.assign?.devices?.length>0){
          let deviceData = process?.assign?.devices;
          for(let device of deviceData){
            if(device == deviceId){
              throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.PROCESS_ASSIGN_ON_DEVICE)
            }
          }
        }
      }
      
      
      await this.model.destroy({
        where:{id:deviceId}, 
        include: [
        {
          model: this.models.DeviceSiteZoneProcess,
          where: { deviceId: deviceId }
        }
        ],transaction: _transaction 
      }); 
    
      await _transaction.commit();
      this.logger.debug("DeviceId and TenantId..", deviceId,tenantId)
      let res=await deviceExternalCommInstance.createDashBoardHeaderReport({tenantId, siteId : siteId ?? null, entity:'device', action:'delete'});
      await deviceExternalCommInstance.syncDeviceDataDelete(deviceId,tenantId);

      // create dashboard header report while deleting device
      // await deviceExternalCommInstance.createDashBoardHeaderReport({tenantId, siteId, entity:'device', action:'delete'});
    }
      return Promise.resolve(localConstant.DEVICE_DELETED);
    }
    catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at Device Deletion deleteDevice",error.message);
      return Promise.reject(error.message)
    }
  }

  //  assgin site and zone 
  async assignSiteZone(req: Request) {

    const _transaction = await databaseInstance.transaction();
    const { deviceId, siteId, zoneId, tenantId }: any = req.body || req;
    try {
      // check if device exist or not 
      const exisitingDevice = await this.models.DeviceSiteZoneProcess.findAll({where: { deviceId:deviceId, tenantId:tenantId}});
      if (!exisitingDevice) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.DEVICE_NOT_FOUND)
      }
      // check if any process assign on it or not
      const DeviceAssigned = await this.model.findAll({
        where: { id: deviceId, status: localConstant.START }, transaction: _transaction });
      if (DeviceAssigned.length > 0) {
        throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.PROCESS_RUNING_ON_DEVICE)
      }

      await this.models.DeviceSiteZoneProcess.update({ deviceId: deviceId, siteId: siteId, zoneId: zoneId }, { where: { id: deviceId,tenantId:tenantId } }, { transaction: _transaction })
      await _transaction.commit();
      return Promise.resolve(localConstant.DEVICE_ASSIGNED);

    }
    catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at Device Assignment assignSiteZone",error.message);
      return Promise.reject(error.message)
    }

  }

  async unassigProcess(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      const processId = req.params.processId || req;
      // check if device exist or not 
      const exisitingDevice = await this.models.DeviceSiteZoneProcess.findAll({where: { processId:processId}});
      if (!exisitingDevice) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.DEVICE_NOT_FOUND)
      }
      // check if any process assign on it or not
      const DeviceAssigned = await this.model.findAll({
        where: { id: processId, status: localConstant.START }, transaction: _transaction });
      if (DeviceAssigned.length > 0) {
        throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.PROCESS_RUNING_ON_DEVICE)
      }

      await this.models.DeviceSiteZoneProcess.update({ processId: processId}, { where: { id: processId } }, { transaction: _transaction })
      await _transaction.commit();
      return Promise.resolve(localConstant.DEVICE_ASSIGNED);

    }
    catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at Device Assignment unassigProcess",error.message);
      return Promise.reject(error.message)
    }
  }

  async unassignDeviceViaZoneId(req: Request) {

    const _transaction = await databaseInstance.transaction();
    const { zoneId }: any = req.body || req;
    try {
        
      const DeviceAssigned=await this.model.findAll({  
          where : {  status:  localConstant.START},
          include: [
          {
            model: this.models.DeviceSiteZoneProcess,
            where: { zoneId: zoneId }
          }
          ],transaction: _transaction 
        });
        

        
        if (DeviceAssigned.length > 0) 
        {
        throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.PROCESS_RUNING_ON_DEVICE)
        }

       await this.models.DeviceSiteZoneProcess.update( {zoneId:null}, { where: { zoneId: zoneId } }, { transaction: _transaction, logging:true });

    
      await _transaction.commit();
      return Promise.resolve(localConstant.DEVICE_DELETED);
    }
    catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at unassignDeviceViaZoneId",error.message);
      return Promise.reject(error.message)
    }

  }

  async unassignDeviceViaTenantId(req: Request) {

    const _transaction = await databaseInstance.transaction();
    const { tenantId }: any = req.body || req;
    try {
             
        const allDevice = await this.models.DeviceSiteZoneProcess.findAll({where: { tenantId: tenantId }});
        if(allDevice.length>0)
        {
        for (let i=0;i<allDevice.length;i++) 
        { 
          
          await this.model.destroy({ where: { id:allDevice[i].deviceId }, transaction: _transaction })
        }
        await this.models.DeviceSiteZoneProcess.destroy({ where: { tenantId:tenantId }, transaction: _transaction })
        await _transaction.commit();
        }
        return Promise.resolve(localConstant.DEVICE_DELETED);

    }
    catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at Device Assignment unassignDeviceViaTenantId", error.message);
      return Promise.reject(error.message)
    }

  }


  async unassignDeviceViaSiteId(req: Request) {

    const _transaction = await databaseInstance.transaction();
    const { siteId }: any = req.body || req;
    try {
         
         const DeviceAssigned=await this.model.findAll({  
          where : {  status: localConstant.START},
          include: [
          {
            model: this.models.DeviceSiteZoneProcess,
            where: { siteId: siteId }
          }
          ],transaction: _transaction 
        }); 
       this.logger.info("DeviceAssigned",DeviceAssigned.length,"---",DeviceAssigned);   
       this.logger.info("SiteID",siteId);
      if (DeviceAssigned.length > 0) 
        {
        throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.PROCESS_RUNING_ON_DEVICE)
        }
      
        const allDevice = await this.models.DeviceSiteZoneProcess.findAll({where: { siteId: siteId }});
        if(allDevice.length>0)
        {
          for (let i=0;i<allDevice.length;i++) 
          { 
            this.logger.info("Device",allDevice[i].deviceId);
            await this.model.destroy({ where: { id:allDevice[i].deviceId }, transaction: _transaction })
          }
          // destroy DeviceSiteZoneProcess
          await this.models.DeviceSiteZoneProcess.update( {siteId:null}, { where: { siteId: siteId } }, { transaction: _transaction, logging:true });

        }
        await _transaction.commit();
        return Promise.resolve(localConstant.DEVICE_DELETED);

    }
    catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at unassignDeviceViaSiteId Assignment",error.message);
      return Promise.reject(error.message)
    }

  }
    
  // check process running on any device or not // for tenant & site deletion 

  async checkRunningProcessUsingSiteId(req: Request) {

    const _transaction = await databaseInstance.transaction();
    const siteId = req.params.id || req;
    try {
         
         const RunningDevice=await this.model.findAll({  
          include: [
          {
            model: this.models.DeviceSiteZoneProcess,
            where: { siteId: siteId }
          }
          ],transaction: _transaction 
        }); 
        
        if (RunningDevice.length > 0) 
        {
          return Promise.resolve(localConstant.PROCESS_RUNING_ON_DEVICE);
        }
        await _transaction.commit();
        return Promise.resolve(localConstant.PROCESS_NOT_RUNING_ON_DEVICE);
        

    }
    catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at checkRunningProcessUsingSiteId check",error.message);
      return Promise.reject(error.message)
    }

  }
  async checkRunningProcessUsingZoneId(req: Request) {

    const _transaction = await databaseInstance.transaction();
    const zoneId = req.params.id || req;
    try {
         
         const RunningDevice=await this.models.DeviceSiteZoneProcess.findAll({  
          where : { zoneId: zoneId },transaction: _transaction}); 

        if (RunningDevice.length > 0) 
        {
          return Promise.resolve(localConstant.REMOVE_DEPENDANCE);
        }
        await _transaction.commit();
        return Promise.resolve(localConstant.PROCESS_NOT_RUNING_ON_DEVICE);

    }
    catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at checkRunningProcessUsingZoneIdId check",error.message);
      return Promise.reject(error.message)
    }

  }


  // delete device via tenant id
  
  async deleteDeviceViaTenantId(req: Request) {
   
    const _transaction = await databaseInstance.transaction();
    try {
      const tenantId = req.params.id;
      let deletedDeviceId:any=[];
      // check if device exist or not 
     
      const allDevice = await this.models.DeviceSiteZoneProcess.findAll({where: { tenantId: tenantId }});
      for (let i=0;i<allDevice.length;i++) 
      { 
        deletedDeviceId.push(allDevice[i].deviceId);
        await this.model.destroy({ where: { id:allDevice[i].deviceId }, transaction: _transaction })
        let res=await deviceExternalCommInstance.createDashBoardHeaderReport({tenantId, siteId : null, entity:'device', action:'delete'});

      }
      // destroy DeviceSiteZoneProcess
      await this.models.DeviceSiteZoneProcess.destroy({ where: { tenantId: tenantId }})  
    
      await _transaction.commit();
      this.logger.info("Delete Device Function before syncDeviceDataBulkDelete");
      if(deletedDeviceId.length>0)
      {
      await deviceExternalCommInstance.syncDeviceDataBulkDelete(deletedDeviceId, tenantId);
      }
      this.logger.info("Delete Device Function after syncDeviceDataBulkDelete");
      return Promise.resolve(localConstant.DEVICE_DELETED);
    }
    catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at Device Deletion using tenant id",error.message);
      return Promise.reject(error.message)
    }
  }


  async deleteDeviceViaSiteId(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      const siteId = req.params.id;
      this.logger.info("siteId",siteId)
      // check if device exist or not 
      const exisitingDevice = await this.model.findOne({
        where : { status: localConstant.START},
        include: [
        {
          model: this.models.DeviceSiteZoneProcess,
          where: { siteId: siteId }
        }
        ],transaction: _transaction 
      });
      this.logger.info("deleteDeviceViasiteId")
      if (exisitingDevice!==null)  {
        throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.PROCESS_RUNING_ON_DEVICE)
      }
      let deletedDeviceId:any=[];
      const allDevice = await this.models.DeviceSiteZoneProcess.findAll({where: { siteId: siteId }});
      if(allDevice.length>0)
      {
      for (let i=0;i<allDevice.length;i++) 
      { 
        this.logger.info("Device",allDevice[i].deviceId);
        deletedDeviceId.push(allDevice[i].deviceId);
        await this.model.destroy({ where: { id:allDevice[i].deviceId }, transaction: _transaction })
      }
      // destroy DeviceSiteZoneProcess
      await this.models.DeviceSiteZoneProcess.destroy({ where: { siteId: siteId }})  
      }
      await _transaction.commit();
      await deviceExternalCommInstance.syncDeviceDataBulkDelete(deletedDeviceId, exisitingDevice?.tenantId);
      return Promise.resolve(localConstant.DEVICE_DELETED);
    }
    catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at Device Deletion deleteDeviceViaSiteId",error.message);
      return Promise.reject(error.message)
    }
  }


  // restore device
  async restoreDeviceViaTenantId(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      const tenantId = req.params.id;
      const futureStartAtDate1 = new Date()
      // const futureStartAtDate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
      // this.logger.info("futureStartAtDate",futureStartAtDate);
     
     
    // const [results, metadata] = await databaseInstance.query('SELECT ...', { type: QueryTypes.SELECT });
     
    //  let data=await this.model.findAll({ 
    //   where : { deletedAt: {[Op.like]: '%'+ futureStartAtDate  }} ,paranoid: false, logging:true,
    //  });
    
     //const exisitingDevice = await this.models.findAll({where: { deviceId:deviceId, tenantId:tenantId}});
   
    // this.logger.info("data",data);
    //  this.logger.info("futureStartAtDate",futureStartAtDate1, "tenantId",tenantId) 
    //   await this.model.update( {deletedAt:null},{ 
    //     where : { updatedAt: {[Op.like]: '%'+ '2022-10-01' + '%'}} ,paranoid: false,
    //     include: [
    //     {
    //       model: this.models.DeviceSiteZoneProcess,
    //       where: { tenantId: tenantId },paranoid: false
    //     }
    //     ],transaction: _transaction,
    //     logging:true 
    //   }); 

      await _transaction.commit();
      return Promise.resolve("Device restore Successfully")
    }
    catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at Device Deletion");
      return Promise.reject(error)
    }
  }

  async restoreDeviceViaSiteId(req: Request) {
    const _transaction = await databaseInstance.transaction();
    try {
      const siteId = req.params.id;
      // check if device exist or not 
      // const futureStartAtDate1 = new Date(moment().locale("en").format("MMM DD, YYYY HH:MM"))
      // const futureStartAtDate = moment().format("YYYY-MM-DD")
     
      // await this.model.destroy({
      //   include: [
      //   {
      //     model: this.models.DeviceSiteZoneProcess,
      //     where: { siteId: siteId },
      //     updatedAt:
      //     {
      //     [Op.like]: '%'+ futureStartAtDate + '%',  
      //     }
      //   }
      //   ],transaction: _transaction 
      // }); 

      await _transaction.commit();
      return Promise.resolve("Device restore Successfully")
    }
    catch (error: any) {
      await _transaction.rollback();
      this.logger.error("Error at Device Deletion",error.message);
      return Promise.reject(error.message)
    }
  }



  // get all devices count
  async getAllDeviceCount(req: Request) {
    try {

      const deviceCountResponse = await this.model.findAndCountAll({
        include: [{
          model: this.models.DeviceSiteZoneProcess,
          where:{ siteId:req.params.id }
        }]
      });
      return Promise.resolve(deviceCountResponse)

    } catch (err:any) {
      this.logger.error("Error at getAllDeviceCount",err.message);
      return Promise.reject(err.message)

    }
  }

}