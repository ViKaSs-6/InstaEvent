import React, { useState } from 'react';
import { Venue } from '../types';
import { X, Star, Users, MapPin, Check, Calendar, ShieldCheck, Zap, Clock, CreditCard, ChevronLeft, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';

interface VenueModalProps {
  venue: Venue | null;
  onClose: () => void;
  onConfirmBooking: (bookingDetails: {
    venue: Venue;
    date: string;
    hours: number;
    guests: number;
    totalAmount: number;
  }) => void;
  onNegotiate?: (venue: Venue) => void;
}

export const VenueModal: React.FC<VenueModalProps> = ({
  venue,
  onClose,
  onConfirmBooking,
  onNegotiate,
}) => {
  if (!venue) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState('2026-08-15');
  const [bookingHours, setBookingHours] = useState(4);
  const [guestCount, setGuestCount] = useState(Math.min(venue.capacity, 50));
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const cleaningFee = 120;
  const serviceFee = Math.round(venue.pricePerHour * bookingHours * 0.12);
  const subtotal = venue.pricePerHour * bookingHours;
  const totalAmount = subtotal + cleaningFee + serviceFee;

  const handleBook = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      onConfirmBooking({
        venue,
        date: selectedDate,
        hours: bookingHours,
        guests: guestCount,
        totalAmount,
      });
      setBookingConfirmed(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-auto">
        
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Section */}
        <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
          <img
            src={venue.images[activeImageIndex] || venue.images[0]}
            alt={venue.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />

          {venue.images.length > 1 && (
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
              <button
                onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : venue.images.length - 1))}
                className="p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full backdrop-blur-sm pointer-events-auto transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev < venue.images.length - 1 ? prev + 1 : 0))}
                className="p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full backdrop-blur-sm pointer-events-auto transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Image indicator dots */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-1.5">
            {venue.images.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                  activeImageIndex === idx ? 'bg-white w-5' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Details (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                <span>{venue.location}</span>
                <span>•</span>
                <span>{venue.sqft} sq ft</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
                {venue.name}
              </h2>

              <div className="flex items-center space-x-4 text-xs sm:text-sm text-slate-600 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-1 font-semibold text-slate-900">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{venue.rating}</span>
                  <span className="text-slate-400 font-normal">({venue.reviewsCount} reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1 font-medium">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Up to {venue.capacity} guests</span>
                </div>
              </div>
            </div>

            {/* Host info card with Alibaba Chat button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/60 gap-4">
              <div className="flex items-center space-x-3">
                <img
                  src={venue.hostAvatar}
                  alt={venue.hostName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Hosted by {venue.hostName}</h4>
                  <p className="text-xs text-slate-500">Superhost • 100% Response Rate</p>
                </div>
              </div>

              {onNegotiate && (
                <button
                  onClick={() => {
                    onNegotiate(venue);
                    onClose();
                  }}
                  className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-xs shrink-0"
                >
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <span>Chat & Negotiate Details</span>
                </button>
              )}
            </div>

            {/* Space Description */}
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-2">About this space</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {venue.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-3">What this venue offers</h3>
              <div className="grid grid-cols-2 gap-3">
                {venue.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs font-medium text-slate-700 p-2.5 bg-slate-50 rounded-xl">
                    <Check className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Side Widget (Right 1 col) */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-baseline justify-between pb-4 border-b border-slate-200 mb-4">
                <div>
                  <span className="text-2xl font-extrabold text-slate-900">${venue.pricePerHour}</span>
                  <span className="text-xs font-medium text-slate-500"> / hour</span>
                </div>
                <div className="flex items-center space-x-1 text-xs font-semibold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{venue.rating}</span>
                </div>
              </div>

              {/* Booking Controls Form */}
              <div className="space-y-4 text-xs font-medium text-slate-700">
                {/* Date */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Event Date</label>
                  <div className="flex items-center space-x-2 bg-white px-3 py-2.5 rounded-xl border border-slate-200">
                    <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Duration (Hours)</label>
                  <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
                    <Clock className="w-4 h-4 text-rose-500 shrink-0" />
                    <input
                      type="number"
                      min={2}
                      max={12}
                      value={bookingHours}
                      onChange={(e) => setBookingHours(Math.max(2, Number(e.target.value)))}
                      className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Expected Guests</label>
                  <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
                    <Users className="w-4 h-4 text-rose-500 shrink-0" />
                    <input
                      type="number"
                      min={5}
                      max={venue.capacity}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Price Calculation breakdown */}
                <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>${venue.pricePerHour} x {bookingHours} hours</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Venue Prep & Cleaning</span>
                    <span>${cleaningFee}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Insta Events Service fee</span>
                    <span>${serviceFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                    <span>Total</span>
                    <span className="text-rose-600">${totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <div className="mt-6 pt-4 border-t border-slate-200 space-y-2">
              <button
                onClick={handleBook}
                disabled={bookingConfirmed}
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-75"
              >
                {bookingConfirmed ? (
                  <>
                    <Check className="w-5 h-5 animate-bounce" />
                    <span>Reserving Space...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Instant Reserve (${totalAmount})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-1.5 mt-3 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Protected by Insta Events Guarantee</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
