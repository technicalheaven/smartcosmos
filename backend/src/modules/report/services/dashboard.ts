import { log } from "console";
import { Request, Response } from "express";
import moment from "moment";
import sequelize from "sequelize";
import BaseService from "../../../core/services/base";
import { reportExternalCommInstance } from "./externalComm";
import { Op, Sequelize } from "sequelize";
import { databaseInstance } from "../../../config/db";
import { Exception } from "../../../middlewares/resp-handler";
import { logger } from "../../../libs/logger";
import { throws } from "assert";
var constant = require('../../../middlewares/resp-handler/constants');


export class DashboardService extends BaseService {
    constructor({ model, models, logger }: any) {
        super({ model, models, logger });
    }

    /*
    * This method is called when Tags will upload
    */
    async createReportTag(req: Request) {
        const { tenantId, counts } = req.body;

        // find current datatime and month
        const date = moment().format("YYYY-MM-DD");
        const month = moment().month();

        //check for tenant exist
        await reportExternalCommInstance.getTenantById(tenantId);



        // check if tenant , site , date report is not present then insert else update existing
        const reportExists = await this.models.TagCount.findOne({
            where: { tenantId, date }
        });

        // prepare count data on the basis of type while creating tag

        const secure = (!!counts?.secure) ? counts?.secure : 0;
        const standard = (!!counts?.standard) ? counts?.standard : 0;
        const total = parseInt(secure) + parseInt(standard);
        try{
        if (!reportExists) {
            // Insert report
            const dataForInsert = {
                tenantId,
                total,
                secure,
                standard,
                date,
                month,
            }

            const result = await this.models.TagCount.create(dataForInsert);
            if(!result) throw "Error during insert report data";
        } else {

            // Update report
            const result = await this.models.TagCount.update(
                {
                    total: sequelize.literal(`total + ${total}`),
                    secure: sequelize.literal(`secure + ${secure}`),
                    standard: sequelize.literal(`standard + ${standard}`),
                },
                {
                    where: { id: reportExists.id }
                });

                if(!result) throw "Error during update report data";
        }

        return true;
    }catch(err){
            return err;
    }

    }

    async createHeaderReport(req: Request){
        
        const {tenantId, siteId, entity, action} = req.body;
    
         //check for tenant exist
         let tdata=await reportExternalCommInstance.getTenantById(tenantId);
         let reportExists;
        if(siteId!==null)
        {
            // check for site exist in a tenant
         await reportExternalCommInstance.getTenantSite({ tenantId, siteId });
            reportExists = await this.models.DashboardHeaderCount.findOne({
            where: { tenantId, siteId }
        });
        }  
        else{ 
       
        // check if tenant , site  report is not present then insert else update existing
             reportExists = await this.models.DashboardHeaderCount.findOne({
            where: { tenantId, siteId }
        });
       
        }

       
        const CREATE_ACTION = 'create';
        const DELETE_ACTION = 'delete';
        const ACTIVE_ACTION = 'active';
        const DEACTIVE_ACTION = 'inActive';
        const SITE_ENTITY = 'site';
        const DEVICE_ENTITY= 'device';

        const allowedActions = [CREATE_ACTION, DELETE_ACTION, ACTIVE_ACTION, DEACTIVE_ACTION];

        // check for valid action value i.e. enabled, de-enabled
         if(!(allowedActions.includes(action))) throw 'Invalid action value it can be create, delete, active or inActive.';
       
        const totalDevices =  (action === CREATE_ACTION && entity === DEVICE_ENTITY)  ? 1 
        : (action === DELETE_ACTION && entity === DEVICE_ENTITY && reportExists?.totalDevices > 0  ) ? -1 
        : 0;

        const totalSites =  (action === CREATE_ACTION && entity === SITE_ENTITY)  ? 1 
        : (action === DELETE_ACTION && entity === SITE_ENTITY && reportExists?.totalSites > 0  ) ? -1 
        : 0;

        // const activeDevices = ((action === ACTIVE_ACTION || action === CREATE_ACTION) && entity === DEVICE_ENTITY && reportExists?.activeDevices <= reportExists?.totalDevices)  ? 1 
        // : (action === DEACTIVE_ACTION && entity === DEVICE_ENTITY && reportExists?.activeDevices > 0 ) ? -1 
        // : 0;

        // const inActiveDevices = (action === DEACTIVE_ACTION && entity === DEVICE_ENTITY && reportExists?.inActiveDevices < reportExists?.totalDevices)  ? 1 
        // : (action === ACTIVE_ACTION && entity === DEVICE_ENTITY && reportExists?.inActiveDevices > 0) ? -1 
        // : 0;
       
        try{
            if (!reportExists && action == CREATE_ACTION) {

                // Insert Report data
                const dataForInsert = {
                    tenantId,
                    siteId,
                    totalDevices: entity === DEVICE_ENTITY ? 1 : 0,
                    activeDevices: entity === DEVICE_ENTITY ? 1 : 0,
                    inActiveDevices:0,
                    totalSites: entity === SITE_ENTITY ? 1 : 0,
                }
              
                const result = await this.models.DashboardHeaderCount.create(dataForInsert);
                if(!result) throw "Error during insert report data";
                
            }
            else{
                // Update Report data
            const result = await this.models.DashboardHeaderCount.update(
                {
                    totalDevices: sequelize.literal(`totalDevices + ${totalDevices}`),
                    totalSites: sequelize.literal(`totalSites + ${totalSites}`),
                    // activeDevices: sequelize.literal(`activeDevices + ${activeDevices}`),
                    // inActiveDevices: sequelize.literal(`inActiveDevices + ${inActiveDevices}`),
                },
                {
                    where: { id: reportExists.id }
                });
                if(!result) throw "Error during update report data";
            }
            
            return true;
        } catch(err){
            return err;
        }
        
        
    }

