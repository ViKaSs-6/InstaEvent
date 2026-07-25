import React, { useState } from 'react';
import { Venue, Vendor, Booking } from '../types';
import { X, ShieldCheck, CheckCircle2, CreditCard, Lock, Calendar, Users, Clock, Building2, Sparkles, Download, ArrowRight, Wallet, Check } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  item: Venue | Vendor | null;
  customPrice?: number;
  onClose: () => void;
  onCompleteBooking: (booking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  item,
  customPrice,
  onClose,
  onCompleteBooking,
}) => {
  if (!isOpen || !item) return null;

  const isVenue = 'pricePerHour' in item;
  const name = item.name;
  const image = isVenue ? (item as Venue).images[0] : (item as Vendor).image;
  const baseRate = customPrice || (isVenue ? (item as Venue).pricePerHour : (item as Vendor).hourlyRate);

  // Form State
  const [step, setStep] = useState<'review' | 'payment' | 'confirmation'>('review');
  const [bookingDate, setBookingDate] = useState('2026-08-25');
  const [hours, setHours] = useState(5);
  const [guests, setGuests] = useState(60);
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'paylink'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('Alex Rivera');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Cost calculations
  const subtotal = baseRate * hours;
  const serviceFee = Math.round(subtotal * 0.10);
  const cleaningFee = isVenue ? 150 : 0;
  const grandTotal = Math.max(0, subtotal + serviceFee + cleaningFee - discountAmount);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'INSTA20') {
      setDiscountAmount(Math.round(subtotal * 0.20));
    } else if (promoCode.trim().length > 0) {
      setDiscountAmount(50);
    }
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newBooking: Booking = {
        id: `b_${Date.now()}`,
        venueName: name,
        venueImage: image,
        date: bookingDate,
        guests,
        totalAmount: grandTotal,
        status: 'Confirmed',
        referenceId: `IE-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentMethod: paymentMethod === 'card' ? 'Visa •••• 4242' : paymentMethod === 'applepay' ? 'Apple Pay' : 'Insta PayLink Escrow'
      };

      setConfirmedBooking(newBooking);
      onCompleteBooking(newBooking);
      setStep('confirmation');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-base tracking-tight">Secure Reservation Checkout</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper */}
        {step !== 'confirmation' && (
          <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs font-bold text-slate-600">
            <div className={`flex items-center space-x-2 ${step === 'review' ? 'text-rose-600' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'review' ? 'bg-rose-600 text-white' : 'bg-slate-300'}`}>1</span>
              <span>Review Booking</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-rose-600' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'payment' ? 'bg-rose-600 text-white' : 'bg-slate-300'}`}>2</span>
              <span>Payment Details</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">3</span>
              <span>Confirmation</span>
            </div>
          </div>
        )}

        {/* STEP 1: REVIEW BOOKING DETAILS */}
        {step === 'review' && (
          <div className="p-6 space-y-6">
            
            {/* Summary card */}
            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <img src={image} alt={name} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200" />
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700 px-2 py-0.5 rounded">
                  {isVenue ? 'Event Space' : 'Vendor Service'}
                </span>
                <h4 className="font-bold text-slate-900 text-base mt-1">{name}</h4>
                <p className="text-xs text-slate-500">Rate: ${baseRate}/hr {customPrice ? '(Negotiated Discount)' : ''}</p>
              </div>
            </div>

            {/* Event Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Hours)</label>
                <select
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  {[3, 4, 5, 6, 8, 10, 12].map((h) => (
                    <option key={h} value={h}>{h} Hours</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Guest Count</label>
                <input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Promo code (e.g. INSTA20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 uppercase"
              />
              <button
                onClick={handleApplyPromo}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Apply
              </button>
            </div>

            {/* Pricing breakdown table */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>${baseRate} × {hours} hours</span>
                <span className="font-semibold">${subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Insta Events Escrow Fee (10%)</span>
                <span className="font-semibold">${serviceFee}</span>
              </div>
              {isVenue && (
                <div className="flex justify-between text-slate-600">
                  <span>Standard Cleaning & Turnover</span>
                  <span className="font-semibold">${cleaningFee}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount</span>
                  <span>-${discountAmount}</span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-slate-900 text-sm">
                <span>Total Amount</span>
                <span className="text-rose-600 text-base">${grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => setStep('payment')}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>Proceed to Payment (${grandTotal})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

        {/* STEP 2: PAYMENT DETAILS */}
        {step === 'payment' && (
          <div className="p-6 space-y-6">
            
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Booking Total:</span>
                <span className="font-extrabold text-slate-900 text-sm ml-2">${grandTotal}</span>
              </div>
              <button
                onClick={() => setStep('review')}
                className="text-rose-600 font-bold hover:underline"
              >
                Edit Order
              </button>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-rose-600 bg-rose-50 text-rose-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Credit Card</span>
              </button>

              <button
                onClick={() => setPaymentMethod('applepay')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                  paymentMethod === 'applepay'
                    ? 'border-rose-600 bg-rose-50 text-rose-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Wallet className="w-5 h-5" />
                <span>Apple Pay</span>
              </button>

              <button
                onClick={() => setPaymentMethod('paylink')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                  paymentMethod === 'paylink'
                    ? 'border-rose-600 bg-rose-50 text-rose-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Lock className="w-5 h-5" />
                <span>Insta PayLink</span>
              </button>
            </div>

            {/* Payment Input Details */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-10 py-2 text-xs font-semibold text-slate-800"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value="08 / 29"
                      readOnly
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      value="•••"
                      readOnly
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'applepay' && (
              <div className="p-6 bg-slate-900 text-white rounded-2xl text-center space-y-2">
                <Wallet className="w-8 h-8 text-rose-400 mx-auto" />
                <h4 className="font-bold text-sm">Apple Pay Express Checkout</h4>
                <p className="text-xs text-slate-400">Touch ID / Face ID verification ready on your device.</p>
              </div>
            )}

            {paymentMethod === 'paylink' && (
              <div className="p-6 bg-emerald-950 text-emerald-100 rounded-2xl text-center space-y-2 border border-emerald-800">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-white">Direct Escrow PayLink</h4>
                <p className="text-xs text-emerald-300">Funds are held safely in escrow until 24 hours after your event completes.</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setStep('review')}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-xl text-slate-700"
              >
                Back
              </button>

              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Confirm (${grandTotal})</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: CONFIRMATION RECEIPT */}
        {step === 'confirmation' && confirmedBooking && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                Booking Confirmed & Escrow Secured
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">You're All Set!</h2>
              <p className="text-xs text-slate-500 mt-1">
                Reference ID: <strong className="text-slate-800 font-mono">{confirmedBooking.referenceId}</strong>
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-left space-y-3 max-w-md mx-auto text-xs">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                <img src={confirmedBooking.venueImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{confirmedBooking.venueName}</h4>
                  <p className="text-slate-500 text-[11px]">Date: {confirmedBooking.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Guests</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.guests} Attending</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Payment</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.paymentMethod}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                <span>Total Paid</span>
                <span className="text-emerald-600">${confirmedBooking.totalAmount}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
              >
                Done & Close
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
