


export const fileTyps = {
    IMAGE: "image",
    VIDEO: "video",
    AUIDO: "audio",
    APPLICATION: "application"
}


export const allowedFileExtentions = {

    [fileTyps.IMAGE]: ["png", "jpg", "jpeg", "gif", "webp"],
    [fileTyps.VIDEO] : ["mp4", "avi", "mkv", "mov", "mwv"],
    [fileTyps.AUIDO] : ["mp3", "wav", "ogg", "wma", "aac"],
    [fileTyps.APPLICATION] : ["pdf", "doc", "docx", "xls", "xlsx","ppt","pptx"],


}