// Presentation-only metadata for each category slug. The slugs themselves
// (and whether a category exists at all) come from the backend; this map
// only supplies copy, icons and colors that don't belong in the database.
export const CATEGORY_DISPLAY_META = {
  coche: {
    title: 'Averías del coche',
    subtitle: 'Asistencia en carretera, grúa y reparaciones de emergencia.',
    icon: 'Car',
    badgeBg: 'bg-amber-100/70',
    iconColor: 'text-amber-600',
    cardBorderHover: 'hover:border-amber-300',
    cardBgHover: 'hover:bg-amber-50/30',
    accentColor: '#D97706',
    popularIssues: ['Humo en el motor', 'Batería descargada', 'Llanta ponchada', 'Fallo de frenos'],
  },
  hogar: {
    title: 'Problemas en el hogar',
    subtitle: 'Cerrajería, fontanería, electricidad y reparaciones urgentes.',
    icon: 'Home',
    badgeBg: 'bg-slate-100',
    iconColor: 'text-slate-700',
    cardBorderHover: 'hover:border-blue-300',
    cardBgHover: 'hover:bg-blue-50/30',
    accentColor: '#2563EB',
    popularIssues: ['Fuga de agua', 'Cortocircuito', 'Olor a gas', 'Cerradura trabada'],
  },
  salud: {
    title: 'Salud',
    subtitle: 'Urgencias médicas, ambulancias y asistencia sanitaria rápida.',
    icon: 'HeartPulse',
    badgeBg: 'bg-rose-50',
    iconColor: 'text-slate-800',
    cardBorderHover: 'hover:border-rose-300',
    cardBgHover: 'hover:bg-rose-50/30',
    accentColor: '#E11D48',
    popularIssues: ['Dificultad respiratoria', 'Dolor agudo en el pecho', 'Fiebre alta', 'Caída o golpe fuerte'],
  },
  tecnologia: {
    title: 'Tecnología',
    subtitle: 'Soporte informático, pérdida de datos y fallos de dispositivos.',
    icon: 'Laptop',
    badgeBg: 'bg-emerald-100/60',
    iconColor: 'text-emerald-700',
    cardBorderHover: 'hover:border-emerald-300',
    cardBgHover: 'hover:bg-emerald-50/30',
    accentColor: '#059669',
    popularIssues: ['No enciende', 'Derrame de líquido', 'Pérdida de datos', 'Ataque de malware'],
  },
};

export const DEFAULT_CATEGORY_META = {
  title: 'Otro',
  subtitle: 'Asistencia general.',
  icon: 'AlertCircle',
  badgeBg: 'bg-slate-100',
  iconColor: 'text-slate-600',
  cardBorderHover: 'hover:border-slate-300',
  cardBgHover: 'hover:bg-slate-50/30',
  accentColor: '#475569',
  popularIssues: [],
};
