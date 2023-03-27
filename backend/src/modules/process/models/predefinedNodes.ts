import mongoose from "mongoose";
import { Schema } from 'mongoose';



const preDefinedNode: Schema = new Schema({

    
       name:{
        type:String,
        required:true
       },
       state:{
        type:JSON,
        required:true
       },
       transition:{
        type:JSON,
        required:true
       },
       

 }, {
    timestamps: true,
    strict: false
})

let PreDefinedNodes = mongoose.model('preDefinedNode', preDefinedNode);
export default PreDefinedNodes;