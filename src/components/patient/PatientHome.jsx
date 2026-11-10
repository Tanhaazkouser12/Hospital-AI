import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PatientChatModal from './PatientChatModal';
import AppointmentModal from './AppointmentModal';

const APOLLO_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    department: 'Cardiology & Critical Care',
    qualification: 'MD, DM (Cardiology), FACC',
    experience: '19+ Years Exp',
    location: 'Apollo Hospitals, Bannerghatta Road, Bangalore',
    fee: 950,
    rating: '4.9',
    reviews: '1,420+',
    nextSlot: 'Today, 03:30 PM',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'doc-2',
    name: 'Dr. S. Chen',
    department: 'Pulmonology & Respiratory Medicine',
    qualification: 'MD (Chest Medicine), FCCP',
    experience: '15+ Years Exp',
    location: 'Apollo Hospitals, Jayanagar, Bangalore',
    fee: 850,
    rating: '4.8',
    reviews: '980+',
    nextSlot: 'Today, 04:15 PM',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'doc-3',
    name: 'Dr. T. Nguyen',
    department: 'Neurology & Neuro-Oncology',
    qualification: 'MCh (Neurosurgery), FINR',
    experience: '17+ Years Exp',
    location: 'Apollo Specialty Hospital, Bangalore',
    fee: 1100,
    rating: '4.9',
    reviews: '1,150+',
    nextSlot: 'Tomorrow, 10:00 AM',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'doc-4',
    name: 'Dr. H. Smith',
    department: 'Internal & Preventive Medicine',
    qualification: 'MBBS, MD (Internal Medicine)',
    experience: '12+ Years Exp',
    location: 'Apollo Clinic, Bangalore Central',
    fee: 700,
    rating: '4.7',
    reviews: '820+',
    nextSlot: 'Today, 05:00 PM',
    image: 'https://images.unsplash.com/photo-1594824813596-f57f68c34f71?auto=format&fit=crop&q=80&w=300'
  }
];

const SPECIALTIES = [
  { name: 'All Specialties', icon: 'medical_services' },
  { name: 'Cardiology', icon: 'cardiology' },
  { name: 'Pulmonology', icon: 'pulmonology' },
  { name: 'Neurology', icon: 'neurology' },
  { name: 'Radiology', icon: 'radiology' },
  { name: 'Internal Medicine', icon: 'vital_signs' }
];

