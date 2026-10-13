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
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    originalUrl: {
      type: String,
      default: ""
    },
    filePath: {
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

