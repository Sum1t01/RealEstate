import express from "express";
import Listing from "../models/listing.model.js";

const createListing = async (req, res, next)=>{
    try
    {
        const listing = await Listing.create(req.body);

        return res.status(200).json(listing);
    }
    catch(error)
    {
        next(error);
    }
};

export {createListing};