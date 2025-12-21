// const appError = require('../utils/AppError')
// const httpStatusText = require('../utils/httpStatusText')

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false
        })
        if (error) {
            return next({
                statusCode: 400,
                message: error.details.map(d => d.message).join(', ')
            })
        }
        next()
    }
}

module.exports = validate