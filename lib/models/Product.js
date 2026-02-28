import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    description: String,
    imageUrl: String,
    active: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);
