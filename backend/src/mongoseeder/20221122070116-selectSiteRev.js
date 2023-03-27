import { SyncDataAction, SyncDataEntity } from "../modules/device/sync-service/rmq/helpers/rmqConfig";
import { publishEntity } from "../modules/device/sync-service/services/sync";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import PreDefinedStateMachine from "../modules/process/models/predefinedStatemachine";
import { logger } from '../libs/logger'



const selectSite = [
    new PreDefinedStateMachine({
        tenantId:'SMARTCOMOS',
        isShared:true,
        name: 'Select Site',
        initialState: {
            name: 'Start',
            transitions: [
                { from: 'Start', event: ['select-site'], to: 'Select Site', gaurd: {} }
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
                { from: 'Start', event: ['select-site'], to: 'Select Site', gaurd: {} }
            ],
            output: null
        },
        {
            name: 'Select Site',
            transitions: [
                { from: 'Select Site', event: ['site-selected'], to: 'End', gaurd: {} }
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
            { from: 'Start', event: ['select-site'], to: 'Select Site', gaurd: {} },
            { from: 'Select Site', event: ['site-selected'], to: 'End', gaurd: {} },
        ]
    }
    )]
let done = 0;

export const seedSelectSiteRev = async () => {
    try {

        // await mongoSequelizeMeta.deleteMany({ name: '20221122070116-selectSiteRev.js' });
        let data = await mongoSequelizeMeta.find({ name: '20221122070116-selectSiteRev.js' });
        if (data.length <= 0) {
            for (let i = 0; i < selectSite.length; i++) {

                let response= await PreDefinedStateMachine.find({name:selectSite[i].name});
                if(response.length>0)
                { 
                    await PreDefinedStateMachine.deleteMany({name:selectSite[i].name})
                }
                selectSite[i].save(function (err, result) {
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
            await mongoSequelizeMeta.create({ name: '20221122070116-selectSiteRev.js' });
        }


    } catch (err) {
        logger.error("error in select Site Rev seeder",err)
    }
}