import React, { useState } from 'react';
import { Venue, Vendor, InboundInquiry } from '../types';
import { DollarSign, CalendarCheck, Star, Users, PlusCircle, CheckCircle, Clock, X, MessageSquare, Shield, AlertCircle, Building2, Camera, Utensils, Music, Flower2, Sparkles, Image as ImageIcon, MapPin, Check } from 'lucide-react';

interface VendorPortalViewProps {
  onAddVenue: (newVenue: Venue) => void;
  onAddVendor: (newVendor: Vendor) => void;
  activeVenues: Venue[];
  activeVendors: Vendor[];
}

export const VendorPortalView: React.FC<VendorPortalViewProps> = ({
  onAddVenue,
  onAddVendor,
  activeVenues,
  activeVendors,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inquiries' | 'register' | 'listings'>('dashboard');

  // Vendor Registration Category state
  const [registrationCategory, setRegistrationCategory] = useState<'Venue' | 'Caterer' | 'Photographer' | 'DJ' | 'Florist'>('Venue');

  // Form State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('New York, NY');
  const [city, setCity] = useState('New York');
  const [pricing, setPricing] = useState(150);
  const [capacityOrPackage, setCapacityOrPackage] = useState(75);
  const [description, setDescription] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [amenitiesInput, setAmenitiesInput] = useState('Wi-Fi, High Ceilings, Valet Parking, Sound System');
  const [successMessage, setSuccessMessage] = useState('');

  // Sample preset images for provider registration
  const presetPhotos = {
    Venue: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=80'
    ],
    Caterer: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80'
    ],
    Photographer: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80'
    ],
    DJ: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80'
    ],
    Florist: [
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=80'
    ]
  };

  // Mock Inbound Inquiries
  const [inquiries, setInquiries] = useState<InboundInquiry[]>([
    {
      id: 'inq1',
      clientName: 'Sophia Lin',
      eventType: '30th Birthday Soirée',
      itemName: 'The Skyline Glass Penthouse',
      itemCategory: 'Venue',
      requestedDate: '2026-08-22',
      guests: 85,
      offeredPrice: 1600,
      originalPrice: 1800,
      status: 'Pending',
      lastMessage: 'Hi! Is outside catering permitted for our group of 85?'
    },
    {
      id: 'inq2',
      clientName: 'Alex Thorne',
      eventType: 'Venture Capital Investor Dinner',
      itemName: 'Artisan Gourmet Catering',
      itemCategory: 'Catering',
      requestedDate: '2026-09-05',
      guests: 40,
      offeredPrice: 1200,
      originalPrice: 1400,
      status: 'Negotiating',
      lastMessage: 'Can you include custom vegan pairings for our VIP guests?'
    }
  ]);

  const handleInquiryStatus = (id: string, newStatus: 'Accepted' | 'Declined') => {
    setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const imgToUse = customImageUrl.trim() || selectedImageUrl || presetPhotos[registrationCategory][0];

    if (registrationCategory === 'Venue') {
      const newSpace: Venue = {
        id: `v_custom_${Date.now()}`,
        name: title,
        location: location || 'New York, NY',
        city: city || 'New York',
        category: 'Rooftop & Penthouse',
        rating: 5.0,
        reviewsCount: 1,
        capacity: capacityOrPackage || 100,
        pricePerHour: pricing || 200,
        images: [imgToUse],
        description: description || 'Beautifully registered space featuring scenic views and flexible layout options for events.',
        amenities: amenitiesInput.split(',').map(s => s.trim()).filter(Boolean),
        superhost: true,
        instantBook: true,
        sqft: 2500,
        hostName: 'Verified Partner',
        hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      };
      onAddVenue(newSpace);
    } else {
      let mappedCategory: Vendor['category'] = 'Catering';
      if (registrationCategory === 'Photographer') mappedCategory = 'Photography';
      if (registrationCategory === 'DJ') mappedCategory = 'DJ & Music';
      if (registrationCategory === 'Florist') mappedCategory = 'Florist';

      const newVendor: Vendor = {
        id: `vend_custom_${Date.now()}`,
        name: title,
        category: mappedCategory,
        rating: 5.0,
        reviewsCount: 1,
        priceRange: `$$$ (${pricing}/hr)`,
        hourlyRate: pricing || 120,
        image: imgToUse,
        bio: description || 'Top-tier event service provider delivering exceptional guest experiences.',
        location: location || 'New York, NY',
        popularPackages: amenitiesInput.split(',').map(s => s.trim()).filter(Boolean)
      };
      onAddVendor(newVendor);
    }

    setSuccessMessage(`Success! Your ${registrationCategory} listing "${title}" was published and is now live on the Explore page!`);
    setTitle('');
    setDescription('');
    setCustomImageUrl('');

    setTimeout(() => {
      setSuccessMessage('');
      setActiveTab('listings');
    }, 2000);
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Vendor Portal Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Provider & Vendor Hub</h1>
            <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 font-bold text-[11px] rounded-full border border-rose-200">
              Verified Partner Portal
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Register new listings, negotiate direct quotes, and monitor your booking payouts.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => setActiveTab('register')}
          className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-rose-500/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Listing</span>
        </button>
      </div>

      {/* Internal Portal Nav Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Dashboard & Earnings
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'inquiries'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Client Inquiries & Quotes</span>
          <span className="w-2 h-2 rounded-full bg-rose-500" />
        </button>

        <button
          onClick={() => setActiveTab('register')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'register'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          + Register Listing Form
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'listings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Active Services ({activeVenues.length + activeVendors.length})
        </button>
      </div>

      {/* TAB 1: VENDOR DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* KPI Analytics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase text-slate-500">Gross Earnings</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">$24,850</div>
              <span className="text-[11px] font-semibold text-emerald-600">+18% vs last month</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase text-slate-500">Total Bookings</span>
                <CalendarCheck className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">18 Events</div>
              <span className="text-[11px] font-semibold text-slate-500">4 upcoming this week</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase text-slate-500">Response Speed</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">99.8%</div>
              <span className="text-[11px] font-semibold text-emerald-600">Avg reply time: 8 mins</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase text-slate-500">Provider Rating</span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">4.99 ★</div>
              <span className="text-[11px] font-semibold text-slate-500">142 verified client reviews</span>
            </div>
          </div>

          {/* Quick Stats overview */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="px-3 py-1 bg-white/10 text-rose-300 font-bold text-xs rounded-full inline-block mb-2">
                Provider Performance Guarantee
              </span>
              <h3 className="text-xl font-extrabold text-white">Your Services Are Instant-Bookable</h3>
              <p className="text-slate-300 text-xs mt-1 max-w-lg">
                Clients can request direct quotes or negotiate pricing through the Alibaba-style chat interface on your listings.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('register')}
              className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 shrink-0"
            >
              + Add Venue or Vendor Service
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CLIENT INQUIRIES & QUOTES */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Incoming Client Quote Requests</h2>
              <p className="text-xs text-slate-500">Review custom offers and negotiate direct quotes.</p>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              {inquiries.filter(i => i.status === 'Pending' || i.status === 'Negotiating').length} Open Negotiation(s)
            </span>
          </div>

          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{inq.clientName}</span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded">
                      {inq.itemCategory}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800">
                    Service: {inq.itemName} • <span className="text-slate-500">{inq.eventType} ({inq.guests} guests)</span>
                  </p>

                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/60 italic">
                    "{inq.lastMessage}"
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                    <span>Date: {inq.requestedDate}</span>
                    <span>•</span>
                    <span>Client Counter Offer: <strong className="text-rose-600">${inq.offeredPrice}</strong></span>
                    <span>•</span>
                    <span>Standard Rate: <span className="line-through">${inq.originalPrice}</span></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  {inq.status === 'Pending' || inq.status === 'Negotiating' ? (
                    <>
                      <button
                        onClick={() => handleInquiryStatus(inq.id, 'Declined')}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-200 text-xs font-bold rounded-xl"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleInquiryStatus(inq.id, 'Accepted')}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        Accept Custom Quote (${inq.offeredPrice})
                      </button>
                    </>
                  ) : (
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      inq.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {inq.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STRUCTURED VENDOR REGISTRATION FORM */}
      {activeTab === 'register' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-3xl mx-auto space-y-6">
          
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Register New Space or Provider Service</h2>
            <p className="text-xs text-slate-500 mt-1">Fill out this structured listing form so your service instantly appears on the Explore page.</p>
          </div>

          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-800 text-xs font-bold">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* Step A: Select Category */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                1. Select Provider Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { id: 'Venue', label: 'Venue', icon: Building2 },
                  { id: 'Caterer', label: 'Caterer', icon: Utensils },
                  { id: 'Photographer', label: 'Photographer', icon: Camera },
                  { id: 'DJ', label: 'DJ & Music', icon: Music },
                  { id: 'Florist', label: 'Florist', icon: Flower2 }
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = registrationCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setRegistrationCategory(cat.id as any);
                        setSelectedImageUrl(presetPhotos[cat.id as keyof typeof presetPhotos][0]);
                      }}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center space-y-1.5 transition-all ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step B: Listing Title & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Listing Name / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder={registrationCategory === 'Venue' ? "e.g. Grand Glasshouse Pavilion" : "e.g. Gourmet Fusion Catering"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / City *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Step C: Pricing & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Price Per Hour ($) *
                </label>
                <input
                  type="number"
                  required
                  min={20}
                  max={5000}
                  value={pricing}
                  onChange={(e) => setPricing(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {registrationCategory === 'Venue' ? 'Max Guest Capacity' : 'Max Served Guests'}
                </label>
                <input
                  type="number"
                  min={10}
                  max={2000}
                  value={capacityOrPackage}
                  onChange={(e) => setCapacityOrPackage(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Step D: Photo Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Listing Photo (Choose Preset or Paste Custom URL)
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {presetPhotos[registrationCategory].map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImageUrl(img);
                      setCustomImageUrl('');
                    }}
                    className={`relative rounded-xl overflow-hidden h-20 border-2 transition-all ${
                      selectedImageUrl === img && !customImageUrl ? 'border-rose-600 ring-2 ring-rose-500/20' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <input
                type="url"
                placeholder="Or paste image URL (e.g. https://images.unsplash.com/...)"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              />
            </div>

            {/* Step E: Description & Amenities */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Service Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe your venue space, equipment, catering menu options, or photography style..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Included Features / Amenities / Packages (comma-separated)
              </label>
              <input
                type="text"
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish Listing to Explore Page</span>
            </button>

          </form>
        </div>
      )}

      {/* TAB 4: MY ACTIVE LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Your Active Published Services</h2>
            <button
              onClick={() => setActiveTab('register')}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              + Register Another Listing
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeVenues.map((v) => (
              <div key={v.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-4 flex space-x-3 items-center">
                <img src={v.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">Venue</span>
                  <h4 className="font-bold text-slate-900 text-xs truncate mt-1">{v.name}</h4>
                  <p className="text-[11px] font-extrabold text-emerald-600">${v.pricePerHour}/hr</p>
                </div>
              </div>
            ))}

            {activeVendors.map((v) => (
              <div key={v.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-4 flex space-x-3 items-center">
                <img src={v.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded">{v.category}</span>
                  <h4 className="font-bold text-slate-900 text-xs truncate mt-1">{v.name}</h4>
                  <p className="text-[11px] font-extrabold text-emerald-600">${v.hourlyRate}/hr</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
