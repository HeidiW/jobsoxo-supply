import Image from "next/image";
import { toSitePath } from "@/catalog";

interface CatalogImageProps {
  src: string;
  alt: string;
  sizes: string;
}

export function CatalogImage({ src, alt, sizes }: CatalogImageProps) {
  const path = toSitePath(src);

  return (
    <div className="relative aspect-square overflow-hidden bg-line">
      <Image
        src={path}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        unoptimized={path.startsWith("http")}
      />
    </div>
  );
}
