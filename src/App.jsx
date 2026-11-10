import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import LoginPage from './components/common/LoginPage';

// Common Views
import Schedules from './components/common/Schedules';
import ClinicalReports from './components/common/ClinicalReports';

// Admin Views
import MainDashboard from './components/admin/MainDashboard';
import BedManagement from './components/admin/BedManagement';
import PatientRecords from './components/admin/PatientRecords';
import BillingManagement from './components/admin/BillingManagement';

// Doctor Views
import DoctorDashboard from './components/doctor/DoctorDashboard';
import PatientDetailAI from './components/doctor/PatientDetailAI';
import Prescriptions from './components/doctor/Prescriptions';

// Patient View
import PatientHome from './components/patient/PatientHome';

function MainAppShell({ userSession, onLogout }) {
  const { currentRole, activeAdminTab, activeDoctorTab } = useApp();

  if (currentRole === 'patient') {
    return (
      <div className="min-h-screen flex flex-col bg-background text-on-surface">
        <Header userSession={userSession} onLogout={onLogout} />
        <PatientHome />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <Header userSession={userSession} onLogout={onLogout} />
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        <Sidebar />
        <main className="flex-1 md:ml-[240px] md:ml-[260px] h-full overflow-y-auto p-4 md:p-8 bg-background">
          <div className="max-w-[1440px] mx-auto">
            {currentRole === 'admin' && (
              <>
                {activeAdminTab === 'dashboard' && <MainDashboard />}
                {activeAdminTab === 'bed' && <BedManagement />}
                {activeAdminTab === 'records' && <PatientRecords />}
                {activeAdminTab === 'billing' && <BillingManagement />}
                {activeAdminTab === 'prescriptions' && <Prescriptions />}
                {activeAdminTab === 'schedules' && <Schedules />}
                {activeAdminTab === 'reports' && <ClinicalReports />}
              </>
            )}

            {currentRole === 'doctor' && (
              <>
                {activeDoctorTab === 'roster' && <DoctorDashboard />}
                {activeDoctorTab === 'patientDetail' && <PatientDetailAI />}
                {activeDoctorTab === 'prescriptions' && <Prescriptions />}
                {activeDoctorTab === 'schedules' && <Schedules />}
                {activeDoctorTab === 'reports' && <ClinicalReports />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userSession, setUserSession] = useState(null);

  const handleLoginSuccess = (session) => {
    setUserSession(session);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUserSession(null);
    setIsLoggedIn(false);
  };

  return (
    <AppProvider>
      {!isLoggedIn ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <MainAppShell userSession={userSession} onLogout={handleLogout} />
      )}
    </AppProvider>
  );
}
