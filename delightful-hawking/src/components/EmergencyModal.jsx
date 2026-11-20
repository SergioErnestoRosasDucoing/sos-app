import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  ShieldAlert, 
  Ambulance, 
  Flame, 
  MapPin, 
  Copy, 
  Check, 
  Radio
} from 'lucide-react';

export default function EmergencyModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [callingNumber, setCallingNumber] = useState(null);

  if (!isOpen) return null;

  const userLocation = "Blvd. Adolfo López Mateos 1820, León, Guanajuato (Coords: 21.1250° N, 101.6850° W)";

  const handleCopyLocation = () => {
    navigator.clipboard.writeText(userLocation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulateCall = (number, name) => {
    setCallingNumber({ number, name });
    setTimeout(() => {
      setCallingNumber(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-red-100 overflow-hidden relative">
        
        {/* Calling Banner overlay if active */}
        {callingNumber && (
          <div className="absolute inset-0 bg-red-600 z-10 flex flex-col items-center justify-center text-white p-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 pulse-emergency">
              <PhoneCall className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-xl font-extrabold mb-1">Conectando con {callingNumber.name}...</h3>
            <p className="text-3xl font-mono font-bold tracking-wider my-2">{callingNumber.number}</p>
            <p className="text-red-100 text-sm max-w-xs">
              Transmitiendo coordenadas GPS y audio de emergencia de manera prioritaria...
            </p>
            <button
              onClick={() => setCallingNumber(null)}
              className="mt-6 px-6 py-2 bg-white text-red-700 font-bold rounded-full hover:bg-red-50 text-sm shadow-md"
            >
              Finalizar Llamada Simulada
            </button>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Central de Emergencias
              </h2>
              <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Líneas prioritarias nacionales y auxilio 24/7
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Location Coords Box */}
        <div className="my-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1.5 text-blue-700">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Tu ubicación actual para el operador:
            </span>
            <button
              onClick={handleCopyLocation}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? '¡Copiado!' : 'Copiar Coordenadas'}
            </button>
          </div>
          <p className="text-xs font-mono font-medium text-slate-800 bg-white p-2 rounded-lg border border-slate-100 break-all">
            {userLocation}
          </p>
        </div>

        {/* Emergency Quick Action Buttons */}
        <div className="space-y-2.5 my-4">
          <button
            onClick={() => handleSimulateCall('911', 'Emergencias 911')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-md active:scale-98 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-base font-extrabold leading-tight">911 - Emergencia General</div>
                <div className="text-xs text-red-100 font-normal">Policía, Ambulancia y Rescate Nacional</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-mono uppercase tracking-wider group-hover:bg-white group-hover:text-red-700 transition-all">
              Llamar
            </span>
          </button>

          <button
            onClick={() => handleSimulateCall('065', 'Cruz Roja')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 font-bold transition-all active:scale-98 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-200/80 text-rose-700 flex items-center justify-center">
                <Ambulance className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-base font-extrabold leading-tight">065 - Cruz Roja Mexicana</div>
                <div className="text-xs text-rose-700 font-normal">Paramédicos y traslado en ambulancia</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-rose-200 rounded-full text-xs text-rose-900 font-mono group-hover:bg-rose-600 group-hover:text-white transition-all">
              Marcar
            </span>
          </button>

          <button
            onClick={() => handleSimulateCall('068', 'Cuerpo de Bomberos')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold transition-all active:scale-98 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-200/80 text-amber-700 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-base font-extrabold leading-tight">068 - Bomberos & Fugas de Gas</div>
                <div className="text-xs text-amber-800 font-normal">Incendios, inundaciones y rescate urbano</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-200 rounded-full text-xs text-amber-900 font-mono group-hover:bg-amber-600 group-hover:text-white transition-all">
              Marcar
            </span>
          </button>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-center text-slate-500 mt-3">
          S.O.S. Ayuda prioriza el canal de socorro. Mantenga la línea libre tras colgar para recibir llamada de confirmación del despachador.
        </p>
      </div>
    </div>
  );
}
