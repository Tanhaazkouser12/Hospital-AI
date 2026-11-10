import React from 'react';
import { useApp } from '../../context/AppContext';

export default function InvoiceModal() {
  const { isInvoiceModalOpen, selectedInvoice, closeInvoiceModal, recordPayment } = useApp();

  if (!isInvoiceModalOpen || !selectedInvoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-on-background/40 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/60 relative">
        {/* Modal Header Controls */}
        <div className="flex justify-between items-center p-4 border-b border-outline-variant/60 bg-surface">
          <div className="font-title-sm text-base font-bold text-on-surface">Invoice Details (INR ₹)</div>
          <button
            onClick={closeInvoiceModal}
            className="text-on-surface-variant hover:text-on-surface rounded-full p-1 hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Printable Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-surface-container-lowest font-body-sm">
          {/* Hospital Letterhead */}
          <div className="flex justify-between items-start border-b-2 border-primary-container pb-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary-container text-3xl icon-filled">
                  local_hospital
                </span>
                <div className="font-headline-md text-2xl font-bold text-primary-container">
                  MedCore General Hospital
                </div>
              </div>
              <div className="text-xs text-on-surface-variant space-y-0.5">
                <p>456 Connaught Place, Medical District</p>
                <p>New Delhi, India 110001</p>
                <p>Phone: +91 (011) 2345-6789 | billing@medcore.org</p>
              </div>
            </div>

            <div className="text-right">
              <div className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface tracking-tight mb-2">
                INVOICE
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <span className="text-on-surface-variant font-bold">Invoice Date:</span>
                <span className="text-on-surface font-data-tabular">{selectedInvoice.invoiceDate}</span>
                <span className="text-on-surface-variant font-bold">Due Date:</span>
                <span className="text-on-surface font-data-tabular">{selectedInvoice.dueDate}</span>
                <span className="text-on-surface-variant font-bold">Invoice #:</span>
                <span className="text-on-surface font-data-tabular">{selectedInvoice.id}</span>
              </div>
            </div>
          </div>

          {/* Patient & Status Info */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="font-label-bold text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
                Bill To
              </div>
              <div className="font-title-sm text-base text-on-surface font-bold">
                {selectedInvoice.patientName}
              </div>
              <div className="text-xs text-on-surface-variant space-y-0.5 mt-1">
                <p>Patient ID: {selectedInvoice.mrn}</p>
                <p>DOB: {selectedInvoice.dob}</p>
                <p>{selectedInvoice.address}</p>
              </div>
            </div>

            <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/60 w-48">
              <div className="font-label-bold text-[10px] text-on-surface-variant uppercase mb-1">Status</div>
              <div className="flex items-center gap-2 text-on-surface font-bold text-sm">
                <span className={`material-symbols-outlined text-[18px] ${
                  selectedInvoice.status === 'Paid' ? 'text-primary-container' : 'text-secondary'
                }`}>
                  {selectedInvoice.status === 'Paid' ? 'check_circle' : 'hourglass_empty'}
                </span>
                {selectedInvoice.status}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left border-collapse mb-8 text-xs">
            <thead>
              <tr className="border-b-2 border-outline-variant text-on-surface-variant uppercase font-bold text-[10px]">
                <th className="py-3">Description</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Unit Price (₹)</th>
                <th className="py-3 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="font-data-tabular text-on-surface divide-y divide-outline-variant/40">
              {selectedInvoice.lineItems ? (
                selectedInvoice.lineItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3">
                      <div className="font-semibold text-sm">{item.description}</div>
                      <div className="text-[10px] text-on-surface-variant">CPT Code: {item.code}</div>
                    </td>
                    <td className="py-3 text-center">{item.qty}</td>
                    <td className="py-3 text-right">₹{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 text-right font-semibold">₹{item.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3">Standard Clinical Treatment Stay</td>
                  <td className="py-3 text-center">1</td>
                  <td className="py-3 text-right">₹{selectedInvoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 text-right font-semibold">₹{selectedInvoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 font-data-tabular text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>₹{(selectedInvoice.subtotal || selectedInvoice.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>GST Tax (0%)</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between text-on-surface-variant border-b border-outline-variant pb-2">
                <span>Insurance Adjustment</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-on-surface pt-1">
                <span>Total Due</span>
                <span>₹{selectedInvoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-outline-variant/60 bg-surface flex justify-end gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-outline-variant/60 text-on-surface font-semibold text-xs rounded-lg flex items-center gap-2 hover:bg-surface-container transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Print / PDF
          </button>
          {selectedInvoice.status !== 'Paid' && (
            <button
              onClick={() => recordPayment(selectedInvoice.id)}
              className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">credit_card</span>
              Record Payment (₹)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
