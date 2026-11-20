import { PoolClient } from 'pg';
import { pool } from './index';

interface CategorySeed {
  name: string;
}

interface ReviewSeed {
  author: string;
  initials: string;
  rating: number;
  comment: string;
}

interface ProfessionalSeed {
  name: string;
  role: string;
  specialty: string;
  rating: number;
  lat: number;
  lng: number;
  price_per_hour: number;
  base_visit_price: number;
  is_fast: boolean;
  is_verified: boolean;
  experience_years: number;
  avatar_url: string;
  cover_image_url: string;
  company_name: string;
  company_description: string;
  company_logo_url: string;
  working_hours: string;
  sos_support: string;
  specialties: string[];
  bio: string;
  address: string;
  city: string;
  reviews: ReviewSeed[];
}

interface TriageOptionSeed {
  key: string;
  label: string;
  icon: string;
}

interface TriageAlertSeed {
  optionKey: string; // 'default' or matches a TriageOptionSeed.key
  title: string;
  items: string[];
}

interface TriageCategorySeed {
  slug: string;
  categoryName: string;
  botIntro: string;
  options: TriageOptionSeed[];
  alerts: TriageAlertSeed[];
}

interface ActionPlanStepSeed {
  title: string;
  description: string;
}

interface ActionPlanContactSeed {
  name: string;
  number: string;
  type: string;
  icon: string;
  color: string;
}

interface ActionPlanSeed {
  slug: string;
  categoryTitle: string;
  subtitle: string;
  steps: ActionPlanStepSeed[];
  emergencyContacts: ActionPlanContactSeed[];
  safetyTip: string;
  ctaButtonText: string;
  targetSpecialty: string;
}

const CATEGORIES: CategorySeed[] = [
  { name: 'coche' },
  { name: 'hogar' },
  { name: 'salud' },
  { name: 'tecnologia' },
];

