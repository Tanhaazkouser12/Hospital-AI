import React, { createContext, useContext, useState } from 'react';
import { initialPatients, initialBeds, initialInvoices, aiDiagnosticModel } from '../data/mockData';
import { getDiagnosisPrescription } from '../data/datasetClassifier';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('admin'); // 'admin' | 'doctor' | 'patient'
  const [loggedInUser, setLoggedInUser] = useState({
    name: 'Dr. Sarah Jenkins',
    email: 'admin@medcore.org',
    role: 'admin',
    title: 'Chief of Staff (Admin)'
  });

  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [activeDoctorTab, setActiveDoctorTab] = useState('patientDetail');
  const [activePatientTab, setActivePatientTab] = useState('home');

  const [patients, setPatients] = useState(initialPatients);
  const [selectedPatientId, setSelectedPatientId] = useState('p1');
  const [beds, setBeds] = useState(initialBeds);
  const [invoices, setInvoices] = useState(initialInvoices);

  // Global Appointments & Scanner Reservations (Accessible across all 3 regions: Patient, Doctor, Admin)
  const [appointments, setAppointments] = useState([
    {
      id: 'apt-101',
      patientName: 'Sarah Jenkins',
      patientId: 'p1',
      type: 'Diagnostic CT Thorax Scanner Reservation',
      scannerType: 'CT Thorax High-Resolution',
      symptoms: 'Persistent cough, mild chest tightness, low-grade fever',
      date: '2023-10-18',
      time: '10:30 AM',
      status: 'Confirmed',
      doctor: 'Dr. S. Chen',
      department: 'Radiology / Pulmonology'
    }
  ]);

  // Modals & Panels State
  const [selectedBed, setSelectedBed] = useState(null);
  const [isBedModalOpen, setIsBedModalOpen] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [isPatientChatOpen, setIsPatientChatOpen] = useState(false);
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Critical SpO2 Alert", message: "Marcus T. Anderson SpO2 dropped to 91%", time: "10 mins ago", type: "alert" },
    { id: 2, title: "Bed Assignment", message: "Ward A Bed A4 marked vacant", time: "25 mins ago", type: "info" },
    { id: 3, title: "Payment Received", message: "Invoice #INV-2023-0890 paid (₹3,200.50)", time: "1 hr ago", type: "success" }
  ]);

  const [chatMessages, setChatMessages] = useState([
    { sender: "assistant", text: "Hello, I'm your MedCore Care Assistant. How can I help you today?", time: "09:00 AM" }
  ]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const switchRole = (role) => {
    setCurrentRole(role);
    if (role === 'admin') setActiveAdminTab('dashboard');
    if (role === 'doctor') setActiveDoctorTab('patientDetail');
    if (role === 'patient') setActivePatientTab('home');
  };

  const handleLoginUserSuccess = (user) => {
    setLoggedInUser(user);

    // Sync patient user with 3-Region Patients Roster
    if (user.role === 'patient') {
      const match = patients.find(p => p.name.toLowerCase() === user.name.toLowerCase());
      if (match) {
        setSelectedPatientId(match.id);
      } else {
        const newPatientId = `p-${Date.now()}`;
        const defaultDiagnosis = 'Pulmonary Observation & Checkup';
        const defaultMeds = getDiagnosisPrescription(defaultDiagnosis);

        const createdPatient = {
          id: newPatientId,
          name: user.name,
          mrn: `${Math.floor(100 + Math.random() * 899)}-${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 8999)}`,
          dob: '1985-04-22',
          age: 38,
          gender: 'Female',
          bloodType: 'O- Negative',
          ward: 'Outpatient Clinic',
          bed: 'Bay-3',
          status: 'Stable',
          doctor: 'Dr. S. Chen',
          vitals: { bp: '122/80', hr: '74 bpm', temp: '98.6 °F', spo2: 98 },
          allergies: ['Penicillin (Severe)'],
          risks: ['Respiratory Alert'],
          problems: [
            { code: 'J18.9', name: defaultDiagnosis, onset: 'Today (Registered)' }
          ],
          medications: defaultMeds
        };
        setPatients(prev => [createdPatient, ...prev]);
        setSelectedPatientId(newPatientId);
      }
    }

    switchRole(user.role || 'patient');
  };

  const bookAppointment = (newAppt) => {
    setAppointments(prev => [newAppt, ...prev]);

    setNotifications(prev => [
      {
        id: Date.now(),
        title: "New Appointment & Scanner Booked",
        message: `${newAppt.patientName} booked ${newAppt.type} (${newAppt.scannerType || 'Consultation'}) for ${newAppt.date} at ${newAppt.time}`,
        time: "Just now",
        type: "info"
      },
      ...prev
    ]);
  };

  const openAssignModal = (bedId) => {
    const bed = beds.find(b => b.id === bedId);
    if (bed) {
      setSelectedBed(bed);
      setIsBedModalOpen(true);
    }
  };

  const closeAssignModal = () => {
    setIsBedModalOpen(false);
    setSelectedBed(null);
  };

  const assignBedToPatient = (bedId, patientName, mrn, status = "Stable") => {
    setBeds(prev => prev.map(bed => {
      if (bed.id === bedId) {
        return {
          ...bed,
          patientName: patientName || null,
          mrn: mrn || null,
          status: patientName ? status : "Vacant"
        };
      }
      return bed;
    }));

    if (patientName) {
      setNotifications(prev => [
        {
          id: Date.now(),
          title: "Bed Assigned",
          message: `${patientName} assigned to Bed ${bedId}`,
          time: "Just now",
          type: "info"
        },
        ...prev
      ]);
    }
    closeAssignModal();
  };

  const openInvoiceModal = (invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const closeInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setSelectedInvoice(null);
  };

  const recordPayment = (invoiceId) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, status: "Paid" };
      }
      return inv;
    }));
    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice(prev => ({ ...prev, status: "Paid" }));
    }
    setNotifications(prev => [
      {
        id: Date.now(),
        title: "Payment Recorded",
        message: `Payment received for ${invoiceId}`,
        time: "Just now",
        type: "success"
      },
      ...prev
    ]);
  };

  const confirmAiDiagnosis = (patientId, diagnosisTitle, code = "J18.9") => {
    const generatedRx = getDiagnosisPrescription(diagnosisTitle);

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const newProblem = { code, name: diagnosisTitle, onset: "Today (AI Diagnosed & Confirmed)" };
        const exists = p.problems.some(pr => pr.name === diagnosisTitle);

        // Merge generated prescription into patient's active medications!
        const existingMedNames = new Set(p.medications.map(m => m.name.toLowerCase()));
        const uniqueRx = generatedRx.filter(rx => !existingMedNames.has(rx.name.toLowerCase()));
        const updatedMeds = [...uniqueRx, ...p.medications];

        if (!exists) {
          return { ...p, problems: [newProblem, ...p.problems], medications: updatedMeds };
        } else {
          return { ...p, medications: updatedMeds };
        }
      }
      return p;
    }));

    setNotifications(prev => [
      {
        id: Date.now(),
        title: "Diagnosis & Prescription Confirmed",
        message: `Confirmed '${diagnosisTitle}' for ${selectedPatient.name}. Auto-generated ${generatedRx.length} Rx medications.`,
        time: "Just now",
        type: "success"
      },
      ...prev
    ]);
  };

  const addClinicalNote = (patientId, noteText) => {
    if (!noteText.trim()) return;
    setNotifications(prev => [
      {
        id: Date.now(),
        title: "Clinical Note Added",
        message: `Note added for ${selectedPatient.name}`,
        time: "Just now",
        type: "info"
      },
      ...prev
    ]);
    setIsNewNoteModalOpen(false);
  };

  const sendPatientMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { sender: "user", text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let reply = `Thank you ${loggedInUser ? loggedInUser.name.split(' ')[0] : ''}. Dr. Chen's care team has received your message and updated your chart.`;
      if (text.toLowerCase().includes("pain") || text.toLowerCase().includes("fever")) {
        reply = "I understand you're experiencing symptoms. Please monitor your temperature and take your prescribed medication. If symptoms worsen, contact emergency care immediately.";
      } else if (text.toLowerCase().includes("appointment") || text.toLowerCase().includes("reschedule") || text.toLowerCase().includes("scan")) {
        reply = "Your scanner reservation request has been processed and saved across Patient, Doctor, and Admin regions.";
      }
      setChatMessages(prev => [...prev, { sender: "assistant", text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1000);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole: switchRole,
        loggedInUser,
        setLoggedInUser,
        handleLoginUserSuccess,
        activeAdminTab,
        setActiveAdminTab,
        activeDoctorTab,
        setActiveDoctorTab,
        activePatientTab,
        setActivePatientTab,
        patients,
        setPatients,
        selectedPatient,
        selectedPatientId,
        setSelectedPatientId,
        beds,
        invoices,
        appointments,
        bookAppointment,
        selectedBed,
        isBedModalOpen,
        openAssignModal,
        closeAssignModal,
        assignBedToPatient,
        selectedInvoice,
        isInvoiceModalOpen,
        openInvoiceModal,
        closeInvoiceModal,
        recordPayment,
        confirmAiDiagnosis,
        aiDiagnosticModel,
        notifications,
        setNotifications,
        isNewNoteModalOpen,
        setIsNewNoteModalOpen,
        addClinicalNote,
        isPatientChatOpen,
        setIsPatientChatOpen,
        chatMessages,
        sendPatientMessage,
        isMobilePreview,
        setIsMobilePreview
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
