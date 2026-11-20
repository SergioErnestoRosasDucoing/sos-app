import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  Calendar, 
  MessageSquare, 
  Clock, 
  Asterisk, 
  Wrench, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  Phone, 
  Award,
  ThumbsUp,
  Share2,
  Check
} from 'lucide-react';
export default function ProfessionalDetailView({
  professional,
  onBack,
  onContact,
  onBookNow
}) {
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!professional) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center animate-fadeIn">
        <p className="text-slate-500 font-medium mb-4">No hay un profesional seleccionado.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
        >
          Volver
        </button>
      </div>
    );
  }

  const prof = professional;

  const handleBook = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      onBookNow(prof);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fadeIn">
      
      {/* Top Header & Back Navigation */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2.5 text-base font-extrabold text-blue-700 hover:text-blue-800 transition-colors group"
        >
          <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-400 shadow-xs">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>S.O.S. Ayuda</span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Enlace del perfil copiado al portapapeles.');
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
            title="Compartir perfil"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout (Matching Screenshot 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Main Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 text-center relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700" />
            
            {/* Avatar with status */}
            <div className="relative inline-block my-3">
              <img
                src={prof.avatar}
                alt={prof.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256';
                }}
              />
              <span className="absolute bottom-1 right-2 w-5 h-5 bg-emerald-500 border-3 border-white rounded-full shadow-xs" title="En línea ahora" />
            </div>

            {/* Name & Verified Badge */}
            <div className="flex items-center justify-center gap-1.5 mb-1 mt-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {prof.name}
              </h2>
              {prof.isVerified && (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs" title="Profesional Verificado S.O.S.">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Role subtitle */}
            <p className="text-sm font-medium text-slate-500 mb-3">
              {prof.role}
            </p>

            {/* Rating Stars */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200/80 mb-6">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-extrabold text-slate-900">{prof.rating}</span>
              <span className="text-xs text-slate-500 font-medium">({prof.reviewsCount} reseñas)</span>
            </div>

            {/* Stats Row (Experiencia | Tarifa Base) */}
            <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-100 mb-6">
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Experiencia
                </span>
                <span className="text-base sm:text-lg font-extrabold text-slate-900">
                  {prof.experienceYears} años
                </span>
              </div>
              <div className="border-l border-slate-100 pl-3">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Tarifa base
                </span>
                <span className="text-base sm:text-lg font-extrabold text-blue-700">
                  ${prof.hourlyRate} / hr
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleBook}
                className="w-full py-3.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-700/25 flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>{bookingSuccess ? '¡Reserva Confirmada!' : 'Reservar Ahora'}</span>
              </button>

              <button
                onClick={() => onContact(prof)}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-blue-700 font-bold rounded-2xl border border-blue-200 shadow-xs flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar Mensaje</span>
              </button>
            </div>
          </div>

          {/* Card 2: Pertenece A & Horarios */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div>
              <span className="block text-xs font-extrabold text-slate-400 tracking-wider uppercase mb-3">
                PERTENECE A
              </span>
              <div className="flex items-start gap-3">
                <img
                  src={prof.company.logo}
                  alt={prof.company.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {prof.company.name}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5 line-clamp-2">
                    {prof.company.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              {/* Working Hours */}
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800">Horario de atención</div>
                  <div className="text-slate-500">{prof.workingHours}</div>
                </div>
              </div>

              {/* SOS Support */}
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <Asterisk className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800">Soporte S.O.S.</div>
                  <div className="text-emerald-600 font-semibold">{prof.sosSupport}</div>
                </div>
              </div>
            </div>
          </div>

        </div>


        {/* ================= RIGHT COLUMN ================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Row 1: Especialidades & Ubicación Grid (2 cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card: Especialidades */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base mb-4">
                <Wrench className="w-4 h-4 text-blue-700" />
                <span>Especialidades</span>
              </div>

              {/* Specialty Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {prof.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-100/90 text-slate-800 rounded-xl text-xs font-semibold"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {prof.bio}
              </p>
            </div>

            {/* Card: Ubicación */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base mb-3">
                  <MapPin className="w-4 h-4 text-blue-700" />
                  <span>Ubicación</span>
                </div>

                {/* Mini map graphical thumbnail */}
                <div className="relative h-28 w-full rounded-2xl bg-blue-50/50 border border-slate-200 overflow-hidden mb-3">
                  <svg viewBox="0 0 400 150" className="w-full h-full object-cover">
                    <rect width="400" height="150" fill="#EAEFF5" />
                    <line x1="0" y1="75" x2="400" y2="75" stroke="#FFFFFF" strokeWidth="8" />
                    <line x1="200" y1="0" x2="200" y2="150" stroke="#FFFFFF" strokeWidth="8" />
                    <path d="M 0,30 Q 150,90 400,50" fill="none" stroke="#FDE68A" strokeWidth="10" />
                    <circle cx="200" cy="75" r="7" fill="#1D4ED8" />
                    <circle cx="200" cy="75" r="14" fill="#93C5FD" opacity="0.5" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="px-2.5 py-1 bg-white/95 rounded-lg text-[10px] font-bold text-slate-800 shadow-xs border border-slate-200">
                      {prof.location.city}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-medium text-slate-700">
                  {prof.location.address}
                </p>
              </div>

              <button
                onClick={() => alert(`Abriendo coordenadas de ${prof.name} en León Guanajuato.`)}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors mt-3"
              >
                <span>Ver en mapa completo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Row 2: Reseñas Recientes Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base sm:text-lg">
                <MessageSquare className="w-5 h-5 text-blue-700" />
                <span>Reseñas Recientes</span>
              </div>
              <button 
                onClick={() => alert(`Total de 124 opiniones verificadas con una valoración promedio de 4.9/5 estrellas para ${prof.name}.`)}
                className="text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors"
              >
                Ver todas ({prof.reviewsCount})
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {prof.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/80"
                >
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-3">
                      {/* Avatar initial letter */}
                      <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm shadow-xs">
                        {rev.initials}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {rev.author}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {rev.timeAgo}
                        </span>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3.5 h-3.5 ${
                            idx < rev.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
