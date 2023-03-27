
import { Request } from "express";
import { logger } from "../../../libs/logger";
import PreDefinedWorkflow from "../models/predefinedWorkflow";


class NodeWFService {
    constructor() { }

    // fetch all nodeworkflows
    async fetchNodePredefineWf(req: Request) {
        try {
            let preDefinedWf=[]
            preDefinedWf = await PreDefinedWorkflow.find();
            return Promise.resolve(preDefinedWf)
        } catch (error: any) {
            logger.error("Error in fetching preDefined node workflows",error.message)
            return Promise.reject(error)
        }

    }
}

export { NodeWFService }