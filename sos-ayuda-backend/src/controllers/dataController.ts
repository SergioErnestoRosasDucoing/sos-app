import { Request, Response } from 'express';
import { pool } from '../db';
import { Category } from '../models/Category';
import { ProfessionalWithCategoryRow, toProfessionalWithCategory, ProfessionalWithCategory } from '../models/Professional';

interface ErrorResponseBody {
  error: string;
}

interface ProfessionalsQuery {
  category_slug?: string;
}

const PROFESSIONAL_SELECT_WITH_REVIEWS = `
  SELECT
    p.id, p.name, p.role, p.specialty, p.rating, p.lat, p.lng, p.price_per_hour, p.base_visit_price,
    p.is_fast, p.is_verified, p.experience_years, p.avatar_url, p.cover_image_url,
    p.company_name, p.company_description, p.company_logo_url, p.working_hours, p.sos_support,
    p.specialties, p.bio, p.address, p.city, p.created_at, p.updated_at,
    c.id AS category_id, c.name AS category_name, c.name AS category_slug,
    COALESCE(
      json_agg(
        json_build_object(
          'id', r.id, 'author', r.author, 'initials', r.initials,
          'rating', r.rating, 'comment', r.comment, 'created_at', r.created_at
        ) ORDER BY r.created_at DESC
      ) FILTER (WHERE r.id IS NOT NULL), '[]'
    ) AS reviews
  FROM professionals p
  JOIN categories c ON c.id = p.category_id
  LEFT JOIN professional_reviews r ON r.professional_id = p.id
`;

export async function getCategories(
  _req: Request,
  res: Response<Category[] | ErrorResponseBody>
): Promise<void> {
  try {
    const result = await pool.query<Category>('SELECT id, name FROM categories ORDER BY name ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('getCategories error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getProfessionals(
  req: Request<Record<string, never>, ProfessionalWithCategory[] | ErrorResponseBody, unknown, ProfessionalsQuery>,
  res: Response<ProfessionalWithCategory[] | ErrorResponseBody>
): Promise<void> {
  try {
    const { category_slug } = req.query;

    let queryText = PROFESSIONAL_SELECT_WITH_REVIEWS;
    const params: string[] = [];

    if (category_slug) {
      queryText += ' WHERE c.name = $1';
      params.push(category_slug);
    }

    queryText += ' GROUP BY p.id, c.id ORDER BY p.rating DESC, p.name ASC';

    const result = await pool.query<ProfessionalWithCategoryRow>(queryText, params);
    res.status(200).json(result.rows.map(toProfessionalWithCategory));
  } catch (err) {
    console.error('getProfessionals error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getProfessionalById(
  req: Request<{ id: string }, ProfessionalWithCategory | ErrorResponseBody>,
  res: Response<ProfessionalWithCategory | ErrorResponseBody>
): Promise<void> {
  try {
    const { id } = req.params;

    const result = await pool.query<ProfessionalWithCategoryRow>(
      `${PROFESSIONAL_SELECT_WITH_REVIEWS} WHERE p.id = $1 GROUP BY p.id, c.id`,
      [id]
    );

    const row = result.rows[0];
    if (!row) {
      res.status(404).json({ error: 'Professional not found' });
      return;
    }

    res.status(200).json(toProfessionalWithCategory(row));
  } catch (err) {
    console.error('getProfessionalById error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
