import Link from "next/link";
import { getCategories } from "@/catalog";
import { CategoryCard } from "@/components/catalog/CategoryCard";

export default function Home() {
  const categories = getCategories();

  return (
    <>
      <section className="relative overflow-hidden bg-graphite text-white">
        <svg
          viewBox="0 0 400 400"
          className="absolute -right-24 -top-16 hidden size-[32rem] text-white/10 md:block"
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          aria-hidden="true"
        >
          <circle cx="400" cy="0" r="120" />
          <circle cx="400" cy="0" r="200" />
          <circle cx="400" cy="0" r="280" />
          <circle cx="400" cy="0" r="360" />
        </svg>
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="font-semibold uppercase tracking-widest text-safety">
            Plastering supply for the trade
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-5xl font-bold uppercase leading-none tracking-wide sm:text-7xl">
            Everything from first coat to final pass
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">
            Trowels, plaster, stilts, and jobsite accessories, picked for
            people who put plaster on walls every day.
          </p>
          <Link
            href="#categories"
            className="mt-8 inline-block bg-safety px-6 py-3 font-semibold text-ink transition-colors hover:bg-safety-dark"
          >
            Shop by category
          </Link>
        </div>
      </section>

      <section
        id="categories"
        aria-labelledby="categories-heading"
        className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 py-12 sm:px-6"
      >
        <h2
          id="categories-heading"
          className="font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl"
        >
          Shop by category
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>
    </>
  );
}
