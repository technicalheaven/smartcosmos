import { Validator } from "../../../middlewares/resp-handler/Validator/validator"
import { check, body } from 'express-validator'
class zoneModelValidator extends Validator {
  constructor() {
    super(
      {

        //  Validation for RelationShip Create
        create: [
          check('tenantId').notEmpty().withMessage("tenantId is required"),
          check('siteId').notEmpty().withMessage("siteId is required"),
          check('name').trim().notEmpty().withMessage("name is required"),       
          check('zoneType').trim().notEmpty().withMessage("zoneType is required"),
          check('createdBy').trim().optional(),
          check('updatedBy').trim().optional()
        ],

        // Validation for RelationShip Update
        update: [
          check('id').notEmpty().withMessage("id is required"),
          // check('name').notEmpty().withMessage("name is required"),
          // check('name').trim().notEmpty().withMessage("name is required"),  
          // check('zoneType').trim().notEmpty().withMessage("zoneType is required"),       
          check('status').trim().optional(),
   
        ],


        delete: [
          check('id').notEmpty().withMessage("id is required"),
          check('deletedBy').trim().optional(),
        ],

      })
  }
}
export let zoneValidator = new zoneModelValidator()
