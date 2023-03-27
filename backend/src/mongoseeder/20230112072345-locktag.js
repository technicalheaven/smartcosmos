import { randomUUID } from "crypto";
import { SyncDataAction, SyncDataEntity } from "../modules/device/sync-service/rmq/helpers/rmqConfig";
import { publishEntity } from "../modules/device/sync-service/services/sync";
import { NodeNames, WorkflowNodeStatus } from "../modules/process/common/utils";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import ProcessWorkFlowSchema from "../modules/process/models/processWorkflow";

const lockTagUUID = randomUUID();
const locktagWfl = [
    new ProcessWorkFlowSchema({
        tenantId: 'SMARTCOMOS',
        isShared: true,
        isPredefined: true,
        workflowName: NodeNames.LockTag,
        nodes: [
            { id: lockTagUUID, name: NodeNames.LockTag, isWorkFlow: false, isStateMachine: false, inputOutPut: null, stateMachineName:'', workflowName:'' }

        ],
        edges: [],
        initialNode:{ id: lockTagUUID, name: NodeNames.LockTag, isWorkFlow: false, isStateMachine: false, inputOutPut: null, stateMachineName:'', workflowName:'' },
        nodesStatus: {},
        status: WorkflowNodeStatus.IDLE
    })]
let done = 0;

export const seedLockTag = async () => {
    try {
        let data = await mongoSequelizeMeta.find({ name: '20230112072345-locktag.js' });
        if (data.length <= 0) {
            for (let i = 0; i < locktagWfl.length; i++) {
                let response= await ProcessWorkFlowSchema.find({workflowName:locktagWfl[i].workflowName});
                if(response.length>0)
                { 
                await ProcessWorkFlowSchema.deleteMany({workflowName:locktagWfl[i].workflowName})
                }
                locktagWfl[i].save(function (err, result) {
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
                        console.log('Error in seeding Lock-Tag')
                    }
                });
            }
            // inserting the migration into mongos seqalize
            await mongoSequelizeMeta.create({ name: '20230112072345-locktag.js' });
        }

    } catch (err) {
        console.error("Error at 20230112072345-locktag.js seeder ",err)
    }
}