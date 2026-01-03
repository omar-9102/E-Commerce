const appError = require('../../utils/AppError');
const httpStatusText = require('../../utils/httpStatusText');
const reviewServices = require('./reviews.services')

const deleteReview = async(req, res, next) =>{
    try{
        const userId = req.user.id
        const reviewId = req.params.id
        const review = await reviewServices.deleteReview(reviewId, userId)
        return res.status(200).json({message: "Deleted Successfuly"})
    }catch(error){
        return next(error)
    }
}

module.exports = {deleteReview};