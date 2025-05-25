import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
	{
		// userId: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: "User",
		// 	required: true,
		// },

		name: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},

		image: {
			type: String,
		},
		status: {
			type: String,
			enum: ["active", "suspended"],
			default: "active",
		},

		description: {
			type: String,
			trim: true,
		},
		tags: {
			type: [String], // Array of strings
			default: [],
		},

		billingAddress: {
			street: { type: String, trim: true },
			city: { type: String, trim: true },
			state: { type: String, trim: true },
			zipCode: { type: String, trim: true },
			country: { type: String, trim: true },
			telephone: { type: String, trim: true },
			website: { type: String, trim: true },
			vatNumber: { type: String, trim: true },
		},
		shippingAddress: {
			street: { type: String, trim: true },
			city: { type: String, trim: true },
			state: { type: String, trim: true },
			zipCode: { type: String, trim: true },
			country: { type: String, trim: true },
			telephone: { type: String, trim: true },
		},

		comments: {
			type: String,
			trim: true,
		},
		projectType: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

const Company = mongoose.model("Company", companySchema);

export default Company;
