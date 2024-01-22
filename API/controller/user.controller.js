const bcryptjs = require('bcryptjs');
const { User } = require('../model/user.model');
module.exports.updateuser = async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(401).json({ message: "you can only update your own account" });
        }

        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateuser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true });

        const { password, ...rest } = updateuser._doc;
        return res.status(200).json({ success: true, ...rest, message: "update successful" });
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
