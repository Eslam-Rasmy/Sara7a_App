import { Router } from "express";
import * as service from "./messages.services.js"
import { authenticationMiddlewares } from './../../Middlewares/authentication.middlewares.js';
const messagesController = Router()



messagesController.post("/send/:receiverId", service.sendMessageService)
messagesController.get("/get", service.GetMessageService)






export default messagesController