import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0.0,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    }
  ],
  categories: [
    {
      type: String,
      required: true,
    }
  ],
  stock: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0.0,
  },
  reviews: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      }
  ],
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);