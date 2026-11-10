import { getStore } from "@/server/store";
import { createGraphQLHandler } from "@/server/yoga";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const yoga = createGraphQLHandler(getStore);

export async function GET(request: Request) {
  return yoga.fetch(request);
}

export async function POST(request: Request) {
  return yoga.fetch(request);
}
