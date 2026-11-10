import { getStripe } from '@/lib/stripe';
import { authenticateMerchant } from '@/lib/merchant';

// The store's own check on one of its payments. It never takes a webhook's or a redirect's word for the
// outcome: it asks here for the real, current state straight from Stripe. Only the store that created a
// payment can read it.
export async function POST(req: Request) {
  const merchant = authenticateMerchant(req);
  if (!merchant) return new Response('Unauthorized', { status: 401 });

  try {
    const { paymentIntentId } = (await req.json()) || {};
    if (!paymentIntentId || typeof paymentIntentId !== 'string') {
      return new Response('Missing paymentIntentId', { status: 400 });
    }

    const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId, { expand: ['latest_charge'] });

    if (paymentIntent.metadata?.merchantId !== merchant.id) return new Response('Not found', { status: 404 });

    // Refund state lives on the charge.
    const charge =
      paymentIntent.latest_charge && typeof paymentIntent.latest_charge === 'object' ? paymentIntent.latest_charge : null;

    return Response.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
      amountRefunded: charge?.amount_refunded ?? 0,
    });
  } catch (error: unknown) {
    // A reference Stripe has never heard of is "not found", not a server fault (the store treats the two differently).
    if (typeof error === 'object' && error !== null && (error as { code?: string }).code === 'resource_missing') {
      return new Response('Not found', { status: 404 });
    }
    console.error('payprimetime payments/status error:', error);
    return new Response(error instanceof Error ? error.message : 'Failed to retrieve payment status', { status: 500 });
  }
}
