import { Validator } from "../../../middlewares/resp-handler/Validator/validator"
import { check, body } from 'express-validator'

class siteModelValidator extends Validator {
    constructor() {
        super(
            {

                //  Validation for Create
                create: [

                    check('name').trim().notEmpty().withMessage("site name is required"),
                    check('address').trim().notEmpty().withMessage("Address name is required").isLength({ min: 3, max: 250 }).withMessage("Address name should be in between 3 to 250"),
                    check('phone').trim().optional().isNumeric().withMessage("Contact Number must contain only numbers"),
                    check('email').trim().optional().isEmail().withMessage("email format is not correct"),
                    check('siteIdentifier').trim().optional().isLength({ min: 2, max: 30 }).withMessage("site identifier should be in between 2 to 30"),
                    check('longitude').trim().optional().isLength({ min: 3, max: 20 }).withMessage("longitude length should be in between 3 to 20").isNumeric().withMessage("longitude should be alphanumeric"),
                    check('latitude').trim().optional().isLength({ min: 3, max: 20 }).withMessage("latitude length should be in between 3 to 20").isNumeric().withMessage("longitude should be alphanumeric"),
                    check('createdBy').trim().optional(),
                    check('updatedBy').trim().optional(),
                ],
                // Validation for  Update
                update: [
                    check('name').trim().notEmpty().withMessage("site name is required"),
                    check('address').trim().notEmpty().withMessage("Address name is required").isLength({ min: 3, max: 250 }).withMessage("Address name should be in between 3 to 250"),
                
                ],



            })
    }
}
export let siteValidator = new siteModelValidator()