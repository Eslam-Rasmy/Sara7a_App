import Joi from "joi";
import { GenderEnum } from "../../Common/enums/userenum.js";


export const SignUpSchema = {
    body: Joi.object({
        firstName: Joi.string().alphanum().required().messages({
            "strinig.base": "First name must be string"
        }),
        lastName: Joi.string().min(3).max(20).required(),
        email: Joi.string().required(),
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
        age: Joi.number().greater(18).less(80).integer().required(),
        gender: Joi.string().valid(...Object.values(GenderEnum)).required(),
        phoneNumber: Joi.string().required(),
    }),


}


