import { getJsonFeed } from "@/catalog";

export const dynamic = "force-static";

export function GET() {
  return Response.json(getJsonFeed());
}
