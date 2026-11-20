import { Router } from 'express';
import { getCategories, getProfessionalById, getProfessionals } from '../controllers/dataController';
import { getActionPlanBySlug, getTriageBySlug } from '../controllers/triageController';

const router = Router();

router.get('/categories', getCategories);
router.get('/professionals', getProfessionals);
router.get('/professionals/:id', getProfessionalById);
router.get('/triage/:slug', getTriageBySlug);
router.get('/action-plans/:slug', getActionPlanBySlug);

export default router;
