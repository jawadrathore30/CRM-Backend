import User from "../models/userr.model.js";
import { errorHandler } from "../utils/error.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

// Update User
export const updateUser = async (req, res, next) => {
	const { userId } = req.params;
	const currentUser = req.user;

	try {
		const targetUser = await User.findById(userId);
		if (!targetUser) return next(errorHandler(404, "User not found."));

		// Admin can update anyone
		if (currentUser.role === "admin") {
			// proceed
		}
		// Coadmin can't update admin
		else if (currentUser.role === "coadmin") {
			if (targetUser.role === "admin") {
				return next(
					errorHandler(403, "Coadmins cannot update admin accounts.")
				);
			}
		}
		// Users can update only their own account
		else if (currentUser.role === "user") {
			if (currentUser.id !== userId) {
				return next(
					errorHandler(403, "Users can only update their own account.")
				);
			}
		}

		// Build dynamic update object
		const updates = {};
		for (const key of Object.keys(req.body)) {
			if (
				req.body[key] !== undefined &&
				req.body[key] !== null &&
				req.body[key] !== ""
			) {
				updates[key] = req.body[key];
			}
		}

		// If changing password, hash it and mark flag
		if (updates.password) {
			const salt = await bcrypt.genSalt(10);
			updates.password = await bcrypt.hash(updates.password, salt);
			updates.passwordChanged = true;
		}

		// Apply only the provided updates
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ $set: updates },
			{ new: true }
		);

		const { password, ...userData } = updatedUser._doc; // Exclude password from response
		res.status(200).json(userData);
	} catch (error) {
		next(error);
	}
};

// Delete User
export const deleteUser = async (req, res, next) => {
	const { userId } = req.params;
	const currentUser = req.user;

	try {
		const targetUser = await User.findById(userId);
		if (!targetUser) return next(errorHandler(404, "User not found."));

		if (currentUser.role === "admin") {
			// Admin can delete anyone
		} else if (currentUser.role === "coadmin") {
			if (targetUser.role === "admin") {
				return next(
					errorHandler(403, "Coadmins cannot delete admin accounts.")
				);
			}
		} else if (currentUser.role === "user") {
			if (currentUser.id !== userId) {
				return next(
					errorHandler(403, "Users can only delete their own account.")
				);
			}
		} else {
			return next(errorHandler(403, "Invalid role for this action."));
		}

		await User.findByIdAndDelete(userId);
		res.status(200).json("User account has been deleted.");
	} catch (error) {
		next(error);
	}
};

// Get All Users (Admin & Coadmin only)
export const getUsers = async (req, res, next) => {
	const currentUser = req.user;
	if (currentUser.role !== "admin" && currentUser.role !== "coadmin") {
		return next(
			errorHandler(
				403,
				"Access denied. Only admins or coadmins can view all users."
			)
		);
	}

	try {
		const users = await User.find().sort({ createdAt: -1 });
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

// Get Single User (User can only access self)
export const getUser = async (req, res, next) => {
	const { userId } = req.params;
	const currentUser = req.user;

	if (currentUser.id !== userId) {
		return next(
			errorHandler(403, "You can only access your own account details.")
		);
	}

	try {
		const user = await User.findById(userId);
		if (!user) return next(errorHandler(404, "User not found."));
		res.status(200).json(user._doc);
	} catch (error) {
		next(error);
	}
};

export const updatePasswordStatus = async (req, res, next) => {
	const { userId } = req.params;
	const currentUser = req.user;

	if (currentUser.id !== userId) {
		return next(
			errorHandler(403, "You can only update your own password status.")
		);
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ passwordChanged: true },
			{ new: true }
		);

		const { password, ...userData } = updatedUser._doc; // Exclude password from response
		res.status(200).json(userData);
	} catch (error) {
		next(error);
	}
};
