const Listing = require("../models/listing");
const fetch = require("node-fetch");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({}); //GPT here .find({}) means return every thing without any filter
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exists");
  }
  res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res, next) => {
  async function forwardGeocode(address) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "major-project/1.0 (singhumu78@gmail.com)",
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await response.json();
      if (data.length > 0) {
        console.log("Address:", address);
        console.log("Latitude:", data[0].lat);
        console.log("Longitude:", data[0].lon);
        return {
          lat: data[0].lat,
          lon: data[0].lon,
        };
      } else {
        console.log("No results found for the address:", address);
        return null;
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.error("Request timed out.");
      } else {
        console.error("Error fetching geocode:", err.message);
      }
      return null;
    }
  }
  const geoData = await forwardGeocode(req.body.listing.location);

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing); //this .listing give all the data from the name to description etc
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  if (geoData) {
    newListing.geometry = {
      type: "Point",
      coordinates: [geoData.lon, geoData.lat],
    };
  }

  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exists");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  //{ ...req.body.listing } decontructing and getting individual values and updating
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
