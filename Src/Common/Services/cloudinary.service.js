import { v2 as cloudinaryV2 } from "cloudinary"


cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


export const uploadFileCloudinary = async (file, options) => {
    const result = await cloudinaryV2.uploader.upload(file, options)
    return result
}

export const uploadManyFilesCloudinary = async (files, options) => {
    const result = []
    for (const file of files) {
        const { secure_url, public_id } = await uploadFileCloudinary(file, options)
        result.push({ secure_url, public_id })
    }
    return result
}



export const deleteFileCloudinary = async (public_id) => {
    const result = await cloudinaryV2.uploader.destroy(public_id)
    return result
}


export const deletManyFilesCloudinary = async (public_ids) => {
    const result = await cloudinaryV2.api.delete_resources(public_ids)
    return result
}


export const cleanFilesCloudinary = async (folder_name) => {
    const result = await cloudinaryV2.api.delete_resources_by_prefix(folder_name)
    return result
}


export const deleteFolderCloudinary = async (folder_name) => {
    await cleanFilesCloudinary(folder_name)
    const result = await cloudinaryV2.api.delete_folder(folder_name)
    return result
}

