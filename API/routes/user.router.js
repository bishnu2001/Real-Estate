const express=require('express');
const { updateuser, deleteuser }=require('../controller/user.controller');
const { verifyToken }=require('../utils/verifyuser');

const router=express.Router();
router.post('/update/:id',verifyToken,updateuser);
router.delete('/delete/:id', verifyToken, deleteuser);

module.exports=router;