import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      }
  ],
}, { timestamps: true });

cartSchema.virtual('totalAmount').get(function() {
  return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

export const Cart = mongoose.model("Cart", cartSchema);