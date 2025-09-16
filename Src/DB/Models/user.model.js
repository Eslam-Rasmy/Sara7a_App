import mongoose from "mongoose";
import { GenderEnum, RoleEnum } from "../../Common/enums/userenum.js";


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "fN must be at least 3 char long"],
        maxLength: 20,
        lowercase: true,
        trim: true
    }, lastName: {
        type: String,
        required: true,
        minLength: [3, "fN must be at least 3 char long"],
        maxLength: 20,
        lowercase: true,
        trim: true
    }, age: {
        type: Number,
        required: true,
        min: [18, "age must be at least 18 years old"],
        max: [100, "age must be at most 100 years old"],
        index: {
            name: "idx_age"
        }
    }, gender: {
        type: String,
        enum: Object.values(GenderEnum),
        default: GenderEnum.MALE
    }, email: {
        type: String,
        required: true,
        index: {
            unique: true,
            name: "idx_email_unique"
        }
    }, password: {
        type: String,
        required: true,
    }, phoneNumber: {
        type: String,
        required: true
    }, otps: {
        confirmation: String,
        resetPassword: String
    }, isConfirmed: {
        type: Boolean,
        default: false
    }, role: {
        type: String,
        enum: Object.values(RoleEnum),
        default: RoleEnum.USER
    },
    profilePicture: {
        secure_url: String,
        public_id: String
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    }, toObject: {
        virtuals: true
    },
    virtuals: {
        fullName: {
            get() {
                return `${this.firstName} ${this.lastName}`
            }
        }
    }, methods: {
        getFullName() {
            return `${this.firstName} ${this.lastName}`
        },
        getDoubleAge() {
            return this.age * 2
        }
    }
})


userSchema.index({ firstName: 1, lastName: 1 }, { name: "idx_first_last_unique)", unique: true })


userSchema.virtual("Messages", {
    ref: "Messages",
    localField: "_id",
    foreignField: "receiverId"
})


const User = mongoose.model("User", userSchema)


export default User