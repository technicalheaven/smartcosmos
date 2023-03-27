
import { Request } from "express";
import { logger } from "../../../libs/logger";
import PreDefinedStateMachine from "../models/predefinedStatemachine";


class StateMachineService {
    constructor() { }

    // fetch all statemachines
    async fetchStateMachine(req: Request) {
        try {
            let stateMachines = await PreDefinedStateMachine.find();
            return Promise.resolve(stateMachines)
        } catch (error: any) {
            logger.error("Error in fetching stateMachines")
            return Promise.reject(error)
        }

    }
}

export { StateMachineService }