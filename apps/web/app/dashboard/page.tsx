'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [status, setStatus] = useState('');

  const handlePayment = async () => {
    setStatus('Préparation du paiement...');

    if (!window.Pi) {
      setStatus('Pi SDK non disponible. Ouvre TopLuxe dans Pi Browser.');
      return;
    }

    try {
      await window.Pi.init({ version: '2.0' });
const auth = await window.Pi.authenticate(
  ['username', 'payments'],
  (payment) => {
    console.warn('PAIEMENT INCOMPLET DÉTECTÉ :', payment);

    setStatus(
      `Paiement incomplet détecté : ${payment?.identifier || 'identifiant inconnu'}`
    );
  }
);

console.log('AUTH PI RÉUSSIE :', auth);

      const payment = await window.Pi.createPayment(
        {
          amount: 0.01,
          memo: 'Test paiement TopLuxe',
          metadata: {
            purpose: 'developer-checklist-test',
          },
        },
        {
         onReadyForServerApproval: async (paymentId: string) => {
  setStatus(`Approbation du paiement ${paymentId}...`);

  try {
    console.log('➡️ ENVOI APPROBATION :', paymentId);

    const response = await fetch('/api/v1/payments/pi/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentId }),
    });

    const data = await response.json().catch(() => null);

    console.log(
      '⬅️ RÉPONSE APPROBATION :',
      response.status,
      data
    );

    if (!response.ok) {
      throw new Error(
        `Approbation échouée (${response.status}) : ${
          data?.error || 'Erreur inconnue'
        }`
      );
    }

    setStatus('Paiement approuvé par le serveur. Attente de confirmation Pi...');

  } catch (error) {
    console.error('❌ ERREUR APPROBATION :', error);

    setStatus(
      error instanceof Error
        ? `Erreur approbation : ${error.message}`
        : `Erreur approbation : ${String(error)}`
    );

    throw error;
  }
},

          onReadyForServerCompletion: async (
            paymentId: string,
            txid: string
          ) => {
            setStatus('Finalisation du paiement...');

            try {
              console.log('➡️ ENVOI COMPLETION :', paymentId, txid);

              const response = await fetch('/api/v1/payments/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, txid }),
              });

              const data = await response.json().catch(() => null);

              console.log('⬅️ RÉPONSE COMPLETION :', response.status, data);

              if (!response.ok) {
                throw new Error(
                  `Complétion échouée (${response.status}) : ${data?.error || 'Erreur inconnue'}`
                );
              }

              setStatus('Paiement terminé.');
            } catch (error) {
              console.error('❌ ERREUR COMPLETION :', error);

              setStatus(
                error instanceof Error
                  ? `Erreur complétion : ${error.message}`
                  : `Erreur complétion : ${String(error)}`
              );

              throw error;
            }
          },

          onCancel: () => {
            setStatus('Paiement annulé.');
          },

          onError: (error: Error) => {
            console.error(error);
            setStatus('Erreur pendant le paiement.');
          },
        }
      );

      console.log('Payment:', payment);
    } catch (error) {
  console.error('Erreur paiement TopLuxe:', error);

  setStatus(
    error instanceof Error
      ? `Erreur Pi : ${error.message}`
      : `Erreur Pi : ${String(error)}`
  );
}
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>TopLuxe — Tableau de bord</h1>

      <p>Connexion Pi réussie.</p>

      <button
        onClick={handlePayment}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#6C63FF',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Tester un paiement de 0,01 Pi
      </button>

      {status && (
        <p style={{ marginTop: '1rem' }}>
          {status}
        </p>
      )}
    </main>
  );
}
