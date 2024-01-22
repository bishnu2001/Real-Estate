const jwt = require('jsonwebtoken');
const verifyToken=(req,res,next)=>{
    const token = req.cookies.access_token;
    if (!token) {
        res.status(401).json({ error: "Unauthorized" })
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            res.status(403).json({ err: "Forbidden" })
        }
        req.user = user;
        next();
    })
}
module.exports = { verifyToken };