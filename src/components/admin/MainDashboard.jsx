import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AddPatientModal from '../doctor/AddPatientModal';

export default function MainDashboard() {
  const { patients, beds, setActiveAdminTab, setSelectedPatientId, openAssignModal } = useApp();
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(patients, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `medcore_operations_report_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Patient Banner / Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display-lg text-2xl md:text-3xl font-semibold text-on-surface tracking-tight">
            Operations Overview
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant mt-1">
            Real-time status for Central Hospital Campus.
          </p>
        </div>
        <div className="hidden sm:flex space-x-3">
          <button
            onClick={() => setIsAddPatientOpen(true)}
            className="px-4 py-2 bg-primary-container text-on-primary font-bold rounded-md text-sm hover:bg-primary transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Admit Patient
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-outline-variant/60 rounded-md text-on-surface text-sm font-semibold hover:bg-surface-container-low transition-colors bg-surface-container-lowest shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Report
          </button>
          <button
            onClick={() => setActiveAdminTab('bed')}
            className="px-4 py-2 bg-primary text-on-primary border border-transparent rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">bed</span>
            Manage Admissions
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Panel 1 */}
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 flex flex-col justify-between min-h-[112px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-3xl font-semibold font-data-tabular text-on-surface leading-none tracking-tight">
              {patients.length}
            </span>
            <span className="material-symbols-outlined text-outline-variant text-[24px]">group</span>
          </div>
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-4">
            Admitted Patients
          </span>
        </div>

        {/* Panel 2 */}
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 flex flex-col justify-between min-h-[112px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-semibold font-data-tabular text-on-surface leading-none tracking-tight">
                87.4
              </span>
              <span className="text-lg font-semibold text-on-surface-variant">%</span>
            </div>
            <span className="material-symbols-outlined text-outline-variant text-[24px]">hotel</span>
          </div>
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-4">
            Bed Occupancy
          </span>
        </div>

        {/* Panel 3 */}
        <div className="bg-surface-container-lowest border border-error/20 rounded-xl p-5 flex flex-col justify-between min-h-[112px] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-bl-full -z-10 transition-transform hover:scale-110 duration-500"></div>
          <div className="flex justify-between items-start">
            <span className="text-3xl font-semibold font-data-tabular text-error leading-none tracking-tight">
              {patients.filter(p => p.status === 'Critical').length}
            </span>
            <span className="material-symbols-outlined text-error text-[24px]">emergency</span>
          </div>
          <span className="text-xs font-semibold text-error uppercase tracking-wider mt-4">
            Critical Patients
          </span>
        </div>

        {/* Panel 4 */}
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 flex flex-col justify-between min-h-[112px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex items-baseline">
              <span className="text-lg font-semibold text-on-surface-variant leading-none mr-1">₹</span>
              <span className="text-3xl font-semibold font-data-tabular text-on-surface leading-none tracking-tight">
                2,45,000
              </span>
            </div>
            <span className="material-symbols-outlined text-outline-variant text-[24px]">payments</span>
          </div>
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-4">
            Today's Revenue (₹)
          </span>
        </div>
      </div>

      {/* Bed Occupancy Floor Plan Grid */}
      <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl flex flex-col shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/40 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-surface-container-lowest">
          <h3 className="text-lg font-semibold text-on-surface">Bed Occupancy Preview</h3>
          <div className="flex flex-wrap items-center gap-4 mt-3 sm:mt-0 text-xs sm:text-sm">
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-outline-variant/30 mr-2"></span>
              <span className="text-on-surface-variant font-medium">Vacant</span>
            </div>
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container mr-2"></span>
              <span className="text-on-surface-variant font-medium">Stable</span>
            </div>
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container mr-2"></span>
              <span className="text-on-surface-variant font-medium">Normal</span>
            </div>
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-error mr-2"></span>
              <span className="text-on-surface-variant font-medium">Critical</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ward A */}
            <div>
              <h4 className="text-xs font-semibold text-on-surface mb-4 uppercase tracking-wider border-b border-outline-variant/30 pb-2 flex justify-between items-center">
                <span>Ward A - Cardiology</span>
                <span className="text-[10px] text-on-surface-variant font-normal">8 Beds</span>
              </h4>
              <div className="grid grid-cols-4 gap-3">
                {beds.filter(b => b.ward === "Ward A - Cardiology").map(b => (
                  <div
                    key={b.id}
                    onClick={() => openAssignModal(b.id)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center relative group cursor-pointer transition-all hover:scale-105 border ${
                      b.status === 'Stable'
                        ? 'bg-primary-container/10 border-primary-container/40 text-primary-container'
                        : b.status === 'Normal'
                        ? 'bg-secondary-container/10 border-secondary-container/40 text-secondary-container'
                        : b.status === 'Critical'
                        ? 'bg-error/10 border-error/40 text-error'
                        : 'bg-surface border-outline-variant/50 text-outline-variant'
                    }`}
                    title={b.patientName ? `${b.patientName} (${b.status})` : 'Vacant'}
                  >
                    {b.status !== 'Vacant' && (
                      <span className="material-symbols-outlined text-[14px] mb-1 opacity-80 group-hover:opacity-100">
                        {b.status === 'Critical' ? 'warning' : b.status === 'Normal' ? 'info' : 'check_circle'}
                      </span>
                    )}
                    <span className="font-data-tabular text-xs font-semibold">{b.id}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ward B */}
            <div>
              <h4 className="text-xs font-semibold text-on-surface mb-4 uppercase tracking-wider border-b border-outline-variant/30 pb-2 flex justify-between items-center">
                <span>Ward B - Neurology</span>
                <span className="text-[10px] text-on-surface-variant font-normal">8 Beds</span>
              </h4>
              <div className="grid grid-cols-4 gap-3">
                {beds.filter(b => b.ward === "Ward B - Neurology").map(b => (
                  <div
                    key={b.id}
                    onClick={() => openAssignModal(b.id)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center relative group cursor-pointer transition-all hover:scale-105 border ${
                      b.status === 'Stable'
                        ? 'bg-primary-container/10 border-primary-container/40 text-primary-container'
                        : b.status === 'Normal'
                        ? 'bg-secondary-container/10 border-secondary-container/40 text-secondary-container'
                        : b.status === 'Critical'
                        ? 'bg-error/10 border-error/40 text-error'
                        : 'bg-surface border-outline-variant/50 text-outline-variant'
                    }`}
                    title={b.patientName ? `${b.patientName} (${b.status})` : 'Vacant'}
                  >
                    {b.status !== 'Vacant' && (
                      <span className="material-symbols-outlined text-[14px] mb-1 opacity-80 group-hover:opacity-100">
                        {b.status === 'Critical' ? 'warning' : b.status === 'Normal' ? 'info' : 'check_circle'}
                      </span>
                    )}
                    <span className="font-data-tabular text-xs font-semibold">{b.id}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ward C */}
            <div>
              <h4 className="text-xs font-semibold text-on-surface mb-4 uppercase tracking-wider border-b border-outline-variant/30 pb-2 flex justify-between items-center">
                <span>Ward C - Oncology</span>
                <span className="text-[10px] text-on-surface-variant font-normal">8 Beds</span>
              </h4>
              <div className="grid grid-cols-4 gap-3">
                {beds.filter(b => b.ward === "Ward C - Oncology").map(b => (
                  <div
                    key={b.id}
                    onClick={() => openAssignModal(b.id)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center relative group cursor-pointer transition-all hover:scale-105 border ${
                      b.status === 'Stable'
                        ? 'bg-primary-container/10 border-primary-container/40 text-primary-container'
                        : b.status === 'Normal'
                        ? 'bg-secondary-container/10 border-secondary-container/40 text-secondary-container'
                        : b.status === 'Critical'
                        ? 'bg-error/10 border-error/40 text-error'
                        : 'bg-surface border-outline-variant/50 text-outline-variant'
                    }`}
                    title={b.patientName ? `${b.patientName} (${b.status})` : 'Vacant'}
                  >
                    {b.status !== 'Vacant' && (
                      <span className="material-symbols-outlined text-[14px] mb-1 opacity-80 group-hover:opacity-100">
                        {b.status === 'Critical' ? 'warning' : b.status === 'Normal' ? 'info' : 'check_circle'}
                      </span>
                    )}
                    <span className="font-data-tabular text-xs font-semibold">{b.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Admissions Table */}
      <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden flex flex-col shadow-sm">
        <div className="px-6 py-4 border-b border-outline-variant/40 bg-surface-container-lowest flex justify-between items-center">
          <h3 className="text-lg font-semibold text-on-surface">Recent Admissions</h3>
          <button
            onClick={() => setActiveAdminTab('records')}
            className="text-primary hover:text-primary-container hover:underline text-sm font-semibold transition-colors"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 border-b border-outline-variant/40 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm text-on-surface divide-y divide-outline-variant/20">
              {patients.slice(0, 4).map((p) => (
                <tr
                  key={p.id}
                  onClick={() => {
                    setSelectedPatientId(p.id);
                    setActiveAdminTab('records');
                  }}
                  className="hover:bg-primary-container/5 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-on-surface group-hover:text-primary transition-colors">
                      {p.name}
                    </div>
                    <div className="text-on-surface-variant text-xs mt-0.5">MRN: {p.mrn}</div>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant font-data-tabular">
                    {p.ward} - {p.bed}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">{p.doctor}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase shadow-xs ${
                        p.status === 'Critical'
                          ? 'bg-error/10 text-error border border-error/20'
                          : p.status === 'Stable'
                          ? 'bg-primary-container/10 text-primary-container border border-primary-container/20'
                          : 'bg-secondary-container/10 text-secondary-container border border-secondary-container/20'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-on-surface-variant font-data-tabular tabular-nums">
                    {p.admissionDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Admit Patient Modal */}
      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
      />
    </div>
  );
}
