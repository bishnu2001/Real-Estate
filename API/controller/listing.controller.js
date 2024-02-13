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
module.exports.getlisting = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(401).json('Listing not found')
        }
        res.status(200).json(listing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports.getListings = async (req,res) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startindex = parseInt(req.query.startindex) || 0;
        let offer = req.query.offer;
        if (offer === undefined || offer === "false") {
            offer = { $in: [false, true] }
        }
        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === "false") {
            furnished = { $in: [false, true] }
        }
        let parking = req.query.parking;
        if (parking === undefined || parking === "false") {
            parking = { $in: [false, true] }
        }
        let type = req.query.type;
        if (type === undefined || type === "all") {
            type = { $in: ['sale', 'rent'] };
        }
        const SearchTerm = req.query.SearchTerm || '';
        const sort = req.query.sort || "createdAt";
        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: { $regex: SearchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type
        }).sort(
            {[sort]:order}
        ).limit(limit).skip(startindex);

        return res.status(200).json(listings)


    } catch (error) {
        res.status(500).json({error:'internal server error'})
    }
}