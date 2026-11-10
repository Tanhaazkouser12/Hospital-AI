import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function Schedules() {
  const { setNotifications, appointments } = useApp();
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    physician: 'Dr. Sarah Jenkins',
    department: 'Cardiology',
    date: '2023-10-25',
    time: '09:00 AM',
    type: 'Appointment' // 'Shift' | 'Appointment' | 'Surgery'
  });

  const [schedulesList, setSchedulesList] = useState([
    { id: 1, title: 'ICU Morning Staff Rounds', physician: 'Dr. Sarah Jenkins', department: 'ICU', date: 'Today', time: '08:00 AM - 10:00 AM', type: 'Shift', location: 'Unit ICU Room 101-108', status: 'In Progress' },
    { id: 2, title: 'Post-Op Coronary Angioplasty', physician: 'Dr. E. Vance', department: 'Cardiology', date: 'Today', time: '10:30 AM - 12:00 PM', type: 'Surgery', location: 'OR Suite 3', status: 'Scheduled' },
    { id: 3, title: 'Pulmonary Function CT Review', physician: 'Dr. S. Chen', department: 'Pulmonology', date: 'Today', time: '01:30 PM - 03:00 PM', type: 'Appointment', location: 'Radiology Bay 2', status: 'Scheduled' },
    { id: 4, title: 'Night On-Call Duty Shift', physician: 'Dr. Robert Miller', department: 'Emergency', date: 'Today', time: '07:00 PM - 07:00 AM', type: 'Shift', location: 'ED Ward B', status: 'Upcoming' },
    { id: 5, title: 'Outpatient Cardiac Follow-up', physician: 'Dr. Sarah Jenkins', department: 'Cardiology', date: 'Tomorrow', time: '09:00 AM - 11:30 AM', type: 'Appointment', location: 'Clinic Suite 204', status: 'Scheduled' }
  ]);

  // Combine staff schedule list with patient-booked appointments & scanner reservations
  const patientApptEvents = appointments.map(apt => ({
    id: apt.id,
    title: `${apt.patientName} — ${apt.type}`,
    physician: apt.doctor,
    department: apt.department || 'Radiology / Imaging',
    date: apt.date,
    time: apt.time,
    type: 'Patient Scanner',
    location: apt.scannerType !== 'N/A (Clinical Consultation)' ? `Scanner Suite (${apt.scannerType})` : 'Outpatient Clinic',
    status: apt.status,
    symptoms: apt.symptoms
  }));

  const allCombinedEvents = [...patientApptEvents, ...schedulesList];

  const filteredSchedules = filterDepartment === 'All'
    ? allCombinedEvents
    : allCombinedEvents.filter(s => s.department.toLowerCase().includes(filterDepartment.toLowerCase()));

  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    const created = {
      id: Date.now(),
      title: newEvent.title,
      physician: newEvent.physician,
      department: newEvent.department,
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type,
      location: `${newEvent.department} Suite`,
      status: 'Scheduled'
    };

    setSchedulesList([created, ...schedulesList]);
    setNotifications(prev => [
      {
        id: Date.now(),
        title: "Schedule Updated",
        message: `'${newEvent.title}' scheduled for ${newEvent.date} at ${newEvent.time}`,
        time: "Just now",
        type: "success"
      },
      ...prev
    ]);

    setIsModalOpen(false);
    setNewEvent({ title: '', physician: 'Dr. Sarah Jenkins', department: 'Cardiology', date: '2023-10-25', time: '09:00 AM', type: 'Appointment' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-[24px]">event</span>
            <h1 className="text-2xl font-bold text-on-surface">Clinical Schedules & Patient Appointments</h1>
          </div>
          <p className="text-xs text-on-surface-variant">
            Master physician shift rotas, surgical room reservations, and patient diagnostic scanner appointments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 bg-surface border border-outline-variant/60 rounded-md text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
          >
            <option value="All">All Departments</option>
            <option value="Radiology">Radiology & Scanner</option>
            <option value="ICU">ICU Ward</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Pulmonology">Pulmonology</option>
            <option value="Emergency">Emergency</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs rounded-md transition-colors flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Schedule Event
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Patient Booked Scans</div>
            <div className="text-2xl font-bold font-data-tabular text-primary-container mt-1">
              {appointments.length} Reserved
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined">document_scanner</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Surgeries Today</div>
            <div className="text-2xl font-bold font-data-tabular text-on-surface mt-1">6 Scheduled</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary-container/15 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined">medical_services</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">OR Room Utilization</div>
            <div className="text-2xl font-bold font-data-tabular text-on-surface mt-1">91.4%</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined">domain</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Active Staff On Duty</div>
            <div className="text-2xl font-bold font-data-tabular text-on-surface mt-1">24 Physicians</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface flex items-center justify-center">
            <span className="material-symbols-outlined">badge</span>
          </div>
        </div>
      </div>

      {/* Schedules Roster Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-surface-container-low border-b border-outline-variant/40 flex justify-between items-center text-xs">
          <h2 className="font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-outline">calendar_month</span>
            Master Schedule Roster ({filteredSchedules.length})
          </h2>
          <span className="text-[11px] text-on-surface-variant font-semibold text-primary">
            ✓ 3-Region Live Sync Active (Patient / Doctor / Admin)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface border-b border-outline-variant/40 text-on-surface-variant font-bold uppercase text-[10px]">
                <th className="p-3.5">Event / Patient Scanner Reservation</th>
                <th className="p-3.5">Attending Physician</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 font-data-tabular text-on-surface">
              {filteredSchedules.map((item) => (
                <tr key={item.id} className="hover:bg-primary-container/5 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-on-surface text-sm">{item.title}</div>
                    <div className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[13px]">location_on</span>
                      {item.location}
                    </div>
                    {item.symptoms && (
                      <div className="text-[10px] text-primary italic mt-0.5 font-sans">
                        Patient Symptoms: "{item.symptoms}"
                      </div>
                    )}
                  </td>
                  <td className="p-3.5 font-medium text-on-surface">{item.physician}</td>
                  <td className="p-3.5 text-on-surface-variant font-semibold">{item.department}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-on-surface">{item.date}</div>
                    <div className="text-[11px] text-on-surface-variant">{item.time}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.type === 'Patient Scanner'
                        ? 'bg-patient-accent/15 text-patient-accent border border-patient-accent/30'
                        : item.type === 'Surgery'
                        ? 'bg-secondary-container/20 text-secondary'
                        : item.type === 'Shift'
                        ? 'bg-primary-container/15 text-primary-container'
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.status === 'In Progress'
                        ? 'bg-green-500/15 text-green-700'
                        : item.status === 'Confirmed'
                        ? 'bg-primary-container/15 text-primary-container'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      {item.status === 'In Progress' && <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-ping"></span>}
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Schedule New Event */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-on-background/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-outline-variant bg-surface flex justify-between items-center">
              <h3 className="font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">edit_calendar</span>
                Schedule New Clinical Event
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSchedule} className="p-5 space-y-4 text-xs font-body-sm">
              <div>
                <label className="block font-bold text-on-surface mb-1">Event Title / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coronary Angioplasty Prep"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full rounded-md border border-outline-variant/60 bg-surface px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Department</label>
                  <select
                    value={newEvent.department}
                    onChange={(e) => setNewEvent({ ...newEvent, department: e.target.value })}
                    className="w-full rounded-md border border-outline-variant/60 bg-surface px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="ICU">ICU Ward</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1">Event Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.type })}
                    className="w-full rounded-md border border-outline-variant/60 bg-surface px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Appointment">Appointment</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Shift">Shift Duty</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full rounded-md border border-outline-variant/60 bg-surface font-data-tabular px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Time Window</label>
                  <input
                    type="text"
                    required
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    placeholder="09:00 AM - 11:00 AM"
                    className="w-full rounded-md border border-outline-variant/60 bg-surface font-data-tabular px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-outline-variant/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant/60 rounded-md font-semibold text-on-surface hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary rounded-md font-bold transition-colors shadow-xs"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
