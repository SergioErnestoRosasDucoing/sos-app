import { apiRequest } from './client';
import { formatTimeAgo } from '../utils/time';

// Reshapes the backend's snake_case, nested professional payload into the
// flat camelCase view-model the existing components already expect
// (ProfessionalsView, ProfessionalDetailView, MessagesView, InteractiveMap).
// `distanceKm` is NOT computed here — it depends on the user's live
// location (see useGeolocation), which this module has no access to; the
// caller computes it from the `lat`/`lng` this view-model still exposes.
function toViewModel(p) {
  return {
    id: p.id,
    category: p.category.slug,
    name: p.name,
    role: p.role,
    specialtyBadge: p.specialty,
    isFast: p.is_fast,
    isVerified: p.is_verified,
    rating: p.rating,
    reviewsCount: p.reviews.length,
    baseVisitPrice: p.base_visit_price,
    hourlyRate: p.price_per_hour,
    experienceYears: p.experience_years,
    avatar: p.avatar_url,
    coverImage: p.cover_image_url,
    lat: p.lat,
    lng: p.lng,
    company: {
      name: p.company.name,
      description: p.company.description,
      logo: p.company.logo_url,
    },
    workingHours: p.working_hours,
    sosSupport: p.sos_support,
    specialties: p.specialties,
    bio: p.bio,
    location: {
      address: p.address,
      city: p.city,
    },
    reviews: p.reviews.map((r) => ({
      id: r.id,
      author: r.author,
      initials: r.initials,
      timeAgo: formatTimeAgo(r.created_at),
      rating: r.rating,
      comment: r.comment,
    })),
  };
}

export async function fetchProfessionals({ categorySlug } = {}) {
  const query = categorySlug && categorySlug !== 'all' ? `?category_slug=${encodeURIComponent(categorySlug)}` : '';
  const rows = await apiRequest(`/professionals${query}`);
  return rows.map(toViewModel);
}

export async function fetchProfessionalById(id) {
  const row = await apiRequest(`/professionals/${encodeURIComponent(id)}`);
  return toViewModel(row);
}
