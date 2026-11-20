import React, { useState } from 'react';
import Header from './components/Header';
import EmergencyModal from './components/EmergencyModal';
import HomeView from './views/HomeView';
import TriageView from './views/TriageView';
import ActionPlanView from './views/ActionPlanView';
import ProfessionalsView from './views/ProfessionalsView';
import ProfessionalDetailView from './views/ProfessionalDetailView';
import MessagesView from './views/MessagesView';
import HistoryView from './views/HistoryView';
import AccountView from './views/AccountView';
import AuthView from './views/AuthView';
import { useAuth } from './hooks/useAuth';
import { createServiceRequest } from './api/serviceRequests';
import { ApiError } from './api/client';

export default function App() {
  // Navigation & Flow State
  const [currentView, setCurrentView] = useState('inicio'); // 'inicio' | 'login' | 'register' | 'triage' | 'actionPlan' | 'profesionales' | 'professionalDetail' | 'mensajes' | 'historial' | 'cuenta'
  const [selectedCategory, setSelectedCategory] = useState('coche');
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [triageReport, setTriageReport] = useState(null);
  const [activeRequestId, setActiveRequestId] = useState(null);

  const { token, user, login, logout } = useAuth();

  const requireAuth = () => {
    if (!token) {
      setCurrentView('login');
      return false;
    }
    return true;
  };

  const handleAuthSuccess = (newToken, newUser) => {
    login(newToken, newUser);
    setCurrentView('inicio');
  };

  const handleLogout = () => {
    logout();
    setActiveRequestId(null);
    setCurrentView('inicio');
  };

  // Flow Step 1: User picks category on Home -> Go to Triage
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setCurrentView('triage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Flow Step 2: User answers Triage symptom -> Go to Action Plan
  const handleCompleteTriage = (symptom) => {
    setSelectedSymptom(symptom);
    setTriageReport({
      category: selectedCategory,
      symptom: symptom,
      timestamp: new Date().toLocaleTimeString()
    });
    setCurrentView('actionPlan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Flow Step 3: User finishes Action Plan -> Go to Nearby Professionals
  const handleFindProfessionals = () => {
    setCurrentView('profesionales');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Flow Step 4: User clicks a professional card -> Go to Detail View
  const handleSelectProfessionalDetail = (prof) => {
    setSelectedProfessional(prof);
    setCurrentView('professionalDetail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Creates (or reuses) a real service_request and opens the chat for it
  const startConversation = async (prof) => {
    if (!requireAuth()) return;

    setSelectedProfessional(prof);

    try {
      const serviceRequest = await createServiceRequest({ proId: prof.id, token });
      setActiveRequestId(serviceRequest.id);
      setCurrentView('mensajes');
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'No se pudo iniciar la solicitud. Intenta de nuevo.');
    }
  };

  // Flow Step 5: User clicks "Contactar" or "Enviar Mensaje" -> Go to Messages
  const handleContactProfessional = (prof) => {
    startConversation(prof);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User clicks "Reservar Ahora" on profile
  const handleBookNow = (prof) => {
    startConversation(prof);
  };

  // Direct tab navigation
  const handleNavigateTab = (viewId) => {
    if ((viewId === 'historial' || viewId === 'cuenta') && !requireAuth()) return;
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Global Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigateTab}
        onOpenEmergencyModal={() => setEmergencyModalOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Router */}
      <main className="flex-1 pb-16">

        {/* Vista 1: Inicio */}
        {currentView === 'inicio' && (
          <HomeView
            onSelectCategory={handleSelectCategory}
            onOpenEmergencyModal={() => setEmergencyModalOpen(true)}
          />
        )}

        {/* Vistas de Autenticación */}
        {(currentView === 'login' || currentView === 'register') && (
          <AuthView
            mode={currentView}
            onSwitchMode={setCurrentView}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {/* Vista 2: Triage Chatbot Dinámico */}
        {currentView === 'triage' && (
          <TriageView
            categoryId={selectedCategory}
            onBack={() => setCurrentView('inicio')}
            onCompleteTriage={handleCompleteTriage}
          />
        )}

        {/* Vista 3: Plan de Acción Dinámico */}
        {currentView === 'actionPlan' && (
          <ActionPlanView
            categoryId={selectedCategory}
            selectedSymptom={selectedSymptom}
            onBack={() => setCurrentView('triage')}
            onFindProfessionals={handleFindProfessionals}
            onOpenEmergencyModal={() => setEmergencyModalOpen(true)}
          />
        )}

        {/* Vista 4: Profesionales Cercanos (Split View Lista + Mapa) */}
        {currentView === 'profesionales' && (
          <ProfessionalsView
            categoryId={selectedCategory}
            onBack={() => setCurrentView('actionPlan')}
            onSelectProfessionalDetail={handleSelectProfessionalDetail}
            onContactProfessional={handleContactProfessional}
          />
        )}

        {/* Vista 5: Detalle de Profesional */}
        {currentView === 'professionalDetail' && (
          <ProfessionalDetailView
            professional={selectedProfessional}
            onBack={() => setCurrentView('profesionales')}
            onContact={handleContactProfessional}
            onBookNow={handleBookNow}
          />
        )}

        {/* Pestaña: Mensajes / Chat de Asistencia */}
        {currentView === 'mensajes' && (
          <MessagesView
            activeProfessional={selectedProfessional}
            triageReport={triageReport}
            activeRequestId={activeRequestId}
            token={token}
          />
        )}

        {/* Pestaña: Historial de Solicitudes */}
        {currentView === 'historial' && (
          <HistoryView
            token={token}
            onReorderService={(cat) => {
              setSelectedCategory(cat);
              setCurrentView('triage');
            }}
          />
        )}

        {/* Pestaña: Mi Cuenta y Contactos ICE */}
        {currentView === 'cuenta' && (
          <AccountView
            user={user}
            token={token}
            onUserUpdated={(updatedUser) => login(token, updatedUser)}
          />
        )}

      </main>

      {/* Emergency Call Modal (911 / 112 / Coordenadas) */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-blue-700">S.O.S. Ayuda</span>
            <span>• Plataforma de Asistencia Inmediata y Triage</span>
          </div>
          <div>
            Centro de Operaciones: León, Guanajuato & CDMX • Soporte 24/7
          </div>
        </div>
      </footer>

    </div>
  );
}
