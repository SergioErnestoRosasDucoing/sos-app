import React, { useState, useEffect } from 'react';
import {
  Bot,
  User,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  ShieldAlert,
  X,
  Fan,
  Wrench,
  Zap,
  Droplet,
  Droplets,
  Flame,
  Activity,
  HeartCrack,
  HeartPulse,
  Thermometer,
  PowerOff,
  Database,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { fetchTriage } from '../api/triage';

export default function TriageView({
  categoryId,
  onBack,
  onCompleteTriage
}) {
  const [data, setData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasUserSelected, setHasUserSelected] = useState(true); // default true to match screenshot directly, but can click others
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);

    fetchTriage(categoryId)
      .catch(() => fetchTriage('coche'))
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setSelectedOption(result.options[0]);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'No se pudo cargar el triage.');
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  const getOptionIcon = (iconName) => {
    switch (iconName) {
      case 'Fan': return Fan;
      case 'Wrench': return Wrench;
      case 'Zap': return Zap;
      case 'Droplet': return Droplet;
      case 'Droplets': return Droplets;
      case 'Flame': return Flame;
      case 'AlertTriangle': return AlertTriangle;
      case 'Activity': return Activity;
      case 'HeartCrack': return HeartCrack;
      case 'HeartPulse': return HeartPulse;
      case 'Thermometer': return Thermometer;
      case 'PowerOff': return PowerOff;
      case 'Database': return Database;
      case 'Smartphone': return Smartphone;
      default: return AlertTriangle;
    }
  };

  const handleSelectOption = (opt) => {
    setSelectedOption(opt);
    setHasUserSelected(true);
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fadeIn">
        <p className="text-rose-600 font-medium">{error}</p>
      </div>
    );
  }

  if (!data || !selectedOption) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-sm font-medium">Cargando triage...</p>
      </div>
    );
  }

  const criticalInfo = data.criticalAlerts[selectedOption.id] || data.criticalAlerts.default;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fadeIn">
      
      {/* Back button and Category indicator */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-400 shadow-xs">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>Cambiar de categoría</span>
        </button>

        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
          Triage: {data.categoryName}
        </span>
      </div>

      {/* Chat Thread Container */}
      <div className="space-y-6 sm:space-y-8">
        
        {/* S.O.S. Bot Message (Left) */}
        <div className="flex items-start gap-3 sm:gap-4 max-w-2xl">
          {/* Bot Avatar */}
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0 mt-1">
            <Bot className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <div className="text-xs font-semibold text-slate-500 mb-1.5 ml-1">
              S.O.S. Bot • Ahora
            </div>
            
            {/* Question Bubble */}
            <div className="bg-blue-50/60 border border-blue-100/90 rounded-2xl rounded-tl-sm p-4 sm:p-5 text-slate-800 text-sm sm:text-base font-medium shadow-xs leading-relaxed">
              {data.botIntro}
            </div>

            {/* 2x2 Option Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {data.options.map((opt) => {
                const IconComponent = getOptionIcon(opt.icon);
                const isSelected = selectedOption?.id === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border text-left font-semibold text-sm transition-all duration-150 active:scale-98 ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-slate-50 shadow-xs'
                    }`}
                  >
                    <span className="font-semibold">{opt.label}</span>
                    <IconComponent className={`w-5 h-5 shrink-0 ml-2 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Response Message (Right) if selected */}
        {hasUserSelected && selectedOption && (
          <div className="flex items-start justify-end gap-3 sm:gap-4 animate-fadeIn">
            <div className="flex flex-col items-end">
              <div className="text-xs font-semibold text-slate-500 mb-1.5 mr-1">
                Tú • Ahora
              </div>
              <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 text-sm sm:text-base font-semibold shadow-md">
                {selectedOption.label}
              </div>
            </div>

            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shadow-xs shrink-0 mt-1">
              <User className="w-5 h-5" />
            </div>
          </div>
        )}

        {/* Red Alert "ACCIÓN CRÍTICA REQUERIDA" Card (Exact match of Screenshot 2 & 3) */}
        {hasUserSelected && selectedOption && (
          <div className="pt-2 animate-fadeIn">
            
            {/* Header Tag with Red Warning Icon */}
            <div className="flex items-center gap-2 mb-2 ml-1">
              <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
                <AlertTriangle className="w-4 h-4 fill-red-600 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-red-600 tracking-wider uppercase">
                ACCIÓN CRÍTICA REQUERIDA
              </span>
            </div>

            {/* Yellow/Cream Card with Red Left Accent Border */}
            <div className="bg-[#FFFBEB] border-l-4 border-red-600 rounded-r-2xl rounded-l-xs p-5 sm:p-6 shadow-sm border-y border-r border-amber-200/70">
              {/* Title with Shield Icon */}
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base sm:text-lg mb-4">
                <div className="w-6 h-6 rounded-md bg-red-600 text-white flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span>{criticalInfo.title}</span>
              </div>

              {/* Prohibited items list with red ✕ */}
              <ul className="space-y-3">
                {criticalInfo.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-800 font-medium">
                    <span className="text-red-600 font-extrabold text-base leading-none mt-0.5 shrink-0">✕</span>
                    <div>
                      <strong className="font-extrabold text-slate-900">NO</strong> {item.replace(/^NO\s*/i, '')}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>

      {/* Floating / Bottom Action Bar */}
      {hasUserSelected && selectedOption && (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-md">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Diagnóstico preliminar completado: <strong>{selectedOption.label}</strong></span>
          </div>

          <button
            onClick={() => onCompleteTriage(selectedOption)}
            className="w-full sm:w-auto px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm sm:text-base shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2 transition-all active:scale-95 group"
          >
            <span>Ver Plan de Acción Inmediato</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

    </div>
  );
}
