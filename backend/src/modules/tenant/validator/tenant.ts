import { Validator } from "../../../middlewares/resp-handler/Validator/validator"
import { check, body } from 'express-validator'

class tenantModelValidator extends Validator {
    constructor() {
        super(
            {

                //  Validation for Create
                create: [

                    check('name').trim().notEmpty().withMessage("Tenant name is required").isLength({ min: 3, max: 50 }).withMessage("Tenant name length must be in 3 to 50"),
                    check('description').trim().optional(),
                    check('createdBy').trim().optional(),
                    check('updatedBy').trim().optional(),
                    check('deletedBy').trim().optional(),
                ],

                // Validation for  Update
                update: [
                    check('name').trim().optional().isLength({ min: 3, max: 50 }).withMessage("Tenant name length must be in 3 to 50"),
                    check('description').trim().optional(),
                ],



            })
    }
}
export let tenantValidator = new tenantModelValidator()
