import express from "express";
import {updateUser, test, deleteUser} from "../controllers/user.controller.js";
import verifyToken from "../utils/verifyUser.js";


const router = express.Router();

router.get("/test", test).post("/update/:id", verifyToken, updateUser).delete("/delete/:id", verifyToken, deleteUser);

export default router;