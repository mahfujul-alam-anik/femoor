import mongoose, { Schema } from 'mongoose';

const schema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', index: true },
    fromStatus: String,
    toStatus: String,
    source: { type: String, enum: ['manual', 'steadfast', 'system'], default: 'manual' },
    actorId: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.models.OrderStatusHistory || mongoose.model('OrderStatusHistory', schema);
