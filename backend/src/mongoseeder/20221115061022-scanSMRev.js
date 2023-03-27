import { SyncDataAction, SyncDataEntity } from "../modules/device/sync-service/rmq/helpers/rmqConfig";
import { publishEntity } from "../modules/device/sync-service/services/sync";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import PreDefinedStateMachine from "../modules/process/models/predefinedStatemachine";
import { logger } from '../libs/logger'
import { error } from "console";



const scanSM = [
    new PreDefinedStateMachine({
        tenantId:'SMARTCOMOS',
        isShared:true,
        name: 'Scan',
        initialState: {
            name: 'Start',
            transitions: [
                { from: 'Start', event: ['scan'], to: 'Scan', gaurd: {} }
            ],
            output: null
        },
        finalState: {
            name: 'End',
            transitions: [
            ],
            output: null
        },
        states: [{
            name: 'Start',
            transitions: [
                { from: 'Start', event: ['scan'], to: 'Scan', gaurd: {} },
                { from: 'Start', event: ['end'], to: 'End', gaurd: {} }

            ],
            output: null
        },
        {
            name: 'Scan',
            transitions: [
                { from: 'Scan', event: ['validate'], to: 'IsValid', gaurd: {} },
                { from: 'Scan', event: ['end'], to: 'End', gaurd: {} }

            ],
            output: null
        },
        {
            name: 'IsValid',
            transitions: [
                { from: 'IsValid', event: ['check-duplicate'], to: 'IsDuplicate', gaurd: {} },
                { from: 'IsValid', event: ['restart'], to: 'Start', gaurd: {} },
                { from: 'IsValid', event: ['end'], to: 'End', gaurd: {} }
            ],
            output: null
        }, {
            name: 'IsDuplicate',
            transitions: [
                { from: 'IsDuplicate', event: ['restart'], to: 'Start', gaurd: {} },
                { from: 'IsDuplicate', event: ['end'], to: 'End', gaurd: {} }
            ],
            output: null
        }, {
            name: 'End',
            transitions: [
            ],
            output: null
        }
        ],
        transitions: [
            { from: 'Start', event: ['scan'], to: 'Scan', gaurd: {} },
            { from: 'Scan', event: ['validate'], to: 'IsValid', gaurd: {} },
            { from: 'IsValid', event: ['check-duplicate'], to: 'IsDuplicate', gaurd: {} },
            { from: 'IsValid', event: ['restart'], to: 'Start', gaurd: {} },
            { from: 'IsValid', event: ['end'], to: 'End', gaurd: {} },
            { from: 'IsDuplicate', event: ['restart'], to: 'Start', gaurd: {} },
            { from: 'IsDuplicate', event: ['end'], to: 'End', gaurd: {} }
        ]
    }
)]

let done = 0;

export const seedScanSMRev = async () => {
    try {
        let data = await mongoSequelizeMeta.find({ name: '20221115061022-scanSMRev.js' });
         if (data.length <= 0) {
            for (let i = 0; i < scanSM.length; i++) {
               let response= await PreDefinedStateMachine.find({name:scanSM[i].name});
               if(response.length>0)
               { 
                const scan = await PreDefinedStateMachine.deleteMany({name:scanSM[i].name});
               }
                scanSM[i].save(function (err, result) {
                    done++;
                    if(result){
                        const data = {
                            type: 'config',
                            entity:SyncDataEntity.STATEMACHINE,
                            action:SyncDataAction.CREATE,
                            params:{},
                            tenantId:'SMARTCOMOS',
                            data: result
                        }
                        publishEntity(data)
                    }
                });
            }
            // inserting the migration into mongos seqalize
            await mongoSequelizeMeta.create({ name: '20221115061022-scanSMRev.js' });
        }

    } catch (err) {
        logger.error("error in scanSMRev seeder", err)
    }
    
}