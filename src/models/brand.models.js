import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  logo: {
    type: String,
    required: true,
  },
  productCount: {
    type: Number,
    required: true,
  },
  topProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }
  ],
}, { timestamps: true });

export const Brand = mongoose.model("Brand", brandSchema);