import mongoose, { Schema } from 'mongoose';

const schema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', index: true },
    action: String,
    success: Boolean,
    request: Schema.Types.Mixed,
    response: Schema.Types.Mixed,
    error: String,
    retries: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.CourierLog || mongoose.model('CourierLog', schema);
