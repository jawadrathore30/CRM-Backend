import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
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
			trim: true,
		},
		telephone: {
			type: String,
			trim: true,
		},

		title: {
			type: String,
			required: true,
			trim: true,
		},
		value: {
			type: Number,
			required: true,
		},
		assignedTo: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Team",
			},
		],
		status: {
			type: String,
			enum: [
				"new",
				"converted",
				"contacted",
				"qualified",
				"disqualified",
				"proposal",
				"lost",
			],
			default: "new",
			required: true,
		},

		image: {
			type: String,
		},

		notes: {
			type: String,
			trim: true,
		},
		source: {
			type: String,
			trim: true,
		},
		category: {
			type: String,
			trim: true,
		},
		tags: {
			type: [String], // Array of strings
			default: [],
		},
		lastContacted: {
			type: Date,
		},

		totalBudget: {
			type: Number,
		},
		targetDate: {
			type: Date,
		},
		contentType: {
			type: String,
		},
		brandName: {
			type: String,
		},

		company: {
			companyName: {
				type: String,
				trim: true,
			},
			street: {
				type: String,
				trim: true,
			},
			city: {
				type: String,
				trim: true,
			},
			state: {
				type: String,
				trim: true,
			},
			zipCode: {
				type: String,
				trim: true,
			},
			country: {
				type: String,
				trim: true,
			},
			website: {
				type: String,
				trim: true,
			},
			telephone: {
				type: String,
				trim: true,
			},
		},

		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
