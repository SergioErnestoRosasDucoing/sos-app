import React, { useState } from 'react';
import {
  Asterisk,
  Home,
  Users,
  MessageSquare,
  Clock,
  User,
  HelpCircle,
  PhoneCall,
  Menu,
  X,
  ShieldAlert,
  LogOut,
  LogIn
} from 'lucide-react';

export default function Header({
  currentView,
  onNavigate,
  unreadMessagesCount = 0,
  onOpenEmergencyModal,
  user,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'profesionales', label: 'Buscar Profesionales', shortLabel: 'Profesionales', icon: Users },
    { id: 'mensajes', label: 'Mensajes', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'historial', label: 'Historial', icon: Clock },
    { id: 'cuenta', label: 'Mi Cuenta', shortLabel: 'Cuenta', icon: User }
  ];

  const handleNavClick = (viewId) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('inicio')}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-xs">
              <Asterisk className="w-5 h-5 stroke-[2.8]" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-blue-700 group-hover:text-blue-800 transition-colors">
              S.O.S. Ayuda
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || 
                (item.id === 'inicio' && ['triage', 'actionPlan'].includes(currentView)) ||
                (item.id === 'profesionales' && currentView === 'professionalDetail');

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700 stroke-[2.5]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>

                  {/* Unread badge */}
                  {item.badge && item.badge > 0 ? (
                    <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Emergency Quick-Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick 911 SOS Button */}
            <button
              onClick={onOpenEmergencyModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-all text-xs sm:text-sm font-bold shadow-xs active:scale-95"
              title="Llamada de Emergencia Inmediata"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SOS</span> 911
            </button>

            {/* Help Button */}
            <button 
              onClick={() => alert('Centro de Ayuda S.O.S. Ayuda:\n\n1. Seleccione una categoría de emergencia.\n2. Responda las preguntas rápidas del asistente inteligente.\n3. Siga las medidas inmediatas de seguridad.\n4. Contacte a un profesional verificado cercano con asistencia 24/7.')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
              title="Ayuda y Soporte"
              aria-label="Ayuda"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* User Profile / Auth Control */}
            {user ? (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => handleNavClick('cuenta')}
                  className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
                  title={user.full_name || user.email}
                  aria-label="Perfil"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {(user.full_name || user.email).slice(0, 2).toUpperCase()}
                  </div>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white transition-all text-xs sm:text-sm font-bold"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Iniciar sesión</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Abrir Menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-blue-600 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
