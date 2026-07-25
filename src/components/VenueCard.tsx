import React from 'react';
import { Venue } from '../types';
import { Star, Users, Zap, Heart, MapPin, MessageSquare } from 'lucide-react';

interface VenueCardProps {
  venue: Venue;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectVenue: (venue: Venue) => void;
  onNegotiate?: (venue: Venue) => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  isFavorite,
  onToggleFavorite,
  onSelectVenue,
  onNegotiate,
}) => {
  return (
    <div 
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
      onClick={() => onSelectVenue(venue)}
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={venue.images[0]}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {venue.superhost && (
            <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center space-x-1">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Superhost</span>
            </span>
          )}
          {venue.instantBook && (
            <span className="bg-rose-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs">
              Instant Book
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(venue.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-xs text-slate-700 transition-all hover:scale-110 z-10"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
        </button>

        {/* Capacity overlay pill */}
        <div className="absolute bottom-3 left-3 bg-slate-950/70 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center space-x-1">
          <Users className="w-3.5 h-3.5 text-slate-300" />
          <span>Up to {venue.capacity} guests</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="flex items-center space-x-1 font-medium text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{venue.location}</span>
            </span>
            <div className="flex items-center space-x-1 font-semibold text-slate-900">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{venue.rating}</span>
              <span className="text-slate-400 font-normal">({venue.reviewsCount})</span>
            </div>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-rose-600 transition-colors line-clamp-1 mb-2">
            {venue.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
            {venue.description}
          </p>
        </div>

        {/* Pricing & Chat Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-extrabold text-slate-900">${venue.pricePerHour}</span>
            <span className="text-xs font-normal text-slate-500"> / hour</span>
          </div>

          {onNegotiate ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNegotiate(venue);
              }}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl flex items-center space-x-1 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              <span>Chat / Negotiate</span>
            </button>
          ) : (
            <span className="text-xs font-semibold text-rose-600 group-hover:translate-x-0.5 transition-transform">
              View Details &rarr;
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
