
import { Request } from "express";
import { last } from "lodash";
import { Op } from "sequelize";
import { logger } from "../../../libs/logger";
import { Conditions, NodeNames } from "../common/utils";
import NodesMapping from "../models/nodeMapping";
import PreDefinedNodes from "../models/predefinedNodes";
import ProcessWorkFlowSchema from "../models/processWorkflow";
import processexternalComm from "./externalCommunication";
var localConstant = require('../utils/constants');


class WorkFlowSchemaService {
    constructor() { }

    // this function will insert data for wokrflow to workflow schema table for the specified process
    async insertWorkFlow(process: any) {
        try {
            if (!process.id || !process.name) {
                logger.error(`Failed to create workflow for process as processId/process name is not present`);
                return Promise.resolve()
            }

            if (!Object.keys(process.states).length) {
                logger.error(`Failed to create workflow for process ${process.name} as no node is present for process`);
                return Promise.resolve()
            }

            // check if wokrflow already exist for process or not
            const tenantId = process.tenantId?process.tenantId:'SMARTCOMOS';
            const workflow = await ProcessWorkFlowSchema.findOne({ workflowName: process.name,tenantId:tenantId})
            if (workflow) {
                logger.error(`Workflow already exist for process ${process.id} with name ${process.name}`);
                return Promise.resolve('Already exist worklow')
            }

            // extract nodes and edges for process from prcess to insert into workflowSchema table
            const data: any = await this.extractNodesNEdgesFromProcess(process);
            if (!data || !data.nodes || !data.edges) {
                logger.error(`Failed to extract nodes and edges for process: ${process.id} with name ${process.name}`);
                return Promise.resolve()
            }

            const isPredefined = process.isPredefined?process.isPredefined:false
            const isShared = true

            const result: any = await ProcessWorkFlowSchema.create({ tenantId:tenantId, isPredefined:isPredefined, isShared:isShared, workflowName: process.name, nodes: data?.nodes, edges: data?.edges })
            logger.info(`Successfully inserted workflow for process ${process.name}`)
            return Promise.resolve(result);

        } catch (error: any) {
            logger.error('Failed to insert workflow to workflow collection');
            return Promise.reject(error)
        }
    }


    async updateWorkFlow(process: any, prevWorkflowName:string) {
        try {
            if (!process.id || !process.name) {
                logger.error(`Failed to update workflow for process as processId/process name is not present`);
                return Promise.resolve()
            }

            if (!Object.keys(process.states).length) {
                logger.error(`Failed to update workflow for process ${process.name} as no node is present for process`);
                return Promise.resolve()
            }

            // check if wokrflow already exist for process or not
            const workflow = await ProcessWorkFlowSchema.findOne({ workflowName: prevWorkflowName })
            if (!workflow) {
                logger.error(`Workflow to be updated is not present for process with name ${prevWorkflowName}`);
                return Promise.resolve('Workflow not found')
            }


            // extract nodes and edges for process from prcess to insert into workflowSchema table
            const data: any = await this.extractNodesNEdgesFromProcess(process);
            if (!data || !data.nodes || !data.edges) {
                logger.error(`Failed to extract nodes and edges for process with name ${process.name}`);
                return Promise.resolve()
            }

            const tenantId = process.tenantId?process.tenantId:'SMARTCOMOS';
            const isPredefined = process.isPredefined?process.isPredefined:false;
            const isShared = true
            const updated:any = await ProcessWorkFlowSchema.updateOne({workflowName: prevWorkflowName},{tenantId:tenantId, isPredefined:isPredefined, isShared:isShared, workflowName: process.name, nodes: data?.nodes, edges: data?.edges})
            // const result: any = await ProcessWorkFlowSchema.create({ processId: process.id, processName: process.name, nodes: data?.nodes, edges: data?.edges })
            logger.info(`Successfully updated workflow for process ${process.name}`)

            const result:any = await ProcessWorkFlowSchema.findOne({workflowName: process.workflowName})
            return Promise.resolve(result);

        } catch (error: any) {
            logger.error('Failed to insert workflow to workflow collection');
            return Promise.reject(error)
        }
    }
    
