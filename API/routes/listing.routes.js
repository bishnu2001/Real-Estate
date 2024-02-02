const express=require('express');
const { createlisting }=require('../controller/listing.controller');
const { verifyToken } = require('../utils/verifyuser');
const router=express.Router();

router.post('/create',verifyToken,createlisting);

module.exports=router;