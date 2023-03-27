import { Request, Response } from "express";
import StatusCodes from 'http-status-codes';
import BaseService from '../../../core/services/base';
import { v4 as uuid } from 'uuid'
import { sequelize } from "../../../config/db";
import Exception from "../../../middlewares/resp-handler/exception";
var constant = require('../../../middlewares/resp-handler/constants');
import { UPDATECHUNKLIMIT, SYNCLIMIT, EXPORTCHUNKLIMIT } from '../utils/constant';
import { productExternalCommInstance } from "./externalComm";
import { findDuplicates, isJsonString } from "../../../helpers";
import { paginator } from '../../../libs/pagination/index';
import { logger } from "../../../libs/logger";
import { pathToFileURL } from "url";
import { hasSubscribers } from "diagnostics_channel";
import { config } from "../../../config";
import path from "path";
import fs from 'fs';
var json2xls = require('json2xls')
import Sequelize from "sequelize";
import { SyncDataAction } from "../../device/sync-service/rmq/helpers/rmqConfig";
var SqlString = require('sqlstring');
const Op  = Sequelize.Op;

let ExportChunkValue01:any=process.env.EXPORTCHUNKSLIMIT
const ExportChunkValue=parseInt(ExportChunkValue01);

export class ProductService extends BaseService {
    constructor({ model, models, logger }: any) {
        super({ model, models, logger });
    }

    public async create(req: Request) {
        const t = await sequelize.transaction();
        try {
            //    const isProductExist = await this.model.count({ where: { tenantId: req.body.tenantId } },{ transaction: t });
            //    if (isProductExist) throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, "A product is already exist for this tenant");
            const result = await this.model.create(req.body, { transaction: t });
            const productId = result.id;

            // for data synced to device management
            // await productExternalCommInstance.syncProductDataAdd(productId, req.body);
            await t.commit();
            return Promise.resolve(result);


        } catch (error: any) {
            await t.rollback();
            return Promise.reject(error.message);
        }
    }



    public async update(req: Request) {
        const t = await sequelize.transaction();
        try {
            const allowedFields = ['name', 'description', 'imageURL'];
            const otherKeys = [];
            for (let key in req.body) {
                if (!allowedFields.includes(key)) {
                    otherKeys.push(key);
                }
            }
            if (otherKeys.length) throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, `${otherKeys.toString()} field not allowed for update operation`);

            var id = req.params.id;
            var result = await this.model.findByPk(id, { transaction: t })

            if (!result) {
                throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `record with id ${id} does not exist`);
            }

            await this.model.update(req.body, {
                where: { id }
            }, { transaction: t });

            const data = await this.model.findByPk(id, { transaction: t });

