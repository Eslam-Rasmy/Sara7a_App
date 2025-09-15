import { compareSync, hashSync } from "bcrypt";
import User from "../../DB/Models/user.model.js"
import { asymetricDecryption, asymetricEncryption, decrypt, encrypt } from "../../Utils/encryption.utils.js";
import { emitter, sendingEmail } from "../../Utils/sendEmail.utils.js";
import { customAlphabet } from "nanoid";
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid";
import { generateToken, verifyToken } from "../../Utils/tokens.utils.js";
import BlackListedToken from "../../DB/Models/black-listed.model.js";
import Message from './../../DB/Models/message.model.js';
import { mongoose } from 'mongoose';
import  fs  from 'fs';


const uniqeString = customAlphabet("dgu873iuhey3e", 5)


export const SignUpService = async (req, res) => {
    try {
        const { firstName, lastName, email, password, age, gender, phoneNumber } = req.body

        const existingUser = await User.findOne({
            $or: [
                { email },
                { firstName, lastName }
            ]
        });
        if (existingUser) {
            return res.status(400).json({ error: "user already exists" });
        }

        const encryptPN = asymetricEncryption(phoneNumber)

        const hashPassword = hashSync(password, +process.env.SALT_Rounds)

        const otp = uniqeString()

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            age,
            gender,
            phoneNumber: encryptPN,
            otps: { confirmation: hashSync(otp, +process.env.SALT_Rounds), resetPassword: null }
        })

        /*  const userInstance = new User({
             firstName, lastName, email, password, age, gender
         })
         await userInstance.save() */

        /*     await sendingEmail({
                to: email,
                subject: "Confirmation Email",
                content: `Your confirmation opt is : ${otp}`
            }) */



        emitter.emit("sendingEmail", {
            to: email,
            subject: "Confirmation Email",
            content: `Your confirmation opt is : ${otp}`
        })

        return res.status(201).json({ message: "User created succesfully", user })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error", error })

    }
}

export const SignInService = async (req, res) => {
    try {

        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "invaild email or password" })
        }

        const isPasswrdMatch = compareSync(password, user.password)

        if (!isPasswrdMatch) {
            return res.status(404).json({ message: "invaild email or password" })
        }


        const accesstoken = generateToken(
            { _id: user.id, email: user.email },
            process.env.JWT_ACCESS_SECRET,
            {
                //issuer: "http://localhost:3000",
                //  audience: "http://localhost:4000",
                expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
                jwtid: uuidv4(),
            })

        const refershToken = generateToken(
            { _id: user.id, email: user.email },
            process.env.JWT_REFERSH_SECRET,
            {
                expiresIn: process.env.JWT_REFERSH_EXPIRES_IN,
                jwtid: uuidv4(),
            })

        return res.status(201).json({ message: "User signIn succesfully", user, accesstoken, refershToken })



    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error", error })
    }
}


export const ConfirmEmailService = async (req, res) => {

    const { email, otp } = req.body

    const user = await User.findOne({ email, isConfirmed: false })

    if (!user) {
        return res.status(404).json({ message: "user not found or already confirmed" })
    }

    const isOtpMatched = compareSync(otp, user.otps?.confirmation)

    if (!isOtpMatched) {
        return res.status(404).json({ message: "Invalid Otp" })
    }

    user.isConfirmed = true

    user.otps.confirmation = undefined

    await user.save()

    return res.status(201).json({ message: "User confirmed succesfully" })

}


export const UpdateService = async (req, res) => {
    try {
        /*         const { userId } = req.params
         */
        /*  const user = await User.findById(userId)
         if (!user) {
             return res.status(400).json({ message: "user not found" })
         }
         if (fi}rstName) user.firstName = firstName
         if (lastName) user.lastName = lastName
         if (email) {
             const existingUser = await User.findOne(email);
             if (existingUser) {
                 return res.status(400).json({ error: "email already exists" });
             }
             user.email = email
         }
         if (age) user.age = age
         if (gender) user.gender = gender
        if (phoneNumber) user.phoneNumber = phoneNumber

         await user.save()
  */
        /*     const updateResuly = await User.updateOne({ _id: userId }, {
                firstName, lastName, email, age, gender
            })
            if (!updateResuly.modifiedCount) {
                return res.status(400).json({ message: "user not found" })
            } */
        const { token: { tokenId }, user: { _id } } = req.loggedInUser
        const { firstName, lastName, email, age, gender, phoneNumber } = req.body

        const blackListToken = await BlackListedToken.findOne({ tokenId })
        if (blackListToken) {
            return res.status(401).json({ message: "Token is blackListed" })
        }


        const user = await User.findByIdAndUpdate(
            _id,
            { firstName, lastName, email, age, gender, phoneNumber: asymetricEncryption(phoneNumber) },
            { new: true }
        )

        if (!user) {
            return res.status(400).json({ message: "user not found" })

        }

        return res.status(201).json({ message: "User created succesfully", user, })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error", error })
    }
}


