const Joi = require('joi')
const appError = require('../../utils/AppError');
const httpStatusText = require('../../utils/httpStatusText');

const registerUserSchema = Joi.object({
    firstName: Joi.string().min(3).max(150).required().messages({
        'string.empty': `You must enter your first name`,
        'string.min': `First Name must have a minimum length of {#limit} characters`,
        'string.max': `First Name must have a maximum length of {#limit} characters`,
        'any.required': `First Name is required`
    }),
    lastName: Joi.string().min(3).max(15).required().messages({
        'string.empty': `You must enter your last name`,
        'string.min': `Last Name must have a minimum length of {#limit} characters`,
        'string.max': `Last Name must have a maximum length of {#limit} characters`,
        'any.required': `Last Name is a required field`
    }),
    password:Joi.string().min(8).max(20).required().messages({
        'string.empty': `You must enter your password`,
        'string.min': `Password must have a minimum length of {#limit} digits`,
        'string.max': `Password must have a maximum length of {#limit} digits`,
        'any.required': `Password is required `
    }) ,
    username: Joi.string().min(3).max(30).required().messages({
        'string.empty': `You must enter your username`,
        'string.min': `Username must have a minimum length of {#limit} digits`,
        'string.max': `Username must have a maximum length of {#limit} digits`,
        'any.required': `Username is required`
    }),
    email: Joi.string().email().required().messages({
        'string.empty': `Enter your email address `,
        'string.email': `Email must be a valid email address`,
        'any.required': `Email is a required field`
    }),
    address: Joi.string().min(5).max(200).required().messages({
        'string.empty': `Enter your address`,
        'string.min': `Address must have a minimum length of {#limit} digits`,
        'string.max': `Address must have a maximum length of {#limit} digits`,
        'any.required': `Address is required`
    })
})

const loginUserSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': `Enter your email address `,
        'string.email': `Email must be a valid email address`,
        'any.required': `Email is a required field`
    }),
    password: Joi.string().min(8).max(20).required().messages({
        'string.empty': `You must enter your password`,
        'string.min': `Password must have a minimum length of {#limit} digits`,
        'string.max': `Password must have a maximum length of {#limit} digits`,
        'any.required': `Password is required `
    })
})

module.exports = {registerUserSchema, loginUserSchema}