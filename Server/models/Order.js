import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userEmail: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      default: "Gamer Customer"
    },
    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        brand: String,
        image: String
      }
    ],
    amountLKR: {
      type: Number,
      required: true
    },
    amountUSD: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: "LKR"
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING_PAYMENT", "PAID", "FAILED", "CANCELLED"],
      default: "PENDING_PAYMENT"
    },
    adminApprovalStatus: {
      type: String,
      enum: ["PENDING_APPROVAL", "APPROVED", "REJECTED", "DISPATCHED"],
      default: "PENDING_APPROVAL"
    },
    paymentMethod: {
      type: String,
      default: "Online Card Payment (PayHere)"
    },
    payherePaymentId: {
      type: String,
      default: ""
    },
    deliveryDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      primaryPhone: { type: String, required: true },
      whatsappPhone: { type: String, default: "" },
      district: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      country: { type: String, default: "Sri Lanka" }
    }
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.model("Order", orderSchema);