    /*
    *This method is called when any enablement is done
    */
    async createReportEnablement(req:Request){
        const { tenantId, siteId, processId, upc, beforeStatus, status, type } = req.body;

        // find current datatime and month
        const date = moment().format("YYYY-MM-DD");
        const month = moment().month();
        try{
        //check for tenant exist
        await reportExternalCommInstance.getTenantById(tenantId);
        // check for site exist in a tenant
        await reportExternalCommInstance.getTenantSite({ tenantId, siteId });

        // check for process exist in a tenant
        const {data:processData} =  await reportExternalCommInstance.getTenantProcess({ tenantId, processId });

        // check for product exist in a tenant
        const {data:productData} = await reportExternalCommInstance.getTenantProduct({ tenantId, upc });

        const ENABLED_STATUS = 'enabled';
        const DEENABLED_STATUS = 'de-enabled';

        // check for valid status value i.e. enabled, de-enabled
         if(!(status === ENABLED_STATUS || status === DEENABLED_STATUS)) throw 'Invalid status value it can be enabled or de-enabled.';
         
        // check for valid beforeStatus value i.e. allowed value - emptystring, enabled, de-enabled
         if(!(beforeStatus === ENABLED_STATUS || beforeStatus === DEENABLED_STATUS || beforeStatus === '')) throw 'Invalid beforeStatus value it can be enabled, de-enabled or empty string.';

        // check if tenant , site  date report is not present then insert else update existing
        const reportExists = await this.models.Enablement.findOne({
            where: { tenantId, siteId, date }
        });
       
        if(status === DEENABLED_STATUS && beforeStatus !== ENABLED_STATUS) throw "De-enablement is only possible with enabled tags.";
        
        const enabledCount =  (status === ENABLED_STATUS && ((!beforeStatus) || 
        (!!beforeStatus && beforeStatus === DEENABLED_STATUS)))  ? 1 
        : (status === DEENABLED_STATUS && beforeStatus === ENABLED_STATUS && reportExists?.enabledCount > 0) ? -1 
        : 0;
        
        
        const unsecureEnabledCount =  (status === ENABLED_STATUS && ((!beforeStatus) || 
        (!!beforeStatus && beforeStatus === DEENABLED_STATUS)))  ? 1 
        : (status === DEENABLED_STATUS && beforeStatus === ENABLED_STATUS && reportExists?.unSecureEnabledCount > 0) ? -1 
        : 0;

        
        const deEnabledCount = (status === DEENABLED_STATUS && beforeStatus === ENABLED_STATUS) ? 1 
        : (status === ENABLED_STATUS && beforeStatus=== DEENABLED_STATUS && !!beforeStatus && reportExists?.deEnabledCount > 0) ? -1 
        : 0;

        const unsecureDeEnabledCount = (status === DEENABLED_STATUS && beforeStatus === ENABLED_STATUS) ? 1 
        : (status === ENABLED_STATUS && beforeStatus=== DEENABLED_STATUS && !!beforeStatus && reportExists?.unSecureDeEnabledCount > 0) ? -1 
        : 0;
       


        // try{

            // Insert Report data
            if (!reportExists || reportExists == null) {
               
                let dataForInsert: any = {};  
                dataForInsert = {
                    tenantId,
                    siteId,
                    enabledCount:(type=='secure')?1:0,
                    deEnabledCount:0,
                    date,
                    month,
                    unSecureEnabledCount: (type=='unsecure')?1:0,
                    unSecureDeEnabledCount: 0,
                }
                

                const result = await this.models.Enablement.create(dataForInsert);
                if(!result) throw "Error during insert report data";
            }
            else{
               
                // Update Report data
                let result;
                if(type == 'secure'){
                    result = await this.models.Enablement.update(
                        {
                            enabledCount: sequelize.literal(`enabledCount + ${enabledCount}`),
                            deEnabledCount: sequelize.literal(`deEnabledCount + ${deEnabledCount}`),
                        },
                        {
                            where: { id: reportExists.id }
                        });
                }
                if(type == 'unsecure'){
                    result = await this.models.Enablement.update(
                        {
                            unSecureEnabledCount: sequelize.literal(`unSecureEnabledCount + ${unsecureEnabledCount}`),
                            unSecureDeEnabledCount: sequelize.literal(`unSecureDeEnabledCount + ${unsecureDeEnabledCount}`),
                        },
                        {
                            where: { id: reportExists.id }
                        });

                }

                if(!result) throw "Error during update report data";
            }

           
            // Save enablements count w.r.t. process and product

            const existProcessEnablement = await this.models.EnablementByProcess.findOne({
                where: { tenantId, siteId, processId, date }
            });

            const existProductEnablement = await this.models.EnablementByProduct.findOne({
                where: { tenantId, siteId, upc, date }
            });
            const commonFields = {
                tenantId,
                siteId,
                date,
                month,
            } 

            if(!existProcessEnablement){
                // insert
                const dataForInsert = {
                    ...commonFields,
                    processId,
                    processName: processData?.result?.name,
                    count: 1,
                }
                await this.models.EnablementByProcess.create(dataForInsert);
            }else{
                // update
                const checkSameProcess = processId === existProcessEnablement?.processId;
                const processCount = (checkSameProcess && status === ENABLED_STATUS) && (!beforeStatus || 
                    (beforeStatus === DEENABLED_STATUS && !!beforeStatus)) ? 1 
                    : (checkSameProcess && status === DEENABLED_STATUS && beforeStatus === ENABLED_STATUS) ? -1 
                    : 0;

                await this.models.EnablementByProcess.update({count: sequelize.literal(`count + ${processCount}`)},{where: {id:existProcessEnablement?.id}});
            }

            if(!existProductEnablement){
                // insert
                const dataForInsert = {
                    ...commonFields,
                    upc,
                    productName: productData?.result?.name,
                    count: 1,
                }
                await this.models.EnablementByProduct.create(dataForInsert);
            }else{

                // update
                const checkSameProduct = upc === existProductEnablement?.upc;
                const productCount = (checkSameProduct && status === ENABLED_STATUS) && (!beforeStatus ||
                     (!!beforeStatus && beforeStatus=== DEENABLED_STATUS)) ? 1 
                     : (checkSameProduct && status === DEENABLED_STATUS && beforeStatus === ENABLED_STATUS) ? -1 
                     : 0;

                await this.models.EnablementByProduct.update({count: sequelize.literal(`count + ${productCount}`)},{where: {id:existProductEnablement?.id}});
            }
            return true;
        }
        catch(err){
            logger.error("error enablement report creation: ", err);
            return err;
        }
            
            
    }

