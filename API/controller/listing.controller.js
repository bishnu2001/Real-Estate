const { Listing } = require('../model/listing.model');
module.exports.createlisting = async (req, res) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json(listing._doc);
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
}

module.exports.deletelisting = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "listing not found" });
    if (req.user.id !== listing.userRef) {
        return res.json(401).json({ message: "you can only delete your listing" });
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(201).json({ message: "Listing has been deleted!", success: true })
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
}
module.exports.updatelisting = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(401).json('Listing not found');
    if (req.user.id !== listing.userRef) {
        return res.status(401).json({ message: "you can update only your listing" })
    }
    try {
        const updatelisting = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json(updatelisting)
    } catch (error) {
        return res.status(501).json({ message: "internal server error" })
    }
}
module.exports.getlisting=async(req,res)=>{
    try {
        const listing=await Listing.findById(req.params.id);
        if(!listing){
            return res.status(401).json('Listing not found')
        }
        res.status(200).json(listing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}