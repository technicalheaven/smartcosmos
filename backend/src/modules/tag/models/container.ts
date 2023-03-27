import mongoose from "mongoose";
import { Schema } from 'mongoose';

const containerSchema: Schema = new Schema({
    containerName:{
        type:String,
        required:true
    },
    storageName: {
        type:String,
        required:true
    }
}, {
    timestamps: true
})

let Container = mongoose.model('container', containerSchema);

export default Container;