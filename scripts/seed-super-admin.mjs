import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('MONGODB_URI is required');

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: { type: String, enum: ['super_admin', 'moderator'], default: 'moderator' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

const admin = {
  name: process.env.SEED_ADMIN_NAME || 'admin',
  email: process.env.SEED_ADMIN_EMAIL || 'admin@gmail.com',
  password: process.env.SEED_ADMIN_PASSWORD || '123456'
};

await mongoose.connect(MONGODB_URI, { dbName: 'femoor' });
const existing = await User.findOne({ email: admin.email });
if (existing) {
  existing.name = admin.name;
  existing.passwordHash = await bcrypt.hash(admin.password, 10);
  existing.role = 'super_admin';
  existing.active = true;
  await existing.save();
  console.log('Updated existing super admin:', admin.email);
} else {
  await User.create({
    name: admin.name,
    email: admin.email,
    passwordHash: await bcrypt.hash(admin.password, 10),
    role: 'super_admin',
    active: true
  });
  console.log('Created super admin:', admin.email);
}

await mongoose.disconnect();
