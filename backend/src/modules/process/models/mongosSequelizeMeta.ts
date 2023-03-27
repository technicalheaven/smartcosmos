import mongoose from "mongoose";
import { Schema } from 'mongoose';



const mongosSequelizeMeta: Schema = new Schema({

    
       name:{
        type:String,
        required:true
       }

 }, {
    timestamps: true,
    strict: false
})

let mongoSequelizeMeta = mongoose.model('mongosSequelizeMeta', mongosSequelizeMeta);
export default mongoSequelizeMeta;