const appError = require('../../utils/AppError');
const httpStatusText = require('../../utils/httpStatusText');
const reviewServices = require('./reviews.services')
const asyncWrapper = require('express-async-handler')


const deleteReview = asyncWrapper(async(req, res) =>{
    const userId = req.user.id
    const reviewId = req.params.id
    const review = await reviewServices.deleteReview(reviewId, userId)
    return res.status(200).json({message: "Deleted Successfuly"})
})

module.exports = {deleteReview};