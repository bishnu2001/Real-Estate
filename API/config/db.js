const mongoose=require("mongoose");
const connectdb=async()=>{
    try {
        const db =await mongoose.connect(process.env.MONGO_url);
        console.log(`db connected ${db.connection.host}`)
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
module.exports={ connectdb };