    async getReportDashboard(req:Request){
        let {tenantId, siteId, to, from} = req.query;
        let whereCond: any = {}
        // for tagsConts only
        let whereCondTag: any = {}
       
        if (to != undefined) {
            to = to+" "+"23:59:59";       
            whereCond = from ? {
              ...whereCond,
              createdAt: {
                [Op.between]: [from, to]
              }
            } : {
              ...whereCond,
              createdAt: {
                [Op.lte]: to
              }
            }

            // for tagsCount
            whereCondTag = from ? {
                ...whereCondTag,
                createdAt: {
                  [Op.between]: [from, to]
                }
              } : {
                ...whereCondTag,
                createdAt: {
                  [Op.lte]: to
                }
              }

          }
      
          if (tenantId) {
            whereCond.tenantId = tenantId
            whereCondTag.tenantId = tenantId
          }
          if (siteId) {
            whereCond.siteId = siteId
          }
        // whereCond = 
        // !!tenantId ? { tenantId } 
        // : !!siteId ? { siteId } 
        // : {};
        try{
        // Get system tags report data
        const tagReportData = await this.models.TagCount.findOne({
            attributes:[
                [sequelize.fn('sum', sequelize.col('total')), 'total'],
                [sequelize.fn('sum', sequelize.col('secure')), 'secure'],
                [sequelize.fn('sum', sequelize.col('standard')), 'standard'],
            ],
            where: {...whereCondTag}, raw:true}
            );        

        // Get enablement report data 

        const enablementReportData = await this.models.Enablement.findAll({
          attributes:[
            [sequelize.fn('sum', sequelize.col('enabledCount')), 'enabled'],
            [sequelize.fn('sum', sequelize.col('deEnabledCount')), 'deEnabled'],
            [sequelize.fn('sum', sequelize.col('unSecureEnabledCount')), 'unSecureEnabledCount'],
            [sequelize.fn('sum', sequelize.col('unSecureDeEnabledCount')), 'unSecureDeEnabledCount'],
            'month',
          ],
          where: {...whereCond}, raw:true,
          group : ['month']
        });    
        
        // fix unused count when site filter
        const {siteId, ...rest} = whereCondTag;
        const tenantEnablementReportData = await this.models.Enablement.findAll({
            attributes:[
              [sequelize.fn('sum', sequelize.col('enabledCount')), 'enabled'],
              'month',
            ],
            where: {...rest}, raw:true,
            group : ['month']
          });   

        const monthlyEnabledCounts = enablementReportData.map((x:any) => parseInt(x.enabled));
        const monthlyUnSecureEnabledCounts = enablementReportData.map((x:any) => parseInt(x.unSecureEnabledCount));

        const tenant_monthlyEnabledCounts = tenantEnablementReportData.map((x:any) => parseInt(x.enabled));

        const monthlyDeEnabledCounts = enablementReportData.map((x:any) => parseInt(x.deEnabled));
        const monthlyUnSecureDeEnabledCounts = enablementReportData.map((x:any) => parseInt(x.unSecureDeEnabledCount));
        
        let totalEnabledTags =  monthlyEnabledCounts.reduce((a:any, b:any) => a + b, 0);                       // adding all secure enalement count
        const totalUnSecureEnabledTags =  monthlyUnSecureEnabledCounts.reduce((a:any, b:any) => a + b, 0);       // adding all unsecure enalement count
        

        const tenant_totalEnabledTags =  tenant_monthlyEnabledCounts.reduce((a:any, b:any) => a + b, 0);

        let totalDeEnabledTags =  monthlyDeEnabledCounts.reduce((a:any, b:any) => a + b, 0);              // adding all secure de-enable count
        const totalUnSecureDeEnabledTags =  monthlyUnSecureDeEnabledCounts.reduce((a:any, b:any) => a + b, 0);  // adding all unsecure de-enable count

        const unUsedTags = parseInt(tagReportData?.total) - parseInt(tenant_totalEnabledTags);
        
        // total sites, devices,
     
        
        let totalCounts = await this.models.DashboardHeaderCount.findOne({
            attributes:[
                [sequelize.fn('sum', sequelize.col('totalSites')), 'totalSites'],
                [sequelize.fn('sum', sequelize.col('totalDevices')), 'totalDevices'],
            ],
            where: {...whereCond},
            ...(tenantId && {group: ['tenantId']}),
            raw: true
        });
        totalCounts = {...totalCounts, totalSites: siteId ? 1 : totalCounts?.totalSites}  
        // top 5 enablement products
        
        const topEnablementProducts = await this.models.EnablementByProduct.findAll({
            attributes:[
                'upc',
                ['productName','name'],
                [sequelize.fn('sum', sequelize.col('count')), 'count'],
              ],
            where: {...whereCond},
            order: [['count', 'DESC']],
            group : ['upc', 'productName'],
            limit : 5,
            raw:true,
        });

        // top 5 enablement processes
        
        const topEnablementProcesses = await this.models.EnablementByProcess.findAll({
            attributes:[
                'processId',
                ['processName','name'],
                [sequelize.fn('sum', sequelize.col('count')), 'count'],
              ],
            where: {...whereCond},
            order: [['count', 'DESC']],
            group : ['processId', 'processName'],
            limit : 5,
            raw:true,
        });

        totalEnabledTags += totalUnSecureEnabledTags;
       
        totalDeEnabledTags += totalUnSecureDeEnabledTags;

        return this.dashboardResponse({tagReportData,enablementReportData,totalEnabledTags, totalDeEnabledTags, unUsedTags,totalCounts,topEnablementProducts, topEnablementProcesses});
        //return this.dashboardResponse({tagReportData,enablementReportData,totalEnabledTags, totalDeEnabledTags, unUsedTags,totalCounts,topEnablementProducts, topEnablementProcesses});
        

        }catch(error){
            this.logger.error(error);
        }
    }

