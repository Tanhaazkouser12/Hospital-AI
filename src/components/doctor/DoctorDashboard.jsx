import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AddPatientModal from './AddPatientModal';

export default function DoctorDashboard() {
  const { patients, setSelectedPatientId, setActiveDoctorTab } = useApp();
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  const filteredPatients = patients.filter(p => {
    const textMatch = p.name.toLowerCase().includes(filterText.toLowerCase()) || p.mrn.toLowerCase().includes(filterText.toLowerCase());
    const statusMatch = statusFilter === 'All' || p.status === statusFilter;
    return textMatch && statusMatch;
  });

  const handleSelectPatient = (id) => {
    setSelectedPatientId(id);
    setActiveDoctorTab('patientDetail');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Doctor Workspace — Patient Roster</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Active ward census, blood types, vitals monitoring, and AI diagnostic decision support
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
              search
            </span>
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search roster..."
              className="w-full pl-9 pr-3 py-1.5 bg-surface border border-outline-variant rounded-md text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface border border-outline-variant rounded-md px-3 py-1.5 text-xs font-semibold text-on-surface focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Critical">Critical</option>
            <option value="Stable">Stable</option>
            <option value="Normal">Normal</option>
          </select>

          <button
            onClick={() => setIsAddPatientOpen(true)}
            className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Admit & Run AI Scan
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-outline-variant/40 bg-surface flex justify-between items-center text-xs">
          <span className="font-bold text-on-surface">Assigned Patients ({filteredPatients.length})</span>
          <span className="text-on-surface-variant">Attending Physician Census</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-outline-variant/40 bg-surface-container-low text-on-surface-variant font-bold uppercase text-[10px]">
                <th className="p-3">Patient Name & Blood Type</th>
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
                <th className="p-3">Vitals (BP / HR / SpO2)</th>
                <th className="p-3">Primary Diagnosis</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-data-tabular text-on-surface">
              {filteredPatients.map(p => (
                <tr
                  key={p.id}
                  onClick={() => handleSelectPatient(p.id)}
                  className="hover:bg-primary-container/5 cursor-pointer transition-colors group"
                >
                  <td className="p-3">
                    <div className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors flex items-center gap-2">
                      <span>{p.name}</span>
                      <span className="bg-error-container/40 text-on-error-container font-bold text-[9px] px-1.5 py-0.5 rounded border border-error-container/50">
                        {p.bloodType || 'O- Neg'}
                      </span>
                    </div>
                    <div className="text-[10px] text-outline">MRN: {p.mrn} • {p.gender}, {p.age}y</div>
                  </td>
                  <td className="p-3 text-on-surface-variant font-semibold">
                    {p.ward} ({p.bed})
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.status === 'Critical' ? 'bg-error/15 text-error border border-error/20' :
                      p.status === 'Stable' ? 'bg-primary-container/15 text-primary-container' :
                      'bg-secondary-container/15 text-secondary-container'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span>{p.vitals.bp}</span>
                      <span className="text-outline">•</span>
                      <span>{p.vitals.hr}</span>
                      <span className="text-outline">•</span>
                      <span className={p.vitals.spo2 < 92 ? 'text-error font-bold' : ''}>
                        {p.vitals.spo2}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-on-surface-variant">
                    {p.problems[0]?.name || 'N/A'}
                  </td>
                  <td className="p-3 text-right">
                    <button className="px-3 py-1 bg-primary text-on-primary rounded text-[11px] font-semibold hover:bg-primary-container transition-colors shadow-xs">
                      View Chart & AI
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admit Patient Modal */}
      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
      />
    </div>
  );
}
