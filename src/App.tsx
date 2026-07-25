import React, { useState, useEffect } from 'react';
import { NavTab, Venue, Vendor, Booking, User } from './types';
import { MOCK_VENUES, MOCK_VENDORS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { VenueCard } from './components/VenueCard';
import { VenueModal } from './components/VenueModal';
import { ExploreView } from './components/ExploreView';
import { EventBuilderView } from './components/EventBuilderView';
import { VendorPortalView } from './components/VendorPortalView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AccountSettingsView } from './components/AccountSettingsView';
import { MessagesHubView, ChatThread } from './components/MessagesHubView';
import { AuthModal, PRESET_USERS } from './components/AuthModal';
import { BookingsModal } from './components/BookingsModal';
import { HostListingModal } from './components/HostListingModal';
import { NegotiationChatModal } from './components/NegotiationChatModal';
import { CheckoutModal } from './components/CheckoutModal';
import { Sparkles, ArrowRight } from 'lucide-react';
import {
  apiGetMe,
  apiLogin,
  apiFetchListings,
  apiFetchBookings,
  apiFetchMessages,
  apiCreateBooking,
  apiCreateListing,
  apiDeleteListing
} from './api';

export default function App() {
  // Current Authenticated User & Role
  const [currentUser, setCurrentUser] = useState<User>(PRESET_USERS[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<NavTab>('Home');

  // Master Listings State (REST API Synced)
  const [venues, setVenues] = useState<Venue[]>(MOCK_VENUES);
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [favorites, setFavorites] = useState<string[]>(['v1', 'v2']);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  
  // Search Query state passed to explore
  const [exploreSearchQuery, setExploreSearchQuery] = useState('');

  // Bookings & Chats State (REST API Synced)
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [chats, setChats] = useState<ChatThread[]>([]);

  // Modals state
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);

  // Negotiation Chat Modal State
  const [chatItem, setChatItem] = useState<Venue | Vendor | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Checkout Modal State
  const [checkoutItem, setCheckoutItem] = useState<Venue | Vendor | null>(null);
  const [checkoutPrice, setCheckoutPrice] = useState<number | undefined>(undefined);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // --- INITIAL DATA FETCHING FROM MONGODB EXPRESS BACKEND ---
  useEffect(() => {
    async function initAppData() {
      // 1. Get Me (Auth profile)
      let user = await apiGetMe();
      if (!user) {
        try {
          user = await apiLogin('alex.rivera@example.com', 'password123');
        } catch (e) {
          console.warn('Auto-login error:', e);
        }
      }
      if (user) {
        setCurrentUser(user);
      }

      // 2. Fetch Listings
      const { venues: apiVenues, vendors: apiVendors } = await apiFetchListings();
      if (apiVenues.length > 0) setVenues(apiVenues);
      if (apiVendors.length > 0) setVendors(apiVendors);

      // 3. Fetch Bookings
      const apiBookings = await apiFetchBookings();
      if (apiBookings.length > 0) setBookings(apiBookings);

      // 4. Fetch Chat Threads
      const apiChats = await apiFetchMessages();
      if (apiChats.length > 0) setChats(apiChats as ChatThread[]);
    }

    initAppData();
  }, []);

  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fId => fId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleHeroSearch = ({ location, eventType }: { location: string; eventType: string; guests: number }) => {
    setExploreSearchQuery(location || eventType);
    setActiveTab('Explore');
  };

  const handleOpenNegotiate = (item: Venue | Vendor) => {
    setChatItem(item);
    setIsChatOpen(true);
  };

  const handleOpenCheckout = (item: Venue | Vendor, customPrice?: number) => {
    setCheckoutItem(item);
    setCheckoutPrice(customPrice);
    setIsCheckoutOpen(true);
  };

  const handleConfirmSingleBooking = async (details: {
    venue: Venue;
    date: string;
    hours: number;
    guests: number;
    totalAmount: number;
  }) => {
    try {
      const venueName = details.venue?.name || (checkoutItem ? checkoutItem.name : 'Selected Listing');
      const venueImage = details.venue?.images?.[0] || (checkoutItem && 'image' in checkoutItem ? checkoutItem.image : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80');
      const baseAmount = (details.venue?.pricePerHour || 150) * (details.hours || 4);

      const newBooking = await apiCreateBooking({
        venueName,
        venueImage,
        date: details.date || new Date().toISOString().split('T')[0],
        guests: details.guests || 50,
        totalAmount: details.totalAmount,
        baseAmount
      });
      setBookings(prev => [newBooking, ...prev]);
      setIsBookingsOpen(true);
    } catch (err: any) {
      console.error('Failed to save booking:', err);
      alert('Could not save booking: ' + (err.message || 'Please check if you are logged in.'));
    }
  };

  const handleConfirmBundleBooking = async (bundle: {
    eventTitle: string;
    venue?: Venue;
    skipVenue?: boolean;
    vendors: any[];
    date: string;
    guests: number;
    totalAmount: number;
    basePrice: number;
    platformFee: number;
  }) => {
    try {
      const venueTitle = bundle.skipVenue ? 'Personal Property Location' : bundle.venue?.name || 'Selected Venue';
      const newBooking = await apiCreateBooking({
        venueName: `${bundle.eventTitle} @ ${venueTitle}`,
        venueImage: bundle.venue?.images[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80',
        date: bundle.date,
        guests: bundle.guests,
        totalAmount: bundle.totalAmount,
        baseAmount: bundle.basePrice,
        vendorNames: bundle.vendors.map(v => v.name)
      });
      setBookings([newBooking, ...bookings]);
      setIsBookingsOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNewVenue = async (newSpace: Venue) => {
    try {
      const created = await apiCreateListing({
        title: newSpace.name,
        category: 'Venue',
        description: newSpace.description,
        price: newSpace.pricePerHour,
        images: newSpace.images,
        amenities: newSpace.amenities,
        location: newSpace.location,
        capacity: newSpace.capacity,
        sqft: newSpace.sqft
      });
      setVenues([created, ...venues]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNewVendor = async (newVendor: Vendor) => {
    try {
      const created = await apiCreateListing({
        title: newVendor.name,
        category: newVendor.category,
        description: newVendor.bio,
        price: newVendor.hourlyRate,
        images: [newVendor.image],
        amenities: newVendor.popularPackages
      });
      setVendors([created, ...vendors]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveVenue = async (venueId: string) => {
    try {
      await apiDeleteListing(venueId);
      setVenues(venues.filter(v => v.id !== venueId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveVendor = async (vendorId: string) => {
    try {
      await apiDeleteListing(vendorId);
      setVendors(vendors.filter(v => v.id !== vendorId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUser = (updated: User) => {
    setCurrentUser(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-900 flex flex-col justify-between">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        favoritesCount={favorites.length}
        bookingsCount={bookings.length}
        unreadChatsCount={1}
        onOpenBookings={() => setIsBookingsOpen(true)}
        onOpenHostModal={() => setIsHostModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        
        {/* HOME TAB VIEW */}
        {activeTab === 'Home' && (
          <div className="space-y-12 pb-16">
            
            {/* Airbnb-style Hero Banner */}
            <HeroBanner onSearch={handleHeroSearch} />

            {/* Featured Spaces Header */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Featured Event Venues</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Handpicked spaces with top-tier ratings and instant booking.</p>
                </div>
                <button
                  onClick={() => setActiveTab('Explore')}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
                >
                  <span>Explore All Spaces ({venues.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Venues Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {venues.slice(0, 3).map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    isFavorite={favorites.includes(venue.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectVenue={(v) => setSelectedVenue(v)}
                    onNegotiate={handleOpenNegotiate}
                  />
                ))}
              </div>
            </div>

            {/* How Insta Events Works Workflow */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full">
                  Simple 3-Step Process
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-3">How Insta Events Works</h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">Book venues and assemble your event dream team in minutes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 font-extrabold text-lg flex items-center justify-center mx-auto mb-4 border border-rose-100">
                    1
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-2">Discover Unique Spaces</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Filter thousands of glass rooftops, beachfront mansions, and creative studios with clear hourly pricing.
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-extrabold text-lg flex items-center justify-center mx-auto mb-4 border border-amber-100">
                    2
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-2">Negotiate & Custom Quotes</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Chat directly with hosts and vendor creators to request custom dates, discounts, and package quotes.
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-extrabold text-lg flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                    3
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-2">Instant Confirmation</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Secure your date instantly with checkout escrow, contract protection, and direct host messaging.
                  </p>
                </div>
              </div>
            </div>

            {/* Event Builder Callout Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
              <div className="max-w-xl">
                <span className="px-3 py-1 bg-white/10 text-amber-300 font-bold text-xs rounded-full border border-white/10 mb-4 inline-block">
                  Custom Event Packages
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                  Planning a Large Party or Corporate Gala?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Use our interactive Event Builder wizard to bundle space rental, catering, sound rigs, and photography into one single booking.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('Event Builder')}
                className="px-6 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 font-bold text-xs rounded-xl shadow-lg shadow-rose-500/30 transition-all text-white shrink-0 flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Event Builder Wizard</span>
              </button>
            </div>

          </div>
        )}

        {/* EXPLORE TAB VIEW */}
        {activeTab === 'Explore' && (
          <ExploreView
            venues={venues}
            vendors={vendors}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectVenue={(v) => setSelectedVenue(v)}
            onNegotiate={handleOpenNegotiate}
            onCheckout={handleOpenCheckout}
            initialSearchQuery={exploreSearchQuery}
          />
        )}

        {/* EVENT BUILDER TAB VIEW */}
        {activeTab === 'Event Builder' && (
          <EventBuilderView
            venues={venues}
            vendors={vendors}
            onConfirmBundleBooking={handleConfirmBundleBooking}
          />
        )}

        {/* VENDOR PORTAL TAB VIEW */}
        {activeTab === 'Vendor Portal' && (
          <VendorPortalView
            onAddVenue={handleAddNewVenue}
            onAddVendor={handleAddNewVendor}
            activeVenues={venues}
            activeVendors={vendors}
          />
        )}

        {/* ADMIN DASHBOARD TAB VIEW */}
        {activeTab === 'Admin Dashboard' && (
          <AdminDashboardView
            currentUser={currentUser}
            venues={venues}
            vendors={vendors}
            onApproveVenue={handleAddNewVenue}
            onApproveVendor={handleAddNewVendor}
            onRemoveVenue={handleRemoveVenue}
            onRemoveVendor={handleRemoveVendor}
          />
        )}

        {/* MESSAGES HUB VIEW */}
        {activeTab === 'My Chats' && (
          <MessagesHubView
            currentUser={currentUser}
            venues={venues}
            vendors={vendors}
            threads={chats}
            onDirectCheckout={handleOpenCheckout}
          />
        )}

        {/* ACCOUNT PROFILE & SETTINGS VIEW */}
        {activeTab === 'Account' && (
          <AccountSettingsView
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
            bookings={bookings}
          />
        )}

      </main>

      {/* Footer - Clean Zero Watermarks */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900">Insta Events</span>
            <span>© 2026 Insta Events Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6 font-medium">
            <span className="hover:text-slate-900 cursor-pointer" onClick={() => setActiveTab('Account')}>Privacy & Security</span>
            <span className="hover:text-slate-900 cursor-pointer" onClick={() => setIsAuthModalOpen(true)}>Role Portal ({currentUser.role})</span>
            <span className="hover:text-slate-900 cursor-pointer" onClick={() => setActiveTab('Account')}>Host Guarantee</span>
          </div>
        </div>
      </footer>

      {/* Auth & Role Selection Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSelectUser={async (selectedUser) => {
          setCurrentUser(selectedUser);
          if (selectedUser.role === 'Admin') setActiveTab('Admin Dashboard');
          else if (selectedUser.role === 'Vendor') setActiveTab('Vendor Portal');
          else setActiveTab('Home');

          // Fetch user-specific bookings & chats from MongoDB
          const updatedBookings = await apiFetchBookings();
          setBookings(updatedBookings);
          const updatedChats = await apiFetchMessages();
          setChats(updatedChats as ChatThread[]);
        }}
      />

      {/* Modal dialogs */}
      <VenueModal
        venue={selectedVenue}
        onClose={() => setSelectedVenue(null)}
        onConfirmBooking={handleConfirmSingleBooking}
        onNegotiate={handleOpenNegotiate}
      />

      <BookingsModal
        isOpen={isBookingsOpen}
        onClose={() => setIsBookingsOpen(false)}
        bookings={bookings}
      />

      <HostListingModal
        isOpen={isHostModalOpen}
        onClose={() => setIsHostModalOpen(false)}
        onAddListing={handleAddNewVenue}
      />

      {/* Negotiation Chat Modal */}
      <NegotiationChatModal
        isOpen={isChatOpen}
        item={chatItem}
        onClose={() => setIsChatOpen(false)}
        onDirectCheckout={handleOpenCheckout}
      />

      {/* Checkout & Payment Confirmation Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        item={checkoutItem}
        customPrice={checkoutPrice}
        onClose={() => setIsCheckoutOpen(false)}
        onCompleteBooking={async (b) => {
          await handleConfirmSingleBooking({
            venue: checkoutItem as Venue || venues[0],
            date: new Date().toISOString().split('T')[0],
            hours: 4,
            guests: 50,
            totalAmount: b.totalAmount
          });
        }}
      />

    </div>
  );
}
