import { randomUUID } from "crypto";
import { SyncDataAction, SyncDataEntity } from "../modules/device/sync-service/rmq/helpers/rmqConfig";
import { publishEntity } from "../modules/device/sync-service/services/sync";
import { NodeNames, WorkflowNodeStatus } from "../modules/process/common/utils";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import ProcessWorkFlowSchema from "../modules/process/models/processWorkflow";

const scanUHFUUID = randomUUID();
const encodeUHFUUID = randomUUID();
const encodeUHFWfl = [
    new ProcessWorkFlowSchema({
        tenantId: 'SMARTCOMOS',
        isShared: true,
        isPredefined: true,
        workflowName: NodeNames.EncodeUHF,
        nodes: [
            { id: scanUHFUUID, name: NodeNames.ScanUHF, isWorkFlow: false, isStateMachine: true, inputOutPut: null, stateMachineName:NodeNames.ScanUHF, workflowName:'' },
            { id: encodeUHFUUID, name: NodeNames.EncodeUHF, isWorkFlow: false, isStateMachine: false, inputOutPut: null, stateMachineName:'', workflowName:'' }

        ],
        edges: [{to:encodeUHFUUID, from: scanUHFUUID, condition:undefined}],
        initialNode:{ id: scanUHFUUID, name: NodeNames.ScanUHF, isWorkFlow: false, isStateMachine: true, inputOutPut: null, stateMachineName:NodeNames.ScanUHF, workflowName:'' },
        nodesStatus: {},
        status: WorkflowNodeStatus.IDLE
    })]
let done = 0;

export const seedEncodeUHF = async () => {
    try {
        let data = await mongoSequelizeMeta.find({ name: '20221229072345-encodeUHF.js' });
        if (data.length <= 0) {
            for (let i = 0; i < encodeUHFWfl.length; i++) {
                let response= await ProcessWorkFlowSchema.find({workflowName:encodeUHFWfl[i].workflowName});
                if(response.length>0)
                { 
                await ProcessWorkFlowSchema.deleteMany({workflowName:encodeUHFWfl[i].workflowName})
                }
                encodeUHFWfl[i].save(function (err, result) {
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
                    }else{
                        console.log('Error in seeding Encode UHF')
                    }
                });
            }
            // inserting the migration into mongos seqalize
            await mongoSequelizeMeta.create({ name: '20221229072345-encodeUHF.js' });
        }

    } catch (err) {
        console.error("Error at 20221229072345-encodeUHF.js seeder ",err)
    }
}