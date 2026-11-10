export const initialPatients = [
  {
    id: "p1",
    name: "Marcus T. Anderson",
    mrn: "883-291-004",
    dob: "11/04/1962",
    age: 61,
    gender: "Male",
    ward: "Ward A - Cardiology",
    bed: "A7",
    doctor: "Dr. H. Smith",
    status: "Critical",
    admissionDate: "Oct 24, 09:15",
    allergies: ["Penicillin Allergy"],
    risks: ["Fall Risk"],
    vitals: { bp: "142/88", hr: 84, temp: "98.9", spo2: 91 },
    problems: [
      { code: "J44.9", name: "COPD, unsp.", onset: "2018" },
      { code: "I10", name: "Essential Hypertension", onset: "2015" }
    ],
    medications: [
      { name: "Lisinopril 20mg", instructions: "PO Daily", type: "pill" },
      { name: "Albuterol HFA", instructions: "2 puffs Q4H PRN", type: "inhaler" }
    ]
  },
  {
    id: "p2",
    name: "Jane A. Doe",
    mrn: "894-33-210",
    dob: "05/14/1982",
    age: 42,
    gender: "Female",
    ward: "ICU",
    bed: "101-A",
    doctor: "Dr. Sarah Jenkins",
    status: "Critical",
    admissionDate: "Oct 12, 08:30",
    bloodType: "O- Negative",
    allergies: ["Penicillin (Severe)", "Latex (Mild)"],
    risks: ["High Fall Risk"],
    vitals: { bp: "150/92", hr: 92, temp: "99.1", spo2: 94 },
    problems: [
      { code: "I21.9", name: "Acute Myocardial Infarction", onset: "2023" },
      { code: "I10", name: "Hypertension", onset: "2020" }
    ],
    medications: [
      { name: "Aspirin 81mg", instructions: "PO Daily", type: "pill" },
      { name: "Metoprolol 50mg", instructions: "PO BID", type: "pill" }
    ]
  },
  {
    id: "p3",
    name: "Eleanor Rigby",
    mrn: "33219-B",
    dob: "03/12/1976",
    age: 48,
    gender: "Female",
    ward: "Ward B - Neurology",
    bed: "B4",
    doctor: "Dr. T. Nguyen",
    status: "Stable",
    admissionDate: "Oct 24, 10:30",
    allergies: ["None"],
    risks: [],
    vitals: { bp: "120/78", hr: 72, temp: "98.6", spo2: 98 },
    problems: [{ code: "G43.9", name: "Migraine, unspecified", onset: "2021" }],
    medications: [{ name: "Sumatriptan 50mg", instructions: "PRN", type: "pill" }]
  },
  {
    id: "p4",
    name: "Samuel L. Jackson",
    mrn: "11094-C",
    dob: "12/21/1948",
    age: 75,
    gender: "Male",
    ward: "Ward C - Oncology",
    bed: "C3",
    doctor: "Dr. K. Patel",
    status: "Normal",
    admissionDate: "Oct 24, 11:45",
    allergies: ["Sulfa Drugs"],
    risks: [],
    vitals: { bp: "128/82", hr: 76, temp: "98.4", spo2: 97 },
    problems: [{ code: "C61", name: "Malignant neoplasm of prostate", onset: "2022" }],
    medications: [{ name: "Bicalutamide 50mg", instructions: "PO Daily", type: "pill" }]
  },
  {
    id: "p5",
    name: "Sarah Connor",
    mrn: "55432-A",
    dob: "05/18/1970",
    age: 54,
    gender: "Female",
    ward: "Ward A - Cardiology",
    bed: "A8",
    doctor: "Dr. H. Smith",
    status: "Critical",
    admissionDate: "Oct 24, 13:20",
    allergies: ["Codeine"],
    risks: ["Fall Risk"],
    vitals: { bp: "160/100", hr: 110, temp: "100.2", spo2: 89 },
    problems: [{ code: "I50.9", name: "Heart failure, unspecified", onset: "2019" }],
    medications: [{ name: "Furosemide 40mg", instructions: "IV Daily", type: "pill" }]
  }
];

