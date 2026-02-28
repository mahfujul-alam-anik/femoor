import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import SystemSettings from '@/lib/models/SystemSettings';
import { requireRole } from '@/lib/auth/guards';

export async function GET() {
  const auth = await requireRole(['super_admin']);
  if (auth.error) return auth.error;
  await connectDB();
  const settings = await SystemSettings.findOne().lean();
  return NextResponse.json(settings || {});
}

export async function PATCH(req) {
  const auth = await requireRole(['super_admin']);
  if (auth.error) return auth.error;
  await connectDB();
  const body = await req.json();
  const settings = await SystemSettings.findOneAndUpdate({}, body, { upsert: true, new: true });
  return NextResponse.json(settings);
}
