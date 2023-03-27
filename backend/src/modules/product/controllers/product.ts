import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { Product } from "../../../config/db";
import { ProductService } from "../services/product";
import BaseController from '../../../core/controllers/base';
import { respHndlr } from '../../../middlewares/resp-handler';
import { uploadXLSX } from '../../../libs/fileUploader';
import * as fs from 'fs';
import * as csv from 'fast-csv';
import { logger } from "../../../libs/logger";
var constant = require('../../../middlewares/resp-handler/constants');
import xlsx from 'node-xlsx';




export class ProductController extends BaseController {
  constructor({ logger, models }: any) {
    super({
      service: new ProductService({ model: Product, logger, models }),
      model: Product,
      models,
      logger
    })
  }


  async create(req: Request, res: Response) {
    try {
      const data = await this.service.create(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS_CREATED);

    }
    catch (error) {
      this.logger.error("Error in creating new product");
      respHndlr.sendError(res, error);
    }

  }


  async update(req: Request, res: Response) {
    try {
      const data = await this.service.update(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
    }
    catch (error) {
      this.logger.error("Error in updating product");
      respHndlr.sendError(res, error);
    }
  }

  async upload(req: Request, res: Response) {
    const uploadSingleXLSX = uploadXLSX.single("file");
    const service = this.service;

    uploadSingleXLSX(req, res, async function (err) {
      try {
        if (err) {
          // throw multer file validation errors
          throw err.message;
        }


        if (req.file !== undefined) {
          const { filename, path } = req.file;

          const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(path));
          const xlsxData = workSheetsFromBuffer[0].data;

          // Make json data from excel file data

          const headers: any = xlsxData[0];
          const rows = xlsxData.filter((item, index) => index !== 0);
          const productJSON: any = [];
          rows.forEach((row: any) => {
            let merged = headers.reduce((obj: any, key: any, index: any) => ({ ...obj, [key]: row[index] }), {});
            productJSON.push(merged);
          });


          // Delete uploaded file after getting exceldata
          fs.unlinkSync(path);

          // save excel data into database
          const result = await service.uploadProduct(req, productJSON);

          // throw error if any error return by service
          if (result.error) throw result.error;

          respHndlr.sendSuccess(res, result, StatusCodes.OK);
        } else {
          throw "XLSX file is required.";
        }

      } catch (error) {
        respHndlr.sendError(res, error);
      }
    });
  }

  async updateByUpc(req: Request, res: Response) {
    try {
      const data = await this.service.updateByUpc(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
    }
    catch (error) {
      this.logger.error("Error in updating single product product");
      respHndlr.sendError(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const data = await this.service.delete(req);
      respHndlr.sendSuccess(res, data), constant.RESPONSE_STATUS.SUCCESS;
    }
    catch (error) {
      this.logger.error("Error in deleting product ")
      respHndlr.sendError(res, error);
    }
  }

  async deleteTenant(req: Request, res: Response) {
    try {
      const data = await this.service.deleteTenant(req);
      respHndlr.sendSuccess(res, data), constant.RESPONSE_STATUS.SUCCESS;
    }
    catch (error) {
      this.logger.error("Error while deleting the product by tenantId")
      respHndlr.sendError(res, error);
    }
  }

  async restoreTenant(req: Request, res: Response) {
    try {
      const data = await this.service.restoreTenant(req);
      respHndlr.sendSuccess(res, data), constant.RESPONSE_STATUS.SUCCESS;
    }
    catch (error) {
      this.logger.error("Error while restoring the product by tenantId")
      respHndlr.sendError(res, error);
    }
  }

  async exportData(req: Request, res: Response) {
    try {
      await this.service.exportData(req, res);
      // respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
    }
    catch (error) {
      this.logger.error("Error while exporting product file")
      respHndlr.sendError(res, error);
    }
  }

  async getTenantProduct(req: Request, res: Response) {
    this.service.getTenantProduct(req).then((result: any) => {
      respHndlr.sendSuccess(res, result, constant.RESPONSE_STATUS.SUCCESS);
    }).catch((err: any) => {
      respHndlr.sendError(res, err);
    });

  }

  async productCount(req: Request, res: Response) {
    try {
      const data = await this.service.productCount(req);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
    }
    catch (error) {
      this.logger.error("Getting error to count product")
      respHndlr.sendError(res, error);
    }
  }

  async exportChunkNumber(req: Request, res: Response) {
    try {
      const data = await this.service.exportChunkNumber(req, res);
      respHndlr.sendSuccess(res, data, constant.RESPONSE_STATUS.SUCCESS);
    }
    catch (error: any) {
      this.logger.error("Error in getting Products export chunk count=>", error.message)
      respHndlr.sendError(res, error);
    }
  }


}
