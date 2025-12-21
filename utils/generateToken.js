const jwt = require('jsonwebtoken');

module.exports = (user) => {return jwt.sign({
    id: user.id,
    role: user.role},
    process.env.JWT_SECRET_KEY, 
    {expiresIn: "15m"});
};
