import { NodeNames } from "../modules/process/common/utils";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import NodesMapping from "../modules/process/models/nodeMapping";
import { logger } from '../libs/logger'


const nodesmapping = [
    {
        nodeName: NodeNames.Ready,
        isStateMachine:false,
        isWorkflow:true,
        stateMachineName:null,
        workflowName:NodeNames.Ready,   
    },{
        nodeName:NodeNames.GPIOLight,
        isStateMachine:false,
        isWorkflow:true,
        stateMachineName:null,
        workflowName: NodeNames.GPIOLight,   
    },
    {
        nodeName: NodeNames.GPIOSound,
        isStateMachine:false,
        isWorkflow:true,
        stateMachineName:null,
        workflowName:NodeNames.GPIOSound,   
    },
    {
        nodeName:NodeNames.PrintLabel,
        isStateMachine:false,
        isWorkflow:true,
        stateMachineName:null,
        workflowName:NodeNames.PrintLabel,   
    },
    {
        nodeName:NodeNames.SelectDevice,
        isStateMachine:true,
        isWorkflow:false,
        stateMachineName:NodeNames.SelectDevice,
        workflowName:null,   
    },
    {
        nodeName:NodeNames.SelectSite,
        isStateMachine:true,
        isWorkflow:false,
        stateMachineName:NodeNames.SelectSite,
        workflowName:null,   
    },
    {
        nodeName:NodeNames.SelectZone,
        isStateMachine:true,
        isWorkflow:false,
        stateMachineName:NodeNames.SelectZone,
        workflowName:null,   
    },
    {
        nodeName:NodeNames.ScanBarcode,
        isStateMachine:true,
        isWorkflow:false,
        stateMachineName:NodeNames.ScanBarcode,
        workflowName:null,   
    },
    {
        nodeName:NodeNames.ScanQRCode,
        isStateMachine:true,
        isWorkflow:false,
        stateMachineName:NodeNames.ScanQRCode,
        workflowName:null,   
    },
    {
        nodeName:NodeNames.ScanUHF,
        isStateMachine:true,
        isWorkflow:false,
        stateMachineName:NodeNames.ScanUHF,
        workflowName:null,   
    },
    {
        nodeName:NodeNames.ScanNFC,
        isStateMachine:true,
        isWorkflow:false,
        stateMachineName:NodeNames.ScanNFC,
        workflowName:null,   
    },
    {
        nodeName:NodeNames.ScanTag,
        isStateMachine:true,
        isWorkflow:false,
        stateMachineName:NodeNames.ScanTag,
        workflowName:null,   
    },
    {
        nodeName:NodeNames.Input,
        isStateMachine:true,
        isWorkflow:false,
        stateMachineName:NodeNames.Input,
        workflowName:null,   
    }
    ]
let done = 0;

export const seedNodeMapping = async () => {
    try {
        let data = await mongoSequelizeMeta.find({ name: '20221212071008-nodeMapping.js' });
        if (data.length <= 0) {
            for (const nodemap of nodesmapping) {
                let response= await NodesMapping.find({nodeName:nodemap.nodeName});
                if(response.length>0)
                { 
                    await NodesMapping.deleteMany({nodeName:nodemap.nodeName});
                }
                await NodesMapping.create(nodemap);
            }
            // inserting the migration into mongos seqalize
            await mongoSequelizeMeta.create({ name: '20221212071008-nodeMapping.js' });
        }

    } catch (err) {
        logger.error("error in nodeMapping seeder",err)
    }
}