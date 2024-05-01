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

const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;

        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;

        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;

        if (type === undefined || type === 'all') {
            type = { $in: ['rent', 'sale'] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listing = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type
        }).sort({
            [sort]: order
        }).limit(limit).skip(startIndex);

        return res.status(200).json(listing);
    }
    catch (error) {
        next(error);
    }
};

export { createListing, deleteListing, updateListing, getListing, getListings };