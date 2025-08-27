import { Router } from "express";
import * as service from "./users.services.js"
import { authenticationMiddlewares } from './../../Middlewares/authentication.middlewares.js';
import { authorizationMiddlewares } from "../../Middlewares/authorization.middlewares.js";
import { Privillages, RoleEnum } from "../../Common/enums/userenum.js";
const usersController = Router()



usersController.post("/add", service.SignUpService)
usersController.put("/update", authenticationMiddlewares, service.UpdateService)
usersController.delete("/delete", authenticationMiddlewares, service.deleteService)
usersController.get("/list", authenticationMiddlewares, authorizationMiddlewares(Privillages.ADMINS), service.listUserServide)
usersController.post("/signIn", service.SignInService)
usersController.put("/confirm", service.ConfirmEmailService)
usersController.put("/confirmPass", service.ConfirmPassService)
usersController.post("/logout", authenticationMiddlewares, service.LogoutService)
usersController.post("/refersh", service.RefershTokenServide)
usersController.post("/updatepass", authenticationMiddlewares, service.UpdatePasswordService)
usersController.post("/resetPass", service.ResetPasswordService)
usersController.post("/NewPass", service.NewPassService)








export default usersController