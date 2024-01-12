const express=require("express");
const { signup } = require("../controller/auth.controller.js");
const { checkDuplicateUser }=require("../middleware/signupmiddleware.js")
const router=express.Router();
router.post('/signup',checkDuplicateUser,signup);
module.exports=router;
