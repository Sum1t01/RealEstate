import express from "express";
import {signup, signin, google, signOut} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup).post("/signin", signin).post("/google", google).get("/signout", signOut);

export default router;