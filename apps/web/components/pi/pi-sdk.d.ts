/**
 * Déclarations TypeScript pour le SDK Pi Network.
 *
 * TopLuxe utilise :
 * - Pi.init()
 * - Pi.authenticate()
 * - Pi.createPayment()
 * - les callbacks du flux de paiement U2A
 */

export interface PiUser {
  uid: string;
  username?: string;
}

export interface PiAuthResult {
  user: PiUser;
  accessToken: string;
}

export interface PiIncompletePayment {
  identifier: string;
  [key: string]: unknown;
}

export type PiScope =
  | 'username'
  | 'payments'
  | 'wallet_address';

export interface PiInitOptions {
  version: '2.0';
  sandbox?: boolean;
}

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata?: Record<string, unknown>;
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (
    paymentId: string,
  ) => void | Promise<void>;

  onReadyForServerCompletion: (
    paymentId: string,
    txid: string,
  ) => void | Promise<void>;

  onCancel: (
    paymentId: string,
  ) => void;

  onError: (
    error: Error,
    payment?: PiIncompletePayment,
  ) => void;
}

export interface PiPayment {
  identifier: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    Pi?: {
      init(
        options: PiInitOptions,
      ): Promise<void>;

      authenticate(
        scopes: PiScope[],
        onIncompletePaymentFound: (
          payment: PiIncompletePayment,
        ) => void,
      ): Promise<PiAuthResult>;

      createPayment(
        paymentData: PiPaymentData,
        callbacks: PiPaymentCallbacks,
      ): Promise<PiPayment>;
    };
  }
}
