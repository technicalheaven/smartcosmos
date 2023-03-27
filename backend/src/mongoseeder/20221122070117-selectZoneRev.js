import { SyncDataAction, SyncDataEntity } from "../modules/device/sync-service/rmq/helpers/rmqConfig";
import { publishEntity } from "../modules/device/sync-service/services/sync";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import PreDefinedStateMachine from "../modules/process/models/predefinedStatemachine";
import { logger } from '../libs/logger'



const selectZone = [
    new PreDefinedStateMachine({
        tenantId:'SMARTCOMOS',
        isShared:true,
        name: 'Select Zone',
        initialState: {
            name: 'Start',
            transitions: [
                { from: 'Start', event: ['select-zone'], to: 'Select Zone', gaurd: {} }
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
                { from: 'Start', event: ['select-zone'], to: 'Select Zone', gaurd: {} }
            ],
            output: null
        },
        {
            name: 'Select Zone',
            transitions: [
                { from: 'Select Zone', event: ['zone-selected'], to: 'End', gaurd: {} }
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
            { from: 'Start', event: ['select-zone'], to: 'Select Zone', gaurd: {} },
            { from: 'Select Zone', event: ['zone-selected'], to: 'End', gaurd: {} },
        ]
    }
    )]
let done = 0;

export const seedSelectZoneRev = async () => {
    try {
        // await mongoSequelizeMeta.deleteMany({ name: '20221122070117-selectZoneRev.js' });

        let data = await mongoSequelizeMeta.find({ name: '20221122070117-selectZoneRev.js' });
        if (data.length <= 0) {

            for (let i = 0; i < selectZone.length; i++) {
                let response= await PreDefinedStateMachine.find({name:selectZone[i].name});
                if(response.length>0)
                { 
                   await PreDefinedStateMachine.deleteMany({name:selectZone[i].name})
                }
                selectZone[i].save(function (err, result) {
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
            await mongoSequelizeMeta.create({ name: '20221122070117-selectZoneRev.js' });
        }


    } catch (err) {
        logger.error("error in select Zone Rev seeder",err)
    }
}