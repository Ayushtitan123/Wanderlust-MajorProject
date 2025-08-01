const Listing = require("../models/listing.js");
const { forwardGeocode } = require("../Services/maptiler.js");



module.exports.index = async (req, res) => {
    const {category} = req.query;

    let filter = {};
    if(category){
        filter.category = category;
    }
    const allListings = await Listing.find(filter);
    res.render("listings/index", { allListings, category });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
        .populate("owner");
    if (!listing) {
        req.flash("error", "listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing });
}

module.exports.createListing = async (req, res) => {
    const { location } = req.body.listing; // user-provided address
    const geoCoordinates = await forwardGeocode(location);
    console.log(JSON.stringify(geoCoordinates, null, 2));
    if (!geoCoordinates) {
        req.flash("error", "Invalid location provided. Please enter a valid address.");
        return res.redirect("/listings/new");
    }
    let url = req.file.path;
    let filename = req.file.filename;

    // If no image provided, randomly pick one from DB
    // if (!listingData.image || !listingData.image.url) {
    //     const [randomListing] = await Listing.aggregate([
    //         { $match: { "image.url": { $exists: true, $ne: "" } } },
    //         { $sample: { size: 1 } } // randomly select one
    //     ]);

    //     if (randomListing && randomListing.image) {
    //         listingData.image = {
    //             url: randomListing.image.url,
    //             filename: randomListing.image.filename || "default-image"
    //         };
    //     } else {
    //         listingData.image = {
    //             url: "/images/default.jpg", // final fallback
    //             filename: "default-image"
    //         };
    //     }
    // }
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = geoCoordinates;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl =listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    let destinationType = listing.category;
    destinationType = destinationType.charAt(0).toUpperCase() + destinationType.slice(1);

    res.render("listings/edit", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings")
}