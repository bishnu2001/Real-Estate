const { User } = require("../model/user.model.js");

const checkDuplicateUser = async (req, res, next) => {
    const { username, email } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: "User with the same username or email already exists." });
        }

        // If no duplicate user is found, proceed to the next middleware or route handler
        next();
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { checkDuplicateUser };
