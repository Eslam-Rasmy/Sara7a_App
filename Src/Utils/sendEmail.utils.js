import nodemailer from "nodemailer"
import { EventEmitter } from "node:events"


export const sendingEmail = async ({
    to,
    cc = "eudrnfniijnlqxprif@fxavaj.com",
    subject,
    content,
    attachments = []

}) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user:process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD,
        },
        /*  tls:{
             rejectUnauthorized:false
         } */
    })

    const info = await transporter.sendMail({
        from: "eslamrasme@gmail.com",
        to,
        cc,
        subject,
        html: content,
        attachments,        
    })
    return info
}

export const emitter = new EventEmitter()

emitter.on("sendingEmail",(args)=>{
    sendingEmail(args)
})