// Ported verbatim from the frontend's former src/data/triageData.js.
const TRIAGE_SEED: TriageCategorySeed[] = [
  {
    slug: 'coche',
    categoryName: 'Averías del coche',
    botIntro: 'He detectado un problema con tu vehículo. Para ayudarte mejor, ¿cuál de estos síntomas notas?',
    options: [
      { key: 'humo', label: 'Humo en el motor', icon: 'Fan' },
      { key: 'ruido', label: 'Ruido metálico', icon: 'Wrench' },
      { key: 'electrico', label: 'Fallo eléctrico', icon: 'Zap' },
      { key: 'liquido', label: 'Pérdida de líquido', icon: 'Droplet' },
    ],
    alerts: [
      { optionKey: 'humo', title: 'IMPORTANTE: Qué NO hacer', items: ['NO intentes abrir el capó si sale humo denso.', 'NO eches agua directamente sobre el motor caliente.', 'NO intentes arrancar el vehículo de nuevo.'] },
      { optionKey: 'ruido', title: 'IMPORTANTE: Qué NO hacer', items: ['NO continúes conduciendo a altas velocidades.', 'NO fuerces los cambios ni revoluciones del motor.', 'NO ignores vibraciones severas en la dirección.'] },
      { optionKey: 'electrico', title: 'IMPORTANTE: Qué NO hacer', items: ['NO toques cables con aislamiento derretido o chispeantes.', 'NO uses puentes de batería sin el conocimiento adecuado.', 'NO dejes accesorios encendidos para evitar descarga total.'] },
      { optionKey: 'liquido', title: 'IMPORTANTE: Qué NO hacer', items: ['NO abras el tapón del radiador con el motor caliente.', 'NO inhales vapores de anticongelante o combustible.', 'NO enciendas fósforos o fuego cerca del derrame.'] },
      { optionKey: 'default', title: 'IMPORTANTE: Qué NO hacer', items: ['NO intentes abrir el capó si sale humo denso.', 'NO eches agua directamente sobre el motor caliente.', 'NO intentes arrancar el vehículo de nuevo.'] },
    ],
  },
  {
    slug: 'hogar',
    categoryName: 'Problemas en el hogar',
    botIntro: 'Entiendo que tienes una emergencia en casa. Para activar el protocolo seguro, ¿qué experimentas?',
    options: [
      { key: 'agua', label: 'Fuga de agua masiva', icon: 'Droplets' },
      { key: 'corto', label: 'Cortocircuito / Chispas', icon: 'Zap' },
      { key: 'gas', label: 'Olor a gas persistente', icon: 'Flame' },
      { key: 'estructura', label: 'Daño estructural / Derrumbe', icon: 'AlertTriangle' },
    ],
    alerts: [
      { optionKey: 'gas', title: 'IMPORTANTE: Qué NO hacer', items: ['NO enciendas ni apagues interruptores de luz.', 'NO uses teléfonos móviles ni timbres en la zona.', 'NO utilices fuego, cerillas ni aparatos eléctricos.'] },
      { optionKey: 'agua', title: 'IMPORTANTE: Qué NO hacer', items: ['NO toques electrodomésticos en contacto con el agua.', 'NO camines descalzo en zonas con agua acumulada.', 'NO uses aparatos eléctricos cerca de la fuga.'] },
      { optionKey: 'corto', title: 'IMPORTANTE: Qué NO hacer', items: ['NO toques cables expuestos o cajas térmicas húmedas.', 'NO intentes apagar un fuego eléctrico con agua.', 'NO sobrecargues tomacorrientes dañados.'] },
      { optionKey: 'estructura', title: 'IMPORTANTE: Qué NO hacer', items: ['NO permanezcas debajo de vigas o techos agrietados.', 'NO uses elevadores bajo ninguna circunstancia.', 'NO intentes rescatar objetos pesados del inmueble.'] },
      { optionKey: 'default', title: 'IMPORTANTE: Qué NO hacer', items: ['NO enciendas ni apagues interruptores de luz.', 'NO uses fuego cerca ni aparatos eléctricos.', 'NO intentes reparaciones complejas sin cortar suministros.'] },
    ],
  },
  {
    slug: 'salud',
    categoryName: 'Salud',
    botIntro: 'Evaluación rápida de salud y primeros auxilios. Selecciona el síntoma principal:',
    options: [
      { key: 'respirar', label: 'Dificultad para respirar', icon: 'Activity' },
      { key: 'sangrado', label: 'Sangrado abundante', icon: 'HeartCrack' },
      { key: 'dolor', label: 'Dolor agudo en el pecho', icon: 'HeartPulse' },
      { key: 'fiebre', label: 'Fiebre muy alta / Convulsión', icon: 'Thermometer' },
    ],
    alerts: [
      { optionKey: 'respirar', title: 'IMPORTANTE: Qué NO hacer', items: ['NO acuestes boca arriba a la persona si le falta el aire.', 'NO administres alimentos, agua o medicamentos sin indicación médica.', 'NO dejes sola a la persona si pierde el conocimiento.'] },
      { optionKey: 'sangrado', title: 'IMPORTANTE: Qué NO hacer', items: ['NO retires objetos incrustados en la herida.', 'NO retires la primera gasa o venda empapada; coloca otra encima.', 'NO apliques torniquetes improvisados sin entrenamiento.'] },
      { optionKey: 'dolor', title: 'IMPORTANTE: Qué NO hacer', items: ['NO permitas que el paciente realice esfuerzo físico.', 'NO demores la llamada a los servicios de emergencia.', 'NO suministres medicamentos que no hayan sido recetados expresamente.'] },
      { optionKey: 'fiebre', title: 'IMPORTANTE: Qué NO hacer', items: ['NO bañes a la persona con agua helada ni uses alcohol.', 'NO introduzcas objetos en la boca durante una convulsión.', 'NO sujetes bruscamente las extremidades del paciente convulsivo.'] },
      { optionKey: 'default', title: 'IMPORTANTE: Qué NO hacer', items: ['NO administres medicamentos sin prescripción médica previa.', 'NO muevas bruscamente a la persona si sospechas caída o trauma.', 'NO demores la atención profesional si los signos vitales decaen.'] },
    ],
  },
  {
    slug: 'tecnologia',
    categoryName: 'Tecnología',
    botIntro: 'Diagnóstico de emergencia para dispositivos e infraestructura digital. ¿Qué falla se presenta?',
    options: [
      { key: 'noenciende', label: 'No enciende / Pantalla negra', icon: 'PowerOff' },
      { key: 'liquidos', label: 'Daño por derrame de líquidos', icon: 'Droplet' },
      { key: 'datos', label: 'Pérdida de datos / Ransomware', icon: 'Database' },
      { key: 'pantalla', label: 'Pantalla rota / Falla física', icon: 'Smartphone' },
    ],
    alerts: [
      { optionKey: 'liquidos', title: 'IMPORTANTE: Qué NO hacer', items: ['NO intentes encender el dispositivo ni conectarlo al cargador.', 'NO apliques calor directo con secadores ni fuentes térmicas.', 'NO agites el equipo violentamente para evitar esparcir el fluido.'] },
      { optionKey: 'datos', title: 'IMPORTANTE: Qué NO hacer', items: ['NO continúes escribiendo archivos en el disco afectado.', 'NO ejecutes herramientas de recuperación de fuentes dudosas.', 'NO mantengas la máquina conectada a la red Wi-Fi o Ethernet.'] },
      { optionKey: 'noenciende', title: 'IMPORTANTE: Qué NO hacer', items: ['NO uses cargadores genéricos con voltajes incompatibles.', 'NO abras la batería de litio bajo ninguna circunstancia.', 'NO golpees el equipo para intentar reactivarlo.'] },
      { optionKey: 'pantalla', title: 'IMPORTANTE: Qué NO hacer', items: ['NO presiones con fuerza sobre el cristal agrietado.', 'NO permitas que partículas de vidrio entren en puertos de carga.', 'NO uses pegamentos domésticos sobre la superficie táctil.'] },
      { optionKey: 'default', title: 'IMPORTANTE: Qué NO hacer', items: ['NO intentes encenderlo repetidamente si huele a quemado.', 'NO apliques calor directo ni abras baterías dañadas.', 'NO conectes el dispositivo dañado a fuentes eléctricas sin protección.'] },
    ],
  },
];

