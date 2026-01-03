const prisma = require('../../lib/prisma'); 
const {userRules} = require('../../utils/roles')
const appError = require('../../utils/AppError')
const httpStatusText = require('../../utils/httpStatusText');

const deleteReview = async(reviewId, userId) =>{
    const review = await prisma.review.findUnique({where:{id: reviewId}})

    if(!review)
        throw appError.create("Review not found", 404, httpStatusText.ERROR)

    if(review.userId !== userId)
        throw appError.create("You are not authorized to delete this review", 403, httpStatusText.ERROR)

    await prisma.review.delete({where:{id: reviewId}})
    return;
}

module.exports = {deleteReview};