    async extractNodesNEdgesFromProcess(process: any) {
        try {
            let keys: any = [];
            let nodes: any[] = []
            let edges: any[] = []

            // add zone
            const selectZone = await PreDefinedNodes.findOne({ name: "Select Zone" });
            if (!selectZone) {
                logger.error("selectZone is not found")
                return Promise.reject(null)
            }

            // add select device state in process states
            const selectDeviceState = await PreDefinedNodes.findOne({ name: "Select Device" })

            if (!selectDeviceState) {
                logger.error("selectDeviceState is not found")
                return Promise.reject(null)
            }

            const readyState = await PreDefinedNodes.findOne({ name: "ReadyState" })

            if (!readyState) {
                logger.error("readyState is not found")
                return Promise.reject(null)
            }

            // add last node
            const lastNode = await this.addlastNode(process?.processType);
            if(lastNode && lastNode !== null) {
                const lastNodeKey = Object.keys(lastNode.state)[0]
                const lastNodeName = lastNode.name
                const existinglastNodeKey = Object.keys(process.states)[Object.keys(process.states).length - 1]
                const existingLastNodeName = process.states[existinglastNodeKey]['properties']['name']
                process.states[lastNodeKey] = lastNode.state[lastNodeKey]
                const existingLastStateTransitions = process.transitions[existinglastNodeKey]
                const existingLastStateTransitionsTo = existingLastStateTransitions['on'][existingLastNodeName]['to']
                process.transitions[lastNodeKey] = { onEnter: {}, on: { [lastNodeName]: {condition:'', value:'', to:existingLastStateTransitionsTo}, onExit: {} }}
                existingLastStateTransitions['on'][existingLastNodeName]['to'] = lastNodeKey
                process.transitions[existinglastNodeKey] = existingLastStateTransitions
            }

            const firstStateKey = Object.keys(process.states)[0];
            process.states['PR4'] = selectZone.state['PR4']
            process.states['PR1'] = selectDeviceState.state['PR1']
            process.states['PR2'] = readyState.state['PR2']
            keys = Object.keys(process.states);

            // add select device transition to process
            selectZone.transition['PR4'].on["Select Zone"].to = 'PR1';
            selectDeviceState.transition['PR1'].on["Select Device"].to = 'PR2';
            readyState.transition['PR2'].on["Ready"].to = process.initialState;

            process.transitions['PR4'] = selectZone.transition['PR4']
            process.transitions['PR1'] = selectDeviceState.transition['PR1']
            process.transitions['PR2'] = readyState.transition['PR2']




            for await (const key of keys) {
                const state = process.states[key]
                const stateTransition = process.transitions.hasOwnProperty(key) ? process.transitions[key] : null
                const fromState = state['properties']['name']
                const lockTag = state['properties']['lockTag']?state['properties']['lockTag']:false
                let lockTagWF:any = []
                if (state && stateTransition) {
                    const transitionData = stateTransition['on'][fromState]
                    // adding edges for lock-tag
                    if(lockTag){
                        lockTagWF = await ProcessWorkFlowSchema.find({workflowName:NodeNames.LockTag});
                        const toLockTagId = lockTagWF[0]?.id
                        const LockedgeObj = { from: key, to: toLockTagId }
                        edges.push(LockedgeObj)

                        const toStateId = transitionData['to']
                        const edgeObj = { from: lockTagWF[0]?.id, to: toStateId }
                        edges.push(edgeObj)

                    }
                    else if (transitionData['to']) {
                        const toStateId = transitionData['to']
                        const edgeObj = { from: key, to: toStateId }
                        edges.push(edgeObj)
                    } else {
                        edges.push({});
                    }
                }

                const nodeMapping:any = await this.getNodeMapping(fromState);

                let validation:any[] = [];
                if(state['properties'] && state['properties']['validation'] && state['properties']['validation'].length) {
                    validation  = state['properties']['validation']
                    
                }

                let input:any[] = []
                if(state['properties'] && state['properties']['input'] && state['properties']['input'].length) {
                    input = state['properties']['input']
                }

                const nodeObj = { id:key, name: fromState, 
                    isStateMachine: nodeMapping[0]?.isStateMachine,
                    isWorkFlow: nodeMapping[0]?.isWorkflow,
                    stateMachineName:nodeMapping[0]?.stateMachineName,
                    workflowName:nodeMapping[0]?.workflowName,
                    validation: validation,
                    input:input
                }
                nodes.push(nodeObj)

                if(lockTag){
                    const nodeMappingLockTag:any = await this.getNodeMapping(NodeNames.LockTag);
                    const lockTagNode = { id:lockTagWF[0]?.id, name: NodeNames.LockTag, 
                        isStateMachine: nodeMappingLockTag[0]?.isStateMachine,
                        isWorkFlow: nodeMappingLockTag[0]?.isWorkflow,
                        stateMachineName:nodeMappingLockTag[0]?.stateMachineName,
                        workflowName:nodeMappingLockTag[0]?.workflowName,
                        validation: [],
                        input:[]
                    }
                    nodes.push(lockTagNode)
                }
            }

            logger.info(`Successfully extracted nodes and edges for process ${process.id}`);
            return Promise.resolve({ nodes: nodes, edges: edges });

        } catch (error: any) {
            logger.error(`Failed to extract node and edges from process data for process:${process.id}`);
            return Promise.reject();
        }
    }

