import { NodeNames } from "../modules/process/common/utils";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import NodesMapping from "../modules/process/models/nodeMapping";
import { logger } from '../libs/logger'


const nodesmapping = [
    {
        nodeName:NodeNames.Digitization,
        isStateMachine:false,
        isWorkflow:false,
        stateMachineName:'',
        workflowName: '',   
    },
    {
        nodeName: NodeNames.TrackNtrace,
        isStateMachine:false,
        isWorkflow:false,
        stateMachineName:'',
        workflowName:'',   
    },

    ]
let done = 0;

export const seedNodeMappingDandT = async () => {
    try {
        let data = await mongoSequelizeMeta.find({ name: '202212120710298-nodeMappingAddDigitization&TNT.js' });
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
            await mongoSequelizeMeta.create({ name: '202212120710298-nodeMappingAddDigitization&TNT.js' });
        }

    } catch (err) {
        logger.error("error in nodeMapping seeder in DigitNtrack",err)
    }
}