// Ported verbatim from the frontend's former src/data/actionPlansData.js.
const ACTION_PLANS_SEED: ActionPlanSeed[] = [
  {
    slug: 'coche',
    categoryTitle: 'Averías del coche',
    subtitle: 'Protocolo de seguridad vial y asistencia en carretera',
    steps: [
      { title: 'Asegure el área de detención', description: 'Coloque los triángulos de preseñalización a 50 metros del vehículo y vista el chaleco reflectante antes de salir.' },
      { title: 'Apague el motor y active las luces de emergencia', description: 'Mantenga las luces intermitentes (warning) encendidas para advertir a los demás conductores en la vía.' },
      { title: 'Verifique el estado de los ocupantes', description: 'Traslade a los pasajeros detrás del guardarraíl o en una zona elevada fuera de la calzada de circulación.' },
    ],
    emergencyContacts: [
      { name: 'Emergencias Viales (911)', number: '911', type: 'Seguridad / Policía', icon: 'ShieldAlert', color: 'bg-red-500 text-white' },
      { name: 'Cruz Roja / Ambulancia', number: '065', type: 'Urgencias Médicas', icon: 'Ambulance', color: 'bg-rose-600 text-white' },
      { name: 'Asistencia Vial & Grúa', number: '800-000-767', type: 'Servicio 24/7', icon: 'Truck', color: 'bg-blue-600 text-white' },
    ],
    safetyTip: 'Si te encuentras en una autopista de alta velocidad, no intentes reparar la avería tú mismo si compromete tu seguridad.',
    ctaButtonText: 'Buscar un mecánico cerca de mí',
    targetSpecialty: 'Mecánico especializado',
  },
  {
    slug: 'hogar',
    categoryTitle: 'Problemas en el hogar',
    subtitle: 'Protocolo de mitigación de daños e instalaciones domésticas',
    steps: [
      { title: 'Cierre la llave de paso o corte el suministro eléctrico', description: 'Interrumpa el paso de agua, gas o desconecte el interruptor magnetotérmico general según el origen del fallo.' },
      { title: 'Ventile y despeje el área afectada', description: 'Abra ventanas y puertas exteriores para evitar acumulación de vapores, gases o humedad concentrada.' },
      { title: 'Aleje aparatos eléctricos y resguarde personas vulnerables', description: 'Despeje el suelo de objetos y mantenga a niños y mascotas lejos de la zona con fugas o riesgo eléctrico.' },
    ],
    emergencyContacts: [
      { name: 'Bomberos & Rescate', number: '911 / 068', type: 'Fuego / Gas / Estructura', icon: 'Flame', color: 'bg-amber-600 text-white' },
      { name: 'Protección Civil', number: '911', type: 'Riesgos Urbanos', icon: 'ShieldAlert', color: 'bg-red-500 text-white' },
      { name: 'S.O.S. Soporte Hogar', number: '800-464-272', type: 'Fontanería & Cerrajería', icon: 'Wrench', color: 'bg-blue-600 text-white' },
    ],
    safetyTip: 'Nunca intente manipular instalaciones de gas con herramientas metálicas que puedan producir chispas por fricción.',
    ctaButtonText: 'Buscar un técnico/plomero cerca',
    targetSpecialty: 'Técnico de Hogar (Plomería)',
  },
  {
    slug: 'salud',
    categoryTitle: 'Salud y Urgencias Sanitarias',
    subtitle: 'Primeros auxilios básicos mientras llega el personal médico',
    steps: [
      { title: 'Mantenga la calma y asegure el entorno', description: 'Compruebe que el lugar no represente un peligro inminente ni para usted ni para el afectado.' },
      { title: 'No mueva al paciente sin necesidad estricta', description: 'Evite mover el cuello o la columna si hubo caídas o traumatismos. Manténgalo abrigado y consciente.' },
      { title: 'Si hay sangrado activo, aplique presión directa y constante', description: 'Utilice gasas o un apósito limpio directamente sobre la herida manteniendo una presión firme.' },
    ],
    emergencyContacts: [
      { name: 'Servicio Médico de Urgencia (911 / 112)', number: '911', type: 'Ambulancia Inmediata', icon: 'HeartPulse', color: 'bg-red-600 text-white' },
      { name: 'Centro de Información Toxicológica', number: '800-000-869', type: 'Intoxicaciones / Venenos', icon: 'AlertTriangle', color: 'bg-amber-500 text-white' },
      { name: 'Médico Orientador S.O.S.', number: '800-725-836', type: 'Telemedicina 24/7', icon: 'UserCheck', color: 'bg-blue-600 text-white' },
    ],
    safetyTip: 'Si la persona pierde el conocimiento y no respira normalmente, inicie maniobras de RCP si está capacitado.',
    ctaButtonText: 'Buscar un médico/hospital cerca',
    targetSpecialty: 'Médico General a Domicilio',
  },
  {
    slug: 'tecnologia',
    categoryTitle: 'Tecnología y Dispositivos',
    subtitle: 'Protocolo de rescate de hardware y preservación de información',
    steps: [
      { title: 'Desconecte de la corriente eléctrica inmediatamente', description: 'Desenchufe la fuente de alimentación o cargador para evitar cortocircuitos en la placa madre.' },
      { title: 'Si hubo contacto con líquidos, coloque sobre toalla absorbente', description: 'Mantenga el equipo abierto boca abajo y no intente encenderlo bajo ninguna circunstancia.' },
      { title: 'Retire baterías extraíbles y periféricos conectados', description: 'Desconecte discos externos, memorias y accesorios para salvaguardar los datos secundarios.' },
    ],
    emergencyContacts: [
      { name: 'Soporte Informático S.O.S.', number: '800-832-466', type: 'Diagnóstico Urgente', icon: 'Laptop', color: 'bg-blue-600 text-white' },
      { name: 'Laboratorio Recuperación de Datos', number: '800-999-328', type: 'Discos & Servidores', icon: 'Database', color: 'bg-indigo-600 text-white' },
      { name: 'Ciberseguridad & Ransomware', number: '800-732-873', type: 'Respaldo & Limpieza', icon: 'ShieldAlert', color: 'bg-red-500 text-white' },
    ],
    safetyTip: 'No use arroz para secar circuitos electrónicos ya que el almidón y el polvo aceleran la corrosión interna.',
    ctaButtonText: 'Buscar soporte técnico cerca',
    targetSpecialty: 'Soporte TI & Recuperación de Datos',
  },
];

