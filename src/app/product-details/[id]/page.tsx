import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/common/Header';
import ProductImageGallery from '../components/ProductImageGallery';
import ProductInfo from '../components/ProductInfo';
import ProductDescription from '../components/ProductDescription';
import { createServerSupabaseClient } from '@/lib/supabase-server';

type Product = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  brand?: string;
  category?: string;
  specifications?: Record<string, unknown>;
};

async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Product;
}

function buildJsonLd(product: Product) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://abc-store.example.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? product.name,
    image: product.image_url,
    brand: {
      '@type': 'Brand',
      name: product.brand ?? 'ABC Informatique',
    },
    category: product.category ?? 'Electronics',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'DZD',
      price: product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${siteUrl}/product-details/${product.id}`,
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Produit introuvable | ABC Informatique',
    };
  }

  const description = product.description?.slice(0, 160) ?? product.name;

  return {
    title: `${product.name} | ABC Informatique`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image_url ? [product.image_url] : [],
      type: 'website',
      locale: 'fr_DZ',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const jsonLd = buildJsonLd(product);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header cartItemCount={0} isAuthenticated={true} />

      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImageGallery
            images={[product.image_url]}
            productName={product.name}
          />

          <ProductInfo
            id={product.id}
            name={product.name}
            price={product.price}
            rating={4.5}
            reviewCount={12}
            stockStatus={product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            description={product.description}
          />
        </div>

        <div className="mt-16">
          <ProductDescription
            description={product.description}
            specifications={product.specifications || {}}
          />
        </div>
      </main>
    </div>
  );
}
