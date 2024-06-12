const JWT = require('jsonwebtoken');

const requireSignIn = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        if (!authorization) {
            return res.status(401).json({ error: "You must be logged in to access this resource" });
        }
        const token = authorization.split(' ')[1]; // Extract the token after "Bearer "
        const decode = JWT.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        console.log(error);
    }
}

module.exports = requireSignIn;