// At least 2 realistic professionals per category, roughly centered on
// León, Guanajuato (matches the frontend's mock data locale).
const PROFESSIONALS_BY_CATEGORY: Record<string, ProfessionalSeed[]> = {
  coche: [
    {
      name: 'Carlos Rodríguez',
      role: 'Mecánico especializado',
      specialty: 'Mecánica Automotriz & Grúa',
      rating: 4.9,
      lat: 21.1224,
      lng: -101.6836,
      price_per_hour: 45.0,
      base_visit_price: 25.0,
      is_fast: true,
      is_verified: true,
      experience_years: 12,
      avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
      cover_image_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800',
      company_name: 'Talleres Central',
      company_description: 'Servicio automotriz integral con más de 20 años de experiencia en la zona metropolitana de León y el Bajío.',
      company_logo_url: 'https://images.unsplash.com/photo-1599837565318-67429bde7162?auto=format&fit=crop&q=80&w=120',
      working_hours: 'Lun - Sáb: 8:00 AM - 6:00 PM',
      sos_support: 'Disponible 24/7 para emergencias en ruta',
      specialties: ['Motor', 'Transmisión', 'Frenos', 'Sistema Eléctrico', 'Diagnóstico por Scanner', 'Auxilio en Carretera'],
      bio: 'Especialista en vehículos asiáticos y americanos. Resolución rápida de fallas complejas de encendido, sobrecalentamiento, sensores e inyección electrónica a domicilio y pie de carretera.',
      address: 'Blvd. Adolfo López Mateos 1820, Col. Centro, León, Gto.',
      city: 'León, Guanajuato',
      reviews: [
        { author: 'María López', initials: 'M', rating: 5, comment: 'Excelente servicio. Mi auto se quedó varado en la carretera y Carlos llegó en menos de 20 minutos. Detectó la falla de inmediato y la solucionó ahí mismo. Muy profesional y amable.' },
        { author: 'Javier Torres', initials: 'J', rating: 5, comment: 'Muy buen diagnóstico. Fui por un ruido extraño en el motor que otros mecánicos no encontraban. Carlos fue paciente y honesto con el precio de la reparación. Lo recomiendo.' },
        { author: 'Roberto Medina', initials: 'R', rating: 5, comment: 'Me auxilió con el sistema eléctrico a medianoche en una lluvia torrencial. Super puntual, traía todas las herramientas necesarias.' },
      ],
    },
    {
      name: 'Miguel Ángel Torres',
      role: 'Electricista Automotriz',
      specialty: 'Diagnóstico Eléctrico & Baterías',
      rating: 4.7,
      lat: 21.1355,
      lng: -101.6789,
      price_per_hour: 40.0,
      base_visit_price: 20.0,
      is_fast: true,
      is_verified: true,
      experience_years: 8,
      avatar_url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=256',
      cover_image_url: 'https://images.unsplash.com/photo-1632823469850-1b7b1e8b7276?auto=format&fit=crop&q=80&w=800',
      company_name: 'ElectroAuto León',
      company_description: 'Taller especializado en electricidad automotriz, arranque en frío y sistemas de carga para todo tipo de vehículo.',
      company_logo_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=120',
      working_hours: 'Lun - Dom: 7:00 AM - 9:00 PM',
      sos_support: 'Auxilio vial con carga de batería en menos de 25 min',
      specialties: ['Baterías y Alternadores', 'Marchas', 'Cortocircuitos', 'Instalación de Audio', 'Sensores ABS'],
      bio: 'Técnico certificado en sistemas eléctricos automotrices. Especialista en diagnóstico de fallas intermitentes de encendido y arneses dañados por humedad.',
      address: 'Av. Manantiales 220, San Isidro, León, Gto.',
      city: 'León, Guanajuato',
      reviews: [
        { author: 'Diana Flores', initials: 'D', rating: 5, comment: 'Se me descargó la batería en un estacionamiento y Miguel llegó rapidísimo con equipo de carga. Muy amable y explicó todo con claridad.' },
        { author: 'Héctor Ibarra', initials: 'H', rating: 4.5, comment: 'Buen diagnóstico del alternador, precio justo y garantía por escrito en la reparación.' },
      ],
    },
  ],
  hogar: [
    {
      name: 'Ana Martínez',
      role: 'Técnico de Hogar (Plomería)',
      specialty: 'Instalaciones & Fugas',
      rating: 4.8,
      lat: 21.118,
      lng: -101.679,
      price_per_hour: 35.0,
      base_visit_price: 20.0,
      is_fast: true,
      is_verified: true,
      experience_years: 9,
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
      cover_image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
      company_name: 'Fontanería & Redes Bajío',
      company_description: 'Soluciones rápidas en plomería hidráulica, detección electrónica de fugas y desazolve sanitario.',
      company_logo_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=120',
      working_hours: 'Lun - Dom: 7:00 AM - 10:00 PM',
      sos_support: 'Respuesta inmediata en menos de 30 min',
      specialties: ['Fugas Ocultas', 'Desazolve Urgente', 'Boilers y Calentadores', 'Tubería de Cobre y CPVC', 'Bombas y Presurizadores'],
      bio: 'Técnica certificada en fontanería residencial e industrial. Reparación urgente de tuberías rotas, inundaciones domésticas y reconexión segura de calentadores y tomas generales.',
      address: 'Calle Madero 450, Zona Piel, León, Gto.',
      city: 'León, Guanajuato',
      reviews: [
        { author: 'Daniela Castro', initials: 'D', rating: 5, comment: 'Se me rompió la tubería principal del patio y Ana llegó con equipo detector. Selló todo en menos de una hora. Servicio impecable.' },
        { author: 'Guillermo Paz', initials: 'G', rating: 4.8, comment: 'Muy honesta con las piezas y repuestos. Explicó todo paso a paso y dejó el área completamente limpia.' },
      ],
    },
    {
      name: 'Roberto Sánchez',
      role: 'Electricista Residencial',
      specialty: 'Instalaciones Eléctricas & Cortocircuitos',
      rating: 4.6,
      lat: 21.129,
      lng: -101.665,
      price_per_hour: 38.0,
      base_visit_price: 22.0,
      is_fast: true,
      is_verified: true,
      experience_years: 11,
      avatar_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=256',
      cover_image_url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800',
      company_name: 'Electricidad Segura León',
      company_description: 'Instalaciones eléctricas certificadas, tableros, tierras físicas y atención de emergencias por cortocircuito.',
      company_logo_url: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=120',
      working_hours: 'Lun - Sáb: 8:00 AM - 8:00 PM',
      sos_support: 'Corte seguro de emergencia en menos de 20 min',
      specialties: ['Cortocircuitos', 'Tableros Eléctricos', 'Tierras Físicas', 'Iluminación', 'Subidas de Voltaje'],
      bio: 'Electricista certificado con enfoque en seguridad residencial. Atiende cortocircuitos, olores a quemado y sobrecargas antes de que se conviertan en incendios.',
      address: 'Priv. Los Naranjos 88, Jardines del Moral, León, Gto.',
      city: 'León, Guanajuato',
      reviews: [
        { author: 'Fernanda Ruiz', initials: 'F', rating: 5, comment: 'Detectó un cortocircuito que llevaba semanas causando parpadeos de luz. Muy meticuloso y dejó todo documentado.' },
        { author: 'Adrián Cortés', initials: 'A', rating: 4.3, comment: 'Llegó puntual y resolvió el problema del tablero rápido, aunque el costo de materiales fue un poco alto.' },
      ],
    },
  ],
  salud: [
    {
      name: 'Dr. Luis Gómez',
      role: 'Médico General a Domicilio',
      specialty: 'Urgencias Médicas',
      rating: 5.0,
      lat: 21.115,
      lng: -101.682,
      price_per_hour: 60.0,
      base_visit_price: 45.0,
      is_fast: true,
      is_verified: true,
      experience_years: 15,
      avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256',
      cover_image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
      company_name: 'Red Médica Domiciliaria S.O.S.',
      company_description: 'Atención prehospitalaria y consulta médica general con instrumental de monitoreo de signos vitales a domicilio.',
      company_logo_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=120',
      working_hours: '24 Horas / 7 Días',
      sos_support: 'Prioridad alta en código amarillo y verde',
      specialties: ['Primeros Auxilios', 'Suturas Menores', 'Manejo de Crisis Hipertensiva', 'Nebulizaciones Urgentes', 'Inyectables y Sueros'],
      bio: 'Médico cirujano con postgrado en urgencias ambulatorias. Equipado con maletín de soporte avanzado de vida, oximetría, electrocardiograma portátil y botiquín de estabilización inmediata.',
      address: 'Paseo del Moral 710, Jardines del Moral, León, Gto.',
      city: 'León, Guanajuato',
      reviews: [
        { author: 'Carmen Villalobos', initials: 'C', rating: 5, comment: 'Atendió a mi padre durante una crisis asmática nocturna. Su trato humano y rapidez fueron vitales. Totalmente agradecida.' },
        { author: 'Eduardo Rivas', initials: 'E', rating: 5, comment: 'Excelente médico. Llegó muy rápido y con todo el equipo médico de esterilización. Excelente diagnóstico.' },
      ],
    },
    {
      name: 'Dra. Patricia Ramírez',
      role: 'Enfermería & Cuidados Urgentes',
      specialty: 'Cuidados de Enfermería a Domicilio',
      rating: 4.9,
      lat: 21.126,
      lng: -101.67,
      price_per_hour: 50.0,
      base_visit_price: 35.0,
      is_fast: true,
      is_verified: true,
      experience_years: 10,
      avatar_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=256',
      cover_image_url: 'https://images.unsplash.com/photo-1587351021355-a479a299d2f9?auto=format&fit=crop&q=80&w=800',
      company_name: 'Cuidados S.O.S. León',
      company_description: 'Enfermería especializada en curaciones, canalizaciones y cuidado de pacientes post-operatorios y crónicos.',
      company_logo_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=120',
      working_hours: 'Lun - Dom: 6:00 AM - 11:00 PM',
      sos_support: 'Canalización y curaciones urgentes en menos de 30 min',
      specialties: ['Curaciones Avanzadas', 'Canalizaciones', 'Control de Signos Vitales', 'Cuidado Post-Operatorio', 'Aplicación de Medicamentos'],
      bio: 'Enfermera certificada con amplia experiencia en cuidados críticos hospitalarios. Ofrece atención domiciliaria segura para pacientes delicados o de edad avanzada.',
      address: 'Blvd. Campestre 512, Valle del Campestre, León, Gto.',
      city: 'León, Guanajuato',
      reviews: [
        { author: 'Sara Domínguez', initials: 'S', rating: 5, comment: 'Cuidó a mi abuela durante su recuperación post-quirúrgica. Muy profesional, puntual y con mucha calidez humana.' },
        { author: 'Iván Salazar', initials: 'I', rating: 4.8, comment: 'Excelente para canalizaciones difíciles, no tuvo ningún problema y explicó cada paso.' },
      ],
    },
  ],
  tecnologia: [
    {
      name: 'Ing. Sofía Herrera',
      role: 'Soporte TI & Recuperación de Datos',
      specialty: 'Hardware & Redes',
      rating: 4.9,
      lat: 21.12,
      lng: -101.69,
      price_per_hour: 40.0,
      base_visit_price: 30.0,
      is_fast: true,
      is_verified: true,
      experience_years: 8,
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
      cover_image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      company_name: 'CyberRescue León',
      company_description: 'Centro avanzado de soporte técnico para laptops, servidores, redes y rescate forense de información dañada.',
      company_logo_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=120',
      working_hours: 'Lun - Sáb: 8:30 AM - 8:00 PM',
      sos_support: 'Soporte remoto y a domicilio 24/7',
      specialties: ['Rescate tras Derrame Líquido', 'Recuperación SSD / HDD', 'Limpieza Virus & Malware', 'Reparación Placas Lógicas', 'Configuración Wi-Fi & Servidores'],
      bio: 'Ingeniera en Sistemas y especialista en microelectrónica. Diagnóstico de equipos mojados con tina ultrasónica, recuperación de discos formateados o encriptados y rescate de archivos críticos en empresas y hogares.',
      address: 'Av. Panorama 302, Valle del Campestre, León, Gto.',
      city: 'León, Guanajuato',
      reviews: [
        { author: 'Alejandro Prado', initials: 'A', rating: 5, comment: 'Se derramó café en mi MacBook con la tesis de maestría sin respaldo. Sofía limpió los componentes y recuperó el 100% de los datos. ¡Es una genia!' },
        { author: 'Valeria Montiel', initials: 'V', rating: 5, comment: 'Respuesta veloz, me asesoró desde el primer minuto por teléfono para no prender el equipo.' },
      ],
    },
    {
      name: 'Jorge Luis Peña',
      role: 'Especialista en Redes & Ciberseguridad',
      specialty: 'Redes & Ciberseguridad',
      rating: 4.7,
      lat: 21.133,
      lng: -101.66,
      price_per_hour: 42.0,
      base_visit_price: 28.0,
      is_fast: true,
      is_verified: true,
      experience_years: 7,
      avatar_url: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=256',
      cover_image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
      company_name: 'RedSegura Bajío',
      company_description: 'Consultoría de redes domésticas y empresariales, limpieza de ransomware y configuración de respaldos automáticos.',
      company_logo_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=120',
      working_hours: 'Lun - Vie: 9:00 AM - 7:00 PM, Emergencias 24/7',
      sos_support: 'Contención de ransomware en menos de 1 hora',
      specialties: ['Configuración de Firewalls', 'Eliminación de Ransomware', 'Redes Empresariales', 'Respaldos en la Nube', 'Auditoría de Seguridad'],
      bio: 'Especialista en ciberseguridad con certificaciones en redes empresariales. Atiende incidentes de ransomware y fuga de datos con protocolos de contención inmediata.',
      address: 'Blvd. Torres Landa 1450, Ciudad Industrial, León, Gto.',
      city: 'León, Guanajuato',
      reviews: [
        { author: 'Mariana Ocampo', initials: 'M', rating: 5, comment: 'Nuestra pyme fue atacada con ransomware un viernes por la noche y Jorge contuvo el ataque antes de que se propagara a más equipos. Excelente respuesta.' },
        { author: 'Tomás Beltrán', initials: 'T', rating: 4.4, comment: 'Configuró nuestra red de oficina con VPN y respaldo automático. Muy claro explicando temas técnicos.' },
      ],
    },
  ],
};

