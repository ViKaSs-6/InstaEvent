import React, { useState, useMemo } from 'react';
import { Venue, Vendor } from '../types';
import { VENUE_CATEGORIES, MOCK_VENDORS } from '../data/mockData';
import { VenueCard } from './VenueCard';
import { Search, SlidersHorizontal, MapPin, Star, Filter, Check, Award, MessageSquare, CreditCard } from 'lucide-react';

interface ExploreViewProps {
  venues: Venue[];
  vendors?: Vendor[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectVenue: (venue: Venue) => void;
  onNegotiate: (item: Venue | Vendor) => void;
  onCheckout: (item: Venue | Vendor) => void;
  initialSearchQuery?: string;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  venues,
  vendors = MOCK_VENDORS,
  favorites,
  onToggleFavorite,
  onSelectVenue,
  onNegotiate,
  onCheckout,
  initialSearchQuery = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [onlySuperhost, setOnlySuperhost] = useState<boolean>(false);
  const [onlyInstantBook, setOnlyInstantBook] = useState<boolean>(false);
  const [viewTab, setViewTab] = useState<'venues' | 'vendors'>('venues');

  // Filtered venues list
  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
      if (selectedCity !== 'all' && v.city !== selectedCity) return false;
      if (v.pricePerHour > maxPrice) return false;
      if (v.capacity < minCapacity) return false;
      if (onlySuperhost && !v.superhost) return false;
      if (onlyInstantBook && !v.instantBook) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(query);
        const matchesLoc = v.location.toLowerCase().includes(query);
        const matchesDesc = v.description.toLowerCase().includes(query);
        if (!matchesName && !matchesLoc && !matchesDesc) return false;
      }
      return true;
    });
  }, [venues, selectedCategory, selectedCity, maxPrice, minCapacity, onlySuperhost, onlyInstantBook, searchQuery]);

  return (
    <div className="space-y-8 py-6">
      
      {/* Top Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Spaces & Event Creators
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Browse verified luxury event venues and top-rated vendor specialists.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewTab('venues')}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              viewTab === 'venues' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Venues ({filteredVenues.length})
          </button>
          <button
            onClick={() => setViewTab('vendors')}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              viewTab === 'vendors' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vendor Directory ({vendors.length})
          </button>
        </div>
      </div>

      {viewTab === 'venues' ? (
        <>
          {/* Category Pill Carousel */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {VENUE_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all whitespace-nowrap flex items-center space-x-2 ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            
            {/* Search Input */}
            <div className="relative md:col-span-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search venue name, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* City Selector */}
            <div className="flex items-center space-x-2 text-xs">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
              >
                <option value="all">All Cities</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Miami">Miami</option>
                <option value="Chicago">Chicago</option>
              </select>
            </div>

            {/* Max Price Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Max Rate</span>
                <span className="text-rose-600 font-bold">${maxPrice}/hr</span>
              </div>
              <input
                type="range"
                min={100}
                max={600}
                step={25}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center justify-between md:justify-end space-x-3">
              <label className="flex items-center space-x-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlySuperhost}
                  onChange={(e) => setOnlySuperhost(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-400"
                />
                <span>Superhost</span>
              </label>

              <label className="flex items-center space-x-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInstantBook}
                  onChange={(e) => setOnlyInstantBook(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-400"
                />
                <span>Instant Book</span>
              </label>
            </div>
          </div>

          {/* Venues Grid */}
          {filteredVenues.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base mb-1">No spaces match your filters</h3>
              <p className="text-slate-500 text-xs mb-4">Try resetting your price limit, city filter, or search keywords.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSelectedCity('all');
                  setMaxPrice(600);
                  setOnlySuperhost(false);
                  setOnlyInstantBook(false);
                }}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  isFavorite={favorites.includes(venue.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelectVenue={onSelectVenue}
                  onNegotiate={onNegotiate}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        /* Vendors Directory Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex space-x-4 mb-4">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-slate-100 shadow-xs"
                  />
                  <div>
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100">
                      {vendor.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1">{vendor.name}</h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                      <div className="flex items-center space-x-1 font-semibold text-slate-900">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{vendor.rating}</span>
                        <span className="text-slate-400 font-normal">({vendor.reviewsCount})</span>
                      </div>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">{vendor.priceRange}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{vendor.location}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">{vendor.bio}</p>

                {/* Popular packages */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Top Offerings</span>
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.popularPackages.map((pkg, pIdx) => (
                      <span key={pIdx} className="px-2 py-1 bg-slate-50 text-slate-700 text-[11px] font-medium rounded-lg border border-slate-200/60">
                        {pkg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-base font-bold text-slate-900">${vendor.hourlyRate}</span>
                  <span className="text-xs text-slate-500"> / hr starting</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onNegotiate(vendor)}
                    className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    <span>Chat / Negotiate</span>
                  </button>

                  <button
                    onClick={() => onCheckout(vendor)}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
