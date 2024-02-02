const { Listing }=require('../model/listing.model');
module.exports.createlisting=async(req,res)=>{
        try {
            const listing=await Listing.create(req.body);
            res.status(201).json({listing})
        } catch (error) {
            res.status(500).json({error:"internal server error"});
        }
}