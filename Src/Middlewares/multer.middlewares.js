import multer from "multer"
import { allowedFileExtentions, fileTyps } from "../Common/constants/fils.constans.js"



export const localupload = () => {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads")
        },
        filename: (req, file, cb) => {
            const unique = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, `${unique}___${file.originalname}`)
        }
    })

    const fileFilter = (req, file, cb) => {

        console.log("Incoming File:", {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
        });

        const fileKey = file.mimetype.split("/")[0].toUpperCase()
        const fileType = fileTyps[fileKey]
        if (!fileType) return cb(new Error("invaild file type"), false)

        const fileExtention = file.mimetype.split("/")[1]
        if (!allowedFileExtentions[fileType].includes(fileExtention)) {
            return cb(new Error("invalid file extension"), false);
        }

        return cb(null, true)
    }

    return multer({
        limits: {
            fileSize: 1024 * 1024 * 2
        }, fileFilter, storage
    }).single("profile")
}



export const hostupload = () => {

    const storage = multer.diskStorage({})

    const fileFilter = (req, file, cb) => {

        console.log("Incoming File:", {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
        });

        const fileKey = file.mimetype.split("/")[0].toUpperCase()
        const fileType = fileTyps[fileKey]
        if (!fileType) return cb(new Error("invaild file type"), false)

        const fileExtention = file.mimetype.split("/")[1]
        if (!allowedFileExtentions[fileType].includes(fileExtention)) {
            return cb(new Error("invalid file extension"), false);
        }

        return cb(null, true)
    }

    return multer({
        limits: {
            fileSize: 1024 * 1024 * 2
        }, fileFilter, storage
    }).single("profile")
}
