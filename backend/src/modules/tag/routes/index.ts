import { Request, Response } from 'express';
import { config } from '../../../config';
import { TagController } from '../controllers/tags';
import { FactoryUploadTagController } from '../controllers/factoryTagsUpload';
import { Validation } from '../../../core/auth';


export const tagRoutes = ({app}:any) =>{
      const tagController = new TagController();
      const factoryUploadTagController = new FactoryUploadTagController();
      const validate = new Validation()


      app.get(`${config.API_PREFIX}/tag`, (req: Request, res: Response) => {
        tagController.readAll(req, res);
      });

      app.get(`${config.API_PREFIX}/tag/:tagId`, (req: Request, res: Response) => {
        tagController.readById(req, res);
      });

      app.get(`${config.API_PREFIX}/digitized/tag`, validate.checkValidation, (req: Request, res: Response) => {
        tagController.readAllDigitized(req, res);
      });

      app.get(`${config.API_PREFIX}/check/digitizedTag/:diId`, (req: Request, res: Response) => {
        tagController.readByIdCheckDigitizedTag(req, res);
      });

      app.get(`${config.API_PREFIX}/digitized/tag/:diId`, validate.checkValidation, (req: Request, res: Response) => {
        tagController.readByIdDigitized(req, res);
      });

      app.get(`${config.API_PREFIX}/duplicatetags/tag`, validate.checkValidation, (req: Request, res: Response) => {
        tagController.readAllDuplicateTags(req, res);
      });

      app.get(`${config.API_PREFIX}/duplicatetags/tag/:diId`, validate.checkValidation, (req: Request, res: Response) => {
        tagController.readByIdDuplicateTags(req, res);
      });

       app.get(`${config.API_PREFIX}/trackntrace/tag`, (req: Request, res: Response) => {
          tagController.readAllTrackNTrace(req, res);
        });

        app.get(`${config.API_PREFIX}/trackntrace/tag/:diId`, (req: Request, res: Response) => {
          tagController.readByIdTrackNTrace(req, res);
        });

        app.get(`${config.API_PREFIX}/di-data`,  validate.checkValidation, (req: Request, res: Response) => {
          tagController.commonDuplicateDigitizedRead(req, res);
        });
        

      app.post(`${config.API_PREFIX}/upload/tag`, (req: Request, res: Response) => {
        tagController.create(req, res);
      });
      
      app.post(`${config.API_PREFIX}/digitized/tag`, (req: Request, res: Response) => {
        tagController.digitize(req, res);
      });

      app.post(`${config.API_PREFIX}/commondataprocessing/tag`, validate.checkValidation,  (req: Request, res: Response) => {
          tagController.commonDataProcessing(req, res);
        });

      app.post(`${config.API_PREFIX}/trackntrace/add`, (req: Request, res: Response) => {
          tagController.trackNTrace(req, res);
        });  

      app.delete(`${config.API_PREFIX}/tag/:tagId`, (req: Request, res: Response) => {
        tagController.delete(req, res);
      });

      // for factory Tag Upload
      app.post(`${config.API_PREFIX}/tag/upload-tags`, (req: Request, res: Response) => {
        factoryUploadTagController.upload(req, res); 
      });
      
       // export excel file
       app.get(`${config.API_PREFIX}/digitized-data/export`, (req: Request, res: Response) => {
        tagController.exportData(req, res);
      }); 
      
      // export searched tags data
      app.get(`${config.API_PREFIX}/factorytags/export`, (req: Request, res: Response) => {
        tagController.exportTagData(req, res);
      }); 

      app.get(`${config.API_PREFIX}/factorytags/history/:tenantId`, (req: Request, res: Response) => {
        tagController.readBatchByTenantId(req, res);
      }); 
       
      
      
      // read distinct tag type and manufacturer
      app.get(`${config.API_PREFIX}/factorytags/distinct-options`, (req: Request, res: Response) => {
        tagController.readDistinct(req, res);
      }); 
      
      //lastExpectedCount
      app.post(`${config.API_PREFIX}/tnt/lastvalidcount`, (req: Request, res: Response) => {
        tagController.lastExpectedCount(req, res);
      }); 
      
      app.patch(`${config.API_PREFIX}/deEnable/tag`, validate.checkValidation, (req: Request, res: Response) => {
        tagController.deEnablement(req, res);
      });

      // processState Create
      app.post(`${config.API_PREFIX}/tnt/processState`, (req: Request, res: Response) => {
        tagController.createProcessState(req, res);
      }); 
      
      // processState update status 
      app.patch(`${config.API_PREFIX}/tnt/processState/:deviceId`, (req: Request, res: Response) => {
        tagController.updateProcessState(req, res);
      });
      // update site name in DI data
      app.patch(`${config.API_PREFIX}/tags/update-sitename-in-di-data/:siteId`, (req: Request, res: Response) => {
        tagController.updateSiteNameInDI(req, res);
      });

      // update zone name in DI data
      app.patch(`${config.API_PREFIX}/tags/update-zone-name-in-di-data/:zoneId`, (req: Request, res: Response) => {
        tagController.updateZoneNameInDI(req, res);
      });

      // get Di Export Chunks Number
      app.get(`${config.API_PREFIX}/di/diexportchunks`, validate.checkValidation, (req: Request, res: Response) => {
        tagController.getDiExportChunkNumber(req, res);
      });
      // get Tags Export Chunk Number
      app.get(`${config.API_PREFIX}/tags/tagsexportchunks`, validate.checkValidation,(req: Request, res: Response) => {
        tagController.getTagsExportChunkNumber(req, res);
      });

    
     // tagdata is-active-tag active-tag tag-counter-update
     app.get(`${config.API_PREFIX}/tagdata/:tagId`, (req: Request, res: Response) => {
      tagController.retrieveTagMetaData(req, res); 
    });
    // check tag is active
    app.get(`${config.API_PREFIX}/is-active-tag/:tagId`, (req: Request, res: Response) => {
      tagController.isTagActivated(req, res); 
    });
    // activating the tag
    app.patch(`${config.API_PREFIX}/active-tag`, (req: Request, res: Response) => {
      tagController.activateTag(req, res); 
    });
    // update latest counter
    app.patch(`${config.API_PREFIX}/tag-counter-update`, (req: Request, res: Response) => {
      tagController.updateLastValidCounter(req, res); 
    });
      
}