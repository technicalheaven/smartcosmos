import { SyncDataAction, SyncDataEntity } from "../modules/device/sync-service/rmq/helpers/rmqConfig";
import { publishEntity } from "../modules/device/sync-service/services/sync";
import { NodeNames, WorkflowNodeStatus } from "../modules/process/common/utils";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import ProcessWorkFlowSchema from "../modules/process/models/processWorkflow";
import { logger } from '../libs/logger'


const GPIOLightworkfl = [
    new ProcessWorkFlowSchema({
        tenantId:'SMARTCOMOS',
        isShared:true,
        isPredefined:true,
        workflowName: NodeNames.GPIOLight,
        nodes: [{ name: NodeNames.GPIOLight, isWorkFlow: null, isStateMachine: null, inputOutPut: null, stateMachineName:null, workflowName:NodeNames.GPIOLight }],
        edges: [],
        initialNode: { name: NodeNames.GPIOLight, isWorkFlow: null, isStateMachine: null, inputOutPut: null, stateMachineName:null, workflowName:NodeNames.GPIOLight  },
        status: WorkflowNodeStatus.IDLE

    })]
let done = 0;

export const seedGPIOLightWFRev = async () => {
    try {
        let data = await mongoSequelizeMeta.find({ name: '20221207071006-gpioLightRev.js' });
        if (data.length <= 0) {
            for (let i = 0; i < GPIOLightworkfl.length; i++) {
                let response= await ProcessWorkFlowSchema.find({workflowName:GPIOLightworkfl[i].workflowName});
                if(response.length>0)
                { 
                 await ProcessWorkFlowSchema.deleteMany({workflowName:GPIOLightworkfl[i].workflowName})
                }
                GPIOLightworkfl[i].save(function (err, result) {
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
            await mongoSequelizeMeta.create({ name: '20221207071006-gpioLightRev.js' });
        }

    } catch (err) {
        logger.error("error in gpioLightRev seeder",err)
    }
}