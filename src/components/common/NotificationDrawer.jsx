import React from 'react';
import { useApp } from '../../context/AppContext';

export default function NotificationDrawer({ isOpen, onClose }) {
  const { notifications } = useApp();

  if (!isOpen) return null;

  return (
    <div className="absolute right-4 top-16 w-80 sm:w-96 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="px-4 py-3 border-b border-outline-variant bg-surface flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">notifications</span>
          <h3 className="font-title-sm text-sm font-bold text-on-surface">Notifications</h3>
          <span className="bg-primary-container text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
            {notifications.length}
          </span>
        </div>
        <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/30">
        {notifications.map(item => (
          <div key={item.id} className="p-3.5 hover:bg-primary-container/5 transition-colors flex gap-3 items-start">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              item.type === 'alert' ? 'bg-error/15 text-error' :
              item.type === 'success' ? 'bg-primary-container/15 text-primary-container' :
              'bg-surface-variant text-on-surface-variant'
            }`}>
              <span className="material-symbols-outlined text-[18px]">
                {item.type === 'alert' ? 'warning' : item.type === 'success' ? 'check_circle' : 'info'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="font-semibold text-xs text-on-surface truncate">{item.title}</span>
                <span className="text-[10px] text-on-surface-variant shrink-0">{item.time}</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-snug">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-outline-variant bg-surface text-center">
        <button onClick={onClose} className="text-xs font-semibold text-primary hover:underline">
          Close Notifications
        </button>
      </div>
    </div>
  );
}
