import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const {
    currentRole,
    activeAdminTab,
    setActiveAdminTab,
    activeDoctorTab,
    setActiveDoctorTab
  } = useApp();

  if (currentRole === 'patient') return null;

  return (
    <aside className="hidden md:flex flex-col h-full py-6 bg-[#00343b] fixed left-0 top-0 w-[240px] md:w-[260px] z-50 border-r border-[#00252a] text-white shadow-xl">
      {/* Brand Header */}
      <div className="px-6 mb-7">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-[#e65c00] text-white flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-white text-[22px] icon-filled">
              health_and_safety
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-display-lg text-lg font-extrabold text-white tracking-tight">Apollo</span>
              <span className="font-display-lg text-lg font-bold text-amber-400 tracking-tight">Care</span>
            </div>
            <p className="text-[10px] text-teal-200 uppercase tracking-wider font-semibold">
              Bangalore Hub
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs mt-3">
          <span className="text-[11px] text-teal-100/80 font-medium">Access Level</span>
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wide bg-amber-400/20 px-2 py-0.5 rounded">
            {currentRole}
          </span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {/* Admin Tabs */}
          {currentRole === 'admin' && (
            <>
              <li>
                <button
                  onClick={() => setActiveAdminTab('dashboard')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-xs font-semibold ${
                    activeAdminTab === 'dashboard'
                      ? 'text-amber-300 bg-white/10 border-l-4 border-[#e65c00] font-bold shadow-xs'
                      : 'text-teal-100/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined mr-3 text-[20px]">dashboard</span>
                  Clinical Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveAdminTab('records')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-xs font-semibold ${
                    activeAdminTab === 'records'
                      ? 'text-amber-300 bg-white/10 border-l-4 border-[#e65c00] font-bold shadow-xs'
                      : 'text-teal-100/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined mr-3 text-[20px]">personal_injury</span>
                  Patient Records
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveAdminTab('bed')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-xs font-semibold ${
                    activeAdminTab === 'bed'
                      ? 'text-amber-300 bg-white/10 border-l-4 border-[#e65c00] font-bold shadow-xs'
                      : 'text-teal-100/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined mr-3 text-[20px]">bed</span>
                  Apollo Bed Occupancy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveAdminTab('billing')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-xs font-semibold ${
                    activeAdminTab === 'billing'
                      ? 'text-amber-300 bg-white/10 border-l-4 border-[#e65c00] font-bold shadow-xs'
                      : 'text-teal-100/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined mr-3 text-[20px]">payments</span>
                  Billing & Invoices (₹)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveAdminTab('prescriptions')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-xs font-semibold ${
                    activeAdminTab === 'prescriptions'
                      ? 'text-amber-300 bg-white/10 border-l-4 border-[#e65c00] font-bold shadow-xs'
                      : 'text-teal-100/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined mr-3 text-[20px] icon-filled">medication</span>
                  Apollo Pharmacy E-Rx
                </button>
              </li>
            </>
          )}

          {/* Doctor Tabs */}
          {currentRole === 'doctor' && (
            <>
              <li>
                <button
                  onClick={() => setActiveDoctorTab('roster')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-xs font-semibold ${
                    activeDoctorTab === 'roster'
                      ? 'text-amber-300 bg-white/10 border-l-4 border-[#e65c00] font-bold shadow-xs'
                      : 'text-teal-100/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined mr-3 text-[20px]">groups</span>
                  Patient Roster
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveDoctorTab('patientDetail')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-xs font-semibold ${
                    activeDoctorTab === 'patientDetail'
                      ? 'text-amber-300 bg-white/10 border-l-4 border-[#e65c00] font-bold shadow-xs'
                      : 'text-teal-100/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined mr-3 text-[20px] icon-filled">personal_injury</span>
                  Patient Detail & AI Tensors
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveDoctorTab('prescriptions')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-xs font-semibold ${
                    activeDoctorTab === 'prescriptions'
                      ? 'text-amber-300 bg-white/10 border-l-4 border-[#e65c00] font-bold shadow-xs'
                      : 'text-teal-100/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined mr-3 text-[20px] icon-filled">medication</span>
                  E-Prescriptions
                </button>
              </li>
            </>
          )}

          {/* Shared Links: Schedules & Clinical Reports */}
          <li>
            <button
              onClick={() => {
                if (currentRole === 'admin') setActiveAdminTab('schedules');
                else setActiveDoctorTab('schedules');
              }}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-xs font-semibold ${
                (currentRole === 'admin' && activeAdminTab === 'schedules') ||
                (currentRole === 'doctor' && activeDoctorTab === 'schedules')
                  ? 'text-amber-300 bg-white/10 border-l-4 border-[#e65c00] font-bold shadow-xs'
                  : 'text-teal-100/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined mr-3 text-[20px]">event</span>
              Schedules & Slots
            </button>
          </li>

          <li>
            <button
              onClick={() => {
                if (currentRole === 'admin') setActiveAdminTab('reports');
                else setActiveDoctorTab('reports');
              }}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-xs font-semibold ${
                (currentRole === 'admin' && activeAdminTab === 'reports') ||
                (currentRole === 'doctor' && activeDoctorTab === 'reports')
                  ? 'text-amber-300 bg-white/10 border-l-4 border-[#e65c00] font-bold shadow-xs'
                  : 'text-teal-100/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined mr-3 text-[20px]">analytics</span>
              50k Dataset AI Reports
            </button>
          </li>
        </ul>
      </div>

      {/* Staff Profile Footer */}
      <div className="px-6 mt-auto">
        <div className="flex items-center pt-4 border-t border-inverse-on-surface/10">
          <img
            src={
              currentRole === 'admin'
                ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDVXrp07-nxnIkhJ4UTii9bNoyEPO3llo7G8wh0Mzbb3hubQwoH18kQoi0eE2px5CN7HgDH6fJ_4hAQ9YSsdEl92FeiA9LXSfBrSl5dh8ZOifo6wbY-vAX5IjyJT1b9UYjEsH_IGMwJGDEVLEcYprDPlCJeTJoq090qqKhhQTpEkmUjf_xH_dml5Vyy1vLtmLWdUhUndS6sY_Y_8AIpZPYdoFW-t8qOF_1V4agnl_1vcmb2qPvjp60"
                : "https://lh3.googleusercontent.com/aida-public/AB6AXuCbMCMDZw_nmyaYTWtuXo3DVIu19bBgW5h-pAkRWh7ZTJocQFtQbgvcYlSYOpcXtF2CF0w5vCQ4NJHMcoUqw0618euYfTfCCtc-8H56cyKoFzQgD0e6YjcDFc_VpT59d6PHAIAfngTcCJzwUZj3QF-Myf9kAOrWE4NqqI7q_qujBqSQYfUbAVnYrbuUKXwRIZAiIdNOWSyjv-2tStnPlXH7bocCTFQSLBQnh_l6OHe7Z12mXOJoSQE"
            }
            alt="Staff Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-inverse-on-surface/20 shrink-0"
          />
          <div className="ml-3 min-w-0">
            <p className="text-sm font-semibold text-inverse-on-surface truncate">
              {currentRole === 'admin' ? 'Dr. Sarah Jenkins' : 'Dr. S. Chen'}
            </p>
            <p className="text-xs text-inverse-on-surface/70 truncate">
              {currentRole === 'admin' ? 'Chief of Staff' : 'Pulmonology'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
