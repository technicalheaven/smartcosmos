import { Validator } from "../../../middlewares/resp-handler/Validator/validator"
import { check, body } from 'express-validator'
var MAC_ADDRESS = require('is-mac-address');
var  isIPAddress = require("ip-address-validator");
class DeviceModelValidator extends Validator {
    constructor() {
        super(
            {

                //  Validation for Create
                create: [

                    check('name').trim().notEmpty().withMessage("Device name is required").isLength({ min: 3, max: 50 }).withMessage("Device name length should be in between 3 to 50"),
                    check('type').trim().notEmpty().withMessage("Device type is required"),
                    check('model').trim().notEmpty().withMessage("Device model is required"),
                    check('mac').trim().notEmpty().withMessage("Device mac is required"),
                    
                    check('createdBy').trim().optional(),
                    check('updatedBy').trim().optional(),
                    check('deletedBy').trim().optional(),   
                ],

                // Validation for  Update
                update: [
                    check('name').trim().notEmpty().withMessage("Device name is required").isLength({ min: 3, max: 50 }).withMessage("Device name length should be in between 3 to 50"),
                    check('mac').trim().notEmpty().withMessage("Device mac is required"),
   
                ],

                deviceManagerCreate:
                [
                    check('name').trim().notEmpty().withMessage("Device manager name is required").isLength({ min: 3, max: 50 }).withMessage("Device manager length should be in between 3 to 50"),
                    check('type').trim().notEmpty().withMessage("Type is required"),
                    check('url').trim().notEmpty().withMessage("Url is required"),
                ],
                deviceTypeModelCreate:
                [
                    check('type').trim().notEmpty().withMessage("Device type is required"),
                    check('model').trim().notEmpty().withMessage("Device model is required"),
                    
                ]


            })
    }
}
export let deviceModelValidator = new DeviceModelValidator()
