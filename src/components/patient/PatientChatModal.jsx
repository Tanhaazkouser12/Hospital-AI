import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function PatientChatModal() {
  const { isPatientChatOpen, setIsPatientChatOpen, chatMessages, sendPatientMessage } = useApp();
  const [input, setInput] = useState('');

  if (!isPatientChatOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendPatientMessage(input);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-on-background/40 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-md h-[85vh] sm:h-[600px] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/60">
        {/* Header */}
        <div className="p-4 bg-patient-accent text-white flex justify-between items-center shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[22px]">smart_toy</span>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">MedCore Care Assistant</h3>
              <p className="text-[10px] text-white/80">Active • Replies in seconds</p>
            </div>
          </div>
          <button
            onClick={() => setIsPatientChatOpen(false)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface text-xs font-body-sm">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-patient-accent text-white rounded-br-none shadow-xs'
                    : 'bg-surface-container-lowest border border-outline-variant/60 text-on-surface rounded-bl-none shadow-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-on-surface-variant mt-1 px-1">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-surface-container-low border-t border-outline-variant/40 flex gap-2 overflow-x-auto text-[10px]">
          <button
            onClick={() => sendPatientMessage("What are my medication instructions?")}
            className="px-2.5 py-1 bg-surface border border-outline-variant/60 rounded-full text-on-surface-variant hover:text-patient-accent whitespace-nowrap transition-colors"
          >
            💊 Medication info
          </button>
          <button
            onClick={() => sendPatientMessage("Can I reschedule my appointment?")}
            className="px-2.5 py-1 bg-surface border border-outline-variant/60 rounded-full text-on-surface-variant hover:text-patient-accent whitespace-nowrap transition-colors"
          >
            📅 Reschedule appointment
          </button>
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 border-t border-outline-variant/60 bg-surface-container-lowest flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your health question..."
            className="flex-1 px-3 py-2 bg-surface border border-outline-variant/60 rounded-xl text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-patient-accent"
          />
          <button
            type="submit"
            className="w-9 h-9 rounded-xl bg-patient-accent text-white flex items-center justify-center hover:opacity-90 transition-opacity shrink-0 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
