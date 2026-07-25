import React from 'react';
import { Booking } from '../types';
import { X, Calendar, MapPin, CheckCircle, Clock, ShieldCheck, MessageSquare } from 'lucide-react';

interface BookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
}

export const BookingsModal: React.FC<BookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="w-6 h-6 text-rose-500" />
          <h2 className="text-xl font-bold text-slate-900">My Confirmed Event Bookings</h2>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            <p>You have no active event bookings yet.</p>
            <p className="text-xs text-slate-400 mt-1">Explore spaces or build a custom event bundle to make your first reservation.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {bookings.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex space-x-3 items-center">
                  <img src={b.venueImage} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md">
                      {b.status}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{b.venueName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Date: {b.date} • {b.guests} Guests
                    </p>
                  </div>
                </div>

                <div className="text-right sm:self-center">
                  <div className="text-sm font-extrabold text-slate-900">${b.totalAmount}</div>
                  <button
                    onClick={() => alert(`Opening chat with host for booking #${b.id}...`)}
                    className="mt-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors inline-flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
                    <span>Chat with Host</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
