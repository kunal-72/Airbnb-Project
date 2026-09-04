const Listing = require("../models/listing.js")

module.exports.index = async (req, res) => {

    let allListings = await Listing.find()

    res.render("listing/index.ejs", { allListings })

}

module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs")
}

module.exports.showListing = async (req, res) => {

    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exist.")
        res.redirect("/listings")
    } else {
       
        res.render("listing/show.ejs", { listing })
    }


}
module.exports.createListing = async (req, res, next) => {


    let url = req.file.path;
    let filename = req.file.filename;
    let listing = req.body.listing;     
    let newListing = new Listing(listing);
    newListing.owner = req.user._id            

    newListing.image = { url, filename }

    await newListing.save();
    req.flash("success", "New listing added!!!")
    res.redirect("/listings")
}

module.exports.renderEditForm = async (req, res) => {

    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist!!");
        return res.redirect("/listings")
    } 

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/c_fill,h_150,w_150");
    res.render("listing/edit.ejs", { listing, originalImageUrl })
    

}
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    if (!req.body.listing) {                                                   
        throw new ExpressError(400, "send valid listing data")
    }
    let listing = req.body.listing;
                      
    let updatedListing = await Listing.findByIdAndUpdate(id, { ...listing })     

    if (typeof req.file != "undefined") {
        let url = req.file.path;                    
        let filename = req.file.filename;
        updatedListing.image = { url, filename }
        await updatedListing.save();
    }

   

    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`);

}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!!")
    res.redirect("/listings");
}