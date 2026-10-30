import { ImageResponse } from "next/og";
import {
  getCategories,
  getCategoryBySlug,
  getProductById,
  getProducts,
} from "@/catalog";
import { PlaceholderArt, type PlaceholderArtProps } from "@/lib/placeholder-art";

const IMAGE_SIZE = 1000;

export const dynamicParams = false;

export function generateStaticParams() {
  const imageUrls = [
    ...getProducts().flatMap((product) => [
      product.image_link,
      ...(product.additional_image_link ?? []),
    ]),
    ...getCategories().map((category) => category.image_link),
  ];

  return imageUrls
    .filter((url) => url.includes("/placeholder/"))
    .map((url) => ({ name: url.slice(url.lastIndexOf("/") + 1) }));
}

function resolveArtwork(name: string): PlaceholderArtProps | null {
  const categorySlug = /^category-(.+)\.png$/.exec(name)?.[1];
  if (categorySlug) {
    const category = getCategoryBySlug(categorySlug);
    return category
      ? { categorySlug: category.slug, categoryName: category.name }
      : null;
  }

  const [, productId, detail] = /^(.+?)(-detail)?\.png$/.exec(name) ?? [];
  const product = productId ? getProductById(productId) : undefined;
  if (!product) return null;

  const { category_slug: slug } = product.custom;
  return {
    categorySlug: slug,
    categoryName: getCategoryBySlug(slug)?.name ?? slug,
    label: detail ? `${product.title} (detail)` : product.title,
  };
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/placeholder/[name]">,
) {
  const { name } = await params;
  const artwork = resolveArtwork(name);

  if (!artwork) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(<PlaceholderArt {...artwork} />, {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  });
}
