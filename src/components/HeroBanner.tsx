import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Sparkles, PartyPopper, CheckCircle } from 'lucide-react';

interface HeroBannerProps {
  onSearch: (filters: { location: string; eventType: string; guests: number }) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState('Party & Gala');
  const [guests, setGuests] = useState(50);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ location, eventType, guests });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white my-6 shadow-xl border border-slate-800">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=2000&q=80"
          alt="Insta Events Venue Banner"
          className="w-full h-full object-cover object-center opacity-35 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:py-20 text-center">
        {/* Welcome Tag */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Extraordinary Venues • Verified Top Vendors • Instant Booking</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
          Find & Book Extraordinary Spaces for <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">Any Event</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          From Manhattan glass penthouses to beachfront villas in Malibu. Discover unique venues and instantly build your dream event team.
        </p>

        {/* Airbnb-style Floating Search Bar */}
        <form 
          onSubmit={handleSearchSubmit}
          className="bg-white/95 backdrop-blur-xl p-3 rounded-2xl sm:rounded-full text-slate-800 shadow-2xl max-w-4xl mx-auto border border-white/50 text-left grid grid-cols-1 sm:grid-cols-4 gap-3 items-center"
        >
          {/* Location */}
          <div className="px-4 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition-colors">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Where</label>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <input
                type="text"
                placeholder="Search location (e.g. New York)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Event Type */}
          <div className="px-4 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition-colors border-t sm:border-t-0 sm:border-l border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Event Type</label>
            <div className="flex items-center space-x-2">
              <PartyPopper className="w-4 h-4 text-rose-500 shrink-0" />
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold bg-transparent text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="Party & Gala">Party & Gala</option>
                <option value="Wedding Reception">Wedding Reception</option>
                <option value="Corporate Retreat">Corporate Retreat</option>
                <option value="Photo / Film Shoot">Photo / Film Shoot</option>
                <option value="Pop-up & Exhibition">Pop-up & Exhibition</option>
              </select>
            </div>
          </div>

          {/* Guest Count */}
          <div className="px-4 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition-colors border-t sm:border-t-0 sm:border-l border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Guests</label>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-rose-500 shrink-0" />
              <input
                type="number"
                min={10}
                max={500}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full text-xs sm:text-sm font-semibold bg-transparent text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="pt-2 sm:pt-0">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 sm:py-3.5 px-6 rounded-xl sm:rounded-full font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-rose-500/30 transition-all transform active:scale-98"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search Spaces</span>
            </button>
          </div>
        </form>

        {/* Feature Badges */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>100% Host Verification</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Instant Booking Guarantee</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Transparent Hourly Rates</span>
          </div>
        </div>
      </div>
    </div>
  );
};
