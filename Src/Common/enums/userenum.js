
export const GenderEnum = {
    FEMALE: "female",
    MALE: "male"
}


export const RoleEnum = {
    USER: "user",
    ADMIN: "admin",
    SUPER_ADMIN: "super_admin"
}


export const Privillages = {
    ADMINS: [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN],
    SUPER_ADMIN: [RoleEnum.SUPER_ADMIN],
    ADMIN: [RoleEnum.ADMIN],
    USER: [RoleEnum.USER],
    ALL: [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN, RoleEnum.USER],
    USER_ADMIN: [RoleEnum.USER, RoleEnum.ADMIN],
    USER_SUPER_ADMIN: [RoleEnum.USER, RoleEnum.SUPER_ADMIN],
}


export const SkillevelEnum = {
    BEGINEER: "beginer",
    INTERMEDIATE: "intermediate",
    ADVANCED: "advanced"
}