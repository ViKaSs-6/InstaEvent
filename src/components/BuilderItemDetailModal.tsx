import React, { useState } from 'react';
import { Venue, Vendor } from '../types';
import { X, Check, Star, MapPin, Users, Sparkles, Building2, ShieldCheck, Heart, Info, DollarSign, Camera, Utensils, Music } from 'lucide-react';

interface BuilderItemDetailModalProps {
  isOpen: boolean;
  item: Venue | Vendor | null;
  isSelected: boolean;
  onClose: () => void;
  onToggleSelect: (item: Venue | Vendor) => void;
}

export const BuilderItemDetailModal: React.FC<BuilderItemDetailModalProps> = ({
  isOpen,
  item,
  isSelected,
  onClose,
  onToggleSelect,
}) => {
  if (!isOpen || !item) return null;

  const isVenue = 'pricePerHour' in item;
  const venue = isVenue ? (item as Venue) : null;
  const vendor = !isVenue ? (item as Vendor) : null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const images = isVenue ? venue!.images : [vendor!.image];
  const name = isVenue ? venue!.name : vendor!.name;
  const hourlyRate = isVenue ? venue!.pricePerHour : vendor!.hourlyRate;
  const rating = item.rating;
  const reviewsCount = item.reviewsCount;
  const location = isVenue ? venue!.location : vendor!.location;
  const description = isVenue ? venue!.description : vendor!.bio;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Showcase */}
        <div className="relative h-64 sm:h-72 bg-slate-900 overflow-hidden">
          <img
            src={images[activeImageIdx]}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Type Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 font-extrabold text-xs rounded-full shadow-sm">
              {isVenue ? `Venue • ${venue?.category.toUpperCase()}` : `Vendor • ${vendor?.category}`}
            </span>
          </div>

          {/* Bottom Overlay Title */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs mb-1">
              <Star className="w-4 h-4 fill-amber-300" />
              <span>{rating} ({reviewsCount} reviews)</span>
              <span>•</span>
              <span className="text-white font-medium flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                {location}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">{name}</h2>
          </div>
        </div>

        {/* Image thumbnails gallery if venue */}
        {images.length > 1 && (
          <div className="flex space-x-2 p-3 bg-slate-100 overflow-x-auto border-b border-slate-200">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activeImageIdx === idx ? 'border-rose-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-16 h-12 object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[50vh] overflow-y-auto">
          
          {/* Quick Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Hourly Rate</span>
              <span className="text-base font-extrabold text-slate-900">${hourlyRate}/hr</span>
            </div>

            {isVenue && (
              <>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Max Guests</span>
                  <span className="text-base font-extrabold text-slate-900">{venue?.capacity} Capacity</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Space Area</span>
                  <span className="text-base font-extrabold text-slate-900">{venue?.sqft} sq ft</span>
                </div>
              </>
            )}

            {!isVenue && (
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 col-span-2 sm:col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pricing Tier</span>
                <span className="text-base font-extrabold text-slate-900">{vendor?.priceRange} Range</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">About This Item</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
          </div>

          {/* Venue Amenities or Vendor Packages */}
          {isVenue && venue?.amenities && (
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Included Amenities</h4>
              <div className="flex flex-wrap gap-1.5">
                {venue.amenities.map((am, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200">
                    ✓ {am}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!isVenue && vendor?.popularPackages && (
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Popular Service Packages</h4>
              <div className="space-y-1.5">
                {vendor.popularPackages.map((pkg, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{pkg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Selected Rate</span>
            <span className="text-lg font-extrabold text-slate-900">${hourlyRate}/hr</span>
          </div>

          <button
            onClick={() => {
              onToggleSelect(item);
              onClose();
            }}
            className={`px-6 py-3 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 ${
              isSelected
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{isSelected ? '✓ Remove from Package' : '+ Add to Custom Event Bundle'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
