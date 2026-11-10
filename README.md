# Hospital AI — Community Project Prototype

A role-based hospital management and patient-care interface built with **React 19** and **Vite**. The project includes Admin, Doctor, and Patient portals, sample medical records, appointments, bed management, billing, prescriptions, clinical reports, and a dataset-backed demonstration assistant.

> **Important:** This repository is an educational prototype. It uses mock/sample data and browser storage. It is not connected to a real hospital, EHR, payment gateway, or validated clinical AI service. Do not enter real patient information or use its outputs for diagnosis, treatment, or emergency decisions.

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm
- A modern browser

## Run locally

1. Extract the ZIP file.
2. Open the extracted `HOSPITAL-AI-main` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed by Vite (normally `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## Demo sign-in accounts

| Portal | Email | Password |
|---|---|---|
| Admin | `admin@medcore.org` | `admin123` |
| Doctor | `doctor@medcore.org` | `doctor123` |
| Patient | `patient@medcore.org` | `patient123` |

These credentials are hard-coded demonstration credentials, not secure authentication. Patient registration is stored in the current browser's local storage and is not shared between devices.

## Project structure

```text
src/
  components/
    admin/       Admin dashboard, patient records, beds, billing
    common/      Login, header, navigation, schedules, reports
    doctor/      Doctor dashboard, patient detail, prescriptions
    patient/     Patient portal, appointments, chat
  context/       Shared application state
  data/          Mock data and dataset-based classifier
  App.jsx        Application routing by role
  main.jsx       React entry point
```

## Current limitations and recommended next steps

1. Replace mock data with a backend API and a database (for example, PostgreSQL).
2. Implement server-side authentication, password hashing, role-based authorization, and audit logs. Never rely on client-side role checks for real access control.
3. Add input validation, secure session handling, backups, and privacy controls before handling any patient data.
4. Treat the current AI/classifier output as a demo only. A real clinical decision-support feature needs clinically validated data, clinician review, documented limitations, and applicable regulatory/privacy review.
5. Add automated tests and verify every workflow with realistic test data.

## Useful commands

- `npm run dev` — start development server
- `npm run build` — create production bundle in `dist/`
- `npm run preview` — preview production bundle
- `npm run lint` — run Oxlint
