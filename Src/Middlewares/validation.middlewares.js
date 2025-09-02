

const reqKeys = ["body", "params", "query", "headers"]

export const validationMiddlewares = (schema) => {
    return (req, res, next) => {

        const validationErrors = []

        for (const key of reqKeys) {
            if (schema[key]) {
                const { error } = schema[key].validate(req[key], { abortEarly: false })
                if (error) {
                    console.log("error", error.details);
                    validationErrors.push(...error.details)
                }
            }
        }
        if (validationErrors.length) {
            return res.status(400).json({ message: "error", errors: validationErrors })

        }
        next()
    }
}