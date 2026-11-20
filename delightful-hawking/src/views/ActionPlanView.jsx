import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  Square,
  Phone,
  ShieldAlert,
  Info,
  Sparkles,
  Ambulance,
  Truck,
  Flame,
  Wrench,
  UserCheck,
  Laptop,
  Database,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { fetchActionPlan } from '../api/actionPlans';

export default function ActionPlanView({
  categoryId,
  selectedSymptom,
  onBack,
  onFindProfessionals,
  onOpenEmergencyModal
}) {
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});

  useEffect(() => {
    let cancelled = false;
    setPlan(null);
    setError(null);
    setCompletedSteps({});

    fetchActionPlan(categoryId)
      .catch(() => fetchActionPlan('coche'))
      .then((result) => {
        if (!cancelled) setPlan(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'No se pudo cargar el plan de acción.');
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  const toggleStep = (stepId) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const getContactIcon = (iconName) => {
    switch (iconName) {
      case 'ShieldAlert': return ShieldAlert;
      case 'Ambulance': return Ambulance;
      case 'Truck': return Truck;
      case 'Flame': return Flame;
      case 'Wrench': return Wrench;
      case 'UserCheck': return UserCheck;
      case 'Laptop': return Laptop;
      case 'Database': return Database;
      default: return Phone;
    }
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fadeIn">
        <p className="text-rose-600 font-medium">{error}</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-sm font-medium">Cargando plan de acción...</p>
      </div>
    );
  }

  const allCompleted = plan.steps.every(s => completedSteps[s.id]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fadeIn">
      
      {/* Header and Back navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-400 shadow-xs">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>Volver al triage</span>
        </button>

        <div className="flex items-center gap-2">
          {selectedSymptom && (
            <span className="px-3 py-1 bg-amber-100/70 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
              Síntoma: {selectedSymptom.label}
            </span>
          )}
        </div>
      </div>

      {/* Main Title & Description */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Protocolo de Respuesta S.O.S.
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Pasos Inmediatos a Seguir
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium">
          {plan.subtitle}. Realice estas comprobaciones de seguridad mientras conectamos con los especialistas disponibles en su zona.
        </p>

        {/* Safety Tip Alert */}
        <div className="mt-5 p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-blue-900 font-medium leading-relaxed">
            <strong>Recomendación clave:</strong> {plan.safetyTip}
          </p>
        </div>
      </div>

      {/* Interactive Action Checklist (3 steps) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Lista de Verificación de Seguridad
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {Object.values(completedSteps).filter(Boolean).length} de {plan.steps.length} completados
          </span>
        </div>

        <div className="space-y-3.5">
          {plan.steps.map((step, idx) => {
            const isDone = !!completedSteps[step.id];

            return (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-150 cursor-pointer flex items-start gap-4 ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {/* Step number badge & checkbox */}
                <div className="flex items-center gap-3 shrink-0 mt-0.5">
                  <span className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center ${
                    isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {idx + 1}
                  </span>
                  {isDone ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className={`text-sm sm:text-base font-bold transition-colors ${
                    isDone ? 'text-emerald-900 line-through opacity-80' : 'text-slate-900'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                    isDone ? 'text-emerald-700/80' : 'text-slate-600'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Phone Quick Contacts Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">
          Líneas Telefónicas Directas de Asistencia
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-5">
          Comuníquese directamente si requiere apoyo institucional o auxilio urgente.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {plan.emergencyContacts.map((contact, idx) => {
            const Icon = getContactIcon(contact.icon);
            return (
              <button
                key={idx}
                onClick={onOpenEmergencyModal}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/40 text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {contact.type}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                    {contact.name}
                  </div>
                </div>
                <div className="mt-3 font-mono font-extrabold text-blue-700 text-base">
                  {contact.number}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary CTA Button (Advance to Step 4: Nearby Professionals) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl text-white shadow-xl shadow-blue-900/20">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold leading-tight">
            ¿Necesita un especialista en el lugar?
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
            Hay técnicos y profesionales verificados a menos de 5 km listos para atenderle.
          </p>
        </div>

        <button
          onClick={onFindProfessionals}
          className="w-full sm:w-auto px-7 py-3.5 bg-white text-blue-800 hover:bg-blue-50 font-extrabold rounded-2xl text-sm sm:text-base shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group whitespace-nowrap"
        >
          <span>{plan.ctaButtonText}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
