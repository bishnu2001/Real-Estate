const express=require('express');
const { updateuser, deleteuser, getuserlisting, getUser }=require('../controller/user.controller');
const { verifyToken }=require('../utils/verifyuser');

const router=express.Router();
router.post('/update/:id',verifyToken,updateuser);
router.delete('/delete/:id', verifyToken, deleteuser);
router.get('/listings/:id', verifyToken, getuserlisting);
router.get('/:id',verifyToken,getUser)


module.exports=router;