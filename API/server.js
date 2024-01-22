const express=require("express");
const dotenv=require("dotenv").config();
const port=process.env.PORT || 3000;
const userrouter =require('./routes/user.router')
const authrouter=require('./routes/auth.routes')
const cookieparser=require("cookie-parser");
const { connectdb } =require('./config/db');
connectdb();
const app = express();
app.use(express.json());
app.use(cookieparser());
app.use('/api/user', userrouter);
app.use('/api/auth',authrouter)
app.get('/',(req,res)=>{
    res.send("abhijeet");
})
app.listen(port,()=>{
    console.log(`server running at ${port}`)
})