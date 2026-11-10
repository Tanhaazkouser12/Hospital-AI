import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import NotificationDrawer from './NotificationDrawer';

export default function Header({ userSession, onLogout }) {
  const {
    currentRole,
    loggedInUser,
    notifications,
    isMobilePreview,
    setIsMobilePreview,
    patients,
    setSelectedPatientId,
    setActiveDoctorTab
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchResults = searchQuery.trim()
    ? patients.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.mrn.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSelectSearchResult = (id) => {
    setSelectedPatientId(id);
    if (currentRole === 'doctor') setActiveDoctorTab('patientDetail');
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const displayName = loggedInUser?.name || userSession?.name || (currentRole === 'admin' ? 'Dr. Sarah Jenkins' : currentRole === 'doctor' ? 'Dr. S. Chen' : 'Patient User');
  const displayTitle = loggedInUser?.title || userSession?.title || (currentRole === 'admin' ? 'Chief of Staff' : currentRole === 'doctor' ? 'Attending Physician' : 'Smart Care Member');

  return (
    <div className="sticky top-0 z-40 w-full flex flex-col shadow-xs">
      {/* Apollo Top Utility & Emergency Bar */}
      <div className="bg-[#004b54] text-white/90 text-[11px] px-4 md:px-8 py-1.5 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#e65c00] text-white px-2.5 py-0.5 rounded-full font-bold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            <span>24x7 Emergency: 1066</span>
          </div>
          <span className="hidden sm:inline text-white/70">|</span>
          <span className="hidden sm:inline flex items-center gap-1 text-white/90 font-medium">
            <span className="material-symbols-outlined text-[14px] text-amber-400">location_on</span>
            Apollo Bangalore (Bannerghatta & Jayanagar)
          </span>
          <span className="hidden md:inline text-white/70">|</span>
          <span className="hidden md:inline text-teal-200 text-[10px] font-semibold tracking-wide">
            ✓ JCI & NABH ACCREDITED • 50,000+ AI CLINICAL RECORDS
          </span>
        </div>
        <div className="flex items-center gap-3 text-white/90 text-xs">
          <span className="hidden lg:inline text-[11px] text-white/80">Need Help? 24/7 Careline</span>
          <span className="font-bold text-amber-300">1860-500-1066</span>
        </div>
      </div>

      {/* Main Apollo Header */}
      <header className="h-16 w-full border-b border-outline-variant/50 bg-surface/95 backdrop-blur-md px-4 md:px-8 flex justify-between items-center transition-all">
        {/* Brand & Active Role Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            {/* Apollo Radiant Curved Emblem */}
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#005963] to-[#003b42] text-white flex items-center justify-center shadow-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 to-transparent"></div>
              <span className="material-symbols-outlined text-[22px] text-amber-300 icon-filled">
                health_and_safety
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-display-lg text-lg md:text-xl font-extrabold text-[#005963] tracking-tight leading-none">
                  Apollo
                </span>
                <span className="font-display-lg text-lg md:text-xl font-bold text-[#e65c00] tracking-tight leading-none">
                  Hospitals
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 leading-tight">
                Bangalore • Smart Care & Clinical Hub
              </span>
            </div>
          </div>

          {/* Active Role Indicator Pill */}
          <div className="px-3 py-1 bg-teal-50 border border-teal-200/80 rounded-full flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#005963] animate-pulse"></span>
            <span className="font-bold uppercase text-[#005963] tracking-wider text-[10px]">
              {currentRole} Portal
            </span>
          </div>
        </div>

      {/* Center Search Bar */}
      <div className="relative max-w-md w-full mx-4 hidden md:block">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px] group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search patients, MRN, rooms..."
            className="w-full pl-10 pr-4 py-1.5 bg-surface-container-lowest border border-outline-variant/60 rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-xs text-on-surface placeholder:text-outline-variant h-9 transition-all shadow-xs"
          />
        </div>

        {/* Live Search Results Dropdown */}
        {isSearchFocused && searchResults.length > 0 && (
          <div className="absolute top-11 left-0 w-full bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-2 text-[10px] uppercase font-bold text-on-surface-variant bg-surface border-b border-outline-variant/40">
              Matching Patients ({searchResults.length})
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-outline-variant/30">
              {searchResults.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectSearchResult(p.id)}
                  className="p-2.5 hover:bg-primary-container/10 cursor-pointer flex justify-between items-center transition-colors"
                >
                  <div>
                    <div className="font-semibold text-xs text-on-surface">{p.name}</div>
                    <div className="text-[10px] text-on-surface-variant">MRN: {p.mrn} • {p.ward}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    p.status === 'Critical' ? 'bg-error/15 text-error' : 'bg-primary-container/15 text-primary-container'
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center space-x-3">
        {/* Mobile Preview Toggle for Patient Role */}
        {currentRole === 'patient' && (
          <button
            onClick={() => setIsMobilePreview(!isMobilePreview)}
            className="px-2.5 py-1 text-xs font-semibold border border-outline-variant/60 rounded-md hover:bg-surface-container-low transition-colors text-on-surface flex items-center gap-1.5 shadow-xs"
            title="Toggle Mobile View Simulation"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isMobilePreview ? 'desktop_windows' : 'smartphone'}
            </span>
            <span className="hidden sm:inline">{isMobilePreview ? 'Desktop View' : 'Mobile View'}</span>
          </button>
        )}

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 text-outline hover:text-primary transition-colors rounded-full hover:bg-surface-container-low"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface-container-lowest animate-pulse"></span>
            )}
          </button>

          <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* Profile Avatar & Log out button */}
        <div className="flex items-center gap-3 border-l border-outline-variant/40 pl-3">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center border border-outline-variant/60 shadow-xs uppercase">
            {displayName ? displayName.charAt(0) : 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-on-surface leading-tight">
              {displayName}
            </p>
            <p className="text-[10px] text-on-surface-variant">
              {displayTitle}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 bg-error/10 text-error hover:bg-error/20 border border-error/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs ml-2"
            title="Log out completely to Login screen"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </header>
    </div>
  );
}
