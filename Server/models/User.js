import mongoose from "mongoose";

const loginLogSchema = new mongoose.Schema(
  {
    loginTime: {
      type: Date,
      default: Date.now
    },
    ip: {
      type: String,
      default: "127.0.0.1"
    },
    userAgent: {
      type: String,
      default: "Browser Client"
    },
    success: {
      type: Boolean,
      default: true
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    loginLogs: [loginLogSchema]
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model("User", userSchema);
