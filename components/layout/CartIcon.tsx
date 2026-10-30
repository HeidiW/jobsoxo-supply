import Link from "next/link";

export function CartIcon() {
  const count = 0;

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} items`}
      className="relative flex size-11 items-center justify-center text-white transition-colors hover:text-safety"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 4h2.5l2.2 11h10.6l2-8H6.3" />
        <circle cx="9.5" cy="19.5" r="1.5" />
        <circle cx="16.5" cy="19.5" r="1.5" />
      </svg>
      <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-safety px-1 text-xs font-semibold text-ink">
        {count}
      </span>
    </Link>
  );
}