async function truncateTables(client: PoolClient): Promise<void> {
  await client.query('TRUNCATE TABLE professionals, categories, triage_categories, action_plans CASCADE');
  console.log('✔ Tablas "professionals", "categories", "triage_categories" y "action_plans" limpiadas (CASCADE)');
}

async function insertCategories(client: PoolClient): Promise<Map<string, string>> {
  const idsByName = new Map<string, string>();

  for (const category of CATEGORIES) {
    const result = await client.query<{ id: string; name: string }>(
      'INSERT INTO categories (name) VALUES ($1) RETURNING id, name',
      [category.name]
    );

    const row = result.rows[0];
    if (!row) {
      throw new Error(`No se pudo insertar la categoría "${category.name}"`);
    }

    idsByName.set(row.name, row.id);
    console.log(`✔ Categoría creada: ${row.name} (${row.id})`);
  }

  return idsByName;
}

async function insertProfessionalReviews(client: PoolClient, professionalId: string, reviews: ReviewSeed[]): Promise<void> {
  for (const review of reviews) {
    await client.query(
      `INSERT INTO professional_reviews (professional_id, author, initials, rating, comment)
       VALUES ($1, $2, $3, $4, $5)`,
      [professionalId, review.author, review.initials, review.rating, review.comment]
    );
  }
  console.log(`  ↳ ${reviews.length} reseña(s) insertada(s)`);
}

