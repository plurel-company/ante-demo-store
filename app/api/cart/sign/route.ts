import { createCartSignature } from "@splitante/sdk/signing";
import type { Cart } from "@splitante/sdk";

export async function POST(req: Request) {
  const signingSecret = process.env.ANTE_SIGNING_SECRET;
  if (!signingSecret) {
    return Response.json({ error: "ANTE_SIGNING_SECRET is not configured" }, { status: 500 });
  }

  let body: { cart?: Cart };
  try {
    body = (await req.json()) as { cart?: Cart };
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { cart } = body;
  if (!cart?.total || !cart.currency || !Array.isArray(cart.items) || cart.items.length === 0) {
    return Response.json({ error: "Invalid cart" }, { status: 400 });
  }

  const signature = createCartSignature(cart, signingSecret);
  return Response.json({ signature });
}
