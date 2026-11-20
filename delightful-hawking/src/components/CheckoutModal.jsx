import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck } from 'lucide-react';
import { payServiceRequest } from '../api/serviceRequests';
import { ApiError } from '../api/client';

function formatCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function CheckoutModal({ requestId, professionalName, token, onClose, onPaid }) {
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/29');
  const [cvc, setCvc] = useState('123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const last4 = cardNumber.replace(/\D/g, '').slice(-4) || '4242';
      await payServiceRequest(requestId, { paymentMethodLabel: `Tarjeta •••• ${last4}` }, token);
      onPaid();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo procesar el pago. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Pagar servicio</h2>
            <p className="text-xs text-slate-500">{professionalName}</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs text-amber-800 font-medium mb-5">
          Pago de prueba — no se realiza ningún cargo real.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Número de tarjeta
            </label>
            <input
              type="text"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="4242 4242 4242 4242"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Expira
              </label>
              <input
                type="text"
                required
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/AA"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                CVC
              </label>
              <input
                type="text"
                required
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Procesando...' : 'Confirmar pago'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