export default function PatientHome() {
  const {
    setIsPatientChatOpen,
    isMobilePreview,
    loggedInUser,
    selectedPatient,
    invoices,
    appointments,
    recordPayment,
    setNotifications,
    bookAppointment
  } = useApp();

  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');

  // Quick Lead / Consult Form State (Apollo ConsultLeads style)
  const [leadSpecialty, setLeadSpecialty] = useState('Cardiology & Critical Care');
  const [leadDoctor, setLeadDoctor] = useState('Dr. Sarah Jenkins');
  const [leadSymptoms, setLeadSymptoms] = useState('');
  const [leadPhone, setLeadPhone] = useState('+91 98765 43210');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Refill request state
  const [refillSent, setRefillSent] = useState(false);

  // Vitals Logger state
  const [loggedBp, setLoggedBp] = useState('124/82');
  const [loggedHr, setLoggedHr] = useState('76');
  const [loggedSpo2, setLoggedSpo2] = useState('98');
  const [loggedSuccess, setLoggedSuccess] = useState(false);

  const activeUserName = loggedInUser?.name || selectedPatient?.name || 'Sarah Jenkins';
  const firstName = activeUserName.split(' ')[0];

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    const newApt = {
      id: `apt-${Date.now()}`,
      patientName: activeUserName,
      patientId: selectedPatient ? selectedPatient.id : 'p1',
      type: 'Doctor Consultation (Apollo Bangalore)',
      scannerType: 'N/A (Clinical Consultation)',
      symptoms: leadSymptoms || 'Routine specialist consultation',
      date: new Date().toISOString().slice(0, 10),
      time: '04:00 PM',
      status: 'Confirmed',
      doctor: leadDoctor,
      department: leadSpecialty
    };

    bookAppointment(newApt);
    setLeadSubmitted(true);
    setNotifications(prev => [
      {
        id: Date.now(),
        title: "Apollo Consultation Confirmed",
        message: `Your appointment with ${leadDoctor} (${leadSpecialty}) has been confirmed. Apollo care manager will call at ${leadPhone}.`,
        time: "Just now",
        type: "success"
      },
      ...prev
    ]);

    setTimeout(() => {
      setLeadSubmitted(false);
      setLeadSymptoms('');
    }, 4500);
  };

  const handleRequestRefill = (medName) => {
    setRefillSent(true);
    setNotifications(prev => [
      {
        id: Date.now(),
        title: "Apollo Pharmacy Refill Requested",
        message: `Refill request for ${medName} submitted to Apollo Pharmacy Bannerghatta Bangalore`,
        time: "Just now",
        type: "info"
      },
      ...prev
    ]);
    setTimeout(() => setRefillSent(false), 4000);
  };

  const handleLogVitals = (e) => {
    e.preventDefault();
    setLoggedSuccess(true);
    setNotifications(prev => [
      {
        id: Date.now(),
        title: "Patient Daily Vitals Logged",
        message: `Vitals submitted: BP ${loggedBp}, HR ${loggedHr} bpm, SpO2 ${loggedSpo2}%`,
        time: "Just now",
        type: "success"
      },
      ...prev
    ]);
    setTimeout(() => setLoggedSuccess(false), 4000);
  };

  const filteredDoctors = selectedSpecialty === 'All Specialties'
    ? APOLLO_DOCTORS
    : APOLLO_DOCTORS.filter(d => d.department.toLowerCase().includes(selectedSpecialty.toLowerCase()));

  return (
    <div className={`min-h-screen pb-20 transition-all ${isMobilePreview ? 'flex justify-center py-6 bg-slate-100' : 'bg-[#f8fafc]'}`}>
      <div className={`w-full transition-all ${
        isMobilePreview
          ? 'max-w-[420px] bg-white rounded-[36px] shadow-2xl border-8 border-slate-800 overflow-hidden'
          : 'max-w-[1360px] mx-auto px-4 md:px-8 py-6'
      }`}>

        {/* ─── APOLLO HERO CONSULTLEADS BANNER (Inspired by consultleads-v2) ─── */}
        <section className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-teal-800/20 mb-8 bg-gradient-to-r from-[#003b42] via-[#005963] to-[#02707d] text-white">
          {/* Subtle geometric circles background (Apollo emblem inspired) */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-400/10 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-orange-500/15 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Value Proposition & Trust Badges */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-amber-300 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>Apollo Hospitals Bangalore • Welcome, {firstName}</span>
                </div>

                <h1 className="font-display-lg text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
                  Consult Bangalore's <br className="hidden sm:inline" />
                  <span className="text-amber-400">Leading Specialists</span> Today
                </h1>

                <p className="text-teal-100 text-sm md:text-base max-w-xl leading-relaxed">
                  Experience compassionate clinical care powered by <strong>50,000+ AI Diagnostic Knowledge Cases</strong>. Book top doctors at Apollo Bannerghatta & Jayanagar or get an instant second opinion online.
                </p>

                {/* Trust Proof Points (Apollo Metric Badges) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 text-center">
                    <div className="text-xl md:text-2xl font-black text-amber-400">50,000+</div>
                    <div className="text-[11px] text-teal-100 font-medium">AI Case Knowledge</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 text-center">
                    <div className="text-xl md:text-2xl font-black text-white">500+</div>
                    <div className="text-[11px] text-teal-100 font-medium">Apollo Specialists</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 text-center">
                    <div className="text-xl md:text-2xl font-black text-amber-400">4.9 ★</div>
                    <div className="text-[11px] text-teal-100 font-medium">Patient Satisfaction</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 text-center">
                    <div className="text-xl md:text-2xl font-black text-white">24/7</div>
                    <div className="text-[11px] text-teal-100 font-medium">Emergency Care</div>
                  </div>
                </div>

                {/* Quick Action CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsPatientChatOpen(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#d94e07] hover:to-[#ea580c] text-white font-bold text-xs md:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    Ask Apollo AI Health Assistant
                  </button>

                  <button
                    onClick={() => setIsApptModalOpen(true)}
                    className="px-5 py-2.5 bg-white/15 hover:bg-white/20 text-white font-semibold text-xs md:text-sm rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    Book Diagnostic Scan / Lab
                  </button>
                </div>
              </div>

              {/* Right Column: Apollo ConsultLeads Quick Appointment Form */}
              <div className="lg:col-span-5">
                <div className="bg-white text-slate-900 rounded-2xl p-5 md:p-6 shadow-2xl border border-slate-100">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-base md:text-lg font-bold text-[#005963]">
                        Request Doctor Consultation
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Fast-track appointment at Apollo Bangalore
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-orange-50 text-[#e65c00] text-[10px] font-bold uppercase tracking-wider border border-orange-200">
                      Priority Slot
                    </span>
                  </div>

                  {leadSubmitted ? (
                    <div className="py-8 text-center space-y-3 animate-in fade-in">
                      <div className="w-14 h-14 mx-auto rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl icon-filled">check_circle</span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900">Consultation Confirmed!</h3>
                      <p className="text-xs text-slate-600 max-w-xs mx-auto">
                        Your appointment has been registered with <strong>{leadDoctor}</strong>. Our clinical coordinator is notifying the team.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-3.5 pt-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Patient Name
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={activeUserName}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            Department
                          </label>
                          <select
                            value={leadSpecialty}
                            onChange={(e) => setLeadSpecialty(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-[#005963]"
                          >
                            <option value="Cardiology & Critical Care">Cardiology</option>
                            <option value="Pulmonology & Respiratory Medicine">Pulmonology</option>
                            <option value="Neurology & Neuro-Oncology">Neurology</option>
                            <option value="Internal & Preventive Medicine">Internal Medicine</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            Preferred Doctor
                          </label>
                          <select
                            value={leadDoctor}
                            onChange={(e) => setLeadDoctor(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-[#005963]"
                          >
                            {APOLLO_DOCTORS.map(d => (
                              <option key={d.id} value={d.name}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Symptoms / Health Concern
                        </label>
                        <input
                          type="text"
                          required
                          value={leadSymptoms}
                          onChange={(e) => setLeadSymptoms(e.target.value)}
                          placeholder="e.g. Chest tightness, persistent cough, migraine..."
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#005963]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            Contact Phone
                          </label>
                          <input
                            type="text"
                            value={leadPhone}
                            onChange={(e) => setLeadPhone(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#005963]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            Location
                          </label>
                          <div className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 truncate">
                            Bangalore Hub
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#ea580c] hover:bg-[#d94e07] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg mt-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        Confirm Apollo Consultation
                      </button>

                      <p className="text-[10px] text-center text-slate-400">
                        🔒 Confidential & HIPAA/NABH Compliant • No Booking Fees
                      </p>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── TAB NAVIGATION (Home, Records, Billing, Vitals) ─── */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'home'
                ? 'bg-[#005963] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">domain</span>
            Specialists & Care Hub
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'records'
                ? 'bg-[#005963] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">folder_shared</span>
            My Apollo Health Records
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'billing'
                ? 'bg-[#005963] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            Billing & Invoices (₹)
          </button>

          <button
            onClick={() => setActiveTab('vitals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'vitals'
                ? 'bg-[#005963] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">monitor_heart</span>
            Log Daily Vitals
          </button>
        </div>

        {/* ─── TAB 1: HOME CARE & APOLLO DOCTOR ROSTER ─── */}
        {activeTab === 'home' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Active Appointments Alert Bar */}
            {appointments.length > 0 && (
              <section className="bg-white border border-teal-100 rounded-2xl p-5 shadow-xs">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e65c00] animate-ping"></span>
                    <h2 className="text-sm md:text-base font-bold text-slate-800">
                      My Scheduled Consultations & Scans ({appointments.length})
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsApptModalOpen(true)}
                    className="text-xs font-bold text-[#e65c00] hover:underline flex items-center gap-1"
                  >
                    + Book Another
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all flex gap-3.5 items-start"
                    >
                      <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#005963] border border-teal-200/80 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold uppercase">{apt.date ? apt.date.slice(5, 7) : 'OCT'}</span>
                        <span className="text-base font-extrabold">{apt.date ? apt.date.slice(8, 10) : '18'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-xs md:text-sm text-slate-800 truncate">{apt.doctor}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#005963] font-semibold">{apt.type}</p>
                        <p className="text-[11px] text-slate-500 italic truncate">"{apt.symptoms}"</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          <span>{apt.time} • Apollo Hospital Bangalore</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Specialty Quick Filter Tabs */}
            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-900">
                    Apollo Bangalore Specialist Roster
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select a specialty to consult with board-certified physicians
                  </p>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {SPECIALTIES.map((sp) => (
                  <button
                    key={sp.name}
                    onClick={() => setSelectedSpecialty(sp.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      selectedSpecialty === sp.name
                        ? 'bg-[#005963] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{sp.icon}</span>
                    {sp.name}
                  </button>
                ))}
              </div>

              {/* Doctor Cards Grid (Apollo verified style) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all hover:border-teal-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Doctor Header & Avatar */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100"
                          />
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold" title="Verified Apollo Specialist">
                            ✓
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#005963] transition-colors truncate">
                            {doc.name}
                          </h3>
                          <p className="text-[11px] font-semibold text-[#005963] truncate">
                            {doc.department}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {doc.qualification}
                          </p>
                        </div>
                      </div>

                      {/* Experience & Hospital Details */}
                      <div className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Experience:</span>
                          <span className="font-semibold text-slate-700">{doc.experience}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Consultation:</span>
                          <span className="font-bold text-slate-900">₹{doc.fee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Patient Rating:</span>
                          <span className="font-semibold text-amber-600">★ {doc.rating} ({doc.reviews})</span>
                        </div>
                        <div className="p-2 rounded-lg bg-teal-50/60 border border-teal-100 text-[10px] text-[#005963] font-semibold flex items-center gap-1.5 mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          <span>Next Slot: {doc.nextSlot}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setLeadDoctor(doc.name);
                          setLeadSpecialty(doc.department);
                          setIsApptModalOpen(true);
                        }}
                        className="py-2 px-2 bg-[#ea580c] hover:bg-[#d94e07] text-white font-bold text-[11px] rounded-xl transition-colors text-center shadow-2xs"
                      >
                        Book Slot
                      </button>
                      <button
                        onClick={() => setIsPatientChatOpen(true)}
                        className="py-2 px-2 bg-teal-50 hover:bg-teal-100 text-[#005963] font-bold text-[11px] rounded-xl transition-colors text-center"
                      >
                        AI Second Opinion
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Apollo Quick Care Services Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-teal-50 to-white border border-teal-200/60 rounded-2xl p-5 shadow-xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#005963] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-2xl">science</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">50,000+ AI Diagnostic Knowledge</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Every diagnosis and question checked against clinical training weights from 50,000 curated cases.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200/60 rounded-2xl p-5 shadow-xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ea580c] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-2xl">medical_information</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Apollo E-Pharmacy & Refills</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Direct refill requests to attending physicians with doorstep delivery across Bangalore.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200/60 rounded-2xl p-5 shadow-xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-2xl">health_and_safety</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Emergency & Ambulance: 1066</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Rapid GPS-tracked Apollo Cardiac & Trauma ambulance network operating 24/7 in Bangalore.
                  </p>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ─── TAB 2: MY MEDICAL RECORDS ─── */}
        {activeTab === 'records' && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005963]">folder_shared</span>
                  My Apollo Clinical Record ({activeUserName})
                </h2>
                <p className="text-xs text-slate-500">
                  MRN: {selectedPatient?.mrn || '894-33-210'} • Apollo Hospitals Bangalore
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#005963] text-xs font-bold">
                Blood Type: {selectedPatient?.bloodType || 'O- Negative'}
              </span>
            </div>

            {/* Diagnosed Conditions */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#005963]">clinical_notes</span>
                Diagnosed Medical Conditions
              </h3>
              <div className="space-y-2">
                {selectedPatient?.problems?.map((pr, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{pr.name}</div>
                      <div className="text-xs text-slate-500 font-medium">ICD-10 Code: {pr.code}</div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Onset: {pr.onset}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Prescribed Medications & Refill Request */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#ea580c]">medication</span>
                  Active Prescriptions & Pharmacy Refill
                </h3>
              </div>

              {refillSent && (
                <div className="p-3.5 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold animate-in fade-in flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>Refill request sent to Apollo Pharmacy Bannerghatta!</span>
                </div>
              )}

              <div className="space-y-2">
                {selectedPatient?.medications?.map((med, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{med.name}</div>
                      <div className="text-xs text-slate-500">{med.instructions}</div>
                    </div>
                    <button
                      onClick={() => handleRequestRefill(med.name)}
                      className="px-3.5 py-1.5 bg-[#ea580c] text-white font-bold text-xs rounded-lg hover:bg-[#d94e07] transition-colors shrink-0 shadow-2xs"
                    >
                      Request Refill
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Diagnostic Lab & Scan Results */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#005963]">science</span>
                Diagnostic Scans & Lab Panels
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-slate-800">Comprehensive Metabolic Blood Panel</div>
                    <div className="text-slate-500 text-[11px]">Tested at Apollo Diagnostics Bangalore</div>
                  </div>
                  <span className="px-2.5 py-1 bg-green-100 text-green-800 font-bold text-[10px] rounded-full">
                    Normal Range
                  </span>
                </div>

                {selectedPatient?.scanInfo && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-slate-800">{selectedPatient.scanInfo.type}</div>
                      <span className="px-2.5 py-1 bg-teal-100 text-[#005963] font-bold text-[10px] rounded-full">
                        AI Verified ({selectedPatient.scanInfo.confidence}%)
                      </span>
                    </div>
                    <div className="text-slate-600 text-xs">Finding: {selectedPatient.scanInfo.finding}</div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ─── TAB 3: BILLING & INVOICES (₹) ─── */}
        {activeTab === 'billing' && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ea580c]">receipt_long</span>
                Apollo Invoices & Statements (₹)
              </h2>
              <p className="text-xs text-slate-500">
                Transparent healthcare billing in Indian Rupees with instant online receipt
              </p>
            </div>

            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-800 text-base">{inv.id}</div>
                      <div className="text-xs text-slate-500">Due Date: {inv.dueDate} • Apollo Hospital Bangalore</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      inv.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-[#e65c00]'
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="text-xs text-slate-600 font-semibold">Total Payable Amount:</span>
                    <span className="text-xl font-extrabold text-slate-900">₹{inv.amount.toLocaleString('en-IN')}</span>
                  </div>

                  {inv.status !== 'Paid' && (
                    <button
                      onClick={() => recordPayment(inv.id)}
                      className="w-full py-2.5 bg-[#ea580c] hover:bg-[#d94e07] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">credit_card</span>
                      Pay Online via UPI / NetBanking (₹{inv.amount.toLocaleString('en-IN')})
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 4: DAILY VITALS LOGGER ─── */}
        {activeTab === 'vitals' && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-xl">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#005963]">monitor_heart</span>
                Log Patient Daily Vitals ({activeUserName})
              </h2>
              <p className="text-xs text-slate-500">
                Transmitted directly to Apollo Attending Physician chart
              </p>
            </div>

            {loggedSuccess && (
              <div className="p-4 bg-[#005963] text-white rounded-2xl font-bold text-xs animate-in fade-in flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-2xl">check_circle</span>
                <span>Vitals successfully logged and updated on your clinical chart!</span>
              </div>
            )}

            <form onSubmit={handleLogVitals} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  required
                  value={loggedBp}
                  onChange={(e) => setLoggedBp(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005963]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  required
                  value={loggedHr}
                  onChange={(e) => setLoggedHr(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005963]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Blood Oxygen SpO2 (%)</label>
                <input
                  type="number"
                  required
                  value={loggedSpo2}
                  onChange={(e) => setLoggedSpo2(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005963]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#005963] hover:bg-[#00474f] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">publish</span>
                Submit Vitals to Apollo Clinical Team
              </button>
            </form>
          </div>
        )}

      </div>

      <PatientChatModal />
      <AppointmentModal isOpen={isApptModalOpen} onClose={() => setIsApptModalOpen(false)} />
    </div>
  );
}
