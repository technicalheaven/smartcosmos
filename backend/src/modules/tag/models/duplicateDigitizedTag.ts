import mongoose from "mongoose";
import { Schema } from 'mongoose';

const duplicateDigitizedTagSchema: Schema = new Schema({
    tenantId:{
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
    deviceName:{
        type:String,
        required:true
    },
    deviceId:{
        type:String,
        required:true
    },
    processId:{
        type:String,
        required:true
    },
    productId:{
        type:String,
        required:true
    },
    siteId:{
        type:String,
        required:true
    },
    siteName:{
        type:String,
    },
    zoneId:{
        type:String,
        required:true
    },
    zoneName:{
        type:String,
    },
    diId:{
        type:String
    },
    diInfo:{
        type:String
    },
    primaryURL:{
        type:String
    },
    primaryId:{
        type:String
    },
    primaryIdType:{
        type:String
    },
    additionalData:{
        type:Object
    },
    count:{
        type:String
    },
    chunkIdentifier:{
        type:String
    },
    finalChunk:{
        type:String
    },
    fileUrl:{
        type:String
    },
    productDescription:{
        type:String
    },
    productExperienceId:{
        type:String
    },
    productExperienceStudioId:{
        type:String
    },
    productExperienceTenantId:{
        type:String
    },
    productUPC:{
        type:String
    },
    status:{
        type:String,
        required:false
    },
    operationTime:{
        type:String,
        required:false
    },
    createdBy:{
        type:String
    },
    updatedBy:{
        type:String
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
    
})

let DuplicateDigitizedTag = mongoose.model('duplicateDigitizedTag', duplicateDigitizedTagSchema);
export default DuplicateDigitizedTag;