import { verifyWebhookSignature } from "@splitante/sdk/signing";

type AnteWebhookEvent = {
  id: string;
  type: string;
  created_at: string;
  data: Record<string, unknown>;
};

const fulfilledOrders = new Set<string>();

export async function POST(req: Request) {
  const webhookSecret = process.env.ANTE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return Response.json({ error: "ANTE_WEBHOOK_SECRET is not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signatureHeader = req.headers.get("ante-signature") ?? "";

  if (!verifyWebhookSignature(rawBody, webhookSecret, signatureHeader)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as AnteWebhookEvent;

  if (event.type === "group.funded") {
    const orderRef = typeof event.data.order_ref === "string" ? event.data.order_ref : "unknown";
    fulfilledOrders.add(orderRef);
    console.info("[ante webhook] group.funded", {
      orderRef,
      sessionId: event.data.session_id,
      total: event.data.total,
    });
  } else {
    console.info("[ante webhook]", event.type, event.data);
  }

  return Response.json({ received: true });
}

export async function GET() {
  return Response.json({
    message: "Ante webhook endpoint. POST signed events from the merchant dashboard.",
    fulfilledOrders: [...fulfilledOrders],
  });
}
