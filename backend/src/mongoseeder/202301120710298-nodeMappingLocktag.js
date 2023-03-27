import { NodeNames } from "../modules/process/common/utils";
import mongoSequelizeMeta from "../modules/process/models/mongosSequelizeMeta";
import NodesMapping from "../modules/process/models/nodeMapping";
import { logger } from '../libs/logger'


const nodesmapping = [
    {
        nodeName:NodeNames.LockTag,
        isStateMachine:false,
        isWorkflow:false,
        stateMachineName:'',
        workflowName: '',   
    }
    ]
let done = 0;

export const seedNodeMappingLockTag = async () => {
    try {
        let data = await mongoSequelizeMeta.find({ name: '202301120710298-nodeMappingLocktag.js' });
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
            await mongoSequelizeMeta.create({ name: '202301120710298-nodeMappingLocktag.js' });
        }

    } catch (err) {
        logger.error("error in nodeMappingLockTag seeder",err)
    }
}