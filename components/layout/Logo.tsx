import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 32 32"
        className="size-8 shrink-0"
        aria-hidden="true"
      >
        <rect width="32" height="32" fill="#2b3238" />
        <path d="M6 21 19 8h7v5L13 26H6z" fill="#f28c18" />
      </svg>
      <span className="font-display text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
        JobsOxo <span className="text-safety">Supply</span>
      </span>
    </Link>
  );
}
