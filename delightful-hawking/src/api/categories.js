import { apiRequest } from './client';
import { CATEGORY_DISPLAY_META, DEFAULT_CATEGORY_META } from '../data/categoryDisplayMeta';

// Merges the real category rows from the backend (id/slug, source of truth)
// with local presentation metadata (copy, icons, colors). `id` here stays
// the slug (e.g. 'coche') since the rest of the app — triage, action plans —
// is keyed by that slug, not the database UUID.
export async function fetchCategories() {
  const rows = await apiRequest('/categories');

  return rows.map((row) => ({
    id: row.name,
    dbId: row.id,
    ...(CATEGORY_DISPLAY_META[row.name] ?? DEFAULT_CATEGORY_META),
  }));
}