export const initialBeds = [
  { id: "A1", ward: "Ward A - Cardiology", status: "Stable", patientName: "A. Miller", mrn: "88219-A" },
  { id: "A2", ward: "Ward A - Cardiology", status: "Stable", patientName: "B. Davis", mrn: "88220-A" },
  { id: "A3", ward: "Ward A - Cardiology", status: "Stable", patientName: "C. Evans", mrn: "88221-A" },
  { id: "A4", ward: "Ward A - Cardiology", status: "Vacant", patientName: null, mrn: null },
  { id: "A5", ward: "Ward A - Cardiology", status: "Normal", patientName: "D. Frank", mrn: "88222-A" },
  { id: "A6", ward: "Ward A - Cardiology", status: "Normal", patientName: "E. Grace", mrn: "88223-A" },
  { id: "A7", ward: "Ward A - Cardiology", status: "Critical", patientName: "Marcus T. Anderson", mrn: "883-291-004" },
  { id: "A8", ward: "Ward A - Cardiology", status: "Critical", patientName: "Sarah Connor", mrn: "55432-A" },

  { id: "B1", ward: "Ward B - Neurology", status: "Normal", patientName: "F. Harris", mrn: "99101-B" },
  { id: "B2", ward: "Ward B - Neurology", status: "Vacant", patientName: null, mrn: null },
  { id: "B3", ward: "Ward B - Neurology", status: "Vacant", patientName: null, mrn: null },
  { id: "B4", ward: "Ward B - Neurology", status: "Stable", patientName: "Eleanor Rigby", mrn: "33219-B" },
  { id: "B5", ward: "Ward B - Neurology", status: "Stable", patientName: "G. Ivers", mrn: "99102-B" },
  { id: "B6", ward: "Ward B - Neurology", status: "Critical", patientName: "H. Jones", mrn: "99103-B" },
  { id: "B7", ward: "Ward B - Neurology", status: "Normal", patientName: "K. Long", mrn: "99104-B" },
  { id: "B8", ward: "Ward B - Neurology", status: "Vacant", patientName: null, mrn: null },

  { id: "C1", ward: "Ward C - Oncology", status: "Critical", patientName: "L. Mason", mrn: "77101-C" },
  { id: "C2", ward: "Ward C - Oncology", status: "Critical", patientName: "M. Nelson", mrn: "77102-C" },
  { id: "C3", ward: "Ward C - Oncology", status: "Normal", patientName: "Samuel L. Jackson", mrn: "11094-C" },
  { id: "C4", ward: "Ward C - Oncology", status: "Stable", patientName: "N. Owens", mrn: "77103-C" },
  { id: "C5", ward: "Ward C - Oncology", status: "Vacant", patientName: null, mrn: null },
  { id: "C6", ward: "Ward C - Oncology", status: "Vacant", patientName: null, mrn: null },
  { id: "C7", ward: "Ward C - Oncology", status: "Stable", patientName: "P. Quinn", mrn: "77104-C" },
  { id: "C8", ward: "Ward C - Oncology", status: "Normal", patientName: "R. Stevens", mrn: "77105-C" },

  { id: "101-A", ward: "ICU", status: "Critical", patientName: "Jane A. Doe", mrn: "894-33-210" },
  { id: "101-B", ward: "ICU", status: "Stable", patientName: "Jane Smith", mrn: "10291-I" },
  { id: "102-A", ward: "ICU", status: "Normal", patientName: "Robert Cole", mrn: "10292-I" },
  { id: "102-B", ward: "ICU", status: "Vacant", patientName: null, mrn: null }
];

