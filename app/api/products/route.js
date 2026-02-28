import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Product from '@/lib/models/Product';
import { productSchema } from '@/lib/validators/product';
import { requireRole } from '@/lib/auth/guards';

export async function GET(request) {
  const auth = await requireAuthOrRole();
  if (auth.error) return auth.error;
  await connectDB();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const products = await Product.find({ name: { $regex: q, $options: 'i' } }).sort({ createdAt: -1 }).limit(100).lean();
  return NextResponse.json(products);
}

async function requireAuthOrRole() {
  return requireRole(['super_admin', 'moderator']);
}

export async function POST(req) {
  const auth = await requireRole(['super_admin', 'moderator']);
  if (auth.error) return auth.error;
  await connectDB();
  const input = await req.json();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });
  const product = await Product.create(parsed.data);
  return NextResponse.json(product, { status: 201 });
}

export async function PATCH(req) {
  const auth = await requireRole(['super_admin', 'moderator']);
  if (auth.error) return auth.error;
  await connectDB();
  const { id, ...rest } = await req.json();
  const parsed = productSchema.partial().safeParse(rest);
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });
  const updated = await Product.findByIdAndUpdate(id, parsed.data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req) {
  const auth = await requireRole(['super_admin']);
  if (auth.error) return auth.error;
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
