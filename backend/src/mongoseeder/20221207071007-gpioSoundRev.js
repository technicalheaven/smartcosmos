import { SyncDataAction, SyncDataEntity } from "../modules/device/sync-service/rmq/helpers/rmqConfig";
import { publishEntity } from "../modules/device/sync-service/services/sync";
import { NodeNames, WorkflowNodeStatus } from "../modules/process/common/utils";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import ProcessWorkFlowSchema from "../modules/process/models/processWorkflow";
import { logger } from '../libs/logger'


const GPIOSoundworkfl = [
    new ProcessWorkFlowSchema({
        tenantId: 'SMARTCOMOS',
        isShared: true,
        isPredefined: true,
        workflowName: NodeNames.GPIOSound,
        nodes: [{ name: NodeNames.GPIOSound, isWorkFlow: null, isStateMachine: null, inputOutPut: null, stateMachineName:null, workflowName:NodeNames.GPIOSound  }],
        edges: [],
        initialNode: { name: NodeNames.GPIOSound, isWorkFlow: null, isStateMachine: null, inputOutPut: null, stateMachineName:null, workflowName:NodeNames.GPIOSound },
        nodesStatus: {},
        status: WorkflowNodeStatus.IDLE
    })]
let done = 0;

export const seedGPIOSoundWFRev = async () => {
    try {
        // await mongoSequelizeMeta.deleteMany({ name: '20221207071007-gpioSound.js' });

        let data = await mongoSequelizeMeta.find({ name: '20221207071007-gpioSoundRev.js' });
        if (data.length <= 0) {
            for (let i = 0; i < GPIOSoundworkfl.length; i++) {
                let response= await ProcessWorkFlowSchema.find({workflowName:GPIOSoundworkfl[i].workflowName});
                if(response.length>0)
                { 
                await ProcessWorkFlowSchema.deleteMany({workflowName:GPIOSoundworkfl[i].workflowName})
                }
                GPIOSoundworkfl[i].save(function (err, result) {
                    done++;
                    if(result){
                        const data = {
                            type: 'config',
                            entity:SyncDataEntity.WORKFLOWS,
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
            await mongoSequelizeMeta.create({ name: '20221207071007-gpioSoundRev.js' });
        }

    } catch (err) {
        logger.error("error in gpio Sound Rev",err)
    }
}