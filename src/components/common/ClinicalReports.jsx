import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function ClinicalReports() {
  const { setNotifications } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('October 2023');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const reportMetrics = [
    { title: 'Monthly Admissions', value: '1,420 Patients', change: '+8.4%', trend: 'up' },
    { title: 'Avg. Length of Stay (ALOS)', value: '4.2 Days', change: '-0.5 days', trend: 'good' },
    { title: 'ICU Bed Turnaround Time', value: '42 mins', change: '12% faster', trend: 'good' },
    { title: 'AI Diagnostic Accuracy', value: '98.2%', change: '+1.8%', trend: 'up' },
    { title: 'Total Revenue Collected', value: '$1,245,890', change: '+14.2%', trend: 'up' }
  ];

  const reportDocs = [
    {
      id: 'REP-2023-101',
      title: 'Pulmonary Diagnostic & CT Imaging Accuracy Report',
      department: 'Radiology / Pulmonology',
      author: 'Dr. S. Chen',
      date: 'Oct 20, 2023',
      metricsSummary: '94% Pneumonia ROI model match, 0.2% false positive rate',
      status: 'Approved',
      type: 'Diagnostic'
    },
    {
      id: 'REP-2023-102',
      title: 'ICU Bed Occupancy & Discharge Throughput Audit',
      department: 'ICU Operations',
      author: 'Dr. Sarah Jenkins',
      date: 'Oct 18, 2023',
      metricsSummary: 'Occupancy peak 92%, turn time reduced from 55m to 42m',
      status: 'Approved',
      type: 'Operational'
    },
    {
      id: 'REP-2023-103',
      title: 'Antibiotic Stewardship & Penicillin Cross-Reactivity Report',
      department: 'Pharmacy',
      author: 'Clinical Pharmacy Board',
      date: 'Oct 15, 2023',
      metricsSummary: '100% allergy conflict flag rate across 1,200 prescriptions',
      status: 'Verified',
      type: 'Quality'
    },
    {
      id: 'REP-2023-104',
      title: 'Hospital Revenue & Insurance Claims Settlement Summary',
      department: 'Finance & Billing',
      author: 'Chief Administrative Officer',
      date: 'Oct 12, 2023',
      metricsSummary: '$1.24M processed, 91.2% claim approval rate',
      status: 'Finalized',
      type: 'Financial'
    }
  ];

  const filteredReports = selectedCategory === 'All'
    ? reportDocs
    : reportDocs.filter(r => r.type === selectedCategory);

  const handleExportReport = (reportTitle, format) => {
    setNotifications(prev => [
      {
        id: Date.now(),
        title: "Report Exported",
        message: `'${reportTitle}' exported as ${format.toUpperCase()}`,
        time: "Just now",
        type: "success"
      },
      ...prev
    ]);
    alert(`Downloading ${reportTitle} (${format.toUpperCase()})...`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-[24px]">analytics</span>
            <h1 className="text-2xl font-bold text-on-surface">Clinical & Operational Analytics Reports</h1>
          </div>
          <p className="text-xs text-on-surface-variant">
            Executive performance indicators, diagnostic AI accuracy benchmarks, and HIPAA financial audits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-surface border border-outline-variant/60 rounded-md text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
          >
            <option value="October 2023">October 2023</option>
            <option value="September 2023">September 2023</option>
            <option value="Q3 2023 Summary">Q3 2023 Summary</option>
          </select>

          <button
            onClick={() => handleExportReport('Executive Performance Summary', 'pdf')}
            className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs rounded-md transition-colors flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Executive PDF
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {reportMetrics.map((m, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 flex flex-col justify-between shadow-xs">
            <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              {m.title}
            </div>
            <div>
              <div className="text-xl font-bold font-data-tabular text-on-surface">{m.value}</div>
              <div className="text-[11px] font-semibold text-primary-container mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                {m.change} vs prev. period
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Reports Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-surface-container-low border-b border-outline-variant/40 flex justify-between items-center text-xs">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-outline">description</span>
              Published Clinical Reports ({filteredReports.length})
            </h2>

            {/* Category Filter Pills */}
            <div className="hidden sm:flex gap-1.5 bg-surface p-1 rounded-lg border border-outline-variant/40">
              {['All', 'Diagnostic', 'Operational', 'Quality', 'Financial'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary-container text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <span className="text-[11px] font-data-tabular text-on-surface-variant">
            Period: <strong>{selectedPeriod}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface border-b border-outline-variant/40 text-on-surface-variant font-bold uppercase text-[10px]">
                <th className="p-3.5">Report Title & ID</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Author</th>
                <th className="p-3.5">Key Performance Findings</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 font-data-tabular text-on-surface">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-primary-container/5 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-on-surface text-sm">{report.title}</div>
                    <div className="text-[11px] text-on-surface-variant flex items-center gap-2 mt-0.5">
                      <span>{report.id}</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span className="font-semibold text-primary-container">{report.type}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-on-surface-variant font-medium">{report.department}</td>
                  <td className="p-3.5 text-on-surface font-semibold">{report.author}</td>
                  <td className="p-3.5 max-w-[280px]">
                    <div className="text-xs text-on-surface line-clamp-2">{report.metricsSummary}</div>
                  </td>
                  <td className="p-3.5 text-on-surface-variant whitespace-nowrap">{report.date}</td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => handleExportReport(report.title, 'pdf')}
                        className="px-2.5 py-1 border border-outline-variant/60 rounded text-[11px] font-bold text-on-surface hover:bg-surface-container transition-colors"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => handleExportReport(report.title, 'csv')}
                        className="px-2.5 py-1 bg-primary-container/15 text-primary-container hover:bg-primary-container/25 rounded text-[11px] font-bold transition-colors"
                      >
                        CSV
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
