import { apiRequest } from './client';

const STATUS_META = {
  pending: { label: 'Pendiente', statusColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  active: { label: 'En curso', statusColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  completed: { label: 'Completado', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

const CATEGORY_NAMES = {
  coche: 'Averías del coche',
  hogar: 'Problemas en el hogar',
  salud: 'Salud',
  tecnologia: 'Tecnología',
};

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

function toViewModel(row) {
  const statusMeta = STATUS_META[row.status] ?? STATUS_META.pending;

  return {
    id: row.id,
    rawStatus: row.status,
    hasReview: row.hasReview,
    category: row.professional.categorySlug,
    categoryName: CATEGORY_NAMES[row.professional.categorySlug] ?? row.professional.categorySlug,
    professional: row.professional.name,
    service: row.professional.role ?? 'Servicio de asistencia',
    date: formatDate(row.created_at),
    status: statusMeta.label,
    statusColor: statusMeta.statusColor,
    cost: row.total_cost != null ? `$${Number(row.total_cost).toFixed(2)}` : 'Por confirmar',
    paymentMethod: row.paymentMethod,
    notes: `Solicitud atendida por ${row.professional.name}.`,
  };
}

export async function createServiceRequest({ proId, token }) {
  return apiRequest('/service-requests', { method: 'POST', body: { pro_id: proId }, token });
}

export async function fetchMyServiceRequests(token) {
  const rows = await apiRequest('/service-requests', { token });
  return rows.map(toViewModel);
}

// Backend returns the raw (non-joined) row here; callers should refetch
// fetchMyServiceRequests afterwards to get the display-ready shape.
export async function payServiceRequest(requestId, { paymentMethodLabel } = {}, token) {
  return apiRequest(`/service-requests/${encodeURIComponent(requestId)}/pay`, {
    method: 'PATCH',
    body: { paymentMethodLabel },
    token,
  });
}
