import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    imageId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    filename: {
      type: String,
      default: "product-image.jpg"
    },
    contentType: {
      type: String,
      default: "image/jpeg"
    },
    data: {
      type: Buffer,
      default: null
    },
    fileSize: {
      type: Number,
      default: 0
    },
    originalPath: {
      type: String,
      default: ""
    },
    originalUrl: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

export const ImageModel = mongoose.model("Image", imageSchema);

