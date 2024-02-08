const { Listing }=require('../model/listing.model');
module.exports.createlisting=async(req,res)=>{
        try {
            const listing=await Listing.create(req.body);
            res.status(201).json(listing._doc);
        } catch (error) {
            res.status(500).json({error:"internal server error"});
        }
}

module.exports.deletelisting=async(req,res)=>{
    const listing=await Listing.findById(req.params.id);
    if(!listing) return res.status(404).json({message:"listing not found"});
    if(req.user.id !==listing.userRef){
        return res.json(401).json({message:"you can only delete your listing"});
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(201).json({ message:"Listing has been deleted!",success:true})
    } catch (error) {
       res.status(500).json({message:"internal server error"});
    }
}