async function insertProfessionals(client: PoolClient, categoryIdsByName: Map<string, string>): Promise<void> {
  for (const [categoryName, professionals] of Object.entries(PROFESSIONALS_BY_CATEGORY)) {
    const categoryId = categoryIdsByName.get(categoryName);
    if (!categoryId) {
      throw new Error(`No se encontró el UUID de la categoría "${categoryName}"`);
    }

    for (const pro of professionals) {
      const result = await client.query<{ id: string }>(
        `INSERT INTO professionals (
           name, role, specialty, rating, lat, lng, price_per_hour, base_visit_price,
           is_fast, is_verified, experience_years, avatar_url, cover_image_url,
           company_name, company_description, company_logo_url, working_hours,
           sos_support, specialties, bio, address, city, category_id
         )
         VALUES (
           $1, $2, $3, $4, $5, $6, $7, $8,
           $9, $10, $11, $12, $13,
           $14, $15, $16, $17,
           $18, $19, $20, $21, $22, $23
         )
         RETURNING id`,
        [
          pro.name, pro.role, pro.specialty, pro.rating, pro.lat, pro.lng, pro.price_per_hour, pro.base_visit_price,
          pro.is_fast, pro.is_verified, pro.experience_years, pro.avatar_url, pro.cover_image_url,
          pro.company_name, pro.company_description, pro.company_logo_url, pro.working_hours,
          pro.sos_support, pro.specialties, pro.bio, pro.address, pro.city, categoryId,
        ]
      );

      const row = result.rows[0];
      if (!row) {
        throw new Error(`No se pudo insertar al profesional "${pro.name}"`);
      }

      console.log(`✔ Profesional creado: ${pro.name} [${categoryName}] (${row.id})`);
      await insertProfessionalReviews(client, row.id, pro.reviews);
    }
  }
}

