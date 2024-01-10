const express=require("express");
const dotenv=require("dotenv").config();
const port=process.env.PORT || 3000;
const app=express();
const { connectdb } =require('./config/db');
connectdb();
app.get('/',(req,res)=>{
    res.send("ready");
})
app.listen(port,()=>{
    console.log(`server running at ${port}`)
})