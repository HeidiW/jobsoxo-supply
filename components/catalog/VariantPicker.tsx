import Link from "next/link";
import type { VariantOption } from "@/catalog";

interface VariantPickerProps {
  options: VariantOption[];
  currentId: string;
}

export function VariantPicker({ options, currentId }: VariantPickerProps) {
  return (
    <nav aria-label="Available sizes">
      <p className="font-semibold">Size</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const isCurrent = option.id === currentId;

          return (
            <li key={option.id}>
              <Link
                href={`/product/${option.slug}`}
                aria-current={isCurrent ? "page" : undefined}
                className={`block border px-3 py-2 font-medium transition-colors ${
                  isCurrent
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white hover:border-safety"
                }`}
              >
                {option.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
