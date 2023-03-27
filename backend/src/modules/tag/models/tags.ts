import mongoose from "mongoose";
import { Schema } from 'mongoose';
import { UUID } from "sequelize";

const tagSchema: Schema = new Schema(
        {
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
        manufacturerName:{
            type:String,
            required:true
        },
        customerName:{
            type:String,
        },
        fileName:{
            type:String,
            required:true
        },
        
        batchId:{
            type:String,
            required:true
        },
        tagId:{
            type:String,
            required:true
        },
        tagInfo:{
            type:String,
            
        },
        tagType:{
            type:String,
           
        },
        tagClass:{
            type:String,
           
        },
        hash:{
            type:String
        },
        secureKey:{
            type:String,
        },
        inlayItemName:{
            type:String
        },
        inlayType:{
            type:String
        },
        vendorName:{
            type:String
        },
        orderId:{
            type:String
        },
        orderDate:{
            type:String,
        },
        orderQuantity:{
            type:String,
        },
        orderQuantityUnit:{
            type:String,
        },
        deliveryDate:{
            type:String,
        },
        deliveryItemName:{
            type:String,
        },
        deliveryQuantity:{
            type:String,
        },
        deliveryQuantityUnit:{
            type:String,
        },
        historyReferenceId:{
            type:String,
        },
        status:{
            type:String,
            defaultValue: 'Inactive'
        },
        isActivated: {
            type:Boolean,
            defaultValue: false
        },
        lastValidCounter: {
            type:String,
            //required:true,
            defaultValue: '000000'
        },
        serialNo: {
            type:String,
        },
        operationTime:{
            type:String,
           
        },
        createdBy:{
            type:String,
           
        },
        updatedBy:{
            type:String,
           
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

let Tag = mongoose.model('manufacturerTags', tagSchema);
export default Tag;