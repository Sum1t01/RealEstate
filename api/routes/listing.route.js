import express from "express";
import { createListing, deleteListing, updateListing, getListing, getListings } from "../controllers/listing.controller.js";
import verifyToken from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing)
    .delete("/delete/:id", verifyToken, deleteListing)
    .post("/update/:id", verifyToken, updateListing)
    .get("/get/:id", getListing)
    .get("/get/", getListings);

export default router;