    dashboardResponse = ({tagReportData, enablementReportData, totalEnabledTags, totalDeEnabledTags, unUsedTags, totalCounts, topEnablementProducts, topEnablementProcesses}:any) => {
        const {total, secure, standard} = tagReportData;
        return {
            totalCounts: {
                totalSites: totalCounts?.totalSites ? parseInt(totalCounts?.totalSites) : 0,
                totalDevices: totalCounts?.totalDevices ? parseInt(totalCounts?.totalDevices) : 0,
            },
            tagInfo:{
                tagsCount:{
                    total: parseInt(total),
                    secure: parseInt(secure),
                    standard: parseInt(standard),
                    enabled: parseInt(totalEnabledTags),
                    deEnabled: parseInt(totalDeEnabledTags),
                    unUsed: parseInt(unUsedTags),
                },
                monthlyEnablementReport: enablementReportData.map((x:any) => ({
                        "enabled": parseInt(x?.enabled) + parseInt(x?.unSecureEnabledCount),
                        "deEnabled": parseInt(x?.deEnabled) + parseInt(x?.unSecureDeEnabledCount),
                        "month": parseInt(x?.month),
                    
                })),
            },
            topEnablementProducts: topEnablementProducts.map((x:any) => ({...x,count:  parseInt(x?.count)})),
            topEnablementProcesses: topEnablementProcesses.map((x:any) => ({...x,count:  parseInt(x?.count)})),
            
        }

    };

    
    async deleteDashboardTagData(req: Request) {
        const _transaction = await databaseInstance.transaction();
        try {
          let id = req.params.id;

          if (id === null || id === "" || id == undefined) {
            throw new Exception(constant.ERROR_TYPE.NOT_FOUND, 'TenantId invalid');
          }
          
          let existingTagCount = await this.models.TagCount.findAll({ where: { tenantId: id }});
          if(existingTagCount){
            await this.models.TagCount.destroy({ where: { tenantId: id }, transaction: _transaction });
            logger.info("TagsCount data deleted for tenantId: "+id);
          }
          
          let existingEnablements = await this.models.Enablement.findAll({ where: { tenantId: id }});
          if(existingEnablements){
            await this.models.Enablement.destroy({where: {tenantId: id}, transaction: _transaction});
            logger.info("Enablement data deleted for tenantId: "+id);
        }

         let existingEnablementByProcess = await this.models.EnablementByProcess.findAll({ where: { tenantId: id }});
         if(existingEnablementByProcess){
            await this.models.EnablementByProcess.destroy({where: {tenantId: id}, transaction: _transaction});
            logger.info("EnablementByProcess data deleted for tenantId: "+id);
        }

        let existingEnablementByProduct = await this.models.EnablementByProduct.findAll({ where: { tenantId: id }});
         if(existingEnablementByProduct){
            await this.models.EnablementByProduct.destroy({where: {tenantId: id}, transaction: _transaction});
            logger.info("EnablementByProduct data deleted for tenantId: "+id);
        }

        let existingDashboardHeaderCount = await this.models.DashboardHeaderCount.findAll({ where: { tenantId: id }});
         if(existingDashboardHeaderCount){
            await this.models.DashboardHeaderCount.destroy({where: {tenantId: id}, transaction: _transaction});
            logger.info("DashboardHeaderCount data deleted for tenantId: "+id);
        }
          
          await _transaction.commit();
          return Promise.resolve('Tag data deleted for tenant id: '+id);
    
    
        } catch (err: any) {
          await _transaction.rollback();
          this.logger.error("Error at deleteTenant ", err.message);
          return Promise.reject(err.message)
        }
    
      }

}
