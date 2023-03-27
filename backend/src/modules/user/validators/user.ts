import { Validator } from "../../../middlewares/resp-handler/Validator/validator"
import { check, body } from 'express-validator'
class userModelValidator extends Validator {
    constructor() {
        super(
            {

                //  Validation for User Create
                create: [

                    check('name').trim().notEmpty().withMessage("name is required"),
                    check('username').trim().notEmpty().withMessage("username is required").isLength({ min: 6 }).withMessage("Username should have length more than or equal to 6 ")
                        .custom(username => {
                            if (username.match(" ")) {
                                return false
                            }
                            return true
                        }).withMessage("userName should not take space"),
                    check('contact').trim().optional().isLength({ min: 10, max: 18 }).withMessage("contactNumber length should be in between 10 to 18"),
                    check('email').trim().notEmpty().withMessage('Email is Required').isEmail().withMessage("email format is not correct"),

                    check('createdBy').trim().optional(),
                    check('updatedBy').trim().optional(),
                    check('deletedBy').trim().optional(),
                ],

                // Validation for User Update
                update: [
                    check('name').trim().optional(),
                    check('status').trim().optional(),
                    check('email').trim().optional().isEmail().withMessage("email format is not correct"),
                    check('contact').trim().optional().isLength({ min: 10, max: 18 }).withMessage("contactNumber length should be in between 10 to 18"),
                    
                ],

                // Validation for logout
                logout: [
                    check('username').trim().notEmpty().withMessage("username is required").isLength({ min: 6 }).withMessage("Username should have length more than or equal to 6 ")
                        .custom(username => {
                            if (username.match(" ")) {
                                return false
                            }
                            return true
                        }).withMessage("userName should not take space"),
                ],

                // Validation for change password
                changepassword: [
                    check('username').trim().notEmpty().withMessage("username is required").isLength({ min: 6 }).withMessage("Username should have length more than or equal to 6 ")
                        .custom(username => {
                            if (username.match(" ")) {
                                return false
                            }
                            return true
                        }).withMessage("userName should not take space"),
                    check('password').trim().notEmpty().withMessage("password is required").isLength({ min: 6 }).withMessage("Password should have length more than or equal to 6 ")
                ],

                // Validation for change password
                forgotpassword: [
                    check('email').trim().notEmpty().withMessage('Email is Required').isEmail().withMessage("invalid email")
                ],

                resettoken: [
                    check('userId').trim().notEmpty().withMessage("userId is required"),
                    check('refresh_token').trim().notEmpty().withMessage("refresh_token is required")
                ],
            })
    }
}
export let userValidator = new userModelValidator()
