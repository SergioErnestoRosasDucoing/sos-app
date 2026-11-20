import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  FileText,
  Star,
  ChevronRight,
  ArrowRight,
  Car,
  Home,
  HeartPulse,
  Laptop,
  Download,
  Loader2,
  CreditCard,
  MessageSquarePlus
} from 'lucide-react';
import { fetchMyServiceRequests } from '../api/serviceRequests';
import { createReview } from '../api/reviews';
import { ApiError } from '../api/client';
import CheckoutModal from '../components/CheckoutModal';

function ReviewForm({ requestId, token, onSubmitted, onCancel }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setError(null);
    setIsSubmitting(true);

    try {
      await createReview(requestId, { rating, comment }, token);
      onSubmitted();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo enviar la reseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`${n} estrellas`}
            className="p-0.5"
          >
            <Star className={`w-5 h-5 ${n <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
          </button>
        ))}
      </div>
      <textarea
        required
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Cuéntanos cómo te fue con el servicio..."
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium resize-none focus:bg-white focus:border-blue-500 outline-none"
      />
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold text-xs transition-colors"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3.5 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100 font-bold text-xs transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function HistoryView({ token, onReorderService }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payingRequest, setPayingRequest] = useState(null);
  const [reviewingId, setReviewingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchMyServiceRequests(token)
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'No se pudo cargar el historial.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handlePaid = () => {
    setPayingRequest(null);
    fetchMyServiceRequests(token).then(setItems).catch(() => {});
  };

  const handleReviewed = (requestId) => {
    setReviewingId(null);
    setItems((prev) => prev.map((item) => (item.id === requestId ? { ...item, hasReview: true } : item)));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'coche': return Car;
      case 'hogar': return Home;
      case 'salud': return HeartPulse;
      case 'tecnologia': return Laptop;
      default: return Clock;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fadeIn">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Historial de Solicitudes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registro de servicios de emergencia atendidos y comprobantes emitidos.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-sm font-medium">Cargando historial...</p>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center my-6">
          <p className="text-rose-700 font-medium mb-1">No se pudo cargar el historial.</p>
          <p className="text-rose-500 text-sm">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && items.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center my-6">
          <p className="text-slate-600 font-medium">Aún no tienes solicitudes registradas.</p>
        </div>
      )}

      {/* History Items List */}
      {!isLoading && !error && items.length > 0 && (
      <div className="space-y-4">
        {items.map((item) => {
          const Icon = getCategoryIcon(item.category);

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                        {item.service}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Atendido por <strong>{item.professional}</strong> • {item.date}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                  <span className="text-base sm:text-lg font-extrabold text-slate-900">
                    {item.cost}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${item.statusColor}`}>
                    <CheckCircle2 className="w-3 h-3" />
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Details & Actions */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                <p className="text-slate-600 font-medium">
                  {item.notes}
                </p>

                <div className="flex items-center gap-2 shrink-0">
                  {item.rawStatus !== 'completed' && (
                    <button
                      onClick={() => setPayingRequest(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 text-xs transition-colors"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pagar</span>
                    </button>
                  )}

                  <button
                    onClick={() => alert(`Descargando comprobante fiscal para la orden ${item.id}...`)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 text-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Factura</span>
                  </button>

                  {item.rawStatus === 'completed' && !item.hasReview && reviewingId !== item.id && (
                    <button
                      onClick={() => setReviewingId(item.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold flex items-center gap-1.5 text-xs transition-colors"
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5" />
                      <span>Dejar reseña</span>
                    </button>
                  )}

                  <button
                    onClick={() => onReorderService(item.category)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold flex items-center gap-1 text-xs transition-colors"
                  >
                    <span>Solicitar de nuevo</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {reviewingId === item.id && (
                <ReviewForm
                  requestId={item.id}
                  token={token}
                  onSubmitted={() => handleReviewed(item.id)}
                  onCancel={() => setReviewingId(null)}
                />
              )}
            </div>
          );
        })}
      </div>
      )}

      {payingRequest && (
        <CheckoutModal
          requestId={payingRequest.id}
          professionalName={payingRequest.professional}
          token={token}
          onClose={() => setPayingRequest(null)}
          onPaid={handlePaid}
        />
      )}

    </div>
  );
}
