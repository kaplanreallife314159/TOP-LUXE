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
            setStatus('Paiement en attente d’approbation...');
            await fetch('/api/v1/payments/pi/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId }),
            });
          },

          onReadyForServerCompletion: async (
            paymentId: string,
            txid: string
          ) => {
            setStatus('Finalisation du paiement...');

            await fetch('/api/v1/payments/pi/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid }),
            });

            setStatus('Paiement terminé.');
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
      console.error(error);
      setStatus('Impossible de lancer le paiement.');
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
