import mongoose, { Schema } from 'mongoose';

const schema = new Schema(
  {
    adminEmail: String,
    steadfastApiKey: String,
    steadfastSecret: String,
    securityOptions: Schema.Types.Mixed
  },
  { timestamps: true }
);

export default mongoose.models.SystemSettings || mongoose.model('SystemSettings', schema);
