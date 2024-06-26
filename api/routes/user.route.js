import express from "express";
import { updateUser, test, deleteUser, getUserListing, getUser } from "../controllers/user.controller.js";
import verifyToken from "../utils/verifyUser.js";


const router = express.Router();

router.get("/test", test)
    .post("/update/:id", verifyToken, updateUser)
    .delete("/delete/:id", verifyToken, deleteUser)
    .get("/listings/:id", verifyToken, getUserListing)
    .get("/:id", verifyToken, getUser);

export default router;