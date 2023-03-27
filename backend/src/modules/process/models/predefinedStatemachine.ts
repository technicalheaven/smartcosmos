import mongoose from "mongoose";
import { Schema } from 'mongoose';


const preDefinedStateMachine: Schema = new Schema({

    name: {
        type: String,
        required: true
    },
    initialState: {
        type: JSON,
        required: true
    },
    finalState: {
        type: JSON,
        required: true
    },
    states: {
        type: Array,
        required: true
    },
    transitions: {
        type: Array,
        required: true
    },
    tenantId:{
        type:String,
        required:true
    },
    isShared:{
        type:Boolean,
        required:true
    }
}, {
    timestamps: true,
    strict: false
})

let PreDefinedStateMachine = mongoose.model('preDefinedStateMachine', preDefinedStateMachine);
export default PreDefinedStateMachine;