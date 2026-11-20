import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';

export default function EmergencyBanner({ onCallEmergency }) {
  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4 text-center sm:text-left">
        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0">
          <AlertTriangle className="w-5 h-5 text-slate-900" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            ¿Emergencia Grave?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Si su vida está en peligro, llame a los servicios de emergencia nacionales.
          </p>
        </div>
      </div>

      <button
        onClick={onCallEmergency}
        className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-slate-900 border border-slate-200 font-semibold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-200 shadow-xs flex items-center justify-center gap-2 group whitespace-nowrap active:scale-95"
      >
        <span className="w-2 h-2 rounded-full bg-red-500 group-hover:animate-ping" />
        <span>Llamar al 112 / 911</span>
      </button>
    </div>
  );
}
