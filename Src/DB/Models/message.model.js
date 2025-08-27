import mongoose from "mongoose";



const messagesShems = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
 },{
    timestamps:true
})

const Message = mongoose.model("Messages",messagesShems)

export default Message