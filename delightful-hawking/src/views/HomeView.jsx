import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowRight,
  Car,
  Home,
  BriefcaseMedical,
  Laptop,
  AlertCircle,
  Sparkles,
  Loader2
} from 'lucide-react';
import { fetchCategories } from '../api/categories';
import EmergencyBanner from '../components/EmergencyBanner';

export default function HomeView({ onSelectCategory, onOpenEmergencyModal }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    fetchCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'No se pudieron cargar las categorías.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Car':
        return Car;
      case 'Home':
        return Home;
      case 'HeartPulse':
        return BriefcaseMedical;
      case 'Laptop':
        return Laptop;
      default:
        return AlertCircle;
    }
  };

  // Filter categories by title, subtitle, or popular keywords
  const filteredCategories = categories.filter(cat => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.title.toLowerCase().includes(q) ||
      cat.subtitle.toLowerCase().includes(q) ||
      cat.popularIssues.some(issue => issue.toLowerCase().includes(q))
    );
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredCategories.length > 0) {
      onSelectCategory(filteredCategories[0].id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fadeIn">
      
      {/* Top Main Heading */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          ¿Cómo podemos ayudarle?
        </h1>
      </div>

      {/* Large Pill Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto mb-5">
        <div className="relative flex items-center bg-white rounded-full border border-slate-200/90 shadow-sm hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all p-1.5 pl-5">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="¿Cuál es su emergencia?"
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base outline-none font-medium pr-3"
          />
          <button
            type="submit"
            aria-label="Buscar emergencia"
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 flex items-center justify-center transition-all duration-200 shrink-0 active:scale-95 shadow-xs"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Helper text */}
      <div className="text-center mb-10">
        <p className="text-sm sm:text-base text-slate-600 font-medium">
          Busque su problema o seleccione una categoría a continuación.
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-sm font-medium">Cargando categorías...</p>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center my-6">
          <p className="text-rose-700 font-medium mb-1">No se pudieron cargar las categorías.</p>
          <p className="text-rose-500 text-sm">{error}</p>
        </div>
      )}

      {/* 4 Big Category Cards Grid (2x2) */}
      {!isLoading && !error && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10">
        {filteredCategories.map((category) => {
          const Icon = getCategoryIcon(category.icon);
          const isCar = category.id === 'coche';

          return (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`group relative bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] flex flex-col items-center text-center ${
                category.cardBorderHover
              } ${isCar ? 'bg-amber-50/20' : ''}`}
            >
              {/* Category Icon in stylized circular pill container */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110 ${category.badgeBg}`}>
                <Icon className={`w-8 h-8 ${category.iconColor}`} />
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                {category.title}
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal max-w-xs">
                {category.subtitle}
              </p>

              {/* Matching tag pill if searching */}
              {searchQuery && (
                <div className="mt-4 flex flex-wrap gap-1 justify-center">
                  {category.popularIssues
                    .filter(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((issue, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                        {issue}
                      </span>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}

      {/* If no categories found */}
      {!isLoading && !error && filteredCategories.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center my-6">
          <p className="text-slate-600 font-medium mb-3">No encontramos categorías que coincidan con &quot;{searchQuery}&quot;.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
          >
            Ver todas las categorías
          </button>
        </div>
      )}

      {/* Emergency Banner at bottom */}
      <EmergencyBanner onCallEmergency={onOpenEmergencyModal} />
    </div>
  );
}
