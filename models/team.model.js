import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		role: {
			type: String,
			enum: ["admin", "coadmin", "management", "accounting", "staff"],
			default: "user",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
