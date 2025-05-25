import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			select: false, // Important: prevent password from returning in queries
		},
		profilePicture: {
			type: String,
			default:
				"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
		},
		companyName: {
			type: String,
			trim: true,
		},
		telephone: {
			type: String,
			trim: true,
		},
		position: {
			type: String,
			trim: true,
		},
		timeZone: {
			type: String,
			default: "UTC±00:00",
			trim: true,
		},
		twitter: {
			type: String,
			trim: true,
		},
		facebook: {
			type: String,
			trim: true,
		},
		linkedin: {
			type: String,
			trim: true,
		},
		github: {
			type: String,
			trim: true,
		},
		dribble: {
			type: String,
			trim: true,
		},
		role: {
			type: String,
			enum: ["admin", "coadmin", "user"],
			default: "user",
			required: true,
		},
		passwordChanged: { type: Boolean, default: false }, // ← newly added
		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "active",
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

export default User;
