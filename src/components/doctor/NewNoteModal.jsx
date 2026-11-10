import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function NewNoteModal() {
  const { isNewNoteModalOpen, setIsNewNoteModalOpen, addClinicalNote, selectedPatient } = useApp();
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState('SOAP Progress Note');

  if (!isNewNoteModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addClinicalNote(selectedPatient.id, `${noteType}: ${noteText}`);
    setNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-on-background/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-outline-variant/60">
        <div className="p-4 border-b border-outline-variant/60 bg-surface flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">add_notes</span>
            <h3 className="font-title-sm text-sm font-bold text-on-surface">New Clinical Note</h3>
          </div>
          <button
            onClick={() => setIsNewNoteModalOpen(false)}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-body-sm text-xs">
          <div>
            <label className="block font-bold text-on-surface mb-1">Patient</label>
            <input
              type="text"
              readOnly
              value={`${selectedPatient.name} (MRN: ${selectedPatient.mrn})`}
              className="w-full p-2 bg-surface-container-low border border-outline-variant/60 rounded-md text-on-surface font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-on-surface mb-1">Note Type</label>
            <select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value)}
              className="w-full p-2 bg-surface border border-outline-variant/60 rounded-md text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option>SOAP Progress Note</option>
              <option>Diagnostic Impression</option>
              <option>Consultation Summary</option>
              <option>Discharge Summary</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-on-surface mb-1">Clinical Observations & Plan</label>
            <textarea
              rows={5}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter clinical note observations, assessment, and treatment plan..."
              className="w-full p-3 bg-surface border border-outline-variant/60 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewNoteModalOpen(false)}
              className="px-4 py-2 border border-outline-variant/60 rounded-md font-semibold text-on-surface hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-on-primary rounded-md font-semibold hover:bg-primary-container transition-colors shadow-xs"
            >
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
