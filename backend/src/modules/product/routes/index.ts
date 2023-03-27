import { Express, Request, Response } from 'express';
import { ProductController } from '../controllers/product';
import { config } from '../../../config';
import { Validation } from '../../../core/auth';

export const productRoutes = ({ app, logger, models }: any) => {
  const productController = new ProductController({ logger, models });
  const validate = new Validation()

  // Read all products
  app.get(`${config.API_PREFIX}/products`, validate.checkValidation, (req: Request, res: Response) => {
    productController.readAll(req, res);
  });

  // Create a product
  app.post(`${config.API_PREFIX}/product`, validate.checkValidation, (req: Request, res: Response) => {
    productController.create(req, res);
  });

  // Upload a product for a tenant
  app.post(`${config.API_PREFIX}/product/:tenantId/upload`, (req: Request, res: Response) => {
    productController.upload(req, res);
  });

  // Get a product by Id
  app.get(`${config.API_PREFIX}/product/:id`, validate.checkValidation, (req: Request, res: Response) => {
    productController.readOne(req, res);
  });

  app.get(`${config.API_PREFIX}/productCount`, validate.checkValidation, (req: Request, res: Response) => {
    productController.productCount(req, res);
  });

  // Check Product for a tenant
  app.get(`${config.API_PREFIX}/tenantupc/:tenantId/:upc`, validate.checkValidation, (req: Request, res: Response) => {
    productController.getTenantProduct(req, res);
  });

  // update a product by Id
  app.patch(`${config.API_PREFIX}/product/:id`, validate.checkValidation, (req: Request, res: Response) => {
    productController.update(req, res);
  });

  // update a product by upc
  app.patch(`${config.API_PREFIX}/product/upc/:upc`, (req: Request, res: Response) => {
    productController.updateByUpc(req, res);
  });

  // export excel file
  app.get(`${config.API_PREFIX}/product/export/:tenantId`, (req: Request, res: Response) => {
    productController.exportData(req, res);
  });

  // delete a product
  app.delete(`${config.API_PREFIX}/product/:id`, validate.checkValidation, (req: Request, res: Response) => {
    productController.delete(req, res);
  });

  // delete product by tenantId
  app.delete(`${config.API_PREFIX}/product/tenant/:tenantId`, (req: Request, res: Response) => {
    productController.deleteTenant(req, res);
  });

  // restore product by tenantId
  app.patch(`${config.API_PREFIX}/product/tenant/:tenantId`, (req: Request, res: Response) => {
    productController.restoreTenant(req, res);
  });

  // exportChunkNumber
  app.get(`${config.API_PREFIX}/exportchunks/:tenantId`, validate.checkValidation,(req: Request, res: Response) => {
    productController.exportChunkNumber(req, res);
  });
}