async function insertTriageData(client: PoolClient): Promise<void> {
  for (const category of TRIAGE_SEED) {
    const categoryResult = await client.query<{ id: string }>(
      'INSERT INTO triage_categories (slug, category_name, bot_intro) VALUES ($1, $2, $3) RETURNING id',
      [category.slug, category.categoryName, category.botIntro]
    );
    const categoryId = categoryResult.rows[0]?.id;
    if (!categoryId) {
      throw new Error(`No se pudo insertar la categoría de triage "${category.slug}"`);
    }

    for (const [index, option] of category.options.entries()) {
      await client.query(
        `INSERT INTO triage_options (triage_category_id, option_key, label, icon, sort_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [categoryId, option.key, option.label, option.icon, index]
      );
    }

    for (const alert of category.alerts) {
      await client.query(
        `INSERT INTO triage_critical_alerts (triage_category_id, option_key, title, items)
         VALUES ($1, $2, $3, $4)`,
        [categoryId, alert.optionKey, alert.title, alert.items]
      );
    }

    console.log(`✔ Triage creado: ${category.slug} (${category.options.length} opciones, ${category.alerts.length} alertas)`);
  }
}

async function insertActionPlans(client: PoolClient): Promise<void> {
  for (const plan of ACTION_PLANS_SEED) {
    const planResult = await client.query<{ id: string }>(
      `INSERT INTO action_plans (slug, category_title, subtitle, safety_tip, cta_button_text, target_specialty)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [plan.slug, plan.categoryTitle, plan.subtitle, plan.safetyTip, plan.ctaButtonText, plan.targetSpecialty]
    );
    const planId = planResult.rows[0]?.id;
    if (!planId) {
      throw new Error(`No se pudo insertar el plan de acción "${plan.slug}"`);
    }

    for (const [index, step] of plan.steps.entries()) {
      await client.query(
        `INSERT INTO action_plan_steps (action_plan_id, title, description, sort_order)
         VALUES ($1, $2, $3, $4)`,
        [planId, step.title, step.description, index]
      );
    }

    for (const [index, contact] of plan.emergencyContacts.entries()) {
      await client.query(
        `INSERT INTO action_plan_contacts (action_plan_id, name, number, contact_type, icon, color, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [planId, contact.name, contact.number, contact.type, contact.icon, contact.color, index]
      );
    }

    console.log(`✔ Plan de acción creado: ${plan.slug} (${plan.steps.length} pasos, ${plan.emergencyContacts.length} contactos)`);
  }
}

async function seed(): Promise<void> {
  console.log('Iniciando seed de la base de datos...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await truncateTables(client);
    const categoryIdsByName = await insertCategories(client);
    await insertProfessionals(client, categoryIdsByName);
    await insertTriageData(client);
    await insertActionPlans(client);

    await client.query('COMMIT');
    console.log('✅ Seed completado con éxito.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error durante el seed, se revirtieron los cambios:', err);
    throw err;
  } finally {
    client.release();
  }
}

seed()
  .catch(() => {
    process.exitCode = 1;
  })
  .finally(() => {
    void pool.end().then(() => {
      console.log('Pool de conexiones cerrado.');
    });
  });
