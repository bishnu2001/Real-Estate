const express=require('express');
const { createlisting, deletelisting }=require('../controller/listing.controller');
const { verifyToken } = require('../utils/verifyuser');
const router=express.Router();

router.post('/create',verifyToken,createlisting);
router.delete('/delete/:id',verifyToken,deletelisting)

module.exports=router;