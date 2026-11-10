import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import InvoiceModal from './InvoiceModal';
import CreateInvoiceModal from './CreateInvoiceModal';

export default function BillingManagement() {
  const { invoices, openInvoiceModal } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const totalOutstanding = invoices.reduce((sum, inv) => inv.status !== 'Paid' ? sum + inv.amount : sum, 0);
  const paidThisMonth = invoices.reduce((sum, inv) => inv.status === 'Paid' ? sum + inv.amount : sum, 0);
  const pendingCount = invoices.filter(inv => inv.status === 'Pending').length;
  const overdueCount = invoices.filter(inv => inv.status === 'Overdue').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-2xl font-bold text-on-surface">Billing Management (INR ₹)</h1>
          <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
            Overview and management of hospital financials & invoice generation in Indian Rupees (₹)
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary-container hover:bg-primary text-on-primary font-bold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Generate New Bill (₹)
        </button>
      </div>

      {/* Summary Stat Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 flex flex-col justify-between h-32 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="font-label-bold text-[10px] text-on-surface-variant uppercase tracking-wider">
              Total Outstanding
            </span>
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </div>
          </div>
          <div>
            <div className="font-display-lg text-2xl font-bold font-data-tabular text-on-surface">
              ₹{totalOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 flex flex-col justify-between h-32 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="font-label-bold text-[10px] text-on-surface-variant uppercase tracking-wider">
              Paid This Month
            </span>
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
          </div>
          <div>
            <div className="font-display-lg text-2xl font-bold font-data-tabular text-on-surface">
              ₹{paidThisMonth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 flex flex-col justify-between h-32 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="font-label-bold text-[10px] text-on-surface-variant uppercase tracking-wider">
              Pending Claims
            </span>
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            </div>
          </div>
          <div>
            <div className="font-display-lg text-2xl font-bold font-data-tabular text-on-surface">{pendingCount}</div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 flex flex-col justify-between h-32 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="font-label-bold text-[10px] text-on-surface-variant uppercase tracking-wider">
              Overdue Bills
            </span>
            <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </div>
          </div>
          <div>
            <div className="font-display-lg text-2xl font-bold font-data-tabular text-on-surface">{overdueCount}</div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden flex flex-col shadow-xs">
        <div className="p-4 border-b border-outline-variant/40 flex justify-between items-center bg-surface-container-low">
          <h2 className="font-title-sm text-base font-bold text-on-surface">Recent Bills ({invoices.length})</h2>
          <div className="flex gap-2">
            <button className="border border-outline-variant/60 text-on-surface-variant font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant uppercase font-bold text-[10px]">
                <th className="p-3.5">Patient</th>
                <th className="p-3.5">Bill ID</th>
                <th className="p-3.5">Amount (₹)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="font-data-tabular text-on-surface divide-y divide-outline-variant/20">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => openInvoiceModal(inv)}
                  className="hover:bg-primary-container/5 transition-colors cursor-pointer group"
                >
                  <td className="p-3.5 font-bold text-on-surface group-hover:text-primary">{inv.patientName}</td>
                  <td className="p-3.5 text-on-surface-variant">{inv.id}</td>
                  <td className="p-3.5 font-bold">₹{inv.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'Paid'
                          ? 'bg-primary-container/15 text-primary-container'
                          : inv.status === 'Overdue'
                          ? 'bg-error/10 text-error'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {inv.status === 'Paid' ? 'check_circle' : inv.status === 'Overdue' ? 'error' : 'hourglass_empty'}
                      </span>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-on-surface-variant">{inv.dueDate}</td>
                  <td className="p-3.5 text-right">
                    <button className="text-primary hover:underline font-bold">View Invoice</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      <InvoiceModal />

      {/* Generate New Bill Modal */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
