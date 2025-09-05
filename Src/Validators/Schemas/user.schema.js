import Joi from "joi";
import { GenderEnum } from "../../Common/enums/userenum.js";


export const SignUpSchema = {
    body: Joi.object({
        firstName: Joi.string().alphanum().min(3).max(20).required(),
        lastName: Joi.string().alphanum().min(3).max(20).required(),
        email: Joi.string().email({ tlds: { allow: false } }).required().messages({
            "string.email": "Email must be a valid email address.",
            "string.empty": "Email is required",
            "any.required": "Email is require."
        }),
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required().messages({
            "string.pattern.base": "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character",
            "string.empty": "Password is required",
            "any.required": "Password is required"
        }),
        age: Joi.number().greater(18).less(80).integer().required(),
        gender: Joi.string().valid(...Object.values(GenderEnum)).required(),
        phoneNumber: Joi.string().pattern(/^(010|011|012|015)[0-9]{8}$/).required().messages({
            "string.pattern.base": "Phone number must start with 010, 011, 012, or 015 and be exactly 11 digits",
            "string.empty": "Phone number is required",
            "any.required": "Phone number is required"
        })
    })
}




export const updateSchema = {
    body: Joi.object({
        firstName: Joi.string().alphanum().min(3).max(20),
        lastName: Joi.string().alphanum().min(3).max(20),
        email: Joi.string().email({ tlds: { allow: false } }).messages({
            "string.email": "Email must be a valid email address."
        }),
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).messages({
            "string.pattern.base": "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character",
        }),
        age: Joi.number().greater(18).less(80).integer(),
        gender: Joi.string().valid(...Object.values(GenderEnum)),
        phoneNumber: Joi.string().pattern(/^(010|011|012|015)[0-9]{8}$/).messages({
            "string.pattern.base": "Phone number must start with 010, 011, 012, or 015 and be exactly 11 digits"
        })
    })
}


