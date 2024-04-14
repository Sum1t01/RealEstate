import express from "express";
import {updateUser, test} from "../controllers/user.controller.js";
import {verifyToken} from "../utils/verifyUser.js";


const router = express.Router();

router.get("/test", test).post("/update/:id", verifyToken, updateUser);

export default router;