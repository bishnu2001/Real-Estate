const express=require('express');
const { createlisting, deletelisting, updatelisting, getlisting }=require('../controller/listing.controller');
const { verifyToken } = require('../utils/verifyuser');
const router=express.Router();

router.post('/create',verifyToken,createlisting);
router.delete('/delete/:id',verifyToken,deletelisting);
router.post('/update/:id',verifyToken,updatelisting);
router.get('/get/:id',getlisting)

module.exports=router;