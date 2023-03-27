import mongoose from "mongoose";
import { Schema } from 'mongoose';

const TnTDataSchema: Schema = new Schema({
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
    deviceId:{
        type:String,
        required:true
    },
    deviceName:{
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
    action:{
        type:String,
        required:true
    },
    diId:{
        type:String,
        required:true
    },
    serialNo:{
        type:String,
    },
    diInfo:{
        type:String,
        required:true
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
    status:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    eventType:{
        type:String,
    },
    eventTime:{
        type:String,
    },
    eventTimeZoneOffset:{
        type:String,
    },
    epcList:{
        type:String,
    },
    bizStep:{
        type:String,
    },
    disposition:{
        type:String,
    },
    readPoint:{
        type:String,
    },
    bizLocation:{
        type:String,
    },
    bizTransactionList:{
        type:String,
    },
    destination:{
        type:String,
    },
    source:{
        type:String,
    },
    operationTime:{
        type:String,
    },
    epcisDocument:{
        type:String,
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

let TnTData = mongoose.model('TnTData', TnTDataSchema);
export default TnTData;