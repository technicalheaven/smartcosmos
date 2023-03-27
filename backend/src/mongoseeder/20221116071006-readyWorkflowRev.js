import { SyncDataAction, SyncDataEntity } from "../modules/device/sync-service/rmq/helpers/rmqConfig";
import { publishEntity } from "../modules/device/sync-service/services/sync";
import { NodeNames, WorkflowNodeStatus } from "../modules/process/common/utils";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import ProcessWorkFlowSchema from "../modules/process/models/processWorkflow";
import { logger } from '../libs/logger'


const Rworkfl = [
    new ProcessWorkFlowSchema({
        tenantId:'SMARTCOMOS',
        isShared:true,
        isPredefined:true,
        workflowName: NodeNames.Ready,
        nodes: [{ name: NodeNames.Ready, isWorkFlow: null, isStateMachine: null, inputOutPut: null, stateMachineName:null, workflowName:NodeNames.Ready }],
        edges: [],
        initialNode: { name: NodeNames.Ready, workflow: null, stateMachine: null, inputOutPut: null },
        status: WorkflowNodeStatus.IDLE

    })]
let done = 0;

export const seedReadyWFRev = async () => {
    try {
        let data = await mongoSequelizeMeta.find({ name: '20221116071006-readyWorkflowRev.js' });
        if (data.length <= 0) {
            for (let i = 0; i < Rworkfl.length; i++) {
                let response= await ProcessWorkFlowSchema.find({workflowName:Rworkfl[i].workflowName});
                if(response.length>0)
                { 
                await ProcessWorkFlowSchema.deleteMany({workflowName:Rworkfl[i].workflowName})
                }
                Rworkfl[i].save(function (err, result) {
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
            await mongoSequelizeMeta.create({ name: '20221116071006-readyWorkflowRev.js' });
        }

    } catch (err) {
        logger.error("error in readyWorkflowRev seeder",err)
    }
    
}