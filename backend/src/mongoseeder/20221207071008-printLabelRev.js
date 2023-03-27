import { SyncDataAction, SyncDataEntity } from "../modules/device/sync-service/rmq/helpers/rmqConfig";
import { publishEntity } from "../modules/device/sync-service/services/sync";
import { NodeNames, WorkflowNodeStatus } from "../modules/process/common/utils";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import ProcessWorkFlowSchema from "../modules/process/models/processWorkflow";
import { logger } from '../libs/logger'


const PrintLabelworkfl = [
    new ProcessWorkFlowSchema({
        tenantId:'SMARTCOMOS',
        isShared:true,
        isPredefined:true,
        workflowName: NodeNames.PrintLabel,
        nodes: [{name:NodeNames.PrintLabel, isWorkFlow: null, isStateMachine: null, inputOutPut: null, stateMachineName:null, workflowName:NodeNames.PrintLabel}],
        edges: [],
        initialNode:{name:NodeNames.PrintLabel, isWorkFlow: null, isStateMachine: null, inputOutPut: null, stateMachineName:null, workflowName:NodeNames.PrintLabel},
        nodesStatus:{},
        status: WorkflowNodeStatus.IDLE
    })]
let done = 0;

export const seedPrintLabelWFRev = async () => {
    try {
        let data = await mongoSequelizeMeta.find({ name: '20221207071008-printLabelRev.js' });
        if (data.length <= 0) {
            for (let i = 0; i < PrintLabelworkfl.length; i++) {
                let response= await ProcessWorkFlowSchema.find({workflowName:PrintLabelworkfl[i].workflowName});
                if(response.length>0)
                { 
                    await ProcessWorkFlowSchema.deleteMany({workflowName:PrintLabelworkfl[i].workflowName})
                }
                PrintLabelworkfl[i].save(function (err, result) {
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
            await mongoSequelizeMeta.create({ name: '20221207071008-printLabelRev.js' });
        }

    } catch (err) {
        logger.error("error in printLabelRev seeder",err)
    }
}