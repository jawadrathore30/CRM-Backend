import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
