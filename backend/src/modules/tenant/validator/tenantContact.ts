import { Validator } from "../../../middlewares/resp-handler/Validator/validator"
import { check, body } from 'express-validator'

class tenantContactModelValidator extends Validator {
    constructor() {
        super(
            {

                //  Validation for Create
                create: [

                    check('firstName').trim().notEmpty().withMessage("Tenant contact name is required").isAlpha('en-US', { ignore: ' ' }).isLength({ min: 3, max: 30 }).withMessage("Tenant contact name should have alphabets only"),
                    check('phone').trim().optional().isLength({ min: 10, max: 18 }).withMessage("Contact number length should be in between 10 to 18"),
                    check('email').trim().notEmpty().withMessage('Email is Required').isEmail().withMessage("email format is not correct"),
                    
                    check('createdBy').trim().optional(),
                    check('updatedBy').trim().optional(),
                    check('deletedBy').trim().optional(),
                ],

                // Validation for  Update
                update: [
                   
                    check('firstName').trim().notEmpty().withMessage("Tenant contact name is required").isAlpha('en-US', { ignore: ' ' }).isLength({ min: 3, max: 30 }).withMessage("Tenant contact name should have alphabets only"),
                    check('phone').trim().optional().isLength({ min: 10, max: 18 }).withMessage("Contact number length should be in between 10 to 18"),
                    check('email').trim().notEmpty().withMessage('Email is Required').isEmail().withMessage("email format is not correct"),
                ],



            })
    }
}
export let tenantContactValidator = new tenantContactModelValidator()