const express=require("express");
const { signup, signin, google, signout } = require("../controller/auth.controller.js");
const { checkDuplicateUser }=require("../middleware/signupmiddleware.js")
const router=express.Router();
router.post('/signup',checkDuplicateUser,signup);
router.post('/signin',signin);
router.post('/google',google);
router.get('/signout', signout);
module.exports=router;
