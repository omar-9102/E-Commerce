const httpStatusText = require('../utils/httpStatusText')
const appError = require('../utils/AppError')

module.exports = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role))
            return next(appError.create("Access denied", 401, httpStatusText.ERROR))
        next()
    }
}