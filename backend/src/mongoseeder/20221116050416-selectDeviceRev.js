import { SyncDataAction, SyncDataEntity } from "../modules/device/sync-service/rmq/helpers/rmqConfig";
import { publishEntity } from "../modules/device/sync-service/services/sync";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import PreDefinedStateMachine from "../modules/process/models/predefinedStatemachine";
import { logger } from '../libs/logger'


const selectDevice = [
    new PreDefinedStateMachine({
        tenantId:'SMARTCOMOS',
        isShared:true,
        name: 'Select Device',
        initialState: {
            name: 'Start',
            transitions: [
                { from: 'Start', event: ['select-device'], to: 'Select Device', gaurd: {} }
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
                { from: 'Start', event: ['select-device'], to: 'Select Device', gaurd: {} }
            ],
            output: null
        },
        {
            name: 'Select Device',
            transitions: [
                { from: 'Select Device', event: ['device-selected'], to: 'End', gaurd: {} }
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
            { from: 'Start', event: ['select-device'], to: 'Select Device', gaurd: {} },
            { from: 'Select Device', event: ['device-selected'], to: 'End', gaurd: {} },
        ]
    }
    )]
let done = 0;

export const seedSelectDeviceRev = async () => {
    try {
        // await mongoSequelizeMeta.deleteMany({ name: '20221116050416-selectDeviceRev.js' });
        let data = await mongoSequelizeMeta.find({ name: '20221116050416-selectDeviceRev.js' });
        if (data.length <= 0) {
            for (let i = 0; i < selectDevice.length; i++) {
               let response= await PreDefinedStateMachine.find({name:selectDevice[i].name});
               if(response.length>0)
               { 
                const selDev = await PreDefinedStateMachine.deleteMany({name:selectDevice[i].name})
               }
                selectDevice[i].save(function (err, result) {
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
            await mongoSequelizeMeta.create({ name: '20221116050416-selectDeviceRev.js' });
        }


    } catch (err) {
        logger.error("error in selectDeviceRev seeder",err)
    }
}