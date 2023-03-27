
import { logger } from "../../../libs/logger"
import { NodeType } from "./utils"


// get whether node is workflow or state machine
export const getNodeType = (nodeName: string) => {
    try {
        const nodes = NodeType.filter((node: any) => { return node.name === nodeName })
        if(!nodes.length) {
            logger.error('No node type peresnt for node',nodeName)
            return Promise.resolve()
        }
        return Promise.resolve(nodes[0].type)
    } catch (error: any) {
        logger.error(`Failed to get node type for node ${nodeName}`)
        return null
    }
}