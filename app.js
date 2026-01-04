const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const httpStatusText = require('./utils/httpStatusText');


const userRoutes = require('./Modules/Users/users.routes');
const categoryRoutes = require('./Modules/Categories/categories.routes')
const productRoutes = require('./Modules/Products/products.routes')
const cartRoutes = require('./Modules/Cart/cart.routes')
const paymentRoutes = require('./Modules/Payment/payment.routes')
const webHookRoutes = require('./Modules/Payment/paymobWebHook.route')
const orderRoutes = require('./Modules/Orders/orders.routes')
const reviewRoutes = require('./Modules/Reviews/reviews.routes')
const couponRoutes = require('./Modules/Coupon/coupon.routes')


const app = express()

// Middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }));   // Middleware to parse URL-encoded bodies
app.use(express.json())

// Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/webHook', webHookRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/coupon', couponRoutes)


//! Global Error Handler
app.use((error, req, res, next) =>{
    res.status(error.statusCode || 500)
    .json({status: error.statusCode || httpStatusText.ERROR, message: error.message, code: error.statusCode || 500});
})

//! Global Middleware for not found routes
app.all(/.*/, (req, res) => {
    return res.status(404).json({status: httpStatusText.ERROR, message: 'Page Not Found', code: 404});
});

module.exports = app;