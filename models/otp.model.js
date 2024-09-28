import mongoose from 'mongoose';

import dotenv from 'dotenv'

dotenv.config();

const otpSchema = new mongoose.Schema({

    email:{
        type: String,
        required:true
    },
    value: { 
        type: String, 
        required: true 
    },
    expiry: { 
        type: Date, 
        required: true, 
        // TTL index to automatically remove OTP after expiry
        expires: 0  // The document will expire at the time specified by the `expiry` field
    }
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;