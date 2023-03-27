import mongoose from "mongoose";
import { Schema } from 'mongoose';

const batchSchema: Schema = new Schema(
        {
        historyReferenceId:{
            type:String,
            required:true
        },
        tenantId:{
            type:String,
            required:true
        },
        tenantName:{
            type:String,
            required:true
        },
        userId:{
            type:String,
            required:true
        },
        userName:{
            type:String,
            required:true
        },
        batchId:{
            type:String,
            required:true
        },
        uploadCount:{
            type:String,
            required:true
        },
        errorCount:{
            type:String,
            required:true
        },
        fileName:{
            type:String,
            required:true
        },
        fileLink: {
            type:String,
            required:true
        },
        errorReportLink: {
            type:String,
        },
        status:{
            type:String,
            required:true
        },
        operationTime:{
            type:String,
           
        },
        createdBy:{
            type:String,
            required: false
           
        },
        updatedBy:{
            type:String,
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
        }
        }, {
          timestamps: true,
         
    }
)

let Batch = mongoose.model('batch', batchSchema);
export default Batch;