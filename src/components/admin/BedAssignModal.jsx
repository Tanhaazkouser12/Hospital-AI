import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function BedAssignModal() {
  const { isBedModalOpen, selectedBed, closeAssignModal, assignBedToPatient, patients } = useApp();
  const [patientSearch, setPatientSearch] = useState('');

  if (!isBedModalOpen || !selectedBed) return null;

  const filteredUnassigned = patients.filter(p => 
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) || 
    p.mrn.toLowerCase().includes(patientSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-on-background/30 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-outline-variant/40">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-outline-variant/60 bg-surface-container-lowest">
          <div>
            <h3 className="font-title-sm text-lg font-bold text-on-surface">Bed Assignment</h3>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Bed: <span className="font-bold text-primary-container">{selectedBed.id}</span> ({selectedBed.ward})
            </p>
          </div>
          <button
            onClick={closeAssignModal}
            className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Currently Assigned Card */}
          {selectedBed.patientName ? (
            <div className="border border-outline-variant/60 rounded-xl p-4 bg-surface-container-lowest shadow-xs">
              <h4 className="font-label-bold text-[10px] text-on-surface-variant uppercase tracking-wider mb-3">
                Currently Assigned Patient
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container font-bold">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <div className="font-data-tabular font-bold text-sm text-on-surface">
                    {selectedBed.patientName}
                  </div>
                  <div className="font-body-sm text-xs text-on-surface-variant">
                    MRN: {selectedBed.mrn || '883-291-004'}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/40 flex gap-2">
                <button
                  onClick={() => assignBedToPatient(selectedBed.id, null, null)}
                  className="flex-1 py-2 px-3 border border-error/40 text-error rounded-lg font-semibold text-xs hover:bg-error/10 transition-colors"
                >
                  Discharge / Vacant Bed
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-surface-container-low border border-dashed border-outline-variant/80 rounded-xl text-center">
              <span className="material-symbols-outlined text-outline text-2xl mb-1">bed</span>
              <p className="text-xs font-semibold text-on-surface-variant">Bed is currently Vacant</p>
            </div>
          )}

          {/* Search Patient Field */}
          <div>
            <label className="block font-label-bold text-xs text-on-surface font-semibold mb-2">
              Select Patient to Assign
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-outline text-sm">
                search
              </span>
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Search by Name or MRN..."
                className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary font-body-sm text-xs text-on-surface"
              />
            </div>
          </div>

          {/* Patient Roster to Pick From */}
          <div>
            <h4 className="font-label-bold text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">
              Available Admitted Patients
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredUnassigned.map((p) => (
                <div
                  key={p.id}
                  onClick={() => assignBedToPatient(selectedBed.id, p.name, p.mrn, p.status)}
                  className="border border-outline-variant/60 rounded-xl p-3 hover:bg-primary-container/10 hover:border-primary-container/40 cursor-pointer flex justify-between items-center transition-colors group"
                >
                  <div>
                    <div className="font-semibold text-xs text-on-surface group-hover:text-primary transition-colors">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-on-surface-variant">MRN: {p.mrn} • Status: {p.status}</div>
                  </div>
                  <span className="material-symbols-outlined text-outline text-sm group-hover:text-primary">
                    add_circle
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-outline-variant bg-surface-container-lowest">
          <button
            onClick={closeAssignModal}
            className="w-full bg-surface border border-outline-variant text-on-surface py-2.5 rounded-lg text-xs font-semibold hover:bg-surface-container-low transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
