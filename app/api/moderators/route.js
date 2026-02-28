import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/connect';
import User from '@/lib/models/User';
import ActivityLog from '@/lib/models/ActivityLog';
import { requireRole } from '@/lib/auth/guards';

export async function GET() {
  const auth = await requireRole(['super_admin']);
  if (auth.error) return auth.error;
  await connectDB();
  const moderators = await User.find({ role: 'moderator' }).select('-passwordHash').lean();
  return NextResponse.json(moderators);
}

export async function POST(req) {
  const auth = await requireRole(['super_admin']);
  if (auth.error) return auth.error;
  await connectDB();
  const body = await req.json();
  const user = await User.create({
    name: body.name,
    email: body.email,
    passwordHash: await bcrypt.hash(body.password, 10),
    role: 'moderator',
    permissions: body.permissions || []
  });
  await ActivityLog.create({ actorId: auth.session.user.id, action: 'moderator.create', entityType: 'User', entityId: String(user._id), payload: { email: body.email } });
  return NextResponse.json(user, { status: 201 });
}

export async function PATCH(req) {
  const auth = await requireRole(['super_admin']);
  if (auth.error) return auth.error;
  await connectDB();
  const { id, ...rest } = await req.json();
  const user = await User.findByIdAndUpdate(id, rest, { new: true }).select('-passwordHash');
  return NextResponse.json(user);
}

export async function DELETE(req) {
  const auth = await requireRole(['super_admin']);
  if (auth.error) return auth.error;
  await connectDB();
  const { searchParams } = new URL(req.url);
  await User.findByIdAndDelete(searchParams.get('id'));
  return NextResponse.json({ success: true });
}
