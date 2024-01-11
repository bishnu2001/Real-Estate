const { User } = require("../model/user.model.js");
module.exports.signup=async(req,res)=>{
    const { username, email, password } = req.body;
    const newuser = new User({ username, email, password })
    await newuser.save();
    res.status(201).json("user created successfully !")
}