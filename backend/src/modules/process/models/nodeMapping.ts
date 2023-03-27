import mongoose from "mongoose";
import { Schema } from 'mongoose';


const nodemapping: Schema = new Schema({
       nodeName:{
        type:String,
        required:true
       },
       isStateMachine:{
        type:Boolean,
        required:true
       },
       isWorkflow:{
        type:Boolean,
        required:true
       },
       stateMachineName:{
        type:String,
        required:false,
       },
       workflowName:{
        type:String,
        required:false,
       },   
 }, {
    timestamps: true,
    strict: false
})

let NodesMapping = mongoose.model('nodemappings', nodemapping);
export default NodesMapping;