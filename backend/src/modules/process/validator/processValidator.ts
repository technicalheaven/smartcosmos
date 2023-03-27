import { Validator } from "../../../middlewares/resp-handler/Validator/validator"
import { check, body } from 'express-validator'
class processModelValidator extends Validator {
  constructor() {
    super(
      {

        //  Validation for RelationShip Create
        create: [
          check('tenantId').notEmpty().withMessage("tenantId is required"),
          check('name').trim().notEmpty().withMessage("name is required"),
          // check('name').notEmpty().withMessage("name is required"),
          check('processType').trim().notEmpty().withMessage("processType is required"),
          check('initialState').notEmpty().withMessage("initialState is required"),
          check('description').trim().optional(),
          check('states').notEmpty().withMessage("states is required"),
          check('transitions').notEmpty().withMessage("transitions is required"),
          check('assign.devices').notEmpty().withMessage("assign.devices is required"),
          check('assign.roles').notEmpty().withMessage("assign.roles is required"),
          check('stopActions').trim().optional(),
          check('startActions').trim().optional(),
          check('instruction').trim().optional(),
          check('status').trim().optional(),
          check('minStationVer').trim().optional(),
          check('isFinalized').notEmpty().withMessage("isFinalized is required"),
          check('createdBy').trim().optional(),
          check('updatedBy').trim().optional()
        ],

        // Validation for RelationShip Update
        update: [
          check('id').notEmpty().withMessage("id is required"),
          // check('name').trim().optional(),
          check('name').trim().notEmpty().withMessage("name is required"),
          check('description').trim().optional(),
          check('states').trim().optional(),
          check('transitions').trim().optional(),
          check('status').trim().notEmpty().withMessage("status is required"),
          check('assign.roles').notEmpty().withMessage("roles is required"),
          check('assign.devices').notEmpty().withMessage("devices is required"),
          check('actions').notEmpty().withMessage("actions is required"),
          check('steps').notEmpty().withMessage("steps is required")

        ],


        delete: [
          check('id').notEmpty().withMessage("id is required"),
          check('deletedBy').trim().optional(),
        ],

        unAssign: [
          check('devices').notEmpty().withMessage("devices is required"),
          check('processId').notEmpty().withMessage("processId is required"),
          check('roles').notEmpty().withMessage("roles is required"),
          check('sites').trim().optional(),
          check('zones').trim().optional(),
        ]

      })
  }
}
export let processValidator = new processModelValidator()
