import { Review } from './Review';

export interface Professional {
  id: string;
  name: string;
  role: string | null;
  specialty: string | null;
  rating: number;
  lat: number | null;
  lng: number | null;
  price_per_hour: number;
  base_visit_price: number;
  is_fast: boolean;
  is_verified: boolean;
  experience_years: number | null;
  avatar_url: string | null;
  cover_image_url: string | null;
  company_name: string | null;
  company_description: string | null;
  company_logo_url: string | null;
  working_hours: string | null;
  sos_support: string | null;
  specialties: string[];
  bio: string | null;
  address: string | null;
  city: string | null;
  category_id: string;
  created_at: Date;
  updated_at: Date;
}

// Row shape returned by the JOIN + reviews aggregation in getProfessionals.
export interface ProfessionalWithCategoryRow
  extends Omit<
    Professional,
    'category_id' | 'company_name' | 'company_description' | 'company_logo_url'
  > {
  category_id: string;
  category_name: string;
  category_slug: string;
  company_name: string | null;
  company_description: string | null;
  company_logo_url: string | null;
  reviews: Review[];
}

export interface ProfessionalWithCategory {
  id: string;
  name: string;
  role: string | null;
  specialty: string | null;
  rating: number;
  lat: number | null;
  lng: number | null;
  price_per_hour: number;
  base_visit_price: number;
  is_fast: boolean;
  is_verified: boolean;
  experience_years: number | null;
  avatar_url: string | null;
  cover_image_url: string | null;
  working_hours: string | null;
  sos_support: string | null;
  specialties: string[];
  bio: string | null;
  address: string | null;
  city: string | null;
  created_at: Date;
  updated_at: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  company: {
    name: string | null;
    description: string | null;
    logo_url: string | null;
  };
  reviews: Review[];
}

export function toProfessionalWithCategory(row: ProfessionalWithCategoryRow): ProfessionalWithCategory {
  const {
    category_id,
    category_name,
    category_slug,
    company_name,
    company_description,
    company_logo_url,
    ...rest
  } = row;

  return {
    ...rest,
    category: { id: category_id, name: category_name, slug: category_slug },
    company: { name: company_name, description: company_description, logo_url: company_logo_url },
  };
}
