const PI_API_BASE = 'https://api.minepi.com/v2';

function getPiApiKey(): string {
  const apiKey = process.env.PI_API_KEY;

  if (!apiKey) {
    throw new Error('PI_API_KEY is not configured.');
  }

  return apiKey;
}

export async function approvePayment(paymentId: string) {
  console.log('[PI APPROVE] paymentId reçu :', paymentId);

  const apiKey = getPiApiKey();

  console.log('[PI APPROVE] PI_API_KEY présente :', !!apiKey);
  console.log('[PI APPROVE] Appel API Pi en cours...');

  const response = await fetch(
    `${PI_API_BASE}/payments/${encodeURIComponent(paymentId)}/approve`,
    {
      method: 'POST',
      headers: {
        Authorization: `Key ${apiKey}`,
      },
      cache: 'no-store',
    },
  );

  const data = await response.json();

  console.log('[PI APPROVE] Réponse Pi status :', response.status);
  console.log('[PI APPROVE] Réponse Pi data :', data);

  if (!response.ok) {
    throw new Error(
      data?.error_message ||
        data?.message ||
        `Pi payment approval failed (${response.status}).`,
    );
  }

  console.log('[PI APPROVE] APPROBATION RÉUSSIE');

  return data;
}

export async function completePayment(paymentId: string, txid: string) {
  const response = await fetch(
    `${PI_API_BASE}/payments/${encodeURIComponent(paymentId)}/complete`,
    {
      method: 'POST',
      headers: {
        Authorization: `Key ${getPiApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txid }),
      cache: 'no-store',
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error_message ||
        data?.message ||
        `Pi payment completion failed (${response.status}).`,
    );
  }

  return data;
}