export const initialInvoices = [
  {
    id: "INV-2023-0891",
    patientName: "Eleanor Pena",
    mrn: "MRN-84729",
    dob: "05/14/1982",
    address: "456 Connaught Place, New Delhi, India 110001",
    amount: 14500.00,
    status: "Pending",
    invoiceDate: "Oct 10, 2023",
    dueDate: "Oct 24, 2023",
    lineItems: [
      { code: "99283", description: "Emergency Room Intake & Triage", qty: 1, unitPrice: 8500.00, total: 8500.00 },
      { code: "70450", description: "CT Scan High-Resolution - Head/Brain", qty: 1, unitPrice: 4500.00, total: 4500.00 },
      { code: "80053", description: "Comprehensive Blood Metabolic Panel", qty: 1, unitPrice: 1500.00, total: 1500.00 }
    ],
    subtotal: 14500.00,
    tax: 0.00,
    insuranceAdjustment: 0.00,
    totalDue: 14500.00
  },
  {
    id: "INV-2023-0890",
    patientName: "Cody Fisher",
    mrn: "MRN-10294",
    dob: "09/22/1990",
    address: "789 Brigade Road, Bengaluru, Karnataka 560001",
    amount: 3200.50,
    status: "Paid",
    invoiceDate: "Oct 06, 2023",
    dueDate: "Oct 20, 2023",
    lineItems: [
      { code: "99214", description: "Outpatient Specialist Consultation", qty: 1, unitPrice: 2200.50, total: 2200.50 },
      { code: "85025", description: "Complete Blood Count (CBC)", qty: 1, unitPrice: 1000.00, total: 1000.00 }
    ],
    subtotal: 3200.50,
    tax: 0.00,
    insuranceAdjustment: 0.00,
    totalDue: 3200.50
  },
  {
    id: "INV-2023-0889",
    patientName: "Albert Flores",
    mrn: "MRN-33421",
    dob: "11/02/1968",
    address: "12 Marine Drive, Mumbai, Maharashtra 400020",
    amount: 42000.00,
    status: "Insurance Claim",
    invoiceDate: "Oct 04, 2023",
    dueDate: "Oct 18, 2023",
    lineItems: [
      { code: "99291", description: "ICU Critical Care Day 1", qty: 1, unitPrice: 32000.00, total: 32000.00 },
      { code: "93000", description: "12-Lead Electrocardiogram (ECG)", qty: 1, unitPrice: 10000.00, total: 10000.00 }
    ],
    subtotal: 42000.00,
    tax: 0.00,
    insuranceAdjustment: 0.00,
    totalDue: 42000.00
  },
  {
    id: "INV-2023-0888",
    patientName: "Savannah Nguyen",
    mrn: "MRN-99102",
    dob: "04/30/1995",
    address: "88 Park Street, Kolkata, West Bengal 700016",
    amount: 850.00,
    status: "Overdue",
    invoiceDate: "Sep 20, 2023",
    dueDate: "Oct 05, 2023",
    lineItems: [
      { code: "99213", description: "Follow-up Clinic Visit", qty: 1, unitPrice: 850.00, total: 850.00 }
    ],
    subtotal: 850.00,
    tax: 0.00,
    insuranceAdjustment: 0.00,
    totalDue: 850.00
  }
];

export const aiDiagnosticModel = {
  scanInfo: {
    type: "CT Thorax w/o Contrast",
    scanDate: "Oct 24, 2023",
    accession: "AC-99281-B",
    series: "Ser: 4 Img: 42",
    windowing: "WL: -600 WW: 1500",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA30AWzOJjFRBBSk-AZHEJZvHRSXFXnovfh5N-Adifpi8Lyp7pjIjOcz46t2sakfqkd3Ty3Q1V0rI3pfpkF8UQ5RPzhZu-DZr4JM6DlkxcNYUpr29zg9ZYWGPiphpo_sdQv-jmB-Bfk3J2q6ZjZMuPlPPygBLl88F67rCOqBJxdcHMk2DPsQ4qves71Kz9Q7AQQlVDs4f_oP9rOLbFhkjBCgEIU3m3wNlslKlYDJ6rcxoJPqL9053g"
  },
  findings: [
    {
      id: "f1",
      title: "Pneumonia, right lower lobe",
      category: "Acute",
      confidence: 94,
      description: "Consolidation with air bronchograms identified in the RLL.",
      features: ["Lobar consolidation", "Air bronchograms present", "No pleural effusion"],
      suggestedActions: [
        "Order CBC and Sputum Culture",
        "Review empirical antibiotic protocol"
      ]
    },
    {
      id: "f2",
      title: "Mild Emphysematous Changes",
      category: "Chronic",
      confidence: 82,
      description: "Centrilobular lucencies noted in upper lobes, consistent with known COPD history.",
      features: ["Centrilobular lucencies upper lobes", "Mild hyperinflation"],
      suggestedActions: ["Continue bronchodilator therapy"]
    }
  ]
};
