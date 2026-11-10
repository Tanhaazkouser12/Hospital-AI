import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import CTViewer from './CTViewer';
import NewNoteModal from './NewNoteModal';
import ScanUploaderModal, { SAMPLE_SCANS } from './ScanUploaderModal';

export default function PatientDetailAI() {
  const {
    selectedPatient,
    confirmAiDiagnosis,
    setIsNewNoteModalOpen,
    appointments
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('ai');
  const [confirmedStatus, setConfirmedStatus] = useState(false);
  const [justAnalyzedNotice, setJustAnalyzedNotice] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  // Active scan state initialized to patient's own scan or sample default
  const [activeScan, setActiveScan] = useState(() => {
    return selectedPatient && selectedPatient.scanInfo ? selectedPatient.scanInfo : SAMPLE_SCANS[0];
  });

  // Automatically update activeScan whenever selectedPatient changes!
  useEffect(() => {
    if (selectedPatient && selectedPatient.scanInfo) {
      setActiveScan(selectedPatient.scanInfo);
    } else {
      setActiveScan(SAMPLE_SCANS[0]);
    }
  }, [selectedPatient?.id, selectedPatient?.scanInfo]);

  // Find any patient appointments
  const patientAppointments = appointments.filter(apt =>
    apt.patientName.toLowerCase() === selectedPatient.name.toLowerCase() ||
    apt.patientId === selectedPatient.id
  );

  const handleConfirm = () => {
    confirmAiDiagnosis(
      selectedPatient.id,
      activeScan.finding,
      activeScan.icdCode || "J18.9"
    );
    setConfirmedStatus(true);
    setTimeout(() => setConfirmedStatus(false), 4000);
  };

  const handleScanAnalyzed = (newScan) => {
    setActiveScan(newScan);
    setJustAnalyzedNotice(true);
    setTimeout(() => setJustAnalyzedNotice(false), 5000);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface animate-in fade-in duration-300">
      {/* Patient Banner (Persistent Top) */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/60 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30 shadow-xs">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="font-headline-md text-xl md:text-2xl font-bold text-on-surface mb-1">
              {selectedPatient.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 font-data-tabular text-xs text-on-surface-variant">
              <span>DOB: {selectedPatient.dob} ({selectedPatient.age}y)</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span>{selectedPatient.gender}</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span className="font-bold text-on-surface">MRN: {selectedPatient.mrn}</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span className="font-bold text-error bg-error-container/40 px-2 py-0.5 rounded text-[10px]">
                Blood: {selectedPatient.bloodType || 'O- Neg'}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedPatient.allergies.map((al, i) => (
              <span key={i} className="px-2.5 py-1 bg-error-container/50 text-on-error-container text-[10px] font-bold tracking-wide rounded-md uppercase border border-error/20">
                {al}
              </span>
            ))}
            {selectedPatient.risks.map((rk, i) => (
              <span key={i} className="px-2.5 py-1 bg-surface-variant/50 text-on-surface text-[10px] font-bold tracking-wide rounded-md uppercase border border-outline-variant/60">
                {rk}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsUploaderOpen(true)}
            className="px-3.5 py-2 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">document_scanner</span>
            Import Scanner Image
          </button>
          <button
            onClick={handlePrintSummary}
            className="px-4 py-2 border border-outline-variant/60 text-on-surface font-semibold text-xs rounded-lg hover:bg-surface-container transition-colors bg-surface shadow-xs"
          >
            Print Summary
          </button>
          <button
            onClick={() => setIsNewNoteModalOpen(true)}
            className="px-4 py-2 bg-primary-container text-on-primary font-semibold text-xs rounded-lg hover:bg-primary transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">add_notes</span>
            New Note
          </button>
        </div>
      </div>

      {/* Content Workspace Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Profile Summary Panel */}
        <aside className="w-[320px] shrink-0 border-r border-outline-variant/60 bg-surface-container-lowest overflow-y-auto p-5 flex flex-col gap-6 hidden lg:flex font-body-sm text-xs">
          {/* Patient Booked Appointments Banner */}
          {patientAppointments.length > 0 && (
            <section className="bg-primary-container/10 border border-primary-container/40 p-3.5 rounded-xl space-y-2">
              <h3 className="font-bold text-primary text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">event_available</span>
                Patient Appointment & Symptoms
              </h3>
              {patientAppointments.map(apt => (
                <div key={apt.id} className="text-[11px] space-y-1 text-on-surface">
                  <div className="font-bold text-primary-container">{apt.type}</div>
                  <div><strong>Doctor:</strong> {apt.doctor}</div>
                  <div><strong>Date & Time:</strong> {apt.date} at {apt.time}</div>
                  <div className="bg-surface p-2 rounded border border-outline-variant/40 italic">
                    "{apt.symptoms}"
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Vitals Snapshot */}
          <section>
            <h3 className="font-bold text-on-surface-variant mb-3 uppercase tracking-wider flex items-center justify-between text-[11px]">
              Latest Vitals <span className="text-[10px] font-normal normal-case">09:00 AM</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/60 shadow-xs">
                <div className="text-[10px] text-on-surface-variant mb-1 font-semibold uppercase">BP</div>
                <div className="font-data-tabular text-on-surface font-bold text-base">
                  {selectedPatient.vitals.bp} <span className="text-[10px] font-medium text-on-surface-variant">mmHg</span>
                </div>
              </div>
              <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/60 shadow-xs">
                <div className="text-[10px] text-on-surface-variant mb-1 font-semibold uppercase">HR</div>
                <div className="font-data-tabular text-on-surface font-bold text-base">
                  {selectedPatient.vitals.hr} <span className="text-[10px] font-medium text-on-surface-variant">bpm</span>
                </div>
              </div>
              <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/60 shadow-xs">
                <div className="text-[10px] text-on-surface-variant mb-1 font-semibold uppercase">Temp</div>
                <div className="font-data-tabular text-on-surface font-bold text-base">
                  {selectedPatient.vitals.temp} <span className="text-[10px] font-medium text-on-surface-variant">°F</span>
                </div>
              </div>
              <div className="bg-error-container/10 p-3 rounded-xl border border-error-container/50 shadow-xs">
                <div className="text-[10px] text-on-error-container mb-1 font-semibold uppercase flex items-center gap-1">
                  SpO2 <span className="material-symbols-outlined text-[12px]">warning</span>
                </div>
                <div className="font-data-tabular text-on-error-container font-bold text-base">
                  {selectedPatient.vitals.spo2}% <span className="text-[10px] font-medium opacity-80">RA</span>
                </div>
              </div>
            </div>
          </section>

          {/* Active Problems */}
          <section>
            <h3 className="font-bold text-on-surface-variant mb-3 uppercase tracking-wider flex justify-between items-center text-[11px]">
              Active Problems
              <span className="material-symbols-outlined text-[16px] text-outline cursor-pointer hover:text-primary">edit</span>
            </h3>
            <ul className="space-y-2">
              {selectedPatient.problems.map((pr, idx) => (
                <li key={idx} className="bg-surface p-3 rounded-lg border border-outline-variant/60 shadow-xs">
                  <div className="font-semibold text-on-surface mb-0.5">{pr.name}</div>
                  <div className="text-[10px] text-on-surface-variant flex justify-between font-data-tabular">
                    <span>Code: {pr.code}</span>
                    <span>Onset: {pr.onset}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Current Meds */}
          <section>
            <h3 className="font-bold text-on-surface-variant mb-3 uppercase tracking-wider flex justify-between items-center text-[11px]">
              Medications
              <span className="material-symbols-outlined text-[16px] text-outline cursor-pointer hover:text-primary">edit</span>
            </h3>
            <div className="divide-y divide-outline-variant/40 border border-outline-variant/60 rounded-lg bg-surface font-data-tabular">
              {selectedPatient.medications.map((med, idx) => (
                <div key={idx} className="p-3 flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-on-surface">{med.name}</div>
                    <div className="text-[10px] text-on-surface-variant mt-0.5">{med.instructions}</div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-outline">
                    {med.type === 'inhaler' ? 'vaccines' : 'pill'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </aside>

        {/* Main AI Workspace Area */}
        <section className="flex-1 flex flex-col min-w-0 bg-surface">
          {/* Clinical Tabs */}
          <div className="border-b border-outline-variant/60 px-6 pt-3 bg-surface-container-lowest">
            <nav className="flex gap-8 text-xs font-semibold">
              <button
                onClick={() => setActiveSubTab('overview')}
                className={`pb-3 transition-all ${activeSubTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveSubTab('scans')}
                className={`pb-3 transition-all ${activeSubTab === 'scans' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
              >
                Scans & Labs
              </button>
              <button
                onClick={() => setActiveSubTab('ai')}
                className={`pb-3 transition-all flex items-center gap-1.5 ${activeSubTab === 'ai' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-[16px] icon-filled">auto_awesome</span>
                AI Suggestions
              </button>
              <button
                onClick={() => setActiveSubTab('history')}
                className={`pb-3 transition-all ${activeSubTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
              >
                Diagnosis History
              </button>
            </nav>
          </div>

          {/* AI Content Tab */}
          <div className="flex-1 overflow-y-auto p-6 bg-background space-y-6">
            {/* Banner 1: Just Analyzed Notification */}
            {justAnalyzedNotice && (
              <div className="p-4 bg-primary-container text-on-primary rounded-xl flex items-center justify-between shadow-lg animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl icon-filled">auto_awesome</span>
                  <div>
                    <div className="font-bold text-sm">AI Scan Diagnosis Generated Successfully!</div>
                    <div className="text-xs opacity-90">
                      Calculated Diagnosis: <strong>"{activeScan.finding}"</strong> ({activeScan.confidence}% confidence)
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleConfirm}
                  className="px-3.5 py-1.5 bg-surface-container-lowest text-primary font-bold text-xs rounded-lg hover:bg-surface transition-colors shrink-0 shadow-xs"
                >
                  Confirm as Diagnosis Now
                </button>
              </div>
            )}

            {/* Banner 2: Confirmed Diagnosis Notification */}
            {confirmedStatus && (
              <div className="p-4 bg-green-700 text-white rounded-xl flex items-center gap-3 shadow-md animate-in fade-in duration-200">
                <span className="material-symbols-outlined text-2xl icon-filled">check_circle</span>
                <div>
                  <div className="font-bold text-sm">Diagnosis Confirmed & Saved to Patient Record!</div>
                  <div className="text-xs">"{activeScan.finding}" (ICD: {activeScan.icdCode}) has been committed to {selectedPatient.name}'s active medical problem chart.</div>
                </div>
              </div>
            )}

            {/* Advisory Banner */}
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 flex justify-between items-center gap-3 shadow-xs text-xs">
              <div className="flex gap-3 items-center">
                <span className="material-symbols-outlined text-outline">info</span>
                <div className="text-on-surface-variant">
                  Active Viewport Scan: <strong>{activeScan.name || 'Patient Scanner Image'}</strong> ({activeScan.type}).
                </div>
              </div>
              <button
                onClick={() => setIsUploaderOpen(true)}
                className="px-3 py-1.5 bg-primary-container text-on-primary font-bold text-xs rounded-md flex items-center gap-1 shrink-0 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">file_upload</span>
                Import Scanner Image
              </button>
            </div>

            {/* Main AI Split Layout */}
            <div className="flex flex-col xl:flex-row gap-6 items-start">
              {/* Left Scan Context Viewport */}
              <div className="w-full xl:w-[380px] shrink-0">
                <CTViewer activeScan={activeScan} onOpenUploader={() => setIsUploaderOpen(true)} />
              </div>

              {/* Right Findings Panel */}
              <div className="flex-1 w-full bg-surface-container-low border border-outline-variant/60 rounded-xl shadow-sm overflow-hidden relative">
                <div className="p-5 border-b border-outline-variant/60 bg-surface-container-lowest flex justify-between items-center">
                  <div className="flex items-center gap-2.5 text-primary-container">
                    <span className="material-symbols-outlined text-[24px] icon-filled text-primary">auto_awesome</span>
                    <h2 className="font-title-sm text-base font-bold text-on-surface">
                      AI Diagnostic Scan Result — <span className="text-primary">Ready for Clinical Review</span>
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 bg-surface rounded-md border border-outline-variant/60 text-on-surface-variant tracking-wide">
                    Neural Vision v2.4
                  </span>
                </div>

                <div className="p-6 space-y-6 bg-surface/50 font-body-sm text-xs">
                  {/* Primary Finding */}
                  <div className="border border-outline-variant/60 rounded-xl p-5 bg-surface shadow-xs relative overflow-hidden space-y-4">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container"></div>
                    <div className="flex justify-between items-start pl-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-title-sm text-lg text-on-surface font-bold">
                            {activeScan.finding}
                          </h3>
                          <span className="px-2 py-0.5 bg-error-container/40 text-on-error-container text-[10px] font-bold rounded uppercase tracking-wider">
                            ICD-10: {activeScan.icdCode || 'J18.9'}
                          </span>
                        </div>
                        <p className="text-on-surface-variant font-medium">Target Input: {activeScan.name || 'Scanner Image Input'}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-on-surface-variant uppercase mb-0.5 tracking-wider">
                          Confidence Score
                        </div>
                        <div className="text-xl font-data-tabular text-primary-container font-bold">
                          {activeScan.confidence || 94}%
                        </div>
                      </div>
                    </div>

                    <div className="pl-3">
                      <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary-container rounded-full" style={{ width: `${activeScan.confidence || 94}%` }}></div>
                      </div>
                    </div>

                    {/* Detailed Descriptions Section */}
                    <div className="pl-3 p-4 bg-surface-container-low/50 rounded-lg border border-outline-variant/40 space-y-3">
                      <div>
                        <span className="font-bold text-on-surface uppercase text-[10px] tracking-wider block mb-0.5 text-primary">
                          Scan Technical Description:
                        </span>
                        <p className="text-on-surface-variant text-xs leading-relaxed">
                          {activeScan.scanDescription || "High-resolution diagnostic scanner image slice detailing anatomical tissue structures and organ borders."}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-on-surface uppercase text-[10px] tracking-wider block mb-0.5 text-primary">
                          Clinical Diagnosis Narrative & AI Findings:
                        </span>
                        <p className="text-on-surface text-xs leading-relaxed font-medium">
                          {activeScan.diagnosisDescription || "AI Neural Vision feature extraction identified localized structural opacities and parenchymal density anomalies consistent with acute inflammation or lesion formation."}
                        </p>
                      </div>
                    </div>

                    <div className="pl-3 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-outline-variant/60">
                      <div>
                        <div className="text-[10px] font-bold text-on-surface-variant uppercase mb-1.5 tracking-wider">
                          Key Scanner Features Detected
                        </div>
                        <ul className="list-disc list-outside ml-4 text-on-surface space-y-1">
                          {activeScan.features ? (
                            activeScan.features.map((feat, idx) => <li key={idx}>{feat}</li>)
                          ) : (
                            <>
                              <li>Focal ROI opacity identified</li>
                              <li>Perilesional tissue response</li>
                              <li>Intact vascular margins</li>
                            </>
                          )}
                        </ul>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-on-surface-variant uppercase mb-1.5 tracking-wider">
                          Suggested Next Clinical Steps
                        </div>
                        <ul className="space-y-1.5">
                          {activeScan.nextSteps ? (
                            activeScan.nextSteps.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-outline">science</span>
                                <span>{step}</span>
                              </li>
                            ))
                          ) : (
                            <li className="flex items-start gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-outline">science</span>
                              <span>Correlate with serial lab cultures</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="bg-surface-container-lowest p-4 border-t border-outline-variant/60 flex justify-end gap-3 rounded-b-xl">
                  <button
                    onClick={() => setIsUploaderOpen(true)}
                    className="px-4 py-2 border border-outline-variant/60 text-on-surface font-semibold text-xs rounded-lg hover:bg-surface-container transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">file_upload</span>
                    Import Scanner Image...
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="px-5 py-2 bg-primary text-on-primary font-semibold text-xs rounded-lg hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Confirm as Diagnosis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <NewNoteModal />

      {/* Scanner Importer Modal */}
      <ScanUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onScanAnalyzed={handleScanAnalyzed}
      />
    </div>
  );
}
