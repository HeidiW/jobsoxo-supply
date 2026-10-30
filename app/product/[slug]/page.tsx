import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getProductBySlug,
  getProducts,
  getVariantOptions,
} from "@/catalog";
import { AddToCart } from "@/components/cart/AddToCart";
import { CatalogImage } from "@/components/catalog/CatalogImage";
import { ProductPrice } from "@/components/catalog/ProductPrice";
import { SpecsTable } from "@/components/catalog/SpecsTable";
import { VariantPicker } from "@/components/catalog/VariantPicker";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.custom.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  return product
    ? { title: product.title, description: product.custom.short_description }
    : {};
}

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = getCategoryBySlug(product.custom.category_slug);
  const variantOptions = getVariantOptions(product);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-steel">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        {category && (
          <>
            <Link
              href={`/products/${category.slug}`}
              className="hover:underline"
            >
              {category.name}
            </Link>
            <span aria-hidden="true"> / </span>
          </>
        )}
        <span aria-current="page">{product.title}</span>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-12">
        <div>
          <CatalogImage
            src={product.image_link}
            alt={product.title}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          {product.additional_image_link && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.additional_image_link.map((image, index) => (
                <CatalogImage
                  key={image}
                  src={image}
                  alt={`${product.title}, additional view ${index + 1}`}
                  sizes="(min-width: 768px) 12vw, 25vw"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h1 className="font-display text-4xl font-bold uppercase tracking-wide sm:text-5xl">
              {product.title}
            </h1>
            <p className="mt-1 text-sm text-steel">SKU {product.id}</p>
          </div>
          <ProductPrice product={product} />
          {variantOptions.length > 1 && (
            <VariantPicker options={variantOptions} currentId={product.id} />
          )}
          <AddToCart
            key={product.id}
            productId={product.id}
            inventory={product.inventory}
          />
          <p className="text-lg">{product.description}</p>
          <section aria-labelledby="specs-heading">
            <h2
              id="specs-heading"
              className="font-display text-2xl font-bold uppercase tracking-wide"
            >
              Specifications
            </h2>
            <div className="mt-2">
              <SpecsTable specs={product.custom.specs} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