            // for data synced to device management
            await productExternalCommInstance.syncProductDataUpdate({ id, ...req.body });
            await t.commit();
            return Promise.resolve(data);


        } catch (error: any) {
            await t.rollback();
            return Promise.reject(error.message);
        }
    }

    public async uploadProduct(req: Request, xlsxData: any) {
        const t = await sequelize.transaction();

        const actionType = req.body.actionType;

        if(!actionType) throw "Please provide action type.";

        const { tenantId } = req.params;
        // logger.debug('xlsxData', xlsxData);

        try {

            await productExternalCommInstance.getTenantById(tenantId);

            if (!xlsxData.length) throw "Data not available in uploaded file.";
            else {
                // make variables productData for storing final excel data for save into db , total for storing total count 
                let productData: any = [], total = 0;

                // filter out empty rows from xlsxData if UPC is not provided, and reformat object for saving into database        
                productData = xlsxData.filter((obj: any) =>  (obj['upc'] !== undefined || obj['sku'] !== undefined ) && !(obj['name'] == undefined || obj['description'] == undefined)).map(({
                    upc ="",
                    sku = "",
                    name = "",
                    description = "",
                    experience_id = "",
                    experience_studio_id = "",
                    experience_tenant_id = "",
                    manufacturer = "",
                    type = "",
                    categories = "",
                    sub_categories = "",
                    price = "",
                    color = "",
                    size = "",
                    images = "",
                    image_url = "",
                    other_attributes = ""
                }: any) => {
                    let _upc = upc == "" ? "" :  isNaN(upc) ? upc : upc.toString();
                    let _sku = sku == "" ? "" :  isNaN(sku) ? sku : sku.toString();
                    return {
                    tenantId,
                    upc: _upc || _sku,
                    sku: _sku,
                    name,
                    description,
                    experienceId: experience_id,
                    experienceStudioId: experience_studio_id,
                    experienceTenantId: experience_tenant_id,
                    manufacturer,
                    type,
                    categories,
                    subCategories: sub_categories,
                    price,
                    color,
                    size,
                    images,
                    imageURL: image_url,
                    otherAttributes: isJsonString(other_attributes)?  JSON.parse(other_attributes): {}
                    }
                })
                ;


                // storing total rows count
                total = productData.length;

                // fetching tenant product data which is already present in database call as prevData
                const prevData = await this.model.findAll({ where: { tenantId }, raw: true, transaction: t });

                // identify duplicate upcs from productData and store into xlsDuplicateUpcs array
                const xlsDuplicateUpcs = findDuplicates(productData.map((item: any) => item.upc));

                // regex for checking upc , disallow spaces between string
                const pattern = /^\S*$/;

                // count duplicate upc from product data and store each duplicate upc count into xlsDuplicatesCountArray
                const xlsDuplicatesCountArray = xlsDuplicateUpcs.map((upc: any) => productData.filter((item: any) => { if (item.upc === upc || !pattern.test(item.upc)) return item.upc }).length);

                // sum of duplicate upc count store it into failedRowsCount variable, Here we use array.reduce() method for calculating sum of array elements
                let failedRowsCount = xlsDuplicatesCountArray.reduce((sum: any, curr: any) => sum += curr, 0)


                // Remove duplicate upc data and invalid upc data from productData
                productData = productData.filter((item: any) => {
                    if (!xlsDuplicateUpcs.includes(item.upc) && pattern.test(item.upc)) return item;
                })
                
                // Remove data if other attributes is not a valid json string
                let otherAttributesFailed:any = [];
                productData = productData.filter((item:any) => {
                   // let checkArrayInput= isJsonString(item?.otherAttributes)? JSON.parse(item?.otherAttributes): "";
                    if((![undefined,null,""].includes(item?.otherAttributes)) && (Array.isArray(item?.otherAttributes))){
                        otherAttributesFailed.push(item?.upc);
                    }else{
                        return item;
                    }
                }); 
               
            
                // If otherAttributesFailed data is found then add into failedRowCount
                failedRowsCount += otherAttributesFailed.length;
                

                // Collect upc ids from db prevData and store it in upcs variable as plain array 
                const upcs = prevData.map((item: any) => item.upc);
                let success: any = [], failed: any = [], dbfailed: any = [];


                // filter out productData if upc is already present into db also collect success and dbfailed upc ids
                productData = productData.filter((item: any) => {
                    if (actionType !== 'UPDATE' && upcs.includes(item.upc.toString())) {
                        dbfailed.push(item.upc);
                    } else {
                        success.push(item.upc);
                        return item;
                    }
                })
                // logger.debug('product data', productData);

                // if dbfailed upcs are found add count into failedRowsCount variable
                if (dbfailed.length) failedRowsCount += dbfailed.length;

                // Here we collecting failed upcs unique data , Set() data collection is used for removing duplicate values.
                failed = [...new Set([...xlsDuplicateUpcs, ...dbfailed])];


                logger.debug('total :', total, ' sucessrows : ', success.length, 'failed : ', failed, 'failedrows :', failedRowsCount);

                if (actionType == 'ADD') productData = await this.addFileProducts(prevData, productData);
                else if (actionType == 'APPEND') productData = await this.appendFileProducts(prevData, productData);
                else if (actionType == 'UPDATE') productData = await this.updateFileProducts(upcs, productData, tenantId, t);                

                // Bulk insert products
              let productResponse =   await this.model.bulkCreate(productData, {
                    transaction: t
                });                
                await t.commit();
                
              //  prepare product data to sync
                if(productResponse) {
                    let syncProductData = [...JSON.parse(JSON.stringify(productResponse))]
                    syncProductData = syncProductData.map((item:any) => {
                        const {id: productId, status, ...fields} = item;
                        return {
                            ...fields,
                            productId,
                            status,
                        }

                    });                    
                    
              // Sync products to device module
              // checking response data size if it is greater then 500 the it will split into data chunk, each chunk contain 100 products 
                     if(syncProductData.length>SYNCLIMIT)
                        { 
                                const chunkSize=SYNCLIMIT;          
                                for (let i = 0; i < syncProductData.length; i += chunkSize) 
                                {
                                const chunk = syncProductData.slice(i, i + chunkSize);
                                await productExternalCommInstance.syncProductData({ data:chunk, tenantId , action: SyncDataAction.CREATE});
                                }
                        }
                        else
                        {
                           await productExternalCommInstance.syncProductData({ data:syncProductData, tenantId, action: SyncDataAction.CREATE });
                        }  
            }

              //  await productExternalCommInstance.syncProductData({ data:productData, actionType, tenantId });

                let message = "";

                message += `${success.length} rows uploaded successfully ${failedRowsCount} rows failed`;

                if(failed.length) message += `, Duplicate UPC ${failed.toString()}`;
            
                if(otherAttributesFailed.length) message += ` & Invalid otherAttributes value of UPC ${otherAttributesFailed.toString()}`;

                // return {
                //     totalRows: total,
                //     successRows: success.length,
                //     failedRows: failedRowsCount,
                //     message,
                // };

                return Promise.resolve({
                    totalRows: total,
                    successRows: success.length,
                    failedRows: failedRowsCount,
                    message,
                });
            }

        } catch (error: any) {
            logger.error('Error in uploading product block', error);
            await t.rollback();
            return Promise.reject(error.message);
        }
    }


    public async addFileProducts(prevData: any, data: any) {
        
        if (prevData.length) throw new Exception(constant.ERROR_TYPE.INTERNAL_ERROR, "You can't add data as data is already present.");
        return data;
    }

    public async appendFileProducts(prevData: any, data: any) {
        if (!prevData.length) throw new Exception(constant.ERROR_TYPE.INTERNAL_ERROR, "First need to add product Data during append operation.");
        return data;
    }

    public async updateFileProducts(upcs: any, data: any, tenantId: any, t: any) {
        try{
            let sql = '';
        if (!upcs.length) throw new Exception(constant.ERROR_TYPE.INTERNAL_ERROR, "First need to add product Data during update operation.");
        const dataForInsert = data.filter((item: any) => !upcs.includes(item.upc.toString()));
        const dataForUpdate = data.filter((item: any) => upcs.includes(item.upc.toString()));
        if (dataForUpdate.length) {
            // if(dataForUpdate.length>UPDATECHUNKLIMIT)
            // {          
            //         for (let i = 0; i < dataForUpdate.length; i += UPDATECHUNKLIMIT) 
            //         {
            //         const chunk = dataForUpdate.slice(i, i + UPDATECHUNKLIMIT);
            //         sql = await this.generateUpdateSQL(chunk);
            //     }
            // }
            // else
            // {
            //     sql = await this.generateUpdateSQL(dataForUpdate);
            // } 
            sql = await this.generateUpdateSQL(dataForUpdate);

           await sequelize.query(sql);
         // console.log("UpdatedData..", updatedData)
            
             // checking response data size if it is greater then 500 the it will split into data chunk, each chunk contain 100 products 
             if(dataForUpdate.length>SYNCLIMIT)
             {        
                     for (let i = 0; i < dataForUpdate.length; i += SYNCLIMIT) 
                     {
                     const chunk = dataForUpdate.slice(i, i + SYNCLIMIT);
                     await productExternalCommInstance.syncProductData({ data:chunk, tenantId, action: SyncDataAction.UPDATE });
                     }
             }
             else
             {
                await productExternalCommInstance.syncProductData({ data:dataForUpdate, tenantId, action: SyncDataAction.UPDATE });
             }       

        }
            return dataForInsert;
        }
        catch(error:any)
        {
            logger.error("Error in updating products=>", error.message)
        }
    }


    // generate sql query for bulk update
    private async generateUpdateSQL(dataArray:any){
        try{
        let sql = "";
        dataArray.forEach((item:any) => {
          const {upc, tenantId, otherAttributes, ...rest} = item;
          let temp = [];
          sql += `UPDATE products SET `;
          for (let key in rest){
             temp.push(` ${key} = ${SqlString.escape(rest[key])}`);

           } 
          sql += temp.toString();
          sql += `, otherAttributes = '${JSON.stringify(otherAttributes)}'`;
          sql += ` WHERE upc = '${upc}' AND tenantId = '${tenantId}';`;
        });
        return Promise.resolve(sql);

    } catch(err:any) {
        logger.error("Error in generateUpdateSQL query in product update", err.message);
        return Promise.reject(err.message);
    }
      }

    public async updateByUpc(req: Request) {
        const t = await sequelize.transaction();
        try {
            const allowedFields = ['upc'];
            const { tenantId } =req.body;
            const otherKeys = [];
            for (let key in req.body) {
                if (allowedFields.includes(key)) {
                    otherKeys.push(key);
                }
            }
            
            if (otherKeys.length) throw new Exception(constant.ERROR_TYPE.NOT_ALLOWED, `${otherKeys.toString()} field not allowed for update operation`);

            var upc:any = req.params.upc;
            //let _upc = upc == "" ? "" :  isNaN(upc) ? upc : JSON.stringify(upc);
            
            console.log("_upc==>",upc)
            var result = await this.model.findOne({ where: { upc: upc, tenantId:tenantId } }, { transaction: t })

            if (!result) {
                throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `record with upc ${upc} does not exist`);
            }
            //where: {  upc: isNaN(upc) ? JSON.stringify(upc): upc, tenantId:tenantId  }
            await this.model.update(req.body, {
                where: {  upc:upc, tenantId:tenantId  }
            }, { transaction: t });

            const data = await this.model.findOne({ where: { upc:upc, tenantId:tenantId }, raw:true}, { transaction: t });
            if(data) {
                
                const {id: productId, ...fields} = data
                let syncUpdatedUpc = {
                    ...fields,
                    productId,
                }                
                await productExternalCommInstance.syncProductDataUpdateByUPC(syncUpdatedUpc);

            }
            

            // for data synced to device management
            // await productExternalCommInstance.syncProductDataUpdateByUPC({ upc, ...req.body });
            await t.commit();
            return Promise.resolve(data);


        } catch (error: any) {
            await t.rollback();
            return Promise.reject(error.message);
        }
    }

    public async readAll(req:any={}){
        try {
            let order = req.query.sortOrder;
            let query = paginator(req.query, []);
            let {tenantId} = req.query;

            let whereObj: any = {}

            if(!!tenantId) await productExternalCommInstance.getTenantById(tenantId);
            
            // Destructure filter parameters from request using rest operator 
            let {sortOrder, sortBy, limit , page, upc , ...filterparams} = req.query;
            let filterObj:any = {};
            filterObj = Object.keys(filterparams).length ? filterparams : {};
            
            let {to, from,...wherecond} = filterObj;
            let whereLike:any = {};
      
            if(filterObj.to != undefined) {
                whereLike = filterObj?.from?{
                    ...whereLike,
                    updatedAt: {
                        [Op.between]: [filterObj?.from, filterObj?.to]
                    }
                } : { ...whereLike,
                  updatedAt: {
                      [Op.lte]: filterObj?.to
                  }}
              }


            if(upc != undefined){
                whereLike.upc = {[Op.like] :  `%${upc}%`};
            }
            if(tenantId!=undefined)
            {
                whereLike.tenantId = tenantId;
            }

            let result = await this.model.findAndCountAll({
                limit: query.limit,
                offset: query.offset,
                order: [[req.query.sortBy ?? "name", order ?? "ASC"]],
                where: {...whereLike}
                //where: {...wherecond,...whereLike}
            },{raw:true});
            //where: {...wherecond,...whereLike}
            result = JSON.parse(JSON.stringify(result));
            result.rows = result.rows.map((item:any) => ({...item, upc: item.upc ? item.upc.replaceAll('"', ''): item.upc}));
           
            return result;

        } catch (error: any) {
            logger.error("Error_in_product_search_", error.message)
            return Promise.reject(error.message)
        }
    }


    public async delete(req: Request) {
        const transaction = await sequelize.transaction()
        try {
            var id = req.params.id;
            var result = await this.model.findByPk(id, { transaction })
            if (!result) {
                throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `record does not exist`)
            }
            await this.model.destroy({ where: { id }, transaction })

            // for data synced to device management
            await productExternalCommInstance.syncProductDataDelete(id, result?.tenantId);
            await transaction.commit()
            return Promise.resolve(`record deleted successfully of id ${id}`)

        } catch (error: any) {
            await transaction.rollback()
            return Promise.reject(error.message)
        }
    }


    public async deleteTenant(req: Request) {
        const transaction = await sequelize.transaction()
        try {
            let tenantId = req.params.tenantId;
            let productResult = await this.model.findAll({where:{tenantId:tenantId}});
            // await productExternalCommInstance.getTenantById(tenantId);
            let deletedProductIds:any=[];
            if(productResult.length>0)
            {
                for (const value of productResult) 
                    {
                        deletedProductIds.push(value.id);
                    }

                await productExternalCommInstance.syncProductBulkDelete(deletedProductIds,tenantId);
            }
           await this.model.destroy({ where: { tenantId }, transaction })
            await transaction.commit()
            return Promise.resolve(`record deleted successfully of tenantId ${tenantId}`)

        } catch (error: any) {
            this.logger.error("ErrorInDeleteTenantProdct", error.message)
            await transaction.rollback()
            return Promise.reject(error.message)
        }
    }


    public async restoreTenant(req: Request) {
        const transaction = await sequelize.transaction()
        try {
            let tenantId = req.params.tenantId;
            await productExternalCommInstance.getTenantById(tenantId);
            await this.model.restore({ where: { tenantId }, transaction })
            await transaction.commit()
            return Promise.resolve(`record restored successfully of tenantId ${tenantId}`)

        } catch (error: any) {
            await transaction.rollback()
            return Promise.reject(error.message)
        }
    }
    

    async exportChunkNumber(req:Request, res:Response)
        {
            const transaction = await sequelize.transaction()
            try
            {    
                let responseResult:any;
                let tenantId = req.params.tenantId;
                let search = req.query.search;
                let whereCond = {};
                if (search != undefined && search != "") {
                    whereCond = {upc: {[Op.like] :  `%${search}%`}};
                }
                
                responseResult = await this.model.count({ where: { tenantId, ...whereCond }, raw: true }, { transaction })

                let data={
                    totalCount:responseResult,
                    chunkSize:ExportChunkValue,
                }
                return Promise.resolve(data)
 
            }
            catch(error:any)
            {
                logger.error("Error in getting Products export chunk count",error.message)
                return Promise.reject(error.message);
            }
        }    

    public async exportData(req: Request, res: Response) {
        const transaction = await sequelize.transaction()
        try {
            logger.debug("exportData__>")
            const filename = `products.xlsx`;
            let result:any=[];
            result =await this.exportDataReadMore(req,res);
            var xls = json2xls(result);

            fs.writeFileSync(filename, xls, 'binary');

            res.download(filename, (err) => {
                if (err) {
                    fs.unlinkSync(filename)
                    res.send("Unable to download the excel file")
                }
                fs.unlinkSync(filename)
            })
            await transaction.commit()

        } catch (error: any) {
            await transaction.rollback()
            return Promise.reject(error.message)
        }
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   

    async exportDataReadMore(req:Request, res:Response)
    {       
        const transaction = await sequelize.transaction()
            try{
            let exportResponse:any=[]; 
            let tenantId = req.params.tenantId; 
            let search = req.query.search;
            let offset:any= req.query.offset ?? 0;
            offset = parseInt(offset);
            let whereCond = {};
            if (search != undefined && search != "") {
                whereCond = {upc: {[Op.like] :  `%${search}%`}};
            }
            if(offset===undefined)
            {
                offset=0;
            }
            logger.debug("Search =>",search)
            let responseResult:any=[];
            do{
                responseResult=[]
                responseResult = await this.model.findAll({ where: { tenantId, ...whereCond },order: [["name", "ASC"]],limit: EXPORTCHUNKLIMIT,
                offset: offset, raw: true }, { transaction })
            // if (!responseResult) {
            //     throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `record does not exist`)
            // }
                 logger.info("Result Data...");
                 for (const product of responseResult) 
                 {
                    let tempObject:any=
                    {
                        upc: (product.upc).replaceAll('"',''),
                        sku: product.sku,
                        name: product.name,
                        description: product.description,
                        experience_id: product.experienceId,
                        experience_studio_id: product.experienceStudioId,
                        experience_tenant_id: product.experienceTenantId,
                        manufacturer: product.manufacturer,
                        type: product.type,
                        categories: product.categories,
                        sub_categories: product.subCategories,
                        price: product.price,
                        color: product.color,
                        size: product.size,
                        images: product.images,
                        image_url: product.imageURL,
                        other_attributes: product.otherAttributes
                    }
                    exportResponse.push(tempObject);

                 }
                 offset=offset+EXPORTCHUNKLIMIT;
                 logger.debug("Product Export with chunks data limit =>",offset, EXPORTCHUNKLIMIT)
            }while(responseResult.length===EXPORTCHUNKLIMIT);    
            return Promise.resolve(exportResponse);
            }
            catch(error:any)
            {
              logger.error("Error in export read more function ", error.message)
              await transaction.rollback()
              return Promise.reject(error.message)

            }
    }        
    async getTenantProduct(req:Request){
        const {tenantId, upc} = req.params;
        try{
            const result = this.model.findOne({
                where:{tenantId,upc}
            });
            return Promise.resolve(result);
        }catch(error: any){
            return Promise.reject(error.message);
        }
    }

    async productCount(req: Request) {
        try {
          const {tenantId} = req.query;
          const whereCond = tenantId ? {tenantId} :{};
         
          return await this.model.count({
            where: { ...whereCond }
          });
    
        } catch (err: any) {
          return Promise.reject(err.message)
    
        }
      }

}
