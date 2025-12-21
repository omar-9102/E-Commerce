const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const httpStatusText = require('./utils/httpStatusText');
// const path = require('path')
// app.use('./uploads', express.static(path.join(__dirname,'/uploads')))
// const multer = require('multer');
// const upload = multer();

const userRoutes = require('./Modules/Users/users.routes');

const app = express()

// Middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

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