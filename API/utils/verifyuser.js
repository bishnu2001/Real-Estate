const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Forbidden" });
        }

        // If verification is successful, attach the user to the request object
        req.user = user;
        next(); // Continue to the next middleware or route handler
    });
};

module.exports = { verifyToken };
