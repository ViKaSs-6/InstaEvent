import React, { useState } from 'react';
import { X, PlusCircle, Building2, UserCheck, Image, DollarSign, Check } from 'lucide-react';

interface HostListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (newSpace: any) => void;
}

export const HostListingModal: React.FC<HostListingModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [city, setCity] = useState('New York');
  const [capacity, setCapacity] = useState(100);
  const [price, setPrice] = useState(250);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onAddListing({
        id: `v_${Date.now()}`,
        name: name || 'New Modern Event Studio',
        location: `${city}, USA`,
        city,
        category: 'studio',
        rating: 5.0,
        reviewsCount: 1,
        capacity,
        pricePerHour: price,
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'],
        description: description || 'Spacious newly listed venue ideal for events.',
        amenities: ['WiFi', 'Sound System', 'Lounge Area'],
        superhost: true,
        instantBook: true,
        sqft: 2500,
        hostName: 'Current User',
        hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      });
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-4">
          <Building2 className="w-6 h-6 text-rose-500" />
          <h2 className="text-xl font-bold text-slate-900">List Your Space on Insta Events</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
          <div>
            <label className="block text-slate-500 uppercase text-[10px] mb-1">Space Name</label>
            <input
              type="text"
              required
              placeholder="e.g. SoHo Loft Terrace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 uppercase text-[10px] mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs focus:outline-none"
              >
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Miami">Miami</option>
                <option value="Chicago">Chicago</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 uppercase text-[10px] mb-1">Hourly Rate ($)</label>
              <input
                type="number"
                min={50}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 uppercase text-[10px] mb-1">Max Capacity</label>
            <input
              type="number"
              min={10}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 uppercase text-[10px] mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Describe what makes your space unique..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            {submitted ? (
              <>
                <Check className="w-4 h-4 animate-bounce" />
                <span>Publishing Space Listing...</span>
              </>
            ) : (
              <span>Publish Listing Immediately</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
