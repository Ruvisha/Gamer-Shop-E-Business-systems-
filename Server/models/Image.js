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
      required: true
    },
    originalUrl: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export const ImageModel = mongoose.model("Image", imageSchema);
