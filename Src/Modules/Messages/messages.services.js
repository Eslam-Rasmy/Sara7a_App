import Message from "../../DB/Models/message.model.js"
import User from "../../DB/Models/user.model.js"



export const sendMessageService = async (req, res) => {

    const { content } = req.body

    const { receiverId } = req.params

    const user = await User.findById(receiverId)
    if (!user) {
        return res.status(401).json({ message: "user not found" })
    }

    const message = new Message({
        content,
        receiverId
    })

    await message.save()

    res.status(200).json({ message: "message sent successfully", message })

}


export const GetMessageService = async (req, res) => {

    const messages = await Message.find().populate([
        {
            path:"receiverId", 
            select:"firstName lastName"
        }
    ])

    return res.status(200).json({ message: "message get successfully", messages })


}