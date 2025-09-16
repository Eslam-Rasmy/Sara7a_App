import { Router } from "express";
import * as service from "./users.services.js"
import { authenticationMiddlewares } from './../../Middlewares/authentication.middlewares.js';
import { authorizationMiddlewares } from "../../Middlewares/authorization.middlewares.js";
import { Privillages, RoleEnum } from "../../Common/enums/userenum.js";
import { validationMiddlewares } from "../../Middlewares/validation.middlewares.js";
import { SignUpSchema, updateSchema,updatePassSchema,newPassSchema } from "../../Validators/Schemas/user.schema.js";
import { hostupload, localupload } from './../../Middlewares/multer.middlewares.js';
const usersController = Router()



usersController.post("/add", validationMiddlewares(SignUpSchema), service.SignUpService)
usersController.put("/update", authenticationMiddlewares, validationMiddlewares(updateSchema), service.UpdateService)
usersController.delete("/delete", authenticationMiddlewares, service.deleteService)
usersController.delete("/deleteExpToken", service.DeletExpiredTokenService)
usersController.get("/list", authenticationMiddlewares, authorizationMiddlewares(Privillages.USER), service.listUserServide)
usersController.post("/signIn", service.SignInService)
usersController.put("/confirm", service.ConfirmEmailService)
usersController.put("/confirmPass", service.ConfirmPassService)
usersController.post("/logout", authenticationMiddlewares, service.LogoutService)
usersController.post("/refersh", service.RefershTokenServide)
usersController.post("/updatepass", authenticationMiddlewares, validationMiddlewares(updatePassSchema), service.UpdatePasswordService)
usersController.post("/resetPass", service.ResetPasswordService)
usersController.post("/NewPass",validationMiddlewares(newPassSchema), service.NewPassService)
usersController.post("/upload-profile",authenticationMiddlewares,hostupload("profile"), service.UploadProfileService)
usersController.delete("/deleteFile", service.DeleteCloudinaryService)











export default usersController