export const deleteService = async (req, res) => {

    const session = await mongoose.startSession()
    req.session = session
    try {
        const { user: { _id } } = req.loggedInUser


        session.startTransaction()


        /*  const deleteResult = await User.deleteOne({ _id: userId })
         if (!deleteResult.deletedCount) {
             return res.status(400).json({ message: "user not found" })
         } */

        const deleteResult = await User.findByIdAndDelete(_id, { session })
        if (!deleteResult) {
            return res.status(400).json({ message: "user not found" })
        }
        fs.unlinkSync(deleteResult.profilePicture)

        await Message.deleteMany({ receiverId: _id }, { session })

        await session.commitTransaction()

        session.endSession()

        return res.status(201).json({ message: "User deleted succesfully", deleteResult })

    } catch (error) {
        await session.abortTransaction()
        session.endSession()

        return res.status(500).json({ message: "error", error })
    }
}



export const listUserServide = async (req, res) => {
    try {
        let users = await User.find().select("-password").populate("Messages")
        /*   users = users.map((user) => {
              return {
                  ...user._doc,
                  phoneNumber: asymetricDecryption(user.phoneNumber)
              }
          }) */
        res.status(201).json({ users })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error", error })
    }
}



export const LogoutService = async (req, res) => {

    /*     const { accesstoken } = req.headers
        const decodedData = verifyToken(accesstoken, process.env.JWT_ACCESS_SECRET) */

    const { token: { tokenId, expirationDate }, user: { _id } } = req.loggedInUser


    const blackListedToken = await BlackListedToken.create({
        tokenId,
        expirationDate: new Date(expirationDate * 1000),
        userId: _id
    })

    return res.status(201).json({ message: "User logedOut succesfully" }, blackListedToken)
}


export const RefershTokenServide = async (req, res) => {
    const { refershtoken } = req.headers

    const decodeData = verifyToken(refershtoken, process.env.JWT_REFERSH_SECRET)

    const accesstoken = generateToken(
        { _id: decodeData._id, email: decodeData.email },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
            jwtid: uuidv4(),
        })

    return res.status(201).json({ message: "User token refersh succesfully", accesstoken })

}


export const UpdatePasswordService = async (req, res) => {
    try {

        const { user: { _id } } = req.loggedInUser

        const { oldPassword, newPassword, confirmPassword } = req.body


        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirm password not matched" });
        }

        const isMatch = compareSync(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const hashPassword = hashSync(newPassword, +process.env.SALT_Rounds)

        user.password = hashPassword;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error", error })
    }
}

export const ResetPasswordService = async (req, res) => {

    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }

    const otp = uniqeString()

    emitter.emit("sendingEmail", {
        to: email,
        subject: "code confirm",
        content: `Your code opt is : ${otp}`
    })

    user.otps.resetPassword = hashSync(otp, +process.env.SALT_Rounds)
    await user.save()

    return res.status(201).json({ message: "User can reset succesfully" })

}

export const ConfirmPassService = async (req, res) => {

    try {
        const { email, otp } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        if (user.otps.resetPassword === null) {
            return res.status(404).json({ message: "not sign" })
        }

        const isOtpMatched = compareSync(otp, user.otps?.resetPassword)
        if (!isOtpMatched) {
            return res.status(404).json({ message: "Invalid Otp" })
        }
        user.otps.resetPassword = "done"

        await user.save()

        return res.status(201).json({ message: "User confirmed succesfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error", error })
    }
}

export const NewPassService = async (req, res) => {

    try {

        const { email, newPassword, confirmPassword } = req.body

        const user = await User.findOne({ email, "otps.resetPassword": "done" })
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        if (user.otps.resetPassword === null) {
            return res.status(404).json({ message: "not sign" })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirm password not matched" });
        }

        const hashPassword = hashSync(newPassword, +process.env.SALT_Rounds)
        user.password = hashPassword;
        user.otps.resetPassword = null

        await user.save();
        return res.status(200).json({ message: "Password updated successfully" });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error", error })
    }
}


export const DeletExpiredTokenService = async (req, res) => {
    try {
        const result = await BlackListedToken.deleteMany({
            expirationDate: { $lt: new Date() }
        });

        return res.status(200).json({ message: "Expired tokens deleted successfully", result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error", error })
    }
}


export const UploadProfileService = async (req, res) => {

    try {
        const { user: { _id } } = req.loggedInUser
        const { path } = req.file

        const user = await User.findByIdAndUpdate(_id, { profilePicture: path }, { new: true })

        return res.status(200).json({ message: "profile uploaded successfully", user })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error", error })
    }
}