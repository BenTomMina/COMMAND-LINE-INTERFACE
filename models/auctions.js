import mongoose from "mongoose";

// Auction Listings Schema
const auctionsSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  start_price: { type: Number, required: true, min: 1 },
  reserve_price: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return value >= this.start_price;
      },
      message: "Reserve price must be equal to or greater than the start_price",
    },
  },
});

// Define and export
export default mongoose.model("Auctions", auctionsSchema);
