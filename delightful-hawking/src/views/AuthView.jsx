import React, { useState } from 'react';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { login as loginRequest, register as registerRequest } from '../api/auth';
import { ApiError } from '../api/client';
import { BLOOD_TYPES, FREE_TEXT_MAX_LENGTH } from '../utils/bloodTypes';

export default function AuthView({ mode = 'login', onSwitchMode, onAuthSuccess }) {
  const isLogin = mode === 'login';

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [iceContact, setIceContact] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { token, user } = isLogin
        ? await loginRequest({ email, password })
        : await registerRequest({
            email,
            full_name: fullName,
            password,
            blood_type: bloodType || undefined,
            vehicle_info: vehicleInfo || undefined,
            ice_contact: iceContact || undefined,
          });

      onAuthSuccess(token, user);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-10 sm:py-16 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">
              {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </h1>
            <p className="text-xs text-slate-500">
              {isLogin ? 'Accede a tu historial y mensajes de S.O.S. Ayuda' : 'Regístrate para solicitar asistencia'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sergio Ernesto Rosas Ducoing"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tipo de sangre <span className="text-slate-400 font-normal normal-case">(opcional)</span>
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                >
                  <option value="">Selecciona...</option>
                  {BLOOD_TYPES.map((bt) => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Vehículo <span className="text-slate-400 font-normal normal-case">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={vehicleInfo}
                  onChange={(e) => setVehicleInfo(e.target.value)}
                  maxLength={FREE_TEXT_MAX_LENGTH}
                  placeholder="Volkswagen Jetta 2021, Placas GTO-882-D"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contacto de emergencia (ICE) <span className="text-slate-400 font-normal normal-case">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={iceContact}
                  onChange={(e) => setIceContact(e.target.value)}
                  maxLength={FREE_TEXT_MAX_LENGTH}
                  placeholder="Elena Silva (Esposa) — +52 477 554 9910"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>
            </>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Procesando...' : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</span>
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-5">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            type="button"
            onClick={() => onSwitchMode(isLogin ? 'register' : 'login')}
            className="font-bold text-blue-700 hover:text-blue-800"
          >
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}
