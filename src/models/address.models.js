import mongoose,{Schema} from "mongoose"

const addressSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    name: {
        type: String,
        required: true,
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: true,
        trim: true,
      },
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      postalCode: {
        type: String,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        required: true,
        trim: true,
      },
      isDefault: {
        type: Boolean,
        default: false,
      },
},{timestamps:true})

export const Address = mongoose.model("Address",addressSchema);