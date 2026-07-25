import React, { useState } from 'react';
import { Venue, Vendor } from '../types';
import { BuilderItemDetailModal } from './BuilderItemDetailModal';
import { Sparkles, Calendar, Users, Check, Building2, Utensils, Camera, Flower2, ShieldCheck, Info, Home, ToggleLeft, ToggleRight, Eye } from 'lucide-react';

interface EventBuilderViewProps {
  venues: Venue[];
  vendors: Vendor[];
  onConfirmBundleBooking: (bundle: {
    eventTitle: string;
    venue?: Venue;
    skipVenue?: boolean;
    vendors: Vendor[];
    date: string;
    guests: number;
    totalAmount: number;
    basePrice: number;
    platformFee: number;
  }) => void;
}

export const EventBuilderView: React.FC<EventBuilderViewProps> = ({
  venues,
  vendors,
  onConfirmBundleBooking,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 Form
  const [eventType, setEventType] = useState('Cocktail & Gala Party');
  const [guestCount, setGuestCount] = useState(75);
  const [eventDate, setEventDate] = useState('2026-09-12');
  const [hours, setHours] = useState(5);

  // Step 2 Venue Selection & Skip Venue Toggle
  const [skipVenue, setSkipVenue] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue>(venues[0] || {
    id: 'v1',
    name: 'The Skyline Glass Penthouse',
    location: 'SoHo, New York, NY',
    city: 'New York',
    category: 'Venue',
    rating: 4.96,
    reviewsCount: 128,
    capacity: 120,
    pricePerHour: 350,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'],
    description: 'A breathtaking glass terrace overlooking Manhattan skyline.',
    amenities: ['Full Bar Area', 'Pro Sound System', 'Elevator Access'],
    superhost: true,
    instantBook: true,
    sqft: 4000,
    hostName: 'Elena Rostova',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  });

  // Step 3 Vendors Selection (Caterers, Photographers, Decorators, DJs)
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>(
    vendors.length > 0 ? [vendors[0].id] : []
  );

  // Detail Modal State
  const [inspectItem, setInspectItem] = useState<Venue | Vendor | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Dynamic pricing calculation
  const venueSubtotal = (!skipVenue && selectedVenue) ? selectedVenue.pricePerHour * hours : 0;
  const selectedVendors = vendors.filter((v) => selectedVendorIds.includes(v.id));
  const vendorSubtotal = selectedVendors.reduce((acc, v) => acc + (v.hourlyRate || 100) * hours, 0);
  
  const baseSubtotal = venueSubtotal + vendorSubtotal;
  const platformFee = Math.round(baseSubtotal * 0.05); // Dynamic 5% Platform Fee Rule
  const totalBundlePrice = baseSubtotal + platformFee;

  const toggleVendor = (id: string) => {
    if (selectedVendorIds.includes(id)) {
      setSelectedVendorIds(selectedVendorIds.filter((vId) => vId !== id));
    } else {
      setSelectedVendorIds([...selectedVendorIds, id]);
    }
  };

  const handleOpenInspect = (item: Venue | Vendor, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setInspectItem(item);
    setIsDetailOpen(true);
  };

  const handleFinish = () => {
    onConfirmBundleBooking({
      eventTitle: eventType,
      venue: skipVenue ? undefined : selectedVenue,
      skipVenue,
      vendors: selectedVendors,
      date: eventDate,
      guests: guestCount,
      totalAmount: totalBundlePrice,
      basePrice: baseSubtotal,
      platformFee
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      
      {/* Wizard Progress Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold mb-3 shadow-2xs">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Custom Event Builder</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Design Your Custom Event Package</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
          Mix & match venues, caterers, photographers, and decorators. Click any card to expand photo galleries, specifications, and amenity previews.
        </p>

        {/* Steps indicator */}
        <div className="flex items-center justify-between max-w-md mx-auto mt-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          
          {[
            { num: 1, label: '1. Vision' },
            { num: 2, label: '2. Venue' },
            { num: 3, label: '3. Vendors' },
            { num: 4, label: '4. Summary' },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num as any)}
              className={`relative z-10 flex flex-col items-center cursor-pointer ${
                s.num <= step ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === s.num
                    ? 'bg-rose-600 text-white shadow-md ring-4 ring-rose-100'
                    : s.num < step
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {s.num < step ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className="text-[11px] font-semibold mt-1.5">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Vision */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Step 1: Event Scope & Parameters</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-semibold text-slate-700">
            <div>
              <label className="block text-slate-500 uppercase font-bold text-[10px] mb-1">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-sm focus:outline-none"
              >
                <option value="Cocktail & Gala Party">Cocktail & Gala Party</option>
                <option value="Wedding Reception">Wedding Reception</option>
                <option value="Corporate Retreat & Fest">Corporate Retreat & Fest</option>
                <option value="Private Dinner Celebration">Private Dinner Celebration</option>
                <option value="Birthday / Milestone Bash">Birthday / Milestone Bash</option>
                <option value="Brand Launch & Shoot">Brand Launch & Shoot</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 uppercase font-bold text-[10px] mb-1">Event Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 uppercase font-bold text-[10px] mb-1">Expected Guest Count</label>
              <input
                type="number"
                min={10}
                max={500}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 uppercase font-bold text-[10px] mb-1">Event Duration (Hours)</label>
              <input
                type="number"
                min={2}
                max={12}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-sm transition-all"
            >
              <span>Next: Venue Selection &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Venue OR Toggle Off Venue */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 2: Choose Your Venue</h2>
              <p className="text-xs text-slate-500 mt-0.5">Select a verified space or toggle off to host at your own location.</p>
            </div>

            {/* CRITICAL FEATURE: TOGGLE OFF VENUE */}
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center space-x-3 shrink-0">
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold text-amber-900">Hosting at Own Property?</span>
              </div>
              <button
                type="button"
                onClick={() => setSkipVenue(!skipVenue)}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all flex items-center space-x-1 ${
                  skipVenue
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300'
                }`}
              >
                {skipVenue ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Venue Skipped ($0)</span>
                  </>
                ) : (
                  <span>Skip Venue</span>
                )}
              </button>
            </div>
          </div>

          {skipVenue ? (
            <div className="p-8 text-center bg-amber-50/30 rounded-3xl border border-dashed border-amber-300 space-y-3">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-700">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">You chose to host at your own home/property!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                No venue rental fee will be added ($0). You can proceed to hire caterers, photographers, decorators, and DJs for your personal space.
              </p>
              <button
                onClick={() => setSkipVenue(false)}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Re-enable venue selection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {venues.map((v) => {
                const isSelected = !skipVenue && selectedVenue?.id === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSkipVenue(false);
                      setSelectedVenue(v);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex space-x-4 relative group ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-500/20 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={v.images[0]}
                      alt={v.name}
                      className="w-24 h-24 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{v.name}</h3>
                          <button
                            onClick={(e) => handleOpenInspect(v, e)}
                            className="text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded flex items-center space-x-1"
                            title="Expand Card Details"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Expand</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-500">{v.location}</p>
                        <p className="text-[11px] font-semibold text-slate-600 mt-1">Capacity: Up to {v.capacity} guests</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs font-extrabold text-slate-900">${v.pricePerHour}/hr</span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl"
            >
              &larr; Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center space-x-2"
            >
              <span>Next: Add Vendors & Services &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Add Vendors (Caterers, Photographers, Decorators, DJs) */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 3: Select Caterers, Photographers & Decorators</h2>
              <p className="text-xs text-slate-500">Mix and match services to complete your event package.</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              {selectedVendorIds.length} Services Selected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendors.map((vendor) => {
              const isAdded = selectedVendorIds.includes(vendor.id);
              return (
                <div
                  key={vendor.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isAdded
                      ? 'border-indigo-500 bg-indigo-50/20 ring-2 ring-indigo-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex space-x-3 mb-3">
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer"
                      onClick={(e) => handleOpenInspect(vendor, e)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">
                          {vendor.category}
                        </span>
                        <button
                          onClick={(e) => handleOpenInspect(vendor, e)}
                          className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center space-x-0.5"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Expand</span>
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{vendor.name}</h4>
                      <p className="text-xs text-slate-500">${vendor.hourlyRate || 100}/hr</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleVendor(vendor.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                      isAdded ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isAdded ? '✓ Added to Package' : '+ Add Service'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold"
            >
              &larr; Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              <span>Next: Dynamic Summary &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Summary & Confirm */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Step 4: Real-Time Dynamic Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left 2 Cols Breakdown */}
            <div className="md:col-span-2 space-y-4">
              
              {/* Event Info */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                <span className="text-[10px] uppercase font-bold text-slate-400">Event Specification</span>
                <h3 className="font-bold text-slate-900 text-base">{eventType}</h3>
                <p className="text-xs text-slate-600 mt-1">Date: {eventDate} • {hours} Hours • {guestCount} Guests</p>
              </div>

              {/* Reserved Venue or Skipped Venue */}
              {skipVenue ? (
                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <Home className="w-6 h-6 text-amber-700 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-800">Venue Location</span>
                      <h4 className="font-bold text-slate-900">Hosting at Personal Property</h4>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">$0</span>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center space-x-3">
                  <img src={selectedVenue.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold text-rose-600">Reserved Venue</span>
                    <h4 className="font-bold text-slate-900 text-sm">{selectedVenue.name}</h4>
                    <p className="text-xs text-slate-500">${selectedVenue.pricePerHour}/hr x {hours}h = ${venueSubtotal}</p>
                  </div>
                </div>
              )}

              {/* Selected Vendors */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">Vendor Services Included ({selectedVendors.length})</span>
                {selectedVendors.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No vendor services added yet.</p>
                ) : (
                  selectedVendors.map((v) => (
                    <div key={v.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{v.name}</span>
                        <span className="text-indigo-600 font-semibold ml-2">({v.category})</span>
                      </div>
                      <span className="font-semibold text-slate-700">${(v.hourlyRate || 100) * hours}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Price Summary with 5% Platform Fee */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-xl">
              <div>
                <h4 className="font-bold text-base mb-4 border-b border-slate-800 pb-2">Real-Time Cost Summary</h4>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Venue Subtotal</span>
                    <span>${venueSubtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vendor Services</span>
                    <span>${vendorSubtotal}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-amber-300">
                    <span>Platform Service Fee (5%)</span>
                    <span>+${platformFee}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex justify-between font-extrabold text-white text-base">
                    <span>Total Billed</span>
                    <span className="text-rose-400">${totalBundlePrice}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleFinish}
                  className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 font-bold text-xs rounded-xl shadow-lg shadow-rose-500/30 transition-all text-white mb-2"
                >
                  Confirm & Reserve Event Package
                </button>
                <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant reservation with zero hidden costs</span>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-2 flex justify-start">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
            >
              &larr; Modify Services
            </button>
          </div>
        </div>
      )}

      {/* Builder Item Detail Inspection Modal */}
      <BuilderItemDetailModal
        isOpen={isDetailOpen}
        item={inspectItem}
        isSelected={
          inspectItem
            ? 'pricePerHour' in inspectItem
              ? !skipVenue && selectedVenue.id === inspectItem.id
              : selectedVendorIds.includes(inspectItem.id)
            : false
        }
        onClose={() => setIsDetailOpen(false)}
        onToggleSelect={(itemToToggle) => {
          if ('pricePerHour' in itemToToggle) {
            setSkipVenue(false);
            setSelectedVenue(itemToToggle as Venue);
          } else {
            toggleVendor(itemToToggle.id);
          }
        }}
      />

    </div>
  );
};
