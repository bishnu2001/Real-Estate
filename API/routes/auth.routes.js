const express=require("express");
const { signup, signin, google } = require("../controller/auth.controller.js");
const { checkDuplicateUser }=require("../middleware/signupmiddleware.js")
const router=express.Router();
router.post('/signup',checkDuplicateUser,signup);
router.post('/signin',signin);
router.post('/google',google);

module.exports=router;
