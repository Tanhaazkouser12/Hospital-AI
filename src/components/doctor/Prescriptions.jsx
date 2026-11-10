import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getDiagnosisPrescription } from '../../data/datasetClassifier';

export default function Prescriptions() {
  const { patients, selectedPatient: activeContextPatient, setSelectedPatientId, setPatients } = useApp();

  const selectedPatient = activeContextPatient || patients[0] || {
    id: 'p1',
    name: 'Sample Patient',
    dob: '1985-04-22',
    age: 38,
    mrn: '102-44-8899',
    gender: 'Female',
    ward: 'General Ward',
    bed: '101',
    allergies: [],
    medications: [],
    problems: [{ name: 'Acute Viral Upper Respiratory Infection (Cold & Fever)' }],
    doctor: 'Dr. S. Chen'
  };

  const primaryDiag = selectedPatient?.problems?.[0]?.name || 'Acute Viral Upper Respiratory Infection';
  const suggestedRxList = getDiagnosisPrescription(primaryDiag);

  const [medication, setMedication] = useState(suggestedRxList[0]?.name?.split(' ')[0] || 'Paracetamol');
  const [dosage, setDosage] = useState('500 mg');
  const [frequency, setFrequency] = useState('BID (Twice daily)');
  const [startDate, setStartDate] = useState('2023-10-24');
  const [endDate, setEndDate] = useState('2023-11-07');
  const [instructions, setInstructions] = useState(suggestedRxList[0]?.instructions || 'Take with food.');

  // Pre-fill when selected patient changes
  useEffect(() => {
    if (selectedPatient && selectedPatient.problems && selectedPatient.problems.length > 0) {
      const rx = getDiagnosisPrescription(selectedPatient.problems[0].name);
      if (rx && rx.length > 0) {
        setMedication(rx[0].name.split(' ')[0]);
        setInstructions(rx[0].instructions);
      }
    }
  }, [selectedPatient?.id]);

  const patientAllergies = selectedPatient?.allergies || [];
  const patientMedications = selectedPatient?.medications || [];

  const hasPenicillinAllergy = patientAllergies.some(a => a.toLowerCase().includes('penicillin'));
  const isConflict = medication.toLowerCase().includes('amoxicillin') || medication.toLowerCase().includes('penicillin');

  const handleAuthorize = (e) => {
    e.preventDefault();
    if (isConflict && hasPenicillinAllergy) {
      alert("WARNING: Medication conflicts with patient's severe Penicillin allergy!");
      return;
    }

    const newMed = {
      name: `${medication} ${dosage}`,
      instructions: `${frequency} - ${instructions}`,
      type: "pill"
    };

    setPatients(prev => prev.map(p => {
      if (p.id === selectedPatient.id) {
        return { ...p, medications: [newMed, ...(p.medications || [])] };
      }
      return p;
    }));

    alert(`Prescription for ${medication} successfully authorized and added to ${selectedPatient.name}'s chart!`);
    setMedication('');
  };

  const handleQuickAddSuggested = (rxItem) => {
    const newMed = {
      name: rxItem.name,
      instructions: rxItem.instructions,
      type: rxItem.type || "pill"
    };

    setPatients(prev => prev.map(p => {
      if (p.id === selectedPatient.id) {
        const currentMeds = p.medications || [];
        const exists = currentMeds.some(m => m.name.toLowerCase() === rxItem.name.toLowerCase());
        if (!exists) {
          return { ...p, medications: [newMed, ...currentMeds] };
        }
      }
      return p;
    }));

    alert(`Added ${rxItem.name} directly to ${selectedPatient.name}'s active prescription chart!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Patient Selection Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl icon-filled">medication</span>
          <div>
            <h2 className="text-base font-bold text-on-surface">Prescription Management Center</h2>
            <p className="text-xs text-on-surface-variant">Select patient to view, prescribe, and authorize medications</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-on-surface">Select Patient:</label>
          <select
            value={selectedPatient.id}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="bg-surface border border-outline-variant/60 rounded-md px-3 py-1.5 text-xs font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (MRN: {p.mrn})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Header Summary */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-on-surface">{selectedPatient.name}</h2>
            {hasPenicillinAllergy && (
              <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Allergy Alert
              </span>
            )}
          </div>
          <div className="font-data-tabular text-xs text-on-surface-variant flex flex-wrap gap-4">
            <span>DOB: {selectedPatient.dob} ({selectedPatient.age}y)</span>
            <span>MRN: {selectedPatient.mrn}</span>
            <span>Sex: {selectedPatient.gender}</span>
            <span>Primary Dx: <strong className="text-primary">{primaryDiag}</strong></span>
          </div>
        </div>

        <div className="text-xs text-right text-on-surface-variant font-data-tabular">
          <span>Current Location: <strong>{selectedPatient.ward} ({selectedPatient.bed})</strong></span>
        </div>
      </div>

      {/* Allergy Warning Alert */}
      {hasPenicillinAllergy && (
        <div className="bg-secondary-fixed text-on-secondary-fixed p-4 rounded-xl border border-secondary-fixed-dim flex items-start gap-3 shadow-xs">
          <span className="material-symbols-outlined text-secondary shrink-0 mt-0.5">warning</span>
          <div>
            <h3 className="font-title-sm text-sm font-bold">Severe Allergy Warning</h3>
            <p className="text-xs mt-1">
              Patient has a documented severe allergy to <strong>Penicillin</strong>. Ensure selected medications do not contain cross-reactive beta-lactam compounds.
            </p>
          </div>
        </div>
      )}

      {/* AI Suggested Prescriptions Card based on Current Diagnosis */}
      {suggestedRxList.length > 0 && (
        <div className="bg-primary-container/10 border border-primary-container/40 p-5 rounded-xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <span className="material-symbols-outlined text-[20px] icon-filled">auto_awesome</span>
              <span>AI Auto-Generated Prescriptions for Primary Diagnosis: "{primaryDiag}"</span>
            </div>
            <span className="text-[10px] bg-primary-container text-on-primary font-bold px-2 py-0.5 rounded">
              50,000 Case Protocol
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {suggestedRxList.map((rx, idx) => (
              <div key={idx} className="bg-surface p-3 rounded-lg border border-outline-variant/60 flex flex-col justify-between space-y-2">
                <div>
                  <div className="font-bold text-on-surface text-xs">{rx.name}</div>
                  <div className="text-[11px] text-on-surface-variant mt-1">{rx.instructions}</div>
                </div>
                <button
                  onClick={() => handleQuickAddSuggested(rx)}
                  className="w-full py-1.5 bg-primary-container/15 hover:bg-primary-container hover:text-on-primary text-primary-container font-bold text-[11px] rounded transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">add_circle</span>
                  Authorize Suggested Rx
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prescription Form */}
        <div className="col-span-1 lg:col-span-5 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary-container"></div>
          <h2 className="font-title-sm text-base font-bold text-on-surface mb-6 flex items-center gap-2 border-b border-outline-variant/40 pb-3">
            <span className="material-symbols-outlined text-primary-container text-[20px]">prescriptions</span>
            New Custom Prescription
          </h2>

          <form onSubmit={handleAuthorize} className="space-y-4 text-xs font-body-sm">
            {/* Medication Field */}
            <div>
              <label className="block font-bold text-on-surface mb-1" htmlFor="medication">
                Medication Name
              </label>
              <div className="relative">
                <input
                  id="medication"
                  type="text"
                  value={medication}
                  onChange={(e) => setMedication(e.target.value)}
                  placeholder="Type to search medication..."
                  className={`w-full rounded-md border font-semibold px-3 py-2 text-xs focus:outline-none ${
                    isConflict && hasPenicillinAllergy
                      ? 'border-error bg-error-container/20 text-on-surface'
                      : 'border-outline-variant/60 bg-surface text-on-surface'
                  }`}
                  required
                />
                {isConflict && hasPenicillinAllergy && (
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-error text-[18px]">
                    error
                  </span>
                )}
              </div>
              {isConflict && hasPenicillinAllergy && (
                <p className="text-[11px] text-error mt-1.5 flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Conflicts with Penicillin allergy!
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Dosage */}
              <div>
                <label className="block font-bold text-on-surface mb-1" htmlFor="dosage">Dosage</label>
                <input
                  id="dosage"
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full rounded-md border border-outline-variant/60 bg-surface font-data-tabular text-on-surface px-3 py-2 text-xs focus:outline-none"
                  required
                />
              </div>
              {/* Frequency */}
              <div>
                <label className="block font-bold text-on-surface mb-1" htmlFor="frequency">Frequency</label>
                <select
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full rounded-md border border-outline-variant/60 bg-surface text-on-surface px-3 py-2 text-xs focus:outline-none"
                >
                  <option>BID (Twice daily)</option>
                  <option>QD (Once daily)</option>
                  <option>TID (Three times daily)</option>
                  <option>Q6H (Every 6 hours)</option>
                  <option>PRN (As needed)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Start Date */}
              <div>
                <label className="block font-bold text-on-surface mb-1" htmlFor="start_date">Start Date</label>
                <input
                  id="start_date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border border-outline-variant/60 bg-surface font-data-tabular text-on-surface px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              {/* End Date */}
              <div>
                <label className="block font-bold text-on-surface mb-1" htmlFor="end_date">End Date</label>
                <input
                  id="end_date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border border-outline-variant/60 bg-surface font-data-tabular text-on-surface px-3 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block font-bold text-on-surface mb-1" htmlFor="instructions">
                Patient Instructions / SIG
              </label>
              <textarea
                id="instructions"
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Take with food..."
                className="w-full rounded-md border border-outline-variant/60 bg-surface text-on-surface px-3 py-2 text-xs focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/40">
              <button
                type="button"
                onClick={() => setMedication('')}
                className="px-4 py-2 border border-outline-variant/60 rounded-md text-on-surface font-semibold hover:bg-surface-container transition-colors"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isConflict && hasPenicillinAllergy}
                className={`px-4 py-2 rounded-md font-semibold text-on-primary transition-colors flex items-center gap-2 shadow-xs ${
                  isConflict && hasPenicillinAllergy
                    ? 'bg-primary-container/50 cursor-not-allowed opacity-60'
                    : 'bg-primary-container hover:bg-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isConflict && hasPenicillinAllergy ? 'lock' : 'check_circle'}
                </span>
                Authorize Rx
              </button>
            </div>
          </form>
        </div>

        {/* Active & Historical Medications Table */}
        <div className="col-span-1 lg:col-span-7 bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-xs flex flex-col">
          <div className="p-5 border-b border-outline-variant/40 bg-surface-container-low flex justify-between items-center text-xs">
            <h2 className="font-title-sm text-sm font-bold flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-outline">history</span>
              Active & Prescribed Medications ({selectedPatient.name})
            </h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 text-xs font-bold border border-primary-container bg-primary-container/10 text-primary-container rounded-full">
                Active ({patientMedications.length})
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-bold uppercase text-[10px]">
                  <th className="p-3">Medicine</th>
                  <th className="p-3">Instructions</th>
                  <th className="p-3">Prescriber</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-data-tabular text-on-surface">
                {patientMedications.map((med, idx) => (
                  <tr key={idx} className="hover:bg-primary-container/5 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-on-surface text-sm">{med.name}</div>
                    </td>
                    <td className="p-3 text-on-surface-variant">{med.instructions}</td>
                    <td className="p-3 text-on-surface-variant">{selectedPatient.doctor || 'Dr. S. Chen'}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-container/15 text-primary-container">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
                {patientMedications.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-outline">
                      No active prescriptions for {selectedPatient.name}. Use the form or AI suggested Rx to authorize medication.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
