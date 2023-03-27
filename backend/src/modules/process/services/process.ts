import { Request } from "express";
import sequelize, { Op } from "sequelize";
import BaseService from '../../../core/services/base';
import { paginator } from "../../../libs/pagination";
import processexternalComm from "./externalCommunication";
var localConstant = require('../utils/constants');
const constant = require('../../../middlewares/resp-handler/constants')
const Exception = require('../../../middlewares/resp-handler/exception')
import { databaseInstance } from '../../../config/db'
import { WorkFlowSchemaService } from "./workflow";
import ProcessWorkFlowSchema from "../models/processWorkflow";
import { TenantFeature } from '../../tenant/models/tenantFeature'


export class ProcessService extends BaseService {
    workflowSchemaServiceInstance!: WorkFlowSchemaService
    constructor({ model, models, logger }: any) {
        super({ model, models, logger });
        this.workflowSchemaServiceInstance = new WorkFlowSchemaService();
    }



    //READ ALL PROCESS
    async readAll(req: Request) {
        try {
            let {
                tenantId,
                deviceId,
                status,
                isFinalized,
                name,
                sortBy,
                sortOrder,
                isPredefined,
                search,
                sync,
                processType,
                to,
                from
            } = req.query

            let query = paginator(req.query, ['name', 'description', 'processType', 'updatedAt', 'createdAt'])
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

            if (isFinalized != undefined) {
                where = {
                    ...where,
                    isFinalized: {
                        [Op.eq]: isFinalized,
                    },
                }
            }
            if (!sync) {

                if (isPredefined != undefined) {
                    where = {
                        ...where,
                        isPredefined: {
                            [Op.eq]: isPredefined,
                        },
                    }
                }
            }

            if (tenantId != undefined) {

                where = {
                    ...where,
                    tenantId: {
                        [Op.eq]: tenantId,
                    },
                }
            }
            if (deviceId != undefined) {
                where = {
                    ...where,
                    assign: {
                        devices: {
                            [Op.like]: '%' + deviceId + '%',
                        }
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
            if (processType != undefined) {
                // calling external comm for getting process type id
                let featureActionExist: any = await processexternalComm.getFeatureIdByName(processType);
                if (featureActionExist) {
                    if (processType != undefined) {
                        where = {
                            ...where,
                            processType: {
                                [Op.eq]: featureActionExist?.data?.result?.rows[0]?.id,
                            },
                        }
                    }
                }
            }   

            let processData = await this.model.findAndCountAll({
                where: {
                    ...query.where,
                    ...where,
                },
                limit: query.limit,
                distinct: true,
                offset: query.offset,
                order: query.order,
            })

            let checkProcessFeature = await this.checkFeatureOfProcess(processData)

            return Promise.resolve(checkProcessFeature)

        } catch (error: any) {
            this.logger.error("Error in reading all process.", error.message)
            return Promise.reject(error.message)
        }
    }




    //CREATE PROCESS 
    async createProcess(req: Request) {
        const _transaction = await databaseInstance.transaction()        
        const { tenantId } = req.body
        try {
            var tenantExist = await processexternalComm.getTenant(tenantId)
            this.logger.info("tenantDataExist");
            if (!tenantExist) {
                throw new Exception(constant.ERROR_TYPE.NOT_FOUND, localConstant.TENANT_NOT_FOUND)
            }

            let name = req.body.name
            if(name == localConstant.ProcessType.DIGITIZATION|| name == localConstant.ProcessType.TRACKNTRACE || name == localConstant.ProcessType.SELECTDEVICE || name == localConstant.ProcessType.SELECTSITE || name == localConstant.ProcessType.SELECTZONE ||
                name == localConstant.ProcessType.READYSTATE || name == localConstant.ProcessType.LOCKTAG) {
                throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.PROCESS_NOT_CREATE)
            }
            var processExist = await this.model.findOne({
                where: {
                    tenantId: tenantId,
                    [Op.and]: [sequelize.where(sequelize.fn('upper', sequelize.col('name')), name.toUpperCase())]
                }, paranoid: false,
                transaction: _transaction
            })
            if (processExist) {
                throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, localConstant.PROCESS_EXIST)
            }
            req.body.workflowName = name
           let processType = req.body.processType
           let processTypeName = await processexternalComm.getFeaturesById(processType)
           processTypeName = processTypeName?.data?.result[0]?.name
            req.body.isShared = req.body.isShared ? req.body.isShared : true
            req.body.processTypeName = processTypeName
           
            
            let process = await this.model.create(req.body, { raw: true, transaction: _transaction })
             processType = process.processType

            req.body.processId = process.id,
                await this.assignProcessToDevice(req);

            let workflowObj = await this.convertProcess(process)            

            // let connect = process + workflowObj
            //convert string into object
            const workflow = await this.workflowSchemaServiceInstance.insertWorkFlow(workflowObj)
            
            let syncprocess = await this.syncData(process, req, workflow)                     

            // sync for device manager
            await processexternalComm.syncCreateProcess(process.id, syncprocess)
            await _transaction.commit()
            return Promise.resolve(process)
        } catch (error: any) {
            await _transaction.rollback()
            this.logger.error("Error in creating process.", error.message)
            return Promise.reject(error.message)
        }
    }


    async convertProcess(process: any) {


        let stateObject = JSON.parse(process.dataValues.states)
        process.dataValues.states = stateObject

        let transitionObject = JSON.parse(process.dataValues.transitions)
        process.dataValues.transitions = transitionObject

        let stepObject = JSON.parse(process.dataValues.steps)
        process.dataValues.steps = stepObject

        return process

    }

    async parseProcessObject(process: any) {

        let stateObject = JSON.parse(process.states)
        process.states = stateObject

        let transitionObject = JSON.parse(process.transitions)
        process.transitions = transitionObject

        let stepObject = JSON.parse(process.steps)
        process.steps = stepObject

        return process

    }




    //UPDATE PROCESS
    async update(req: Request) {
        const _transaction = await databaseInstance.transaction()
        try {
            let processId = req.params.id
            let name = req.body.name
            let tenantId = req.body.tenantId
            let processType = req.body.processType
            let isFinalized = req.params.isFinalized
            let processExist = await this.model.findByPk(processId, { transaction: _transaction })
            if (!processExist) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.PROCESS_NOT_EXIST)
            }
            if (processExist.status == 'running') {
                this.logger.error("process in progress.")
                throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.PROCESS_IN_PROGRESS)
            }

