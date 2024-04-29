import Listing from "../models/listing.model.js";
import errorHandler from "../utils/error.js";

const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);

        return res.status(201).json(listing);
    }
    catch (error) {
        next(error);
    }
};

const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(404, "Listnig not found"));
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "Unauthorized access"));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Listing deleted" });
    }
    catch (error) {
        next(error);
    }
};

const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(404, "Listing Not Found"));
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "Unauthorized Access"));
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(updateListing);
        res.status(200).json(updatedListing);
    }
    catch (error) {
        next(error);
    }
};

const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, "Listing not found"));
        }
        res.status(200).json(listing);
    }
    catch (error) {
        next(error);
    }
};

export { createListing, deleteListing, updateListing, getListing };