    // this function will delete workflow schema for specified processId
    async deleteWorkflowSchema(processName: string) {
        try {
            await ProcessWorkFlowSchema.deleteOne({ workflowName: processName });
            logger.info(`Sucessfully deleted workflow schema for process:${processName}`);
            return Promise.resolve()
        } catch (error: any) {
            logger.error(`Failed to delete workflow schema for process:${processName}`);
            return Promise.reject(error);
        }
    }

    // fetch all workflows
    async fetchWorkflows(req: Request) {
        try {
            let {
                tenantId,
                status,
                name,
                isPredefined,
            } = req.query

            let where = {}
            if (status != undefined) {
                where = {
                    ...where,
                    status: {
                        [Op.eq]: status,
                    },
                }
            }

            if (isPredefined != undefined) {
                where = {
                    ...where,
                    isPredefined: {
                        [Op.eq]: isPredefined,
                    },
                }
            }

            if (tenantId != undefined) {

                where = {
                    ...where,
                    tenantId: {
                        [Op.eq]: tenantId,
                    },
                }
            }

            if (name != undefined) {
                where = {
                    ...where,
                    workflowName: {
                        [Op.eq]: name,
                    },
                }
            }

            let workflows = await ProcessWorkFlowSchema.find({...where})
            return Promise.resolve(workflows)
        } catch (error: any) {
            logger.error("Error in fetching workflows")
            return Promise.reject(error)
        }

    }

    async getNodeMapping(nodeName:string) {
        try {
            const nodemapping = await NodesMapping.find({nodeName:nodeName});
            logger.info('Successfully get node mapping for node',nodeName, nodemapping);
            return Promise.resolve(nodemapping)
        } catch (error:any) {
            logger.error(`Failed to get node mapping for node:${nodeName}`);
            return Promise.reject(error);
        }
    }

    async addlastNode(procesTypeId: string) {
        try {
            // add select device state in process states
            let node:any = null
            const data = await processexternalComm.getFeatureNameById(procesTypeId)
            const processType = data.data.result[0].name
            if (processType === localConstant.ProcessType.DIGITIZATION) {
                 node = await PreDefinedNodes.findOne({ name:  NodeNames.Digitization})
            } else if (processType === localConstant.ProcessType.TRACKNTRACE) {
                node = await PreDefinedNodes.findOne({ name:  NodeNames.TrackNtrace})
            } else {
                logger.error('Process Type is not supported to add last node');
                return Promise.resolve(node);
            }

            if(!node || node === null) {
                logger.error('No last node is available to add')
                return Promise.resolve(node);
            }

            logger.debug('Successfully added last node')
            return Promise.resolve(node);
        } catch (error: any) {
            logger.error('Failed to add last node', error);
            return Promise.reject(error);
        }
    }
}

export { WorkFlowSchemaService }
