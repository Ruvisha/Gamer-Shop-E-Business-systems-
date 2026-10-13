import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      default: "Gamer Customer"
    },
    userEmail: {
      type: String,
      default: ""
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      default: "Great product!"
    },
    comment: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      default: "Generic"
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    originalPrice: {
      type: Number
    },
    rating: {
      type: Number,
      default: 5.0
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    reviews: [reviewSchema],
    stock: {
      type: Number,
      default: 10
    },
    wattage: {
      type: Number,
      default: 0
    },
    isFlashSale: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: ""
    },
    specs: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    image: {
      type: mongoose.Schema.Types.Mixed,
      default: ""
    },
    fallbackImage: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

export const Product = mongoose.model("Product", productSchema);
