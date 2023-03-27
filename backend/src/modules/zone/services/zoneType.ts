import { Response, Request } from "express";
import sequelize, { Op } from "sequelize";
import BaseService from '../../../core/services/base';
const Exception = require('../../../middlewares/resp-handler/exception')
var constant = require('../../../middlewares/resp-handler/constants')
var localConstant = require('../utils/constants');
import { paginator } from "../../../libs/pagination";
import { databaseInstance } from '../../../config/db'


export class ZoneTypeService extends BaseService {
    constructor({ model, models, logger }: any) {
        super({ model, models, logger });
    }
    
    async zoneTypeReadAll(req: Request) {
        try {
            //getting all the zone
            let whereObj: any = {}
            const zones = await this.model.findAndCountAll({
                where: whereObj,
                order: [['name', 'ASC']],
                distinct: true,
            });
            return Promise.resolve(zones);
        }
        catch (error: any) {
            this.logger.error('Failed to get all zoneTypeReadAll:',error.message)
            return Promise.reject(error.message)
        }
    }
  

    // this is to get zone by Id
    async readOne(req: Request) {
        try {
            // let user: any;
            const zoneType = await this.model.findByPk(req.params.id);

            if (!zoneType) {
                throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `ZoneType with id ${req.params.id} doesn't exist`)
            }

            return Promise.resolve(zoneType);
        }
        catch (error:any) {
            this.logger.error('Failed to get zoneType by Id:',error.message)
            return Promise.reject(error.message)
        }
    }

    async getZoneTypeByName(req: Request) {
        try {
            let zoneType = req.params.zoneType
            const zoneTypeExist = await this.model.findOne({
                where: { id: zoneType }
            }
            );
            if (!zoneTypeExist) {
                throw new Exception(
                    constant.ERROR_TYPE.NOT_FOUND,
                    localConstant.ZONETYPE_NOT_EXIST,
                )
            }
            return Promise.resolve(zoneTypeExist)
        }
        catch (error:any) {
            this.logger.error("Error in get zonetype by name.",error.message)
            return Promise.reject(error.message)
        }

    }
     // for create zone
    async createZoneType(req: Request) {
        const _transaction = await databaseInstance.transaction()
           try{ 
            let zoneTypeName = req.body.name
            var zoneTypeExist = await this.model.findOne({
                where: {
                    [Op.and]: [sequelize.where(sequelize.fn('upper', sequelize.col('name')), zoneTypeName.toUpperCase())]
                },paranoid: false,
                transaction: _transaction
            });
            if (zoneTypeExist) {
                throw new Exception(
                    constant.ERROR_TYPE.ALREADY_EXISTS,
                    localConstant.ZONE_EXIST
                )
            }

            let zoneType = await this.model.create(req.body, { transaction: _transaction })
            return Promise.resolve(zoneType)}
            catch(error:any){
              return Promise.reject(error.message)
            }
        } 

    //for zone updation
    async updateZoneType(req: Request) {
        const _transaction = await databaseInstance.transaction()
        try {
            let zoneTypeId = req.params.id
            let zoneTypeExist = await this.model.findByPk(zoneTypeId, { transaction: _transaction });

            let updateObj: any = req.body
            await this.model.update({zoneTypeId:zoneTypeId},updateObj)
            let updatedZoneType = await this.model.findOne({zoneTypeId : zoneTypeId});

            return Promise.resolve(updatedZoneType)
        }
        catch (error:any) {
            return Promise.reject(error.message)
        }
    }
     
    //delete zone by id
    async deleteZoneType(req: Request) {
        const _transaction = await databaseInstance.transaction()
        try {
            const zoneTypeId = req.params.id
            let zoneTypeExist: any = await this.model.findOne({ where: { id: zoneTypeId, }, transaction: _transaction })

            //to delete zone
            await this.model.destroy({zoneTypeId : zoneTypeId})
      
          
            return Promise.resolve('Successfully deleted ZoneType')
        }
        catch (error:any) {
         
            return Promise.reject(error.message)
        }
    }
  }
