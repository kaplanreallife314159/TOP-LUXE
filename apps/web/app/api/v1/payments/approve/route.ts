import { NextResponse, type NextRequest } from 'next/server';
import { approvePayment } from '@/modules/payments/pi/u2a/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const paymentId = body?.paymentId;

    if (!paymentId || typeof paymentId !== 'string') {
      return NextResponse.json(
        { error: 'paymentId is required.' },
        { status: 400 },
      );
    }

    const result = await approvePayment(paymentId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Pi payment approval error:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Payment approval failed.',
      },
      { status: 500 },
    );
  }
}
