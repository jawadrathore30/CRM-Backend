import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
	{
		clientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Client",
			required: true,
		},

		title: {
			type: String,
			required: true,
			trim: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},

		description: {
			type: String,
			trim: true,
		},
		tags: {
			type: [String], // Array of strings
			default: [],
		},

		category: {
			type: String,
			trim: true,
		},
		assignedTo: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Team",
			},
		],
		manager: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Team",
		},

		progress: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
		status: {
			enum: ["not started", "in progress", "completed", "on hold", "cancelled"],
			type: String,
			default: "not started",
		},

		projectBilling: {
			BillingAmount: {
				type: Number,
			},
			BilllingType: {
				type: String,
				enum: ["hourly", "fixed"],
				default: "hourly",
			},
			EstimatedHours: {
				type: Number,
			},
			EstimatedCost: {
				type: Number,
			},
		},

		keywords: {
			type: [String], // Array of strings
			default: [],
		},
		comments: {
			type: String,
			trim: true,
		},

		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Team",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
