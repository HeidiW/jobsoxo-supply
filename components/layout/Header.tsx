import Link from "next/link";
import { getCategories } from "@/catalog";
import { CartIcon } from "./CartIcon";
import { Logo } from "./Logo";

export function Header() {
  const categories = getCategories();

  return (
    <header className="sticky top-0 z-40 bg-ink">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-8 px-4 py-2 sm:px-6">
        <Logo />
        <nav
          aria-label="Categories"
          className="order-last -mx-4 w-screen border-t border-graphite px-4 sm:mx-0 sm:w-auto sm:flex-1 sm:order-none sm:border-0 sm:px-0"
        >
          <ul className="flex justify-between gap-1 sm:justify-start sm:gap-6">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/products/${category.slug}`}
                  className="block py-2.5 text-sm font-medium text-white/85 transition-colors hover:text-safety sm:text-base"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <CartIcon />
      </div>
    </header>
  );
}
