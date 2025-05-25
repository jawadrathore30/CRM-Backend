import express from "express";
import {
	updateUser,
	getUsers,
	getUser,
	deleteUser,
	updatePasswordStatus,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", verifyToken, updateUser);
router.get("/getusers", verifyToken, getUsers);
router.get("/getuser/:userId", verifyToken, getUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.put("/passwordstatus/:userId", verifyToken, updatePasswordStatus); // Update password status

export default router;
