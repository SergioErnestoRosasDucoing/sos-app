export interface ServiceRequest {
  id: string;
  user_id: string;
  pro_id: string;
  status: 'pending' | 'active' | 'completed';
  total_cost: number | null;
  payment_method: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceRequestWithProfessionalRow extends ServiceRequest {
  pro_name: string;
  pro_role: string | null;
  category_slug: string;
  has_review: boolean;
}

export interface ServiceRequestWithProfessional {
  id: string;
  status: 'pending' | 'active' | 'completed';
  total_cost: number | null;
  paymentMethod: string | null;
  hasReview: boolean;
  created_at: Date;
  updated_at: Date;
  professional: {
    id: string;
    name: string;
    role: string | null;
    categorySlug: string;
  };
}

export function toServiceRequestWithProfessional(row: ServiceRequestWithProfessionalRow): ServiceRequestWithProfessional {
  return {
    id: row.id,
    status: row.status,
    total_cost: row.total_cost,
    paymentMethod: row.payment_method,
    hasReview: row.has_review,
    created_at: row.created_at,
    updated_at: row.updated_at,
    professional: {
      id: row.pro_id,
      name: row.pro_name,
      role: row.pro_role,
      categorySlug: row.category_slug,
    },
  };
}
