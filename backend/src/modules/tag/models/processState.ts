import mongoose from "mongoose";
import { Schema } from 'mongoose';
import { UUID } from "sequelize";

const processStateSchema: Schema = new Schema(
    {
        userId:{
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
        siteId:{
            type:String,
            required:true
        },
        zoneId:{
            type:String,
            required:true
        },

        
        status: {
            type: String,
            required:true,
            //defaultValue: 'active-running'
        },
        
        createdBy: {
            type: String,
        },
        updatedBy: {
            type: String,
        },
        deletedBy: {
            type: String,
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

let ProcessState = mongoose.model('processState', processStateSchema);
export default ProcessState;