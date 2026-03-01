import { notFound } from 'next/navigation';
import { productApi } from '@/lib/api';
import ProductDetail from '@/components/product/ProductDetail';

interface Params {
  slug: string;
}

export default async function ProductPage({ params }: { params: Params }) {
  try {
    const res = await productApi.getBySlug(params.slug);
    const product = res.data.data;
    return <ProductDetail product={product} />;
  } catch (err) {
    // if the product lookup fails we'll fall back to 404
    return notFound();
  }
}

// revalidate this page every minute
export const revalidate = 60;

// generate static params so that Next.js knows about existing slugs during build
export async function generateStaticParams() {
  try {
    const res = await productApi.getAll({ limit: 1000 });
    return res.data.data.map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}
