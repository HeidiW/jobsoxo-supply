import { getMetaCsvFeed } from "@/catalog";

export const dynamic = "force-static";

export function GET() {
  return new Response(getMetaCsvFeed(), {
    headers: { "Content-Type": "text/csv; charset=utf-8" },
  });
}
