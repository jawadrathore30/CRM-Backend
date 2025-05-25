import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			required: true,
		},
		owner: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Client = mongoose.model("Client", clientSchema);

export default Client;
