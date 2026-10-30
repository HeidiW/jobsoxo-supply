import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-3 text-lg text-steel">
        We couldn&apos;t find what you were looking for.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block bg-safety px-5 py-3 font-semibold text-ink transition-colors hover:bg-safety-dark"
      >
        Back to home
      </Link>
    </div>
  );
}
