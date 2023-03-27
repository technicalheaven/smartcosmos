import { randomUUID } from "crypto";
import { SyncDataAction, SyncDataEntity } from "../modules/device/sync-service/rmq/helpers/rmqConfig";
import { publishEntity } from "../modules/device/sync-service/services/sync";
import { NodeNames, WorkflowNodeStatus } from "../modules/process/common/utils";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import ProcessWorkFlowSchema from "../modules/process/models/processWorkflow";


const scanUUID = randomUUID();
const encodeUUID = randomUUID();

const encodeNFCWfl = [
    new ProcessWorkFlowSchema({
        tenantId: 'SMARTCOMOS',
        isShared: true,
        isPredefined: true,
        workflowName: NodeNames.EncodeNFC,
        nodes: [
            { id: scanUUID, name: NodeNames.ScanNFC, isWorkFlow: false, isStateMachine: true, inputOutPut: null, stateMachineName:NodeNames.ScanNFC, workflowName:'' },
            { id: encodeUUID, name: NodeNames.EncodeNFC, isWorkFlow: false, isStateMachine: false, inputOutPut: null, stateMachineName:'', workflowName:'' }

        ],
        edges: [{to: encodeUUID, from:scanUUID, condition:undefined}],
        initialNode: { id:scanUUID, name: NodeNames.ScanNFC, isWorkFlow: false, isStateMachine: true, inputOutPut: null, stateMachineName:NodeNames.ScanNFC, workflowName:'' },
        nodesStatus: {},
        status: WorkflowNodeStatus.IDLE
    })]
let done = 0;

export const seedEncodeNFC = async () => {
    try {
        let data = await mongoSequelizeMeta.find({ name: '20221229072345-encodeNfc.js' });

        if (data.length <= 0) {
            for (let i = 0; i < encodeNFCWfl.length; i++) {
                let response= await ProcessWorkFlowSchema.find({workflowName:encodeNFCWfl[i].workflowName});
                if(response.length>0)
                { 
                    await ProcessWorkFlowSchema.deleteMany({workflowName:encodeNFCWfl[i].workflowName})
                }

                encodeNFCWfl[i].save(function (err, result) {
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
                        console.log('Error in seeding Encode NFC')
                    }
                });

            }
            // inserting the migration into mongos seqalize
            await mongoSequelizeMeta.create({ name: '20221229072345-encodeNfc.js' });
        }

    } catch (err) {
        console.error("Error at 20221229072345-encodeNfc.js seeder ",err)
    }
}