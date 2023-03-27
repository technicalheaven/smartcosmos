import { SyncDataAction, SyncDataEntity } from "../modules/device/sync-service/rmq/helpers/rmqConfig";
import { publishEntity } from "../modules/device/sync-service/services/sync";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import PreDefinedStateMachine from "../modules/process/models/predefinedStatemachine";
import { logger } from '../libs/logger'



const input = [
    new PreDefinedStateMachine({
        tenantId:'SMARTCOMOS',
        isShared:true,
        name: 'Add Input Field',
        initialState: {
            name: 'Start',
            transitions: [
                { from: 'Start', event: ['input'], to: 'Input', gaurd: {} }
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
                { from: 'Start', event: ['input'], to: 'Input', gaurd: {} }
            ],
            output: null
        },
        {
            name: 'Input',
            transitions: [
                { from: 'Input', event: ['input-received'], to: 'End', gaurd: {} }
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
            { from: 'Start', event: ['input'], to: 'Input', gaurd: {} },
            { from: 'Input', event: ['input-received'], to: 'End', gaurd: {} },
        ]
    }
    )]
let done = 0;

export const seedInputRevName = async () => {
    try {
        // await mongoSequelizeMeta.deleteMany({ name: '20221206070118-inputRev.js' });

        let data = await mongoSequelizeMeta.find({ name: '20221206070118-inputRev-ChangeName.js' });
        if (data.length <= 0) {
            for (let i = 0; i < input.length; i++) {

                let response= await PreDefinedStateMachine.find({name:input[i].name});
                if(response.length>0)
                { 
                     await PreDefinedStateMachine.deleteMany({name:input[i].name})
                }   
                input[i].save(function (err, result) {
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
            await mongoSequelizeMeta.create({ name: '20221206070118-inputRev-ChangeName.js' });
        }


    } catch (err) {
        logger.error("error in inputRev-ChangeName seeder",err)
    }
}