const { User } = require("../model/user.model.js");
const bcrypt = require('bcryptjs');

module.exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        return res.status(400).json({ error: "User with the same username or email already exists." });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });

    try {
        // Save the new user
        await newUser.save();
        res.status(201).json("User created successfully!");
    } catch (error) {
        res.status(500).json(error.message);
    }
};
