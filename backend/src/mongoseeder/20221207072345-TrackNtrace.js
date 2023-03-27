import { SyncDataAction, SyncDataEntity } from "../modules/device/sync-service/rmq/helpers/rmqConfig";
import { publishEntity } from "../modules/device/sync-service/services/sync";
import { NodeNames, WorkflowNodeStatus } from "../modules/process/common/utils";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import ProcessWorkFlowSchema from "../modules/process/models/processWorkflow";
import { logger } from '../libs/logger'

const TrackNtraceworkfl = [
    new ProcessWorkFlowSchema({
        tenantId: 'SMARTCOMOS',
        isShared: true,
        isPredefined: true,
        workflowName: NodeNames.TrackNtrace,
        nodes: [{ name: NodeNames.TrackNtrace, isWorkFlow: null, isStateMachine: null, inputOutPut: null, stateMachineName:'', workflowName:'' }],
        edges: [],
        initialNode: { name: NodeNames.TrackNtrace, isWorkFlow: null, isStateMachine: null, inputOutPut: null, stateMachineName:'', workflowName:''},
        nodesStatus: {},
        status: WorkflowNodeStatus.IDLE
    })]
let done = 0;

export const seedTrackNtraceWFRev = async () => {
    try {
        let data = await mongoSequelizeMeta.find({ name: '20221207072345-TrackNtrace.js' });
        if (data.length <= 0) {
            for (let i = 0; i < TrackNtraceworkfl.length; i++) {
                let response= await ProcessWorkFlowSchema.find({workflowName:TrackNtraceworkfl[i].workflowName});
                if(response.length>0)
                { 
                await ProcessWorkFlowSchema.deleteMany({workflowName:TrackNtraceworkfl[i].workflowName})
                }
                TrackNtraceworkfl[i].save(function (err, result) {
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
                        logger.error("Error in TrackNTrace seeding",err)
                    }
                });
            }
            // inserting the migration into mongos seqalize
            await mongoSequelizeMeta.create({ name: '20221207072345-TrackNtrace.js' });
        }

    } catch (err) {
        logger.error("Error at 20221207072345-TrackNtrace.js seeder ",err)
    }
}