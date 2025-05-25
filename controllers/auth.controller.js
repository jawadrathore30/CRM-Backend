import User from "../models/userr.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export const signup = async (req, res, next) => {
	const {
		firstName,
		lastName,
		email,
		password,
		profilePicture,
		companyName,
		telephone,
		position,
		timeZone,
		twitter,
		facebook,
		linkedin,
		github,
		dribble,
		role,
		passwordChanged,
	} = req.body;

	// Validate required fields
	if (!firstName || !lastName || !email || !password) {
		return next(
			errorHandler(
				400,
				"First name, last name, email, and password are required!"
			)
		);
	}

	// Validate role
	const validRoles = ["user", "coadmin"];
	if (role && !validRoles.includes(role)) {
		return next(
			errorHandler(400, "Invalid role! Allowed roles are 'user' or 'coadmin'.")
		);
	}

	try {
		// Check if email is already registered
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return next(errorHandler(400, "Email already exists. Try another one!"));
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create the user object
		const newUser = new User({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			profilePicture: profilePicture || undefined,
			companyName: companyName || undefined,
			telephone: telephone || undefined,
			position: position || undefined,
			timeZone: timeZone || undefined,
			twitter: twitter || undefined,
			facebook: facebook || undefined,
			linkedin: linkedin || undefined,
			github: github || undefined,
			dribble: dribble || undefined,
			role: role || "user", // default to user if not provided
			passwordChanged: passwordChanged || false,
		});

		await newUser.save();

		res.status(201).json("User created successfully!");
	} catch (error) {
		next(error);
	}
};

export const signin = async (req, res, next) => {
	const { email, password, rememberMe } = req.body;
	// console.log("signin", req.body);

	// Basic validation
	if (!email || !password) {
		return next(errorHandler(400, "Both email and password are required!"));
	}

	try {
		// Explicitly select the password field
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			return next(errorHandler(404, "User not found!"));
		}

		// Compare password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return next(errorHandler(401, "Invalid credentials!"));
		}

		// JWT Token
		const token = jwt.sign(
			{
				id: user._id,
				role: user.role, // add role to payload for access control
			},
			process.env.JWT_SECRET,
			{ expiresIn: "30d" }
		);

		// Hide password before sending response
		const { password: _, ...userData } = user._doc;

		const cookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		};
		if (rememberMe) {
			// 30 days
			cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000;
		}
		// else no maxAge → session cookie

		res.status(200).cookie("access_token", token, cookieOptions).json(userData);
	} catch (error) {
		next(error);
	}
};

export const signout = (req, res, next) => {
	try {
		res
			.clearCookie("access_token")
			.status(200)
			.json("User has been signed out");
	} catch (error) {
		next(error);
	}
};
