import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema(
  {
    customer: {
      fullName: String,
      phone: { type: String, index: true },
      alternativePhone: String,
      email: String,
      address: String,
      district: { type: String, index: true },
      thana: String
    },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    quantity: Number,
    itemDescription: String,
    note: String,
    weightKg: Number,
    exchange: { type: Boolean, default: false },
    exactPrice: Number,
    sellingPrice: Number,
    totalPrice: Number,
    deliveryCost: Number,
    status: { type: String, enum: ['pending', 'processing', 'delivered', 'returned', 'partial', 'cancelled'], default: 'pending', index: true },
    pushToSteadfast: Boolean,
    steadfastTrackingId: { type: String, index: true },
    steadfastPayload: Schema.Types.Mixed
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
