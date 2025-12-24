const Joi = require('joi')
const appError = require('../../utils/AppError');
const httpStatusText = require('../../utils/httpStatusText');

const createValidCategory = Joi.object({
    name: Joi.string().min(3).max(150).required().messages({
        'string.empty': `You must enter a category name`,
        'string.min': `Category must have a minimum length of {#limit} characters`,
        'string.max': `Category must have a maximum length of {#limit} characters`,
        'any.required': `Category name is required`
    }),
    parentId: Joi.string().min(3).max(15).optional()
})

module.exports = {createValidCategory}