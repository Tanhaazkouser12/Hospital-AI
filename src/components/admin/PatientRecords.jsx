import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AddPatientModal from '../doctor/AddPatientModal';

export default function PatientRecords() {
  const { patients, selectedPatient, setSelectedPatientId, setPatients, setCurrentRole, setActiveDoctorTab } = useApp();
  const [recordSearch, setRecordSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  const filteredList = patients.filter(p => {
    const searchMatch = p.name.toLowerCase().includes(recordSearch.toLowerCase()) || p.mrn.toLowerCase().includes(recordSearch.toLowerCase());
    const statusMatch = statusFilter === 'All' || p.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const handleDischarge = (patientId) => {
    if (window.confirm(`Are you sure you want to discharge ${selectedPatient.name}?`)) {
      setPatients(prev => prev.filter(p => p.id !== patientId));
    }
  };

  const handleOpenDoctorAiChart = (patientId) => {
    setSelectedPatientId(patientId);
    setCurrentRole('doctor');
    setActiveDoctorTab('patientDetail');
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-background animate-in fade-in duration-300">
      {/* Left Panel: Patient List */}
      <section className="w-full md:w-1/3 border-r border-outline-variant/60 bg-surface-container-lowest flex flex-col overflow-hidden">
        <div className="p-4 border-b border-outline-variant/40 flex justify-between items-center bg-surface-container-low">
          <div className="flex items-center gap-2">
            <h2 className="font-title-sm text-sm font-bold text-on-surface">Admitted Patients</h2>
            <span className="bg-primary-container text-on-primary font-label-bold text-[10px] font-bold px-2 py-0.5 rounded-full">
              {patients.length}
            </span>
          </div>
          <button
            onClick={() => setIsAddPatientOpen(true)}
            className="px-3 py-1 bg-primary-container text-on-primary font-bold text-xs rounded-md hover:bg-primary transition-colors flex items-center gap-1 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            Admit Patient
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 border-b border-outline-variant/40 flex flex-col gap-2 bg-surface">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xs">
              search
            </span>
            <input
              type="text"
              value={recordSearch}
              onChange={(e) => setRecordSearch(e.target.value)}
              placeholder="Search patients, MRN..."
              className="w-full pl-8 pr-3 py-1.5 bg-surface-container-lowest border border-outline-variant/60 rounded-md text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/60 rounded px-2 py-1 font-semibold text-on-surface-variant"
            >
              <option value="All">All Statuses</option>
              <option value="Critical">Critical</option>
              <option value="Stable">Stable</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
        </div>

        {/* Patient Table List */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container-low border-b border-outline-variant/40 text-[10px] uppercase font-bold text-outline">
              <tr>
                <th className="p-3">Patient Info</th>
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs text-on-surface divide-y divide-outline-variant/20">
              {filteredList.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`cursor-pointer transition-colors ${
                    selectedPatient?.id === p.id
                      ? 'bg-primary-container/10 border-l-4 border-primary-container'
                      : 'hover:bg-primary-container/5'
                  }`}
                >
                  <td className="p-3">
                    <div className="font-semibold text-on-surface">{p.name}</div>
                    <div className="text-[10px] text-outline">MRN: {p.mrn}</div>
                  </td>
                  <td className="p-3 text-on-surface-variant font-data-tabular">
                    {p.bed}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        p.status === 'Critical'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-primary-container/15 text-primary-container'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Right Panel: Patient Profile Detail */}
      <section className="w-full md:w-2/3 bg-background flex flex-col overflow-y-auto">
        {selectedPatient ? (
          <div>
            {/* Banner Top */}
            <div className="p-6 bg-surface-container-lowest border-b border-outline-variant/40 sticky top-0 z-10 shadow-xs">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold text-xl border border-outline-variant/40">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h1 className="font-display-lg text-xl md:text-2xl font-bold text-on-surface leading-tight">
                      {selectedPatient.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-outline font-data-tabular">
                      <span>MRN: <strong className="text-on-surface">{selectedPatient.mrn}</strong></span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span>DOB: <strong className="text-on-surface">{selectedPatient.dob} ({selectedPatient.age}y)</strong></span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      {selectedPatient.bloodType && (
                        <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                          Blood: {selectedPatient.bloodType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenDoctorAiChart(selectedPatient.id)}
                    className="px-3.5 py-1.5 bg-primary-container text-on-primary text-xs font-bold rounded-md hover:bg-primary transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    View Doctor Chart & AI
                  </button>
                  <button
                    onClick={() => handleDischarge(selectedPatient.id)}
                    className="px-3 py-1.5 border border-error text-error text-xs font-semibold rounded-md hover:bg-error-container transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    Discharge
                  </button>
                </div>
              </div>

              {/* Contacts Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-outline-variant/40 mt-4 text-xs">
                <div>
                  <span className="block font-bold text-[10px] text-outline uppercase mb-0.5">Primary Contact</span>
                  <span className="text-on-surface font-medium">+91 98765-43210</span>
                </div>
                <div>
                  <span className="block font-bold text-[10px] text-outline uppercase mb-0.5">Emergency Contact</span>
                  <span className="text-on-surface font-medium">John Doe (Spouse) - +91 98765-12345</span>
                </div>
                <div>
                  <span className="block font-bold text-[10px] text-outline uppercase mb-0.5">Address</span>
                  <span className="text-on-surface font-medium">456 Connaught Place, New Delhi, India 110001</span>
                </div>
              </div>
            </div>

            {/* Detailed Cards Section */}
            <div className="p-6 space-y-6">
              {/* Diagnosis & Bed Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 mb-3 border-b border-outline-variant/40 pb-2">
                    <span className="material-symbols-outlined text-primary-container">vital_signs</span>
                    <h3 className="font-title-sm text-sm font-bold text-on-surface">Current Diagnosis</h3>
                  </div>
                  <div className="space-y-2 text-xs">
                    {selectedPatient.problems.map((pr, i) => (
                      <div key={i}>
                        <span className="block text-[10px] font-bold text-outline uppercase">
                          {i === 0 ? 'Primary Dx' : 'Secondary Dx'}
                        </span>
                        <span className="text-on-surface font-semibold">{pr.name} ({pr.code})</span>
                      </div>
                    ))}
                    <div>
                      <span className="block text-[10px] font-bold text-outline uppercase">Attending Physician</span>
                      <span className="text-on-surface font-medium">{selectedPatient.doctor}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 mb-3 border-b border-outline-variant/40 pb-2">
                    <span className="material-symbols-outlined text-primary-container">bed</span>
                    <h3 className="font-title-sm text-sm font-bold text-on-surface">Bed Assignment</h3>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="block text-[10px] font-bold text-outline uppercase">Unit / Bed</span>
                      <span className="text-on-surface font-semibold">{selectedPatient.ward} / Bed {selectedPatient.bed}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-outline uppercase">Admission Date</span>
                      <span className="text-on-surface">{selectedPatient.admissionDate}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-outline uppercase">Code Status</span>
                      <span className="inline-block bg-primary-container/10 text-primary-container font-bold px-2 py-0.5 rounded text-[10px]">
                        Full Code
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-xs">
                <div className="flex items-center gap-2 mb-3 border-b border-outline-variant/40 pb-2">
                  <span className="material-symbols-outlined text-primary-container">history</span>
                  <h3 className="font-title-sm text-sm font-bold text-on-surface">Medical History & Alerts</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold text-outline uppercase mb-1">Allergies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPatient.allergies.map((al, idx) => (
                        <span key={idx} className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[10px] font-bold">
                          {al}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-outline uppercase mb-1">Chronic Conditions</span>
                    <span className="text-on-surface font-medium">Type 2 Diabetes, Asthma</span>
                  </div>
                </div>
              </div>

              {/* Insurance Info */}
              <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-xs">
                <div className="flex items-center gap-2 mb-3 border-b border-outline-variant/40 pb-2">
                  <span className="material-symbols-outlined text-primary-container">health_and_safety</span>
                  <h3 className="font-title-sm text-sm font-bold text-on-surface">Insurance Information</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs font-data-tabular">
                  <div>
                    <span className="block text-[10px] font-bold text-outline uppercase mb-0.5">Primary Provider</span>
                    <span className="text-on-surface font-semibold">Star Health Insurance</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-outline uppercase mb-0.5">Policy Number</span>
                    <span className="text-on-surface">STR-998-342-IND</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-outline uppercase mb-0.5">Group Number</span>
                    <span className="text-on-surface">GRP-7742</span>
                  </div>
                </div>
              </div>

              {/* Billing Summary (Indian Rupees ₹) */}
              <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-xs mb-8">
                <div className="flex items-center gap-2 mb-3 border-b border-outline-variant/40 pb-2">
                  <span className="material-symbols-outlined text-primary-container">receipt_long</span>
                  <h3 className="font-title-sm text-sm font-bold text-on-surface">Billing Summary (INR ₹)</h3>
                </div>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="text-outline font-bold uppercase border-b border-outline-variant/40 text-[10px]">
                      <th className="py-2 w-2/3">Description</th>
                      <th className="py-2 w-1/3 text-right">Estimated Cost (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="font-data-tabular divide-y divide-outline-variant/20 text-on-surface">
                    <tr>
                      <td className="py-2">ICU Room Charge (2 Days)</td>
                      <td className="py-2 text-right">₹24,500.00</td>
                    </tr>
                    <tr>
                      <td className="py-2">Pharmacy / Medications</td>
                      <td className="py-2 text-right">₹4,850.00</td>
                    </tr>
                    <tr>
                      <td className="py-2">Laboratory Diagnostic Services</td>
                      <td className="py-2 text-right">₹6,200.00</td>
                    </tr>
                    <tr className="font-bold bg-surface-container-low">
                      <td className="py-2 px-2">Subtotal (Pre-Insurance)</td>
                      <td className="py-2 px-2 text-right">₹35,550.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-outline">Select a patient from the roster to view record details.</div>
        )}
      </section>

      {/* Admit Patient Modal for Admin Mode */}
      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
      />
    </div>
  );
}
