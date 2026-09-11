import { NextResponse, type NextRequest } from 'next/server';
import { approvePayment } from '@/modules/payments/pi/u2a/service';

export async function POST(req: NextRequest) {
  console.log('=================================');
  console.log('➡️ /api/v1/payments/pi/approve APPELÉ');
  console.log('=================================');

  try {
    const body = await req.json();
    const paymentId = body?.paymentId;

    console.log('➡️ paymentId reçu :', paymentId);

    if (!paymentId || typeof paymentId !== 'string') {
      console.error('❌ paymentId manquant');

      return NextResponse.json(
        { error: 'paymentId is required.' },
        { status: 400 },
      );
    }

    console.log('➡️ Appel Pi API approve...');

    const result = await approvePayment(paymentId);

    console.log('✅ Pi API approve réussi :', result);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('❌ Pi payment approval error:', error);

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
