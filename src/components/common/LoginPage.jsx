import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const INITIAL_CREDENTIALS = {
  admin: {
    email: 'admin@medcore.org',
    password: 'admin123',
    role: 'admin',
    name: 'Dr. Sarah Jenkins',
    title: 'Chief of Staff (Admin)'
  },
  doctor: {
    email: 'doctor@medcore.org',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. S. Chen',
    title: 'Pulmonologist (Doctor)'
  },
  patient: {
    email: 'patient@medcore.org',
    password: 'patient123',
    role: 'patient',
    name: 'Sarah Jenkins',
    title: 'Patient Care Portal'
  }
};

export default function LoginPage({ onLoginSuccess }) {
  const { handleLoginUserSuccess } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'user_register'
  const [userAccounts, setUserAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('medcore_patient_accounts');
      return saved ? { ...INITIAL_CREDENTIALS, ...JSON.parse(saved) } : INITIAL_CREDENTIALS;
    } catch {
      // Recover safely if browser storage contains invalid JSON.
      return INITIAL_CREDENTIALS;
    }
  });

  // Login state
  const [selectedRole, setSelectedRole] = useState('admin');
  const [loginIdentifier, setLoginIdentifier] = useState(INITIAL_CREDENTIALS.admin.email);
  const [loginPassword, setLoginPassword] = useState(INITIAL_CREDENTIALS.admin.password);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Patient User Register state
  const [regName, setRegName] = useState('');
  const [regIdentifier, setRegIdentifier] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccessMessage, setRegSuccessMessage] = useState('');

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    const existing = userAccounts[roleKey] || INITIAL_CREDENTIALS[roleKey];
    if (existing) {
      setLoginIdentifier(existing.email);
      setLoginPassword(existing.password);
    }
    setErrorMessage('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const inputClean = loginIdentifier.trim().toLowerCase();

    // Check pre-provisioned or registered user accounts
    const foundAcc = Object.values(userAccounts).find(
      acc => (acc.email.toLowerCase() === inputClean || (acc.username && acc.username.toLowerCase() === inputClean)) &&
             acc.password === loginPassword
    );

    if (foundAcc && foundAcc.role === selectedRole) {
      handleLoginUserSuccess(foundAcc);
      onLoginSuccess(foundAcc);
    } else {
      setErrorMessage('Invalid username or password for the selected portal.');
    }
  };

  const handlePatientRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim() || !regIdentifier.trim() || !regPassword.trim()) {
      setErrorMessage('Please fill in all registration fields.');
      return;
    }

    const normalizedIdentifier = regIdentifier.trim().toLowerCase();
    const alreadyRegistered = Object.values(userAccounts).some(
      account => account.email?.toLowerCase() === normalizedIdentifier ||
        account.username?.toLowerCase() === normalizedIdentifier
    );
    if (alreadyRegistered) {
      setErrorMessage('An account with this email or username already exists.');
      return;
    }

    const newPatientAccount = {
      email: regIdentifier.trim(),
      username: regIdentifier.trim(),
      password: regPassword,
      role: 'patient',
      name: regName.trim(),
      title: 'Patient Care Portal'
    };

    const updated = {
      ...userAccounts,
      patient: newPatientAccount,
      [regIdentifier.toLowerCase()]: newPatientAccount
    };

    setUserAccounts(updated);
    localStorage.setItem('medcore_patient_accounts', JSON.stringify(updated));

    setRegSuccessMessage(`Welcome, ${regName}! Your patient portal account has been created.`);
    handleLoginUserSuccess(newPatientAccount);
    onLoginSuccess(newPatientAccount);
  };

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center p-4 bg-background text-on-background bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(248, 249, 255, 0.75), rgba(248, 249, 255, 0.75)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfLloCzTMRXa1Gn0HvFnJLhE4tpeMa8ZJoglSpBH73wBzKm28eioT1XMCD0Z0VyAqLacAClOThKsQNPrhQ3h4qRsY1FszDUMHrE-EeQbLe3RLGTPmsxyuTETK0yhvGt0_GiRhM3LUUOj3-a_0U1eBu32YNhALLxRnhl-iFE8PuHLY6XkWlalJxq9gTmFqTIOY7aol7xxNQFn6RR0LS5wY1aa-gLqnYwDH_qiGc4CpZEc1_Lflpbc4')`
      }}
    >
      <main className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300 z-10">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* Header / Apollo Brand */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#005963] to-[#003b42] text-white shadow-md">
                <span className="material-symbols-outlined text-[26px] text-amber-300 icon-filled">
                  health_and_safety
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display-lg text-2xl font-black text-[#005963]">Apollo</span>
                  <span className="font-display-lg text-2xl font-bold text-[#e65c00]">Hospitals</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-500">Bangalore • Clinical & Patient Care</p>
              </div>
            </div>

            {/* Top Navigation Mode Tabs */}
            <div className="flex border-b border-slate-200 mb-6 text-xs font-bold">
              <button
                onClick={() => { setMode('login'); setErrorMessage(''); }}
                className={`flex-1 pb-2.5 transition-all ${
                  mode === 'login'
                    ? 'text-[#005963] border-b-2 border-[#005963]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('user_register'); setErrorMessage(''); }}
                className={`flex-1 pb-2.5 transition-all ${
                  mode === 'user_register'
                    ? 'text-[#ea580c] border-b-2 border-[#ea580c]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Patient Registration
              </button>
            </div>

            {/* Registration Success Banner */}
            {regSuccessMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>{regSuccessMessage}</span>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {mode === 'login' ? (
              <>
                {/* Role Tabs */}
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Select Apollo Portal Access Mode
                  </div>
                  <div className="p-1 bg-slate-100 rounded-xl flex border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('admin')}
                      className={`flex-1 py-1.5 px-3 text-center rounded-lg font-bold text-xs transition-all ${
                        selectedRole === 'admin'
                          ? 'bg-[#005963] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('doctor')}
                      className={`flex-1 py-1.5 px-3 text-center rounded-lg font-bold text-xs transition-all ${
                        selectedRole === 'doctor'
                          ? 'bg-[#005963] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Doctor
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('patient')}
                      className={`flex-1 py-1.5 px-3 text-center rounded-lg font-bold text-xs transition-all ${
                        selectedRole === 'patient'
                          ? 'bg-[#ea580c] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Patient
                    </button>
                  </div>
                </div>

                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-xs font-body-sm">
                  {/* Username / Email Field */}
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-on-surface" htmlFor="login_id">
                      Username or Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">person</span>
                      </div>
                      <input
                        id="login_id"
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="Enter username or email..."
                        className="block w-full pl-9 pr-3 py-2 border border-[#E2E5EA] rounded-md bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-on-surface" htmlFor="login_pass">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                      </div>
                      <input
                        id="login_pass"
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter password..."
                        className="block w-full pl-9 pr-10 py-2 border border-[#E2E5EA] rounded-md bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1 flex flex-col items-center gap-3">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2.5 px-4 rounded-xl bg-[#005963] hover:bg-[#00474f] text-white font-bold text-xs transition-colors focus:outline-none shadow-xs"
                    >
                      Sign In to Apollo {selectedRole.toUpperCase()} Portal
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* PATIENT / USER SIGN UP FORM ONLY */
              <form onSubmit={handlePatientRegisterSubmit} className="flex flex-col gap-3.5 text-xs font-body-sm">
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-[#ea580c] text-[11px] font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">account_circle</span>
                  <span>Apollo Patient Sign Up — Register for Instant Doctor Care</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:outline-none focus:border-[#005963]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Desired Patient Username or Email</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. sarah or sarah@apollo.org"
                    value={regIdentifier}
                    onChange={(e) => setRegIdentifier(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:outline-none focus:border-[#005963]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Create Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Create your password..."
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 focus:outline-none focus:border-[#005963]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#ea580c] hover:bg-[#d94e07] text-white font-bold text-xs transition-colors mt-2 shadow-xs"
                >
                  Create Apollo Patient Account & Sign In
                </button>
              </form>
            )}
          </div>

          {/* Secure Footer */}
          <div className="bg-slate-50 px-8 py-3 border-t border-slate-200 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-slate-500 icon-filled">
              shield_lock
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Apollo Bangalore • 256-bit HIPAA & NABH Encrypted Portal
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
