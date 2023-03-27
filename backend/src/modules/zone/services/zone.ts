import { Response, Request } from "express";
import sequelize, { Op } from "sequelize";
import StatusCodes from 'http-status-codes';
import BaseService from '../../../core/services/base';
import { paginator } from "../../../libs/pagination";
import zoneExternalComm from "./externalCommunication";
const Exception = require('../../../middlewares/resp-handler/exception')
var constant = require('../../../middlewares/resp-handler/constants')
var localConstant = require('../utils/constants');
import { Zone } from '../models/zone'
import { databaseInstance } from '../../../config/db'
import { siteValidator } from "../../site/validator/site";

export class ZoneService extends BaseService {
    constructor({ model, models, logger }: any) {
        super({ model, models, logger });
    }
    // read all zones
    async readAllZone(req: Request) {
        try {
            let {
                tenant,
                site,
                status,
                sortBy,
                sortOrder,
                search,
                to,
                from
            } = req.query
            let query = paginator(req.query, ['name', 'zonetype', 'description', 'siteId', 'siteName'])
            if (undefined == sortBy) { sortBy = 'name' }
            if (undefined == sortOrder) { sortOrder = 'ASC' }
            query.order = [[String(sortBy), String(sortOrder)]]
            let where = {}
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
            if (status != undefined) {
                where = {
                    ...where,
                    status: {
                        [Op.eq]: status,
                    },
                }
            }
            if (site != undefined) {
                where = {
                    ...where,
                    siteId: {
                        [Op.like]: '%' + site + '%',
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
            let zoneData = await this.model.findAndCountAll({
                where: {
                    ...query.where,
                    ...where,
                },
                limit: query.limit,
                distinct: true,
                offset: query.offset,
                order: query.order,
            })
            return Promise.resolve(zoneData)
        } catch (error:any) {
            this.logger.error("Error in reading all zones.",error.message)
            return Promise.reject(error.message)
        }
    }
    // for create zone
    async createZone(req: Request) {
        const _transaction = await databaseInstance.transaction()
        const { siteId, tenantId } = req.body
        const zoneType = req.body.zoneType
        req.body.name = (req.body.name).trim();
        let siteName = '';
        try {

            var siteExist = await zoneExternalComm.getSite(siteId)
            if (!siteExist) {
                throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_NOT_FOUND)
            }
            if (req.body.siteName !== siteExist.data.result[0].name) {
                throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.SITE_NAME_INCORRECT)
            }

            var tenantExist = await zoneExternalComm.getTenant(tenantId)
            if (!tenantExist) {
                throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_NOT_FOUND)
            }


            var zoneTypeExist = await zoneExternalComm.getZoneType(zoneType)
            if (!zoneTypeExist) {
                throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.ZONETYPE_NOT_FOUND)
            }



            let zoneName = req.body.name
            var zoneExist = await this.model.findOne({
                where: {
                    [Op.and]: [sequelize.where(sequelize.fn('upper', sequelize.col('name')), zoneName.toUpperCase())],
                    siteId: req.body.siteId, tenantId: req.body.tenantId
                }, paranoid: false,

                transaction: _transaction
            });
            if (zoneExist) {
                throw new Exception(
                    constant.ERROR_TYPE.ALREADY_EXISTS,
                    localConstant.ZONE_EXIST
                )
            }

            let zone = await this.model.create(req.body, { transaction: _transaction })

            if(zone){
                let syncZoneData = {...JSON.parse(JSON.stringify(zone))} 
                const {id: zoneId, ...fields} = syncZoneData
                syncZoneData = {
                 ...fields,
                 zoneId,
                }
 
              // sync zone created data to device mgt
                await zoneExternalComm.syncZoneDataAdd(zone.id, syncZoneData);
             }
            await _transaction.commit()
            return Promise.resolve(zone)
        } catch (error: any) {
            await _transaction.rollback()
            this.logger.error("Error in creating zones.",error.message)
            return Promise.reject(error.message)
        }
    }

    //for zone updation
    async updateZone(req: Request) {
        const _transaction = await databaseInstance.transaction()
        try {
            let zoneId = req.params.id
            let name = req.body.name
            let zoneExist = await this.model.findByPk(zoneId, { transaction: _transaction });
            if (!zoneExist) {
                throw new Exception(
                    constant.ERROR_TYPE.NOT_FOUND,
                    localConstant.ZONE_DOES_NOT_EXIST,
                )
            }

            if (req.body.tenantId !== undefined) {
                throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_IS_NOT_ALLOWED)
            }

            if (req.body.zoneType !== undefined) {
                let zoneType = req.body.zoneType
                var zoneTypeExist = await zoneExternalComm.getZoneType(zoneType)
                if (!zoneTypeExist) {
                    throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.ZONETYPE_NOT_FOUND)
                }
            }

            let updateObj: any = {}
            if (req.body.name) updateObj.name = req.body.name
            if (req.body.description || req.body.description == "") updateObj.description = req.body.description
            if (req.body.status) updateObj.status = req.body.status
            if (req.body.zoneType) updateObj.zoneType = req.body.zoneType

            if (name !== null && name !== undefined && name !== zoneExist.name) {
                let zoneReqName = name.trim();
                let existingName = await this.model.findOne({
                    where: {
                        name: zoneReqName,
                        siteId: { [Op.eq]: zoneExist.siteId }
                    },
                    logging: true,
                    transaction: _transaction
                })
                if (existingName) { throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, `Entered zone name already exists!`,) }
            }

            await this.model.update(updateObj, {
                where: { id: zoneId },
                transaction: _transaction
            })

            const zoneUpdate = await this.model.findByPk(zoneId, { transaction: _transaction })
            if(zoneUpdate) {
                let syncUpdatedZoneData = {...JSON.parse(JSON.stringify(zoneUpdate))}
                const {id: zoneId, ...fields} = syncUpdatedZoneData
                syncUpdatedZoneData = {
                    ...fields,
                    zoneId,
                }                
                // sync zone updated data to device mgt
                await zoneExternalComm.syncZoneDataUpdate(zoneId, syncUpdatedZoneData);


                // SYNCING WITH DEVICE ===> DEVICESITEZONEPROCESS TABLE
                // GETTING DEVICE ID BY ZONE ID
                let deviceData =  await zoneExternalComm.getDeviceSiteZoneProcessByZoneId(zoneId);
               
                let deviceIdData: any = []; 
                for(let item of deviceData?.data?.result){  
                    deviceIdData.push(item?.deviceId);
                }
                //  UPDATING ZONE BY FETCHED DEVICE ID
                for(let item of deviceIdData){
                    await zoneExternalComm.updateDeviceSiteZoneProcess(item,syncUpdatedZoneData);
                }
            }
            
            // updating zone name in DI collection
            if (name !== null && name !== zoneExist.name) 
            {
                    //zoneExternalComm.updateExistingDigitizedTagWithZoneName(zoneId,name);     
            }
            
           // await zoneExternalComm.syncZoneDataUpdate(zoneId, zoneUpdate);
            await _transaction.commit()
            return Promise.resolve(zoneUpdate)
        }
        catch (error:any) {
            await _transaction.rollback()
            this.logger.error("Error in updating zones.",error.message)
            return Promise.reject(error.message)
        }
    }

    async updateSiteName(req: Request) {
        const _transaction = await databaseInstance.transaction()
        try {
            
            let siteId = req.body.siteId
            let siteName = req.body.siteName
            let zoneExist = await this.model.findOne({ where: { siteId: siteId } }, { transaction: _transaction });
            if (!zoneExist) {
                throw new Exception(
                    constant.ERROR_TYPE.NOT_FOUND,
                    localConstant.ZONE_DOES_NOT_EXIST,
                )
            }
            let zoneId =zoneExist?.id;
            let updateObj: any = {}
            if (req.body.siteName) updateObj.siteName = req.body.siteName

            await this.model.update(updateObj, {
                where: { siteId: siteId },
                transaction: _transaction
            })

            const zoneUpdate = await this.model.findByPk(zoneId, { transaction: _transaction })
            
            let syncUpdatedZoneData = {...JSON.parse(JSON.stringify(zoneUpdate))}
                const { ...fields} = syncUpdatedZoneData
                syncUpdatedZoneData = {
                    ...fields,
                    zoneId,
                }
            await zoneExternalComm.syncZoneDataUpdate(zoneId, syncUpdatedZoneData);
            await _transaction.commit()
           return Promise.resolve(zoneUpdate)
           return "hello";
        }
        catch (error:any) {
            await _transaction.rollback()
            this.logger.error("Error in updating siteName in zones.",error.message)
            return Promise.reject(error.message)
        }

    }

    //get zone by id
    async getZone(req: Request) {
        try {
            let zoneId = req.params.id
            const zoneExist = await this.model.findOne({
                where: { id: zoneId }
            }
            );
            if (!zoneExist) {
                throw new Exception(
                    constant.ERROR_TYPE.NOT_FOUND,
                    localConstant.ZONE_DOES_NOT_EXIST,
                )
            }
            return Promise.resolve(zoneExist)
        }
        catch (error:any) {
            this.logger.error("Error in get zone by id.",error.message)
            return Promise.reject(error.message)
        }

    }

    // get number of zone
    async getNumberOfZone(req: Request) {
        try {
            let siteId = req.params.id
            let count = 0;
            const zoneExist = await this.model.findAndCountAll({
                where: { siteId: siteId }
            }
            );
            return Promise.resolve(zoneExist)
        }
        catch (error:any) {
            this.logger.error("Error in getNumberOfZone ",error.message)
            return Promise.reject(error.message)
        }

    }

    //delete zone by id
    async deleteZone(req: Request) {
        const _transaction = await databaseInstance.transaction()

        try {
            const zoneId = req.params.id
            // this.logger.info("req.params", zoneId)
            let zoneExist: any = await this.model.findOne({ where: { id: zoneId, }, transaction: _transaction })
            let tenantId = zoneExist.dataValues.tenantId
            this.logger.debug("TId.. in zone..", tenantId)

            //to check Zone exist or not
            if (!zoneExist) {
                throw new Exception(
                    constant.ERROR_TYPE.NOT_FOUND,
                    localConstant.ZONE_DOES_NOT_EXIST,
                )
            }
            let deviceResponse = await zoneExternalComm.checkRunningProcessOnDevice(zoneId)
            if (deviceResponse.data.result === 'Remove dependency') {
                throw new Exception(constant.ERROR_TYPE.FORBIDDEN, localConstant.REMOVE_SITE_DEPENDENCY);
            }
            //to delete zone
            await this.model.destroy({ where: { id: zoneId }, transaction: _transaction })
            //To notify the Device Management to unassign Zone.
            // this.logger.info("deleteZone", zoneId)
            //await zoneExternalComm.unassignDeviceViaZoneId(zoneId)

            await _transaction.commit()
            await zoneExternalComm.syncZoneDataDelete(zoneId, tenantId);
            return Promise.resolve(localConstant.ZONE_DELETED)
        }
        catch (error:any) {
            await _transaction.rollback()
            this.logger.error("Error in delete zone.",error.message)
            return Promise.reject(error.message)
        }
    }

    async deleteZoneByTenantId(req: Request) {
        const _transaction = await databaseInstance.transaction()
        try {
            const tenantId = req.params.tenantId
            let zoneExist: any = await this.model.findOne({ where: { tenantId: tenantId }, transaction: _transaction })
            let zoneExistAll: any = await this.model.findAll({ where: { tenantId: tenantId }, transaction: _transaction })
            this.logger.debug("zoneExist inside deleteZoneByTenantId..", zoneExist)
            this.logger.debug("zoneExistAll@349 inside deleteZoneByTenantId..", zoneExistAll)
            //to delete zone
            if (zoneExist) {
                await this.model.destroy({ where: { tenantId: tenantId }, transaction: _transaction })
            }
            
            let deletedZoneIds:any=[];
            this.logger.info("zoneExist",zoneExistAll.tenantId)
            if (zoneExistAll.length>0) 
            { 
                this.logger.info("zoneExistAll__")
                    for (const value of zoneExistAll) 
                    {
                        deletedZoneIds.push(value.id);
                    }
            }
            if(deletedZoneIds.length>0)
            {
            await zoneExternalComm.syncZoneDataBulkDelete(deletedZoneIds, zoneExist?.tenantId)
            }
            await _transaction.commit()
            return Promise.resolve(localConstant.ZONE_DELETED)
        }
        catch (error:any) {
            await _transaction.rollback()
            this.logger.error("Error in delete zone using tenant id deleteZoneByTenantId ",error.message)
            return Promise.reject(error.message)
        }
    }

    async deleteZoneBySiteId(req: Request) {
        const _transaction = await databaseInstance.transaction()
        try {
            const siteId = req.params.siteId
            this.logger.info("deleteZoneBySiteId__", siteId)
            let zoneExist: any = await this.model.findAll({ where: { siteId: siteId }, transaction: _transaction })
            const tenantId = zoneExist[0]?.dataValues?.tenantId
            //to delete zone
            if (zoneExist) {
                let deletedZoneId:any=[]
                if(zoneExist.length>0){

                    for (let i=0;i<zoneExist.length;i++) 
                                { 
                                    deletedZoneId.push(zoneExist[i].id);
                                }
                                
                    await zoneExternalComm.syncZoneDataBulkDelete(deletedZoneId, tenantId);

                }
                await this.model.destroy({ where: { siteId: siteId }, transaction: _transaction })
            }
            //To notify the Device Management to Unassign Zone.
            await _transaction.commit()

            return Promise.resolve(localConstant.ZONE_DELETED)
        }
        catch (error:any) {
            await _transaction.rollback()
            this.logger.error("Error in delete zone using tenant ID.",error.message)
            return Promise.reject(error.message)
        }
    }

    async restoreZoneViaTenantId(req: Request) {
        const _transaction = await databaseInstance.transaction();
        try {
            const tenantId = req.params.id;
            const futureStartAtDate1 = new Date()


            // const [results, metadata] = await sequelize.query('SELECT ...', { type: QueryTypes.SELECT });

            //  let data=await this.model.findAll({ 
            //   where : { deletedAt: {[Op.like]: '%'+ futureStartAtDate1  }} ,paranoid: false, logging:true,
            //  });

            //  this.logger.info("data",data);
            await _transaction.commit();
            return Promise.resolve("Zone restore Successfully")
        }
        catch (error: any) {
            await _transaction.rollback();
            this.logger.error("Error at Zone Deletion");
            return Promise.reject(error)
        }
    }

    async restoreZoneViaSiteId(req: Request) {
        const _transaction = await databaseInstance.transaction();
        try {
            const siteId = req.params.id;
            const futureStartAtDate1 = new Date()


            // const [results, metadata] = await sequelize.query('SELECT ...', { type: QueryTypes.SELECT });

            //  let data=await this.model.findAll({ 
            //   where : { deletedAt: {[Op.like]: '%'+ futureStartAtDate1  }} ,paranoid: false, logging:true,
            //  });

            //  this.logger.info("data",data);
            await _transaction.commit();
            return Promise.resolve("Zone restore Successfully")
        }
        catch (error: any) {
            await _transaction.rollback();
            this.logger.error("Error at Zone Deletion");
            return Promise.reject(error)
        }
    }

    // combine check 
    async combineCheckOnTenantSiteZone(data: any) {
        try {

            let tenantId = data.body.tenantId
            let siteId = data.body.siteId
            let zoneId = data.body.zoneId
            let count = 0;
            const zoneExist = await this.model.findAndCountAll({
                where: { id: zoneId, siteId: siteId, tenantId: tenantId }
            }
            );
            return Promise.resolve(zoneExist)
        }
        catch (error:any) {
            this.logger.error("Error in combineCheckOnTenantSiteZone",error.message)
            return Promise.reject(error.message)
        }

    }
}
