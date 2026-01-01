const { initiatePayment } = require('./payment.services');

const createPayment = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        const userId = req.user.id

        if (!orderId) {
            return res.status(400).json({ status: "error", message: "orderId is required" });
    }

        const paymentUrl = await initiatePayment(orderId, userId);
        return res.status(200).json({ status: "SUCCESS", paymentUrl });
    }catch (error) {
        next(error);
}};

module.exports = { createPayment };
