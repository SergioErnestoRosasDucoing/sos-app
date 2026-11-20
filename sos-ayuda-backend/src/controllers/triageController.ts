import { Request, Response } from 'express';
import { pool } from '../db';
import { TriageCategoryResponse, TriageOption, TriageCriticalAlert } from '../models/Triage';
import { ActionPlanResponse, ActionPlanStep, ActionPlanContact } from '../models/ActionPlan';

interface ErrorResponseBody {
  error: string;
}

interface SlugParams {
  slug: string;
}

export async function getTriageBySlug(
  req: Request<SlugParams>,
  res: Response<TriageCategoryResponse | ErrorResponseBody>
): Promise<void> {
  try {
    const { slug } = req.params;

    const categoryResult = await pool.query<{ category_name: string; bot_intro: string }>(
      'SELECT category_name, bot_intro FROM triage_categories WHERE slug = $1',
      [slug]
    );
    const category = categoryResult.rows[0];
    if (!category) {
      res.status(404).json({ error: 'Triage category not found' });
      return;
    }

    const optionsResult = await pool.query<TriageOption>(
      `SELECT option_key AS id, label, icon
       FROM triage_options
       WHERE triage_category_id = (SELECT id FROM triage_categories WHERE slug = $1)
       ORDER BY sort_order ASC`,
      [slug]
    );

    const alertsResult = await pool.query<{ option_key: string; title: string; items: string[] }>(
      `SELECT option_key, title, items
       FROM triage_critical_alerts
       WHERE triage_category_id = (SELECT id FROM triage_categories WHERE slug = $1)`,
      [slug]
    );

    const criticalAlerts: Record<string, TriageCriticalAlert> = {};
    for (const row of alertsResult.rows) {
      criticalAlerts[row.option_key] = { title: row.title, items: row.items };
    }

    res.status(200).json({
      categoryName: category.category_name,
      botIntro: category.bot_intro,
      options: optionsResult.rows,
      criticalAlerts,
    });
  } catch (err) {
    console.error('getTriageBySlug error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getActionPlanBySlug(
  req: Request<SlugParams>,
  res: Response<ActionPlanResponse | ErrorResponseBody>
): Promise<void> {
  try {
    const { slug } = req.params;

    const planResult = await pool.query<{
      category_title: string;
      subtitle: string;
      safety_tip: string;
      cta_button_text: string;
      target_specialty: string;
    }>(
      `SELECT category_title, subtitle, safety_tip, cta_button_text, target_specialty
       FROM action_plans WHERE slug = $1`,
      [slug]
    );
    const plan = planResult.rows[0];
    if (!plan) {
      res.status(404).json({ error: 'Action plan not found' });
      return;
    }

    const stepsResult = await pool.query<ActionPlanStep>(
      `SELECT id, title, description
       FROM action_plan_steps
       WHERE action_plan_id = (SELECT id FROM action_plans WHERE slug = $1)
       ORDER BY sort_order ASC`,
      [slug]
    );

    const contactsResult = await pool.query<ActionPlanContact>(
      `SELECT name, number, contact_type AS type, icon, color
       FROM action_plan_contacts
       WHERE action_plan_id = (SELECT id FROM action_plans WHERE slug = $1)
       ORDER BY sort_order ASC`,
      [slug]
    );

    res.status(200).json({
      categoryTitle: plan.category_title,
      subtitle: plan.subtitle,
      steps: stepsResult.rows,
      emergencyContacts: contactsResult.rows,
      safetyTip: plan.safety_tip,
      ctaButtonText: plan.cta_button_text,
      targetSpecialty: plan.target_specialty,
    });
  } catch (err) {
    console.error('getActionPlanBySlug error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
