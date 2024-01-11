const express=require("express");
const dotenv=require("dotenv").config();
const port=process.env.PORT || 3000;
const userrouter =require('./routes/user.router')
const authrouter=require('./routes/auth.routes')
const app=express();
const { connectdb } =require('./config/db');
connectdb();
app.use(express.json())
app.use('/api/user', userrouter);
app.use('/api/auth',authrouter)
app.get('/',(req,res)=>{
    res.send("ready");
})
app.listen(port,()=>{
    console.log(`server running at ${port}`)
})