import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import BedAssignModal from './BedAssignModal';

export default function BedManagement() {
  const { beds, openAssignModal } = useApp();

  const [selectedWard, setSelectedWard] = useState('All Wards');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  const filteredBeds = beds.filter(b => {
    const wardMatch = selectedWard === 'All Wards' || b.ward === selectedWard;
    const statusMatch = selectedStatus === 'All Statuses' || b.status === selectedStatus;
    return wardMatch && statusMatch;
  });

  const wards = Array.from(new Set(beds.map(b => b.ward)));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Bed & Room Management</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Real-time campus occupancy floor plan & bed assignments
          </p>
        </div>

        {/* Filter Selectors */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Ward Filter */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full sm:w-44 appearance-none bg-surface border border-outline-variant rounded-md px-3 py-1.5 pr-8 text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            >
              <option value="All Wards">All Wards</option>
              {wards.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-outline text-sm">
              expand_more
            </span>
          </div>

          {/* Status Filter */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-40 appearance-none bg-surface border border-outline-variant rounded-md px-3 py-1.5 pr-8 text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Vacant">Vacant</option>
              <option value="Stable">Stable</option>
              <option value="Normal">Normal</option>
              <option value="Critical">Critical</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-outline text-sm">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Ward Cards Grid */}
      <div className="space-y-6">
        {wards
          .filter(w => selectedWard === 'All Wards' || w === selectedWard)
          .map(wardName => {
            const wardBeds = filteredBeds.filter(b => b.ward === wardName);
            if (wardBeds.length === 0) return null;

            return (
              <section key={wardName} className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4 border-b border-outline-variant/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[20px] ${
                      wardName.includes('ICU') ? 'text-error' : 'text-primary-container'
                    }`}>
                      {wardName.includes('ICU') ? 'monitor_heart' : 'local_hospital'}
                    </span>
                    <h3 className="font-title-sm text-base font-bold text-on-surface">{wardName}</h3>
                  </div>
                  <span className="text-xs font-semibold text-on-surface-variant">
                    {wardBeds.filter(b => b.status !== 'Vacant').length} / {wardBeds.length} Occupied
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {wardBeds.map(b => (
                    <button
                      key={b.id}
                      onClick={() => openAssignModal(b.id)}
                      className={`text-left w-full border rounded-xl p-3.5 transition-all hover:scale-[1.02] shadow-xs ${
                        b.status === 'Critical'
                          ? 'bg-error/10 border-error/30 hover:bg-error/20'
                          : b.status === 'Stable'
                          ? 'bg-primary-container/10 border-primary-container/30 hover:bg-primary-container/20'
                          : b.status === 'Normal'
                          ? 'bg-secondary-container/10 border-secondary-container/30 hover:bg-secondary-container/20'
                          : 'bg-surface border-outline-variant/50 border-dashed hover:bg-surface-variant/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-data-tabular font-bold text-sm text-on-surface">Bed {b.id}</span>
                        <span className={`material-symbols-outlined text-sm ${
                          b.status === 'Critical' ? 'text-error icon-filled' :
                          b.status === 'Stable' ? 'text-primary-container' :
                          b.status === 'Normal' ? 'text-secondary-container icon-filled' :
                          'text-outline'
                        }`}>
                          {b.status === 'Critical' ? 'warning' : b.status === 'Vacant' ? 'bed' : 'radio_button_unchecked'}
                        </span>
                      </div>
                      <div className="font-body-sm text-xs font-semibold text-on-surface truncate">
                        {b.patientName || 'Empty'}
                      </div>
                      <div className={`text-[10px] mt-1 uppercase font-bold tracking-wider ${
                        b.status === 'Critical' ? 'text-error' :
                        b.status === 'Stable' ? 'text-primary-container' :
                        b.status === 'Normal' ? 'text-secondary-container' :
                        'text-outline'
                      }`}>
                        {b.status}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
      </div>

      <BedAssignModal />
    </div>
  );
}
