import { NextResponse, type NextRequest } from 'next/server';
import { completePayment } from '@/modules/payments/pi/u2a/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const paymentId = body?.paymentId;
    const txid = body?.txid;

    if (!paymentId || typeof paymentId !== 'string') {
      return NextResponse.json(
        { error: 'paymentId is required.' },
        { status: 400 },
      );
    }

    if (!txid || typeof txid !== 'string') {
      return NextResponse.json(
        { error: 'txid is required.' },
        { status: 400 },
      );
    }

    const result = await completePayment(paymentId, txid);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Pi payment completion error:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Payment completion failed.',
      },
      { status: 500 },
    );
  }
}
