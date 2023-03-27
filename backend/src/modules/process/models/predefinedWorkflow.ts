import mongoose from "mongoose";
import { Schema } from 'mongoose';


const preDefinedWorkflow: Schema = new Schema({

    
       name:{
        type:JSON,
        required:true
       },
       nodes:{
        type:Array,
        required:true
       },
       edges:{
        type:Array,
        required:true
       },
       initialNode:{
        type:JSON,
        required:true
       },
       status:{
        type:JSON,
        required:true
       }  

 }, {
    timestamps: true,
    strict: false
})

let PreDefinedWorkflow = mongoose.model('preDefinedWorkflow', preDefinedWorkflow);
export default PreDefinedWorkflow;