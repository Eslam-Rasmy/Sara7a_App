import mongoose from "mongoose";




const blackListedTokenSchema = new mongoose.Schema({
    tokenId: { type: String, required: true, unique: true },
    expirationDate: { type: String, required: true }
})

const BlackListedToken = mongoose.model("BlackListedTokens", blackListedTokenSchema)

export default BlackListedToken