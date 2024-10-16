import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  price: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  sold: {
    type: Boolean,
    required: true,
  },

  dateOfSale: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("Transaction", TransactionSchema);
