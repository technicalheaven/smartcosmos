import { randomUUID } from "crypto";
import { SyncDataAction, SyncDataEntity } from "../modules/device/sync-service/rmq/helpers/rmqConfig";
import { publishEntity } from "../modules/device/sync-service/services/sync";
import { NodeNames, WorkflowNodeStatus } from "../modules/process/common/utils";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import ProcessWorkFlowSchema from "../modules/process/models/processWorkflow";
import { logger } from '../libs/logger'
const digitizationId = randomUUID()
const Digitizationworkfl = [
    new ProcessWorkFlowSchema({
        tenantId: 'SMARTCOMOS',
        isShared: true,
        isPredefined: true,
        workflowName: NodeNames.Digitization,
        nodes: [{ id:digitizationId,name: NodeNames.Digitization, isWorkFlow: false, isStateMachine: false, inputOutPut: null, stateMachineName:'', workflowName:''  }],
        edges: [],
        initialNode: {id:digitizationId, name: NodeNames.Digitization, isWorkFlow: null, isStateMachine: null, inputOutPut: null, stateMachineName:'', workflowName:'' },
        nodesStatus: {},
        status: WorkflowNodeStatus.IDLE
    })]
let done = 0;

export const seedDigitizationWFRev = async () => {
    try {
        let data = await mongoSequelizeMeta.find({ name: '20221207071126-Digitization.js' });
        if (data.length <= 0) {
            for (let i = 0; i < Digitizationworkfl.length; i++) {
                let response= await ProcessWorkFlowSchema.find({workflowName:Digitizationworkfl[i].workflowName});
                if(response.length>0)
                { 
                    await ProcessWorkFlowSchema.deleteMany({workflowName:Digitizationworkfl[i].workflowName})
                }
                Digitizationworkfl[i].save(function (err, result) {
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
                        logger.error("Error in Digitization seeding",err)
                    }
                });
            }
            // inserting the migration into mongos seqalize
            await mongoSequelizeMeta.create({ name: '20221207071126-Digitization.js' });
        }

    } catch (err) {
        logger.error("Error at 20221207071126-Digitization.js seeder ",err)
    }
    
}