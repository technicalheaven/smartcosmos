import mongoose from "mongoose";
import { Schema } from 'mongoose';

const processWorkflowSchema: Schema = new Schema({
    tenantId: {
        type:String,
        required:true
    },
    isShared:{
        type:Boolean,
        required:true,
    },
    isPredefined: {
        type:Boolean,
        required:true
    },
    workflowName: {
        type: String,
        required: true
    },
    nodes:[{id:String, nodeName:String, isStateMachine:Boolean, isWorkFlow:Boolean, stateMachineName:String, workflowName:String, validation:Array, input:Array}],
    edges: [{to:String, from:String, condition:{type:String, value:String}}],
    createdBy: {
        type: Date,
        required: false
    },
    updatedBy: {
        type: Date,
        required: false
    },
    createdAt: {
        type: Date,
        required: false
    },
    updatedAt: {
        type: Date,
        required: false
    },
    deletedAt: {
        type: Date,
        required: false
    },
}, {
    timestamps: true,
    strict: false
})

let ProcessWorkFlowSchema = mongoose.model('processWorkflow', processWorkflowSchema);
export default ProcessWorkFlowSchema;