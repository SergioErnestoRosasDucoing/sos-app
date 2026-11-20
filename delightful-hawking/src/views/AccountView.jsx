import React, { useState } from 'react';
import { ShieldAlert, Car, Check, Save, Droplet, Mail, User as UserIcon } from 'lucide-react';
import { updateMe } from '../api/auth';
import { ApiError } from '../api/client';
import { BLOOD_TYPES, FREE_TEXT_MAX_LENGTH } from '../utils/bloodTypes';

export default function AccountView({ user, token, onUserUpdated }) {
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [bloodType, setBloodType] = useState(user?.blood_type ?? '');
  const [vehicleInfo, setVehicleInfo] = useState(user?.vehicle_info ?? '');
  const [iceContact, setIceContact] = useState(user?.ice_contact ?? '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const updatedUser = await updateMe(
        { full_name: fullName, blood_type: bloodType, vehicle_info: vehicleInfo, ice_contact: iceContact },
        token
      );
      onUserUpdated(updatedUser);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fadeIn">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mi Cuenta y Configuración SOS
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Datos médicos, vehículo registrado y contacto ICE para emergencias rápidas.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Personal Details */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold">
              {(fullName || user.email).slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Información Personal</h2>
              <p className="text-xs text-slate-500">Datos visibles para operadores y especialistas</p>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              <UserIcon className="w-3.5 h-3.5" />
              Nombre completo
            </label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={100}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              <Mail className="w-3.5 h-3.5" />
              Correo electrónico
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              <Droplet className="w-3.5 h-3.5" />
              Tipo de Sangre
            </label>
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
            >
              <option value="">Sin especificar</option>
              {BLOOD_TYPES.map((bt) => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Emergency ICE Contact & Vehicle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* ICE Contact Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2.5 text-red-600 font-extrabold text-sm mb-4">
              <ShieldAlert className="w-4 h-4" />
              <span>Contacto de Emergencia (ICE)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nombre, parentesco y teléfono</label>
              <textarea
                rows={3}
                value={iceContact}
                onChange={(e) => setIceContact(e.target.value)}
                maxLength={FREE_TEXT_MAX_LENGTH}
                placeholder="Elena Silva (Esposa) — +52 477 554 9910"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium resize-none"
              />
            </div>
          </div>

          {/* Vehicle Registered Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2.5 text-blue-700 font-extrabold text-sm mb-4">
              <Car className="w-4 h-4" />
              <span>Vehículo Registrado</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Marca, Modelo y Placas</label>
                <input
                  type="text"
                  value={vehicleInfo}
                  onChange={(e) => setVehicleInfo(e.target.value)}
                  maxLength={FREE_TEXT_MAX_LENGTH}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Se transmite automáticamente a las grúas para facilitar la identificación.
              </p>
            </div>
          </div>

        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        {/* Save button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-emerald-600 font-bold text-sm flex items-center gap-1">
              <Check className="w-4 h-4" /> ¡Cambios guardados con éxito!
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold rounded-2xl shadow-md flex items-center gap-2 transition-all active:scale-95 text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Preferencias'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
