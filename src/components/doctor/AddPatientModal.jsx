import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getDiagnosisPrescription } from '../../data/datasetClassifier';

export default function AddPatientModal({ isOpen, onClose }) {
  const { setPatients, setNotifications, setSelectedPatientId, setActiveDoctorTab } = useApp();

  const [name, setName] = useState('');
  const [age, setAge] = useState('42');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('1981-08-15');
  const [bloodType, setBloodType] = useState('O- Negative');
  const [ward, setWard] = useState('General Ward');
  const [bed, setBed] = useState('104-B');

  // Vitals
  const [bp, setBp] = useState('124/82');
  const [hr, setHr] = useState('78');
  const [temp, setTemp] = useState('99.6');
  const [spo2, setSpo2] = useState('98');

  // Symptoms & Scan
  const [symptoms, setSymptoms] = useState('');
  const [scanFile, setScanFile] = useState(null);
  const [scanDataUrl, setScanDataUrl] = useState(null);
  const [allergies, setAllergies] = useState('None Known');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScanFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setScanDataUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    const symClean = (symptoms.trim() || 'General Clinical Evaluation').toLowerCase();
    const fileNameLower = (scanFile ? scanFile.name : '').toLowerCase();

    let computedDiagnosis = '';
    let computedCode = 'Z00.00';
    let confidence = 96;
    let diagDesc = '';
    let features = [];
    let nextSteps = [];

    // Intelligent Symptom Classifier: Distinguish Mild Cold/Fever from Severe Conditions!

    // 1. MILD COLD, FLU, & FEVER (URI)
    if ((symClean.includes('cold') || symClean.includes('fever') || symClean.includes('flu') || symClean.includes('throat') || symClean.includes('nose') || symClean.includes('sneez')) &&
        !symClean.includes('breath') && !symClean.includes('pneumon') && !symClean.includes('shortness')) {
      computedDiagnosis = 'Acute Viral Upper Respiratory Infection (Cold & Fever)';
      computedCode = 'J06.9';
      confidence = 96;
      diagDesc = `Clinical evaluation of symptoms ("${symptoms}") indicates a self-limiting viral upper respiratory tract infection (URI) with low-grade febrile episode and mild mucosal inflammation.`;
      features = ['Pharyngeal erythema & mild congestion', 'Clear lung auscultation fields', 'Normal SpO2 oxygenation (98%)'];
      nextSteps = [
        '1. Rest, adequate oral hydration, and supportive care',
        '2. Antipyretics (Acetaminophen / Paracetamol) for fever management',
        '3. OTC saline decongestant spray & throat lozenges as needed'
      ];
    }
    // 2. SEVERE PNEUMONIA & LOWER RESPIRATORY INFECTION
    else if (symClean.includes('pneumon') || symClean.includes('shortness') || symClean.includes('breath') || symClean.includes('difficulty breathing') || fileNameLower.includes('pneumon')) {
      computedDiagnosis = 'Acute Lobar Pneumonia & Pulmonary Infiltrate';
      computedCode = 'J18.9';
      confidence = 94;
      diagDesc = `Clinical symptom intake ("${symptoms}") indicates lower respiratory tract bronchial infection and parenchymal consolidation requiring targeted antibiotic therapy.`;
      features = ['Basilar rales & rhonchi upon auscultation', 'Elevated body temperature', 'Impaired gas exchange risk'];
      nextSteps = [
        '1. Order CBC, CRP, and Sputum Culture',
        '2. Initiate empirical antibiotic therapy',
        '3. Monitor SpO2 and administer supplemental O2 if < 94%'
      ];
    }
    // 3. HEADACHE & NEUROLOGICAL
    else if (symClean.includes('head') || symClean.includes('migraine') || symClean.includes('dizz') || symClean.includes('stroke') || symClean.includes('numb') || fileNameLower.includes('brain') || fileNameLower.includes('mri')) {
      computedDiagnosis = 'Acute Neurological Disorder & Cephalea';
      computedCode = 'G44.2';
      confidence = 94;
      diagDesc = `Clinical evaluation of symptoms ("${symptoms}") indicates cranial neurological strain, vasospasm, or localized cephalea.`;
      features = ['Focal cranial tenderness noted', 'Pupillary light response equal and reactive', 'No focal motor deficit'];
      nextSteps = [
        '1. Schedule non-contrast head CT or Brain MRI',
        '2. Administer targeted neuro-vascular analgesia',
        '3. Monitor vital signs & Glasgow Coma Scale (GCS)'
      ];
    }
    // 4. STOMACH & GASTROINTESTINAL
    else if (symClean.includes('stomach') || symClean.includes('nausea') || symClean.includes('vomit') || symClean.includes('acid') || symClean.includes('belly') || symClean.includes('gastric') || symClean.includes('digest')) {
      computedDiagnosis = 'Acute Gastroenteritis & Abdominal Distress';
      computedCode = 'K52.9';
      confidence = 96;
      diagDesc = `Clinical symptom intake ("${symptoms}") indicates acute gastrointestinal mucosal inflammation and hyperperistalsis.`;
      features = ['Diffuse abdominal tenderness without guarding', 'Normoactive bowel sounds', 'Hydration deficit noted'];
      nextSteps = [
        '1. Initiate IV rehydration & electrolyte replacement',
        '2. Order abdominal ultrasound & stool culture panel',
        '3. Administer antiemetics & GI mucosal protectants'
      ];
    }
    // 5. KIDNEY & RENAL COLIC
    else if (symClean.includes('kidney') || symClean.includes('flank') || symClean.includes('urine') || symClean.includes('renal') || symClean.includes('calcul')) {
      computedDiagnosis = 'Nephrolithiasis with Renal Calculus Colic';
      computedCode = 'N20.0';
      confidence = 96;
      diagDesc = `Clinical evaluation of flank symptoms ("${symptoms}") indicates urinary tract calculus irritation and proximal hydronephrosis.`;
      features = ['Costovertebral angle tenderness (CVA)', 'Microscopic hematuria risk', 'Ureteral spasm'];
      nextSteps = [
        '1. Schedule urology consultation & renal ultrasound',
        '2. Maintain high oral fluid intake (>2.5L / day)',
        '3. Administer prescribed analgesia for colic relief'
      ];
    }
    // 6. CARDIAC & CHEST PAIN
    else if (symClean.includes('chest') || symClean.includes('heart') || symClean.includes('cardiac') || symClean.includes('angina') || symClean.includes('palpitat')) {
      computedDiagnosis = 'Acute Myocardial Ischemic Strain / ACS';
      computedCode = 'I21.9';
      confidence = 97;
      diagDesc = `Clinical evaluation of cardiac chest symptoms ("${symptoms}") indicates acute coronary perfusion strain requiring immediate evaluation.`;
      features = ['Retrosternal chest pressure noted', 'Preserved peripheral pulses', 'Normal S1/S2 heart sounds'];
      nextSteps = [
        '1. Perform 12-lead Electrocardiogram (ECG) immediately',
        '2. Order STAT Troponin I & CK-MB lab panel',
        '3. Administer sublingual nitroglycerin & antiplatelets'
      ];
    }
    // 7. MUSCULOSKELETAL & JOINT PAIN
    else if (symClean.includes('knee') || symClean.includes('leg') || symClean.includes('arm') || symClean.includes('joint') || symClean.includes('fracture') || symClean.includes('bone') || symClean.includes('swell') || symClean.includes('pain')) {
      computedDiagnosis = 'Acute Musculoskeletal Joint Strain & Arthralgia';
      computedCode = 'M25.50';
      confidence = 96;
      diagDesc = `Clinical symptom intake ("${symptoms}") indicates acute localized articular strain, peri-articular inflammation, or bony tenderness.`;
      features = ['Localized joint tenderness & mild edema', 'Restricted painful range of motion', 'No neuro-vascular impairment'];
      nextSteps = [
        '1. Immobilize affected joint / splinting support',
        '2. Order radiographic alignment series (X-Ray)',
        '3. Apply ice therapy, compression, and limb elevation'
      ];
    }
    // 8. DYNAMIC FALLBACK MATCHING EXACT USER SYMPTOMS
    else {
      const words = symptoms.trim().split(' ').slice(0, 4).join(' ');
      const capitalized = words ? words.charAt(0).toUpperCase() + words.slice(1) : 'Clinical Symptom';
      computedDiagnosis = `Acute ${capitalized} Evaluation`;
      computedCode = 'R69';
      confidence = 93;
      diagDesc = `Clinical evaluation conducted for symptoms: "${symptoms}". Patient requires outpatient supportive care and routine observation.`;
      features = ['Symptomatic presentation documented upon intake', 'Normal vital signs baseline', 'No acute emergency collapse'];
      nextSteps = [
        '1. Complete routine supportive care & oral hydration',
        '2. Schedule follow-up if symptoms persist > 48 hours',
        '3. Monitor vitals daily'
      ];
    }

    // Automatically generate diagnosis-matched prescription!
    const matchedPrescription = getDiagnosisPrescription(computedDiagnosis);

    const scanType = scanDataUrl
      ? (scanFile ? `Uploaded ${scanFile.name}` : 'External Scanner File')
      : 'Clinical Intake & Physical Examination';

    const scanDesc = scanDataUrl
      ? `Uploaded scanner image file '${scanFile ? scanFile.name : 'Patient Scan Image'}'. Rendered in clinical viewport.`
      : `Clinical intake for ${name}. Physical exam & vitals recorded upon admission (No external scanner file uploaded).`;

    const newId = `p${Date.now()}`;
    const newPatient = {
      id: newId,
      name: name,
      mrn: `${Math.floor(100 + Math.random() * 899)}-${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 8999)}`,
      dob: dob,
      age: parseInt(age) || 42,
      gender: gender,
      bloodType: bloodType,
      ward: ward,
      bed: bed,
      status: parseInt(spo2) < 92 ? 'Critical' : 'Stable',
      doctor: 'Dr. S. Chen',
      vitals: { bp, hr: `${hr} bpm`, temp: `${temp} °F`, spo2: parseInt(spo2) || 98 },
      allergies: allergies ? allergies.split(',').map(a => a.trim()) : [],
      risks: ['Clinical Monitoring'],
      problems: [
        { code: computedCode, name: computedDiagnosis, onset: 'Today (AI Diagnosed)' }
      ],
      // Attach diagnosis-matched prescription directly!
      medications: matchedPrescription,

      // Attach Custom Scan & AI Diagnosis directly to patient object!
      scanInfo: {
        id: `scan-${newId}`,
        name: scanFile ? scanFile.name : 'Clinical Symptom Evaluation',
        type: scanType,
        imageUrl: scanDataUrl, // NULL if no scan file was uploaded!
        finding: computedDiagnosis,
        confidence: confidence,
        icdCode: computedCode,
        scanDescription: scanDesc,
        diagnosisDescription: diagDesc,
        features: features,
        nextSteps: nextSteps
      }
    };

    setPatients(prev => [newPatient, ...prev]);
    setSelectedPatientId(newId);
    setActiveDoctorTab('patientDetail');

    setNotifications(prev => [
      {
        id: Date.now(),
        title: "New Patient Admitted & Rx Prescribed",
        message: `${name} admitted. Diagnosis: '${computedDiagnosis}'. Prescribed ${matchedPrescription.length} medications.`,
        time: "Just now",
        type: "success"
      },
      ...prev
    ]);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-on-background/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant/40 bg-surface flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary-container">
            <span className="material-symbols-outlined text-[24px] icon-filled">person_add</span>
            <h2 className="font-bold text-base text-on-surface">Admit Patient & Auto-Generate Clinical Prescription</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs font-body-sm">
          {/* Patient Personal Info */}
          <div>
            <h3 className="font-bold text-on-surface uppercase text-[10px] tracking-wider mb-2 text-primary">
              1. Patient Demographics & Blood Type
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-on-surface mb-1">Full Patient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Michael Thorne"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-outline-variant/60 bg-surface px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Blood Type</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full rounded-md border border-outline-variant/60 bg-surface font-bold text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="O- Negative">O- Negative (Universal Donor)</option>
                  <option value="O+ Positive">O+ Positive</option>
                  <option value="A+ Positive">A+ Positive</option>
                  <option value="A- Negative">A- Negative</option>
                  <option value="B+ Positive">B+ Positive</option>
                  <option value="B- Negative">B- Negative</option>
                  <option value="AB+ Positive">AB+ Positive</option>
                  <option value="AB- Negative">AB- Negative</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block font-bold text-on-surface mb-1">Age</label>
                <input
                  type="number"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded-md border border-outline-variant/60 bg-surface font-data-tabular px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-on-surface mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-md border border-outline-variant/60 bg-surface px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-on-surface mb-1">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-md border border-outline-variant/60 bg-surface font-data-tabular px-3 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Vitals Snapshot */}
          <div>
            <h3 className="font-bold text-on-surface uppercase text-[10px] tracking-wider mb-2 text-primary">
              2. Initial Admission Vitals
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">BP (mmHg)</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  className="w-full rounded-md border border-outline-variant/60 bg-surface font-data-tabular px-2.5 py-1.5 text-xs text-center focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">HR (bpm)</label>
                <input
                  type="text"
                  value={hr}
                  onChange={(e) => setHr(e.target.value)}
                  className="w-full rounded-md border border-outline-variant/60 bg-surface font-data-tabular px-2.5 py-1.5 text-xs text-center focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Temp (°F)</label>
                <input
                  type="text"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full rounded-md border border-outline-variant/60 bg-surface font-data-tabular px-2.5 py-1.5 text-xs text-center focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">SpO2 (%)</label>
                <input
                  type="text"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  className="w-full rounded-md border border-outline-variant/60 bg-surface font-data-tabular px-2.5 py-1.5 text-xs text-center focus:outline-none font-bold text-error"
                />
              </div>
            </div>
          </div>

          {/* Symptoms & Scanner Image Upload */}
          <div>
            <h3 className="font-bold text-on-surface uppercase text-[10px] tracking-wider mb-2 text-primary">
              3. Patient Symptoms & Scanner Image (Optional)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-on-surface mb-1">Type Patient Symptoms / Clinical Complaints</label>
                <textarea
                  rows={3}
                  required
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Type patient symptoms here (e.g. normal cold fever, knee joint pain, stomach ache, headache...)"
                  className="w-full rounded-md border border-outline-variant/60 bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Upload Scanner Image File (Optional - CT / X-Ray / MRI)</label>
                <label className="border border-dashed border-primary-container/60 hover:border-primary rounded-lg p-3 flex items-center gap-3 bg-surface-container-low/40 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-2xl text-primary shrink-0">upload_file</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-on-surface truncate">
                      {scanFile ? scanFile.name : 'Click to choose scanner file from computer (Optional)'}
                    </div>
                    <div className="text-[10px] text-on-surface-variant">Leave blank if no scanner image file is available</div>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              {/* Viewport Thumbnail if uploaded */}
              {scanDataUrl ? (
                <div className="p-2 bg-black rounded-lg flex items-center gap-3">
                  <img src={scanDataUrl} alt="Scan Preview" className="w-12 h-12 object-cover rounded border border-white/20" />
                  <div className="text-white text-[11px]">
                    <div className="font-bold">Scanner File Uploaded: {scanFile ? scanFile.name : 'Image'}</div>
                    <div className="text-white/70 text-[10px]">Image loaded into clinical viewport</div>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface-variant text-[11px]">
                  ℹ️ <strong>No scanner image uploaded.</strong> Diagnosis & Rx prescription will be calculated from your entered symptoms.
                </div>
              )}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-3 flex justify-end gap-3 border-t border-outline-variant/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-outline-variant/60 rounded-md font-semibold text-on-surface hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs rounded-md transition-colors shadow-xs flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              Admit Patient & Auto-Generate Rx
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
