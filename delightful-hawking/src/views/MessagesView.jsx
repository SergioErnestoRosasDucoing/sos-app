import React, { useState, useEffect } from 'react';
import {
  Send,
  Phone,
  MapPin,
  Check,
  CheckCheck,
  ShieldCheck,
  Image as ImageIcon,
  Paperclip,
  Clock,
  Sparkles,
  Loader2,
  Bell,
  BellRing
} from 'lucide-react';
import { fetchMessages, toChatMessage } from '../api/messages';
import { getSocket, disconnectSocket } from '../socket/client';
import { subscribeToPush } from '../utils/push';

export default function MessagesView({ activeProfessional, triageReport, activeRequestId, token }) {
  const prof = activeProfessional;

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);

  const handleEnableNotifications = async () => {
    setNotificationsError(null);
    try {
      await subscribeToPush(token);
      setNotificationsEnabled(true);
    } catch (err) {
      setNotificationsError(err.message || 'No se pudieron activar las notificaciones.');
    }
  };

  useEffect(() => {
    if (!prof || !activeRequestId || !token) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const systemMessage = {
      id: 'system-report',
      sender: 'system',
      text: `📋 Reporte Automático de Emergencia S.O.S.:\n• Categoría: ${triageReport?.category || 'Averías del coche'}\n• Síntoma detectado: ${triageReport?.symptom?.label || 'Humo en el motor'}\n• Ubicación: ${prof.location?.address || 'Sin ubicación registrada'}`,
      time: '',
    };

    fetchMessages(activeRequestId, token)
      .then((history) => {
        if (cancelled) return;
        setMessages([systemMessage, ...history]);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'No se pudo cargar la conversación.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    const socket = getSocket(token);
    socket.connect();
    socket.emit('join_request', { requestId: activeRequestId });

    const handleNewMessage = (row) => {
      setMessages((prev) => [...prev, toChatMessage(row)]);
    };
    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
      disconnectSocket();
    };
  }, [prof, activeRequestId, token, triageReport]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeRequestId) return;

    getSocket(token).emit('send_message', { requestId: activeRequestId, content: inputMessage });
    setInputMessage('');
  };

  if (!prof || !activeRequestId) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center animate-fadeIn">
        <p className="text-slate-500 font-medium">No hay ninguna conversación activa. Contacta a un profesional para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fadeIn">

      {/* Chat Card Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[680px]">

        {/* Chat Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={prof.avatar}
                alt={prof.name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-slate-900 text-base">{prof.name}</h3>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                  En Servicio
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{prof.role} • {prof.company.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEnableNotifications}
              disabled={notificationsEnabled}
              className={`p-2.5 rounded-xl transition-all shadow-xs ${
                notificationsEnabled
                  ? 'bg-emerald-50 text-emerald-700 cursor-default'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'
              }`}
              title={notificationsEnabled ? 'Notificaciones activadas' : 'Activar notificaciones'}
            >
              {notificationsEnabled ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            </button>
            <button
              onClick={() => alert(`Iniciando llamada directa con ${prof.name}...`)}
              className="p-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-xs"
              title="Llamar al profesional"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {notificationsError && (
          <div className="px-4 py-2 bg-rose-50 border-b border-rose-100 text-xs text-rose-700 font-medium">
            {notificationsError}
          </div>
        )}

        {/* ETA & Status Notification */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-emerald-800">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Tiempo estimado de arribo: <strong>12-15 minutos</strong>
          </span>
          <span className="text-[11px] text-emerald-600 font-normal">
            Monitoreo GPS activo
          </span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F8FAFC]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p className="text-xs font-medium">Cargando conversación...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="max-w-md mx-auto bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {!isLoading && messages.map((m) => {
            if (m.sender === 'system') {
              return (
                <div key={m.id} className="max-w-md mx-auto bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 font-mono shadow-xs whitespace-pre-line leading-relaxed">
                  {m.text}
                </div>
              );
            }

            const isUser = m.sender === 'user';

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-xs sm:max-w-md rounded-2xl px-4 py-3 text-sm font-medium shadow-xs ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                  {m.time}
                  {isUser && <CheckCheck className="w-3 h-3 text-blue-500" />}
                </span>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert('Adjuntar foto del vehículo o falla.')}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Adjuntar foto"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escriba un mensaje para el especialista..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
          />

          <button
            type="submit"
            className="p-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-md transition-all active:scale-95 shrink-0"
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
