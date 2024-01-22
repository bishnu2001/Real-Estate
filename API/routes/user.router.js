const express=require('express');
const { updateuser }=require('../controller/user.controller');
const { verifyToken }=require('../utils/verifyuser');

const router=express.Router();
router.post('/update/:id',verifyToken,updateuser);
module.exports=router;