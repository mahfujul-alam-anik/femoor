import mongoose, { Schema } from 'mongoose';

const schema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    action: String,
    entityType: String,
    entityId: String,
    payload: Schema.Types.Mixed
  },
  { timestamps: true }
);

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', schema);