            if (name != null && name !== processExist.name) {
                if(name == localConstant.ProcessType.DIGITIZATION|| name == localConstant.ProcessType.TRACKNTRACE || name == localConstant.ProcessType.SELECTDEVICE || name == localConstant.ProcessType.SELECTSITE || name == localConstant.ProcessType.SELECTZONE ||
                    name == localConstant.ProcessType.READYSTATE || name == localConstant.ProcessType.LOCKTAG) {
                    throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.PROCESS_NOT_UPDATE)
                }
                let existingName = await this.model.findOne({
                    where: {
                        name: {
                            [Op.eq]: name,
                        },
                        tenantId: { [Op.eq]: tenantId }
                    },
                    logging: true,
                    transaction: _transaction
                })
                if (existingName) { throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, `Entered process name already exist!`,) }
            }

            let processTypeName = await processexternalComm.getFeaturesById(processType)
           processTypeName = processTypeName?.data?.result[0]?.name           
           req.body.processTypeName = processTypeName



            let updateObj = {
                name: req.body.name,
                description: req.body.description,
                processTypeName: req.body.processTypeName,
                initialState: req.body.initialState,
                states: req.body.states,
                transitions: req.body.transitions,
                assign: req.body.assign,
                minStationVersion: req.body.minStationVersion,
                instruction: req.body.instruction,
                status: req.body.status,
                isFinalized: req.body.isFinalized,
                isCustomizedLoop: req.body.isCustomizedLoop,
                createdAt: req.body.createdAt,
                updatedAt: req.body.updatedAt,
                deletedAt: req.body.deletedAt,
                startActions: req.body.startActions,
                stopActions: req.body.stopActions,
                roleId: req.body.assign.roles,
                actions: req.body.actions,
                steps: req.body.steps,
                startLoop: req.body.startLoop,
                workflowName: req.body.name,
                isShared: req.body.isShared ? req.body.isShared : true

            }

            await this.model.update(updateObj, {
                where: { id: processId },
                transaction: _transaction
            })

            let process = await this.model.findByPk(processId, { transaction: _transaction })
            process.dataValues.roleId = process.assign.roles
            process.dataValues.processId = process.id
            req.body.processId = process.id,
                await this.assignProcessUpdated(req, processExist.isPredefined);
            let workflowObj = await this.parseProcessObject(process)

            // //convert string into object
            const workflow = await this.workflowSchemaServiceInstance.updateWorkFlow(workflowObj, processExist?.name)
            // // sync for device manager
            await processexternalComm.syncUpdateProcess(process.id, { workflow: workflow, ...process, actions: JSON.stringify(process.actions) })
            await _transaction.commit()
            return Promise.resolve(process)
        } catch (error:any) {
            await _transaction.rollback()
            this.logger.error("Error in updating process", error.message)
            return Promise.reject(error.message)
        }
    }

    //GET PROCESS BY ID
    async getProcessById(req: Request) {
        try {
            let processId = req.params.id
            this.logger.info(processId)
            const processExist = await this.model.findOne({
                where: { id: processId }
            }
            );
            //this.logger.info(processExist)
            if (!processExist) {
                throw new Exception(
                    constant.ERROR_TYPE.NOT_FOUND,
                    localConstant.PROCESS_NOT_EXIST,
                )
            }

            let isEnabled: any = await TenantFeature.findOne({
                where: { tenantId: processExist.dataValues.tenantId, featureId: processExist.dataValues.processType }
            });
            if (isEnabled?.dataValues.isEnabled == 1) {
                
                return Promise.resolve(processExist)
            }
            else {
                
                return Promise.resolve("process is not enabled")
            }
        }
        catch (error:any) {
            this.logger.error("Error in get process by id.", error.message)
            return Promise.reject(error.message)
        }

    }

    //DELETE PROCESS BY ID
    async deleteProcess(req: Request) {
        const _transaction = await databaseInstance.transaction()
        try {
            const processId = req.params.id
            let processExist: any = await this.model.findOne({ where: { id: processId, }, transaction: _transaction })

            //to check Process exist or not
            if (!processExist) {
                throw new Exception(
                    constant.ERROR_TYPE.NOT_FOUND,
                    localConstant.PROCESS_NOT_EXIST,
                )
            }

            if (processExist.status == 'running') {
                this.logger.error("process in progress it cannot be deleted.")
                throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.PROCESS_IN_PROGRESS)
            }

            await this.unassignProcess(req);

            //to delete process
            await this.model.destroy({ where: { id: processId }, transaction: _transaction })

              // check for Workflow 
              const workflow = await this.model.findAll({where:{workflowName:processExist?.workflowName,tenantId:processExist?.tenantId}})
              if(workflow.length === 1){
                  await ProcessWorkFlowSchema.deleteOne({workflowName:processExist?.workflowName , tenantId:processExist?.tenantId})
              }
              
            // sync for device manager
            await processexternalComm.syncDeleteProcess(processId, processExist?.tenantId)
            await _transaction.commit()
            return Promise.resolve(localConstant.PROCESS_DELETED)
        }
        catch (error:any) {
            await _transaction.rollback()
            this.logger.error("Error in deleting process.", error.message)
            return Promise.reject(error.message)
        }
    }

    async deleteProcessByTenantId(req: Request) {
        const _transaction = await databaseInstance.transaction()
        try {

            const tenantId = req.params.tenantId
            let processExist: any = await this.model.findOne({ where: { tenantId: tenantId }, transaction: _transaction })
            let processExistAll: any = await this.model.findAll({ where: { tenantId: tenantId }, transaction: _transaction })

            //to check Process exist or not
            // if (!processExist) {
            //     throw new Exception(
            //         constant.ERROR_TYPE.NOT_FOUND,
            //         localConstant.PROCESS_NOT_EXIST,
            //     )
            // }
            // for process id array
            let deletedProcessIds: any = [];
            if (processExistAll.length > 0) {
                for (const value of processExistAll) {
                    deletedProcessIds.push(value.id);
                }
            }
            // await this.unassignProcess(req);
            //to delete process
            await this.model.destroy({ where: { tenantId: tenantId }, transaction: _transaction })
            // sync for device manager
            if (deletedProcessIds.length > 0) {
                await processexternalComm.syncBulkDeleteProcess(deletedProcessIds, processExist?.tenantId)
            }
            await _transaction.commit()
            return Promise.resolve(localConstant.PROCESS_DELETED)
        }
        catch (error:any) {
            await _transaction.rollback()
            this.logger.error("Error in deleting process.", error.message)
            return Promise.reject(error.message)
        }
    }


    async deleteProcessBySiteId(req: Request) {
        const _transaction = await databaseInstance.transaction()
        try {
            const processId = req.params.processId
            const siteId = req.params.siteId
            let processExist: any = await this.model.findOne({
                where: {
                    assign: {
                        sites: siteId
                    }
                }, transaction: _transaction, logging: true
            })
            let processExistAll: any = await this.model.findAll({ where: { siteId: siteId }, transaction: _transaction, logging: true })

            //to check Process exist or not
            if (!processExist) {
                throw new Exception(
                    constant.ERROR_TYPE.NOT_FOUND,
                    localConstant.PROCESS_NOT_EXIST,
                )
            }

            await this.unassignProcess(req);

            // for process id array
            let deletedProcessIds: any = [];
            for (const value of processExistAll) {
                deletedProcessIds.push(value.id);
            }

            //to delete process
            await this.model.destroy({
                where: {
                    assign: {
                        sites: siteId
                    }
                }, transaction: _transaction, logging: true
            })

            // sync for device manager
            await processexternalComm.syncBulkDeleteProcess(deletedProcessIds, processExist?.tenantId)
            await _transaction.commit()
            return Promise.resolve(localConstant.PROCESS_DELETED)
        }
        catch (error:any) {
            await _transaction.rollback()
            this.logger.error("Error in deleting process.", error.message)
            return Promise.reject(error.message)
        }
    }

    async deleteProcessByZoneId(req: Request) {
        const _transaction = await databaseInstance.transaction()
        try {
            const processId = req.params.id
            const zoneId = req.params.zoneId
            let processExist: any = await this.model.findOne({
                where: {
                    assign: {
                        zones: {
                            [Op.like]: zoneId
                        }
                    }
                }, transaction: _transaction, logging: true
            })

            await this.unassignProcess(req);

            //to delete process
            await this.model.destroy({
                where: {
                    assign: {
                        zones: {
                            [Op.like]: zoneId
                        }
                    }
                }, transaction: _transaction, logging: true
            })
            // sync for device manager
            await processexternalComm.syncDeleteProcess(processId, processExist?.tenantId)
            await _transaction.commit()
            return Promise.resolve(localConstant.PROCESS_DELETED)
        }
        catch (error:any) {
            await _transaction.rollback()
            this.logger.error("Error in deleting process.", error.message)
            return Promise.reject(error.message)
        }
    }

    //ASSIGN PROCESS 
    async assignProcessToDevice(req: Request) {
        const _transaction = await databaseInstance.transaction()
        try {
            let processId = req.body.processId
            let tenantId = req.body.tenantId
            let { devices, roles, sites, zones } = req.body.assign

            if (devices.length == 0 || roles == null) {
                this.logger.error("without deviceId process not assign")
                throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.NOT_NULL)
            }


            // FOR DEVICE CHECKING EXIST OR NOT 

            let devicesId = devices

            for (var index of devicesId) {
                let deviceExist = await processexternalComm.getDevice(index)
                if (!deviceExist) {
                    throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.DEVICE_NOT_FOUND)
                }
            }

            let roleId = roles
            for (var index of roleId) {
                let roleExist = await processexternalComm.getRole(index)
                if (!roleExist) {
                    throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.ROLE_NOT_FOUND)
                }
            }

            if (sites.length == 0 || sites.length !== 0) {

                let siteId = sites
                for (var index of siteId) {
                    let siteExist = await processexternalComm.getSite(index)
                    if (!siteExist) {
                        throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.SITE_NOT_FOUND)
                    }
                }
            }

            if (zones.length == 0 || zones.length !== 0) {

                let zoneId = zones
                for (var index of zoneId) {
                    let zoneExist = await processexternalComm.getZone(index)
                    if (!zoneExist) {
                        throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.ZONE_NOT_FOUND)
                    }
                }
            }

            if (devices) {
                // await this.models.ProcessDevice.update({ deviceId: deviceId }, {
                //     where: { processId: processId },
                //     transaction: _transaction
                // })

                let processAssign = await this.models.ProcessDevice.create({
                    processId: processId,
                    deviceId: devices,
                    roleId: roles,
                    siteId: sites,
                    zoneId: zones,
                    tenantId: tenantId
                }, { transaction: _transaction })
                processAssign.save(_transaction)

            }


            for (var index of devices) {
                const AssignData = {
                    deviceId: index,
                    processId: processId,
                    // roleId: roleId,
                    // zoneId: zoneId,
                    // siteId: siteId,
                    tenantId: tenantId
                }
                //await processexternalComm.AssignProcessToDevice(AssignData);
            }

            await _transaction.commit()
            return Promise.resolve(localConstant.PROCESS_ASSIGNED)
        } catch (error: any) {
            await _transaction.rollback()
            this.logger.error("Error in assigning process.", error.message)
            return Promise.reject(error.message)
        }
    }

    //UNASSIGN PROCESS
    async unassignProcess(req: Request) {
        const _transaction = await databaseInstance.transaction()
        try {
            let processId = req.params.id
            // let { deviceId, tenantId } = req.body
            let processExist = await this.model.findOne({ where: { id: processId, }, transaction: _transaction })

            if (!processExist) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.PROCESS_NOT_EXIST)
            }

            // //To notify the Device Management to unassign process.
            let deleteProcessFromDevice = await processexternalComm.UnAssignProcess(processId)
            if (!deleteProcessFromDevice) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.PROCESS_NOT_EXIST)
            }

            await this.models.ProcessDevice.destroy({
                where: { processId: processId },
                transaction: _transaction
            })

            await _transaction.commit()
            return Promise.resolve(localConstant.PROCESS_UNASSIGNED)
        } catch (error: any) {
            await _transaction.rollback()
            this.logger.error("Error in unassign process.", error.message)
            return Promise.reject(error.message)
        }
    }


    async assignProcessUpdated(req: Request, isPredefined: any = "") {
        const _transaction = await databaseInstance.transaction()
        try {
            let processId = req.body.processId

            let tenantId = req.body.tenantId
            let { isFinalized, status } = req.body
            let { devices, roles, sites, zones } = req.body.assign

            let processExist = await this.models.ProcessDevice.findOne({ where: { processId: processId, }, transaction: _transaction })
            if (!processExist && isPredefined) {

                await this.assignProcessToDevice(req);

            } else if (!processExist && !isPredefined) {
                throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.PROCESS_NOT_EXIST)

            }


            if (status == 'running') {
                this.logger.error("process in progress.")
                throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, localConstant.PROCESS_IN_PROGRESS)
            }


            let devicesId = devices

            for (var index of devicesId) {
                let deviceExist = await processexternalComm.getDevice(index)
                if (!deviceExist) {
                    throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.DEVICE_NOT_FOUND)
                }
            }

            let roleId = roles
            for (var index of roleId) {
                let roleExist = await processexternalComm.getRole(index)
                if (!roleExist) {
                    throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.ROLE_NOT_FOUND)
                }
            }

            if (sites.length == 0 || sites.length !== 0) {

                let siteId = sites
                for (var index of siteId) {
                    let siteExist = await processexternalComm.getSite(index)
                    if (!siteExist) {
                        throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.SITE_NOT_FOUND)
                    }
                }
            }

            if (zones.length == 0 || zones.length !== 0) {

                let zoneId = zones
                for (var index of zoneId) {
                    let zoneExist = await processexternalComm.getZone(index)
                    if (!zoneExist) {
                        throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, localConstant.ZONE_NOT_FOUND)
                    }
                }
            }


            let allprocess = await this.model.findOne({
                include: [
                    {
                        model: this.models.ProcessDevice,
                        where: { processId: processId },
                    },
                ],
            }, { transaction: _transaction })

            allprocess.processDevices.deviceId = devices
            allprocess.processDevices.roleId = roles
            allprocess.processDevices.siteId = sites
            allprocess.processDevices.zoneId = zones

            await allprocess.processDevices.save(_transaction)

            for (var index of devices) {
                const AssignData = {
                    deviceId: index,
                    processId: processId,
                    // roleId: roles,
                    // zoneId: zones,
                    // siteId: sites,
                    tenantId: tenantId
                }
                await processexternalComm.AssignProcessToDevice(AssignData);
            }

            await _transaction.commit()
            return Promise.resolve(localConstant.PROCESS_UPDATED)
        } catch (error: any) {
            await _transaction.rollback()
            this.logger.error("Error in update assigning process.", error.message)
            return Promise.reject(error.message)
        }
    }

    async getTenantProcess(req: Request) {
        const { tenantId, id } = req.params;
        try {
            const result = this.model.findOne({
                where: { tenantId, id }
            });
            return Promise.resolve(result);
        } catch (error: any) {
            return Promise.reject(error.message);
        }
    }

    async processCount(req: Request) {
        try {
            const { tenantId } = req.query;
            const whereCond = tenantId ? { tenantId } : {};

            return await this.model.count({
                where: { ...whereCond }
            });

        } catch (err: any) {
            return Promise.reject(err.message)

        }
    }

    async syncData(process: any, req: Request, workflow: any) {
        try{
        let createProcessData =
        {
            processId: process.id,
            tenantId: process.tenantId,
            name: process.name,
            description: process.description,
            initialState: process.initialState,
            states: process.states,
            transitions: process.transitions,
            assign: process.assign,
            minStationVersion: process.minStationVersion,
            instruction: process.instruction,
            status: process.status,
            isFinalized: process.isFinalized,
            isCustomizedLoop: process.isCustomizedLoop,
            startLoop: process.startLoop,
            processType: process.processType,
            processTypeName: process.processTypeName,
            createdAt: process.createdAt,
            updatedAt: process.updatedAt,
            deletedAt: process.deletedAt,
            startActions: process.startActions,
            stopActions: process.stopActions,
            roleId: process.assign.roles,
            actions: process.actions,
            steps: process.steps,
            isShared: process.isShared,
            isPredefined: process.isPredefined,
            workflowName: process.workflowName,
            workflow: workflow
        }


        return (createProcessData)
        }
        catch(error:any)
        {
            this.logger.error("Errro in creating syncData data format", error.message);
            return 
        }
    }  


    // GET PREDEFINED PROCESS BY TENANT ID
    async getPredefinedProcesses(req: Request) {
        try {
            let preDefinedProcessData = await this.model.findAll({
                where: {
                    tenantId: ' '
                }
            });
            return Promise.resolve(preDefinedProcessData);
        }
        catch (error: any) {
            this.logger.error("Error in getting process by Tenant Id.", error.message)
            return Promise.reject(error.message);
        }
    }


    //  CREATE PREDEFINED PROCESS
    async createPreDefinedProcess(req: Request) {
        const _transaction = await databaseInstance.transaction()
        const { tenantId } = req.body
        try {
            let name = req.body.name
            this.logger.debug("Before Creating Pre-define process")
            let process = await this.model.create(req.body, { raw: true, transaction: _transaction })
            req.body.processId = process.id;
            this.logger.debug("Before Finding ProcessWorkFlow Schema process", process.name)
            let predefinedWorkflow :any= {};
            predefinedWorkflow = await ProcessWorkFlowSchema.findOne({ workflowName: process.name })
            this.logger.info("predefinedWorkflow==>",predefinedWorkflow,  process.name)
            if(predefinedWorkflow!==null)
            {
            predefinedWorkflow.tenantId = tenantId
            this.logger.debug("Before Creating ProcessWorkFlow Schema process")
            const  workflow = await ProcessWorkFlowSchema.create(predefinedWorkflow)
            this.logger.debug("Before Calling SyncData ")
            let syncprocess = await this.syncData(process, req, workflow)
            this.logger.debug("Before Sending Data to syncCreateProcess service")
            await processexternalComm.syncCreateProcess(process.id, syncprocess)
            }
            await _transaction.commit()

            return Promise.resolve(process)
        } catch (error: any) {
            await _transaction.rollback()
            this.logger.error("Error in creating process.", error.message)
            return Promise.reject(error.message)
        }
    }

    async checkFeatureOfProcess(processData: any) {
        try {

            let processArray: any = []

            let lengthOfProcess = processData.rows.length
            let counter = 1
            let actualArrayLength=processData.count;
            for (let i = 0; i < lengthOfProcess; i++) {

                let tenantId = processData.rows[i].tenantId;
                let processTypeId = processData.rows[i].processType


                let featureExist: any
                if (tenantId != '') {
                    featureExist = await TenantFeature.findOne({ where: { tenantId: tenantId, featureId: processTypeId, isEnabled: 1 } })
                }
                if (featureExist != null) {
                    processArray.push(processData.rows[i])
                }
               
                if (lengthOfProcess == counter) {
                    let processData: any = {}
                    processData['count'] = processArray.length
                    processData['rows'] = processArray
                    return Promise.resolve(processData)

                }
                counter++;
            }


        }
        catch (error: any) {
            this.logger.error("Error in checking Feature of process", error.message)
            return Promise.reject(error.message)
        }
    }

}
