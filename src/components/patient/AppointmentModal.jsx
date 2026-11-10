import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AppointmentModal({ isOpen, onClose }) {
  const { selectedPatient, bookAppointment } = useApp();

  const [appointmentCategory, setAppointmentCategory] = useState('scanner'); // 'scanner' | 'consultation'
  const [scannerType, setScannerType] = useState('CT Thorax High-Resolution');
  const [doctor, setDoctor] = useState('Dr. S. Chen — Pulmonology & Respiratory');
  const [symptoms, setSymptoms] = useState('');
  const [selectedDate, setSelectedDate] = useState('2023-10-18');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAppt = {
      id: `apt-${Date.now()}`,
      patientName: selectedPatient ? selectedPatient.name : 'Patient User',
      patientId: selectedPatient ? selectedPatient.id : 'p1',
      type: appointmentCategory === 'scanner' ? 'Diagnostic Scanner Reservation' : 'Doctor Consultation',
      scannerType: appointmentCategory === 'scanner' ? scannerType : 'N/A (Clinical Consultation)',
      symptoms: symptoms || 'General consultation request',
      date: selectedDate,
      time: selectedTime,
      status: 'Confirmed',
      doctor: doctor,
      department: appointmentCategory === 'scanner' ? 'Radiology / Imaging' : 'Clinical Outpatient'
    };

    bookAppointment(newAppt);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-on-background/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/60">
        {/* Header */}
        <div className="p-4 bg-surface border-b border-outline-variant/60 flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <span className="material-symbols-outlined text-[20px] icon-filled">event_available</span>
            <span>Book Doctor Appointment & Scanner</span>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded-full">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <span className="material-symbols-outlined text-5xl text-green-600 icon-filled">check_circle</span>
            <div className="font-bold text-base text-on-surface">Appointment Booked with {doctor}!</div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Your <strong>{appointmentCategory === 'scanner' ? scannerType : 'Clinical Consultation'}</strong> has been booked with <strong>{doctor}</strong> for <strong>{selectedDate} at {selectedTime}</strong>.
            </p>
            <div className="p-2.5 bg-primary-container/15 border border-primary-container/30 rounded-xl text-[11px] font-semibold text-primary">
              ✓ Synced across Patient, Doctor, & Admin Regions
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-body-sm">
            {/* Category Switcher */}
            <div>
              <label className="block font-bold text-on-surface mb-1.5">1. Appointment Purpose</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAppointmentCategory('scanner')}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    appointmentCategory === 'scanner'
                      ? 'bg-patient-accent text-white border-patient-accent shadow-xs'
                      : 'bg-surface text-on-surface-variant border-outline-variant/60'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                  Diagnostic Scanner
                </button>
                <button
                  type="button"
                  onClick={() => setAppointmentCategory('consultation')}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    appointmentCategory === 'consultation'
                      ? 'bg-primary-container text-on-primary border-primary'
                      : 'bg-surface text-on-surface-variant border-outline-variant/60'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">stethoscope</span>
                  Doctor Consultation
                </button>
              </div>
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block font-bold text-on-surface mb-1">2. Select Particular Doctor</label>
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full p-2.5 bg-surface border border-outline-variant/60 rounded-xl text-on-surface font-bold focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Dr. S. Chen — Pulmonology & Respiratory">Dr. S. Chen — Pulmonology & Respiratory Specialist</option>
                <option value="Dr. Emily Chen — Cardiology Specialist">Dr. Emily Chen — Cardiology Specialist</option>
                <option value="Dr. Marcus Vance — Neurology Specialist">Dr. Marcus Vance — Neurology Specialist</option>
                <option value="Dr. Sarah Jenkins — Chief of Staff / General Medicine">Dr. Sarah Jenkins — Chief of Staff / General Medicine</option>
                <option value="Dr. K. Patel — Oncology & Internal Medicine">Dr. K. Patel — Oncology & Internal Medicine</option>
              </select>
            </div>

            {/* Scanner Type Selection if applicable */}
            {appointmentCategory === 'scanner' && (
              <div>
                <label className="block font-bold text-on-surface mb-1">3. Select Diagnostic Scanner Modality</label>
                <select
                  value={scannerType}
                  onChange={(e) => setScannerType(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-outline-variant/60 rounded-xl text-on-surface font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="CT Thorax High-Resolution">CT Thorax High-Resolution (Lung / Chest)</option>
                  <option value="Abdominal & Pelvic CT Scan">Abdominal & Pelvic CT Scan (Renal / Liver)</option>
                  <option value="Brain MRI DWI Sequence">Brain MRI DWI Sequence (Stroke / Head)</option>
                  <option value="Chest Radiograph AP">Chest Radiograph AP View (X-Ray)</option>
                </select>
              </div>
            )}

            {/* Symptoms & Medical History Details */}
            <div>
              <label className="block font-bold text-on-surface mb-1">Tell Doctor Your Exact Symptoms</label>
              <textarea
                rows={3}
                required
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Type your exact symptoms here (e.g. fever, normal cold, headache, knee joint pain, stomach ache...)"
                className="w-full p-2.5 bg-surface border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-on-surface mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 bg-surface border border-outline-variant/60 rounded-xl text-on-surface font-data-tabular"
                />
              </div>
              <div>
                <label className="block font-bold text-on-surface mb-1">Time Slot</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-2 bg-surface border border-outline-variant/60 rounded-xl text-on-surface font-data-tabular"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:15 PM">04:15 PM</option>
                </select>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-outline-variant/60 rounded-xl text-on-surface hover:bg-surface-container font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-patient-accent text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Book & Send Symptoms To Doctor
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
