import Link from "next/link";
import type { Category } from "@/catalog";
import { CatalogImage } from "./CatalogImage";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/products/${category.slug}`}
      className="group flex flex-col border border-line bg-white transition-colors hover:border-safety"
    >
      <CatalogImage
        src={category.image_link}
        alt={category.name}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-2xl font-bold uppercase tracking-wide">
          {category.name}
        </h3>
        <p className="mt-1 flex-1 text-steel">{category.description}</p>
        <span className="mt-3 font-semibold group-hover:underline">
          Shop {category.name.toLowerCase()}
        </span>
      </div>
    </Link>
  );
}
