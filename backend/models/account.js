const mongoose=require("mongoose");

const accountSchema=mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    balance:{
        type:Number,
        default:0,
        required: true
    }
})

const Account=mongoose.model("Account",accountSchema);
module.exports=Account