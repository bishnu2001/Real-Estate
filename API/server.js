const express=require("express");
const dotenv=require("dotenv").config();
const port=process.env.PORT || 3000;
const userrouter =require('./routes/user.router')
const authrouter=require('./routes/auth.routes')
const listingrouter=require('./routes/listing.routes');
const path=require('path');
const cookieparser=require("cookie-parser");
const { connectdb } =require('./config/db');
connectdb();
const _dirname=path.resolve();
const app = express();
app.use(express.json());
app.use(cookieparser());
app.use('/api/user', userrouter);
app.use('/api/auth',authrouter);
app.use('/api/listing', listingrouter);
app.use(express.static(path.join(_dirname,'/client/dist')));
app.get('*',(req,res)=>{
    res.sendFile(path.join(_dirname,'client','dist','index.html'))
})

app.get('/',(req,res)=>{
    res.send("server is ready");
});
app.listen(port,()=>{
    console.log(`server running at ${port}`)
})