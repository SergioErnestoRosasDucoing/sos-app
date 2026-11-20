import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  MapPin,
  MessageSquare,
  Zap,
  SlidersHorizontal,
  CheckCircle,
  ChevronRight,
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  Loader2,
  LocateFixed
} from 'lucide-react';
import { fetchProfessionals } from '../api/professionals';
import InteractiveMap from '../components/InteractiveMap';
import { useGeolocation } from '../hooks/useGeolocation';
import { haversineKm } from '../utils/geo';

export default function ProfessionalsView({
  categoryId,
  onBack,
  onSelectProfessionalDetail,
  onContactProfessional
}) {
  const [activeFilter, setActiveFilter] = useState('distancia'); // 'distancia' | 'calificacion' | 'precio' | 'todos'
  const [categoryFilter, setCategoryFilter] = useState(categoryId || 'all');
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { location: userLocation, isFallback: isFallbackLocation } = useGeolocation();

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    fetchProfessionals({ categorySlug: categoryFilter })
      .then((data) => {
        if (cancelled) return;
        setProfessionals(data);
        setSelectedProfessional((prev) =>
          prev && data.some((p) => p.id === prev.id) ? prev : data[0] ?? null
        );
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'No se pudieron cargar los profesionales.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryFilter]);

  // Distance depends on the user's live location, so it's computed here
  // rather than baked into the API view-model (see api/professionals.js).
  const withDistance = professionals.map((p) => ({
    ...p,
    distanceKm: haversineKm(userLocation.lat, userLocation.lng, p.lat, p.lng),
  }));

  // Sort by active filter (server already applies the category filter)
  const filtered = [...withDistance];

  if (activeFilter === 'distancia') {
    filtered.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (activeFilter === 'calificacion') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (activeFilter === 'precio') {
    filtered.sort((a, b) => a.baseVisitPrice - b.baseVisitPrice);
  }

  const handleCardClick = (prof) => {
    setSelectedProfessional(prof);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fadeIn">
      
      {/* Top Header & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs hover:border-blue-400">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Volver</span>
          </button>
          <span className="text-slate-300">/</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Profesionales Cercanos
          </h1>
        </div>

        {/* Category switcher tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'coche', label: '🚗 Coche' },
            { id: 'hogar', label: '🏠 Hogar' },
            { id: 'salud', label: '🏥 Salud' },
            { id: 'tecnologia', label: '💻 Tecnología' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                categoryFilter === tab.id
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Chips Bar (Screenshot 5 exact match) */}
      <div className="flex items-center gap-2.5 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveFilter('distancia')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeFilter === 'distancia'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Distancia</span>
        </button>

        <button
          onClick={() => setActiveFilter('calificacion')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeFilter === 'calificacion'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Calificación</span>
        </button>

        <button
          onClick={() => setActiveFilter('precio')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeFilter === 'precio'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>🏷 Precio</span>
        </button>

        <button
          onClick={() => {
            alert('Filtros avanzados activos: Disponibilidad 24/7, Profesionales Verificados con Garantía S.O.S., Cobertura en León Guanajuato.');
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 whitespace-nowrap ml-auto"
        >
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Fallback location notice */}
      {isFallbackLocation && !isLoading && (
        <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 font-medium">
          <LocateFixed className="w-4 h-4 shrink-0" />
          <span>Mostrando distancias aproximadas desde León — activa tu ubicación en el navegador para mayor precisión.</span>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-sm font-medium">Cargando profesionales...</p>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center my-6">
          <p className="text-rose-700 font-medium mb-1">No se pudieron cargar los profesionales.</p>
          <p className="text-rose-500 text-sm">{error}</p>
        </div>
      )}

      {/* Split View Container (2 Columns) */}
      {!isLoading && !error && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Professionals List (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4 max-h-[750px] overflow-y-auto pr-1">
          {filtered.map((prof) => {
            const isSelected = selectedProfessional?.id === prof.id;

            return (
              <div
                key={prof.id}
                onClick={() => handleCardClick(prof)}
                className={`group bg-white rounded-3xl p-5 border transition-all duration-200 cursor-pointer relative ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-100 shadow-md'
                    : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  
                  {/* Avatar with status dot */}
                  <div className="relative shrink-0">
                    <img
                      src={prof.avatar}
                      alt={prof.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-xs"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                      }}
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>

                  {/* Info Header */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-700 transition-colors truncate">
                        {prof.name}
                      </h3>
                      {prof.isFast && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                          <Zap className="w-3 h-3 text-blue-600 fill-blue-600" />
                          Rápido
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 font-medium truncate mb-2">
                      {prof.role}
                    </p>

                    {/* Rating & Distance */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-3">
                      <div className="flex items-center gap-1 text-slate-900 font-bold">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{prof.rating}</span>
                        <span className="text-slate-400 font-normal">({prof.reviewsCount})</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>a {prof.distanceKm} km</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & Contact Button */}
                <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[11px] text-slate-400 font-medium">
                      Visita técnica desde
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      ${prof.baseVisitPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Profile Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProfessionalDetail(prof);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition-colors"
                    >
                      Ver Perfil
                    </button>

                    {/* Contact Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onContactProfessional(prof);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-700/20 flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Contactar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Interactive Map (7 cols on lg) */}
        <div className="lg:col-span-7 sticky top-24">
          <InteractiveMap
            professionals={filtered}
            selectedProfessional={selectedProfessional}
            onSelectProfessional={(prof) => setSelectedProfessional(prof)}
            userLocation={userLocation}
          />
        </div>

      </div>
      )}

    </div>
  );
}
