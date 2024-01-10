const express=require("express");
const port=3000;
const app=express();
app.get('/',(req,res)=>{
    res.send("ready");
})
app.listen(port,()=>{
    console.log(`server running at ${port}`)
})