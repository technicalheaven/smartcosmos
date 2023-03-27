import { NodeNames } from "../modules/process/common/utils";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import NodesMapping from "../modules/process/models/nodeMapping";
import { logger } from '../libs/logger'


const nodesmapping = [
    {
        nodeName:NodeNames.EncodeNFC,
        isStateMachine:false,
        isWorkflow:true,
        stateMachineName:'',
        workflowName: NodeNames.EncodeNFC,   
    },
    {
        nodeName: NodeNames.EncodeUHF,
        isStateMachine:false,
        isWorkflow:true,
        stateMachineName:'',
        workflowName:NodeNames.EncodeUHF,   
    },

    ]
let done = 0;

export const seedNodeMappingEncodeNFCUHF = async () => {
    try {
        let data = await mongoSequelizeMeta.find({ name: '202212290710298-nodeMappingEncode.js' });
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
            await mongoSequelizeMeta.create({ name: '202212290710298-nodeMappingEncode.js' });
        }

    } catch (err) {
        logger.error("error in nodeMappingencode seeder",err)
    }
}