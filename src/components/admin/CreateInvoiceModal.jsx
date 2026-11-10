import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function CreateInvoiceModal({ isOpen, onClose }) {
  const { patients, setInvoices, setNotifications } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || 'p1');
  const [dueDate, setDueDate] = useState('2023-11-15');
  const [items, setItems] = useState([
    { description: 'Emergency Room Intake & Triage', cptCode: '99283', qty: 1, price: 8500.00 },
    { description: 'CT Scan - Thorax w/ Contrast', cptCode: '71260', qty: 1, price: 4500.00 }
  ]);

  if (!isOpen) return null;

  const patient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleAddItem = () => {
    setItems([...items, { description: 'Laboratory Diagnostic Blood Test', cptCode: '80053', qty: 1, price: 1500.00 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems(items.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [field]: field === 'qty' || field === 'price' ? parseFloat(value) || 0 : value
        };
      }
      return item;
    }));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newInvoice = {
      id: `INV-2023-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: patient.name,
      mrn: patient.mrn,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      dueDate: dueDate,
      status: 'Pending',
      amount: subtotal,
      items: items.map(item => ({
        ...item,
        total: item.qty * item.price
      }))
    };

    setInvoices(prev => [newInvoice, ...prev]);

    setNotifications(prev => [
      {
        id: Date.now(),
        title: "New Invoice Generated",
        message: `Invoice ${newInvoice.id} generated for ${patient.name} (₹${subtotal.toLocaleString('en-IN')})`,
        time: "Just now",
        type: "success"
      },
      ...prev
    ]);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-on-background/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-outline-variant/40 bg-surface">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-[22px]">receipt_long</span>
            <h2 className="font-title-sm text-base font-bold text-on-surface">Generate New Hospital Bill (INR ₹)</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs font-body-sm">
          {/* Patient Selection & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-on-surface mb-1">Select Patient</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full rounded-md border border-outline-variant/60 bg-surface px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (MRN: {p.mrn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-on-surface mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md border border-outline-variant/60 bg-surface font-data-tabular px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Line Items Section */}
          <div className="border border-outline-variant/40 rounded-lg p-4 bg-surface-container-low/30 space-y-3">
            <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
              <h3 className="font-bold text-on-surface uppercase text-[10px] tracking-wider">Itemized Services & CPT Codes (₹)</h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-primary hover:underline font-bold text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">add_circle</span>
                Add Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-surface p-2.5 rounded-md border border-outline-variant/30">
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Service Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary text-xs text-on-surface focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="CPT Code"
                      value={item.cptCode}
                      onChange={(e) => handleItemChange(idx, 'cptCode', e.target.value)}
                      className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary font-data-tabular text-[11px] text-on-surface-variant text-center focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                      className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary font-data-tabular text-xs text-center focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      step="1"
                      placeholder="Price (₹)"
                      value={item.price}
                      onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                      className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary font-data-tabular text-xs text-right focus:outline-none"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-error hover:text-red-700 p-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal Calculation */}
          <div className="flex justify-between items-center p-3 bg-surface-container rounded-lg border border-outline-variant/40">
            <span className="font-bold text-on-surface-variant">Calculated Bill Total:</span>
            <span className="text-xl font-bold font-data-tabular text-primary-container">
              ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex justify-end gap-3 border-t border-outline-variant/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-outline-variant/60 rounded-md font-semibold text-on-surface hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-md transition-colors shadow-xs flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Issue Invoice (₹)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
