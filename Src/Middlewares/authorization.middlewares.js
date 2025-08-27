


export const authorizationMiddlewares = (allowRolles) => {
    return (req, res, next) => {
        const { user: { role } } = req.loggedInUser
        if (allowRolles.includes(role)) {
            return next()
        }

        return res.status(401).json({message:"Unauthorized"})

    }
}