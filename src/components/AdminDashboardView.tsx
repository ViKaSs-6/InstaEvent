import React, { useState, useEffect } from 'react';
import { User, Venue, Vendor, PendingListing } from '../types';
import { Shield, Check, X, Search, ShieldCheck, DollarSign, Users, Store, AlertCircle, FileText, CheckCircle2, Trash2, Eye, TrendingUp } from 'lucide-react';
import { apiFetchAdminStats, apiModerateListing, apiDeleteListing } from '../api';

interface AdminDashboardViewProps {
  currentUser: User;
  venues: Venue[];
  vendors: Vendor[];
  onApproveVenue?: (venue: Venue) => void;
  onApproveVendor?: (vendor: Vendor) => void;
  onRemoveVenue?: (venueId: string) => void;
  onRemoveVendor?: (vendorId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  venues,
  vendors,
  onApproveVenue,
  onApproveVendor,
  onRemoveVenue,
  onRemoveVendor,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'moderation' | 'users' | 'audit'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [stats, setStats] = useState<{
    totalUsers: number;
    customerCount: number;
    vendorCount: number;
    totalBookings: number;
    grossVolume: number;
    platformRevenue: number;
    pendingListingsCount: number;
    approvedListingsCount: number;
  }>({
    totalUsers: 4,
    customerCount: 2,
    vendorCount: 2,
    totalBookings: 1,
    grossVolume: 1520,
    platformRevenue: 76,
    pendingListingsCount: 1,
    approvedListingsCount: 6
  });

  // Fetch real admin stats from MongoDB backend
  useEffect(() => {
    async function loadStats() {
      const data = await apiFetchAdminStats();
      if (data) {
        setStats(data);
      }
    }
    loadStats();
  }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await apiModerateListing(id, status);
      setActionSuccess(`Listing ${status === 'approved' ? 'approved' : 'rejected'} successfully.`);
      setTimeout(() => setActionSuccess(''), 3000);
      const data = await apiFetchAdminStats();
      if (data) setStats(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-extrabold tracking-tight">Master Admin Dashboard</h1>
            <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-[10px] rounded-full uppercase">
              Global Analytics & Moderation
            </span>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Live analytics powered by MongoDB: track total users, customer/vendor breakdown, bookings processed, and platform revenue.
          </p>
        </div>

        {/* Dynamic Platform Revenue Tracker */}
        <div className="flex items-center space-x-3 shrink-0 text-center">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-indigo-200 uppercase font-bold block">Gross Volume</span>
            <span className="text-lg font-extrabold text-emerald-400">${stats.grossVolume.toLocaleString()}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-indigo-200 uppercase font-bold block">Platform Fee (5%)</span>
            <span className="text-lg font-extrabold text-amber-300">${stats.platformRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Registered Users</span>
            <h3 className="text-xl font-extrabold text-slate-900">{stats.totalUsers}</h3>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
              <span className="text-rose-600">{stats.customerCount} Customers</span> • <span className="text-amber-600">{stats.vendorCount} Vendors</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Bookings Processed</span>
            <h3 className="text-xl font-extrabold text-slate-900">{stats.totalBookings}</h3>
            <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">100% Verified Escrow</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Platform Revenue (5%)</span>
            <h3 className="text-xl font-extrabold text-amber-600">${stats.platformRevenue.toLocaleString()}</h3>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">5% fee on gross bookings</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Listings</span>
            <h3 className="text-xl font-extrabold text-slate-900">{venues.length + vendors.length}</h3>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Venues, Caterers, Photographers</p>
          </div>
        </div>

      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Platform Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'moderation'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Moderation & Listings ({venues.length + vendors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Role Management</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Platform Health & System Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider text-rose-600 block">Database Architecture</span>
              <p>Database: <strong>MongoDB (via Mongoose ORM)</strong></p>
              <p>Schemas: User, Listing, Booking, Message</p>
              <p>Authentication: JWT tokens with bcrypt password hashing</p>
              <p>Architecture: Express REST API proxying all client calls</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider text-amber-600 block">Platform Revenue Engine</span>
              <p>Platform Fee Structure: <strong>5% auto-calculated platform fee</strong> on every booked service base price.</p>
              <p>Current Gross Escrow: <strong>${stats.grossVolume.toLocaleString()}</strong></p>
              <p>Total Revenue Collected: <strong>${stats.platformRevenue.toLocaleString()}</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE LISTINGS MODERATION */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Platform Active Listings Catalog</h2>
              <p className="text-xs text-slate-500">Admin oversight for all published venues and vendor services.</p>
            </div>
            
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {venues
              .filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((v) => (
                <div key={v.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div className="flex space-x-3 mb-3">
                    <img src={v.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div>
                      <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded">Venue</span>
                      <h4 className="font-bold text-slate-900 text-xs mt-1">{v.name}</h4>
                      <p className="text-xs text-slate-500">${v.pricePerHour}/hr • {v.hostName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <span className="text-[10px] font-bold text-emerald-600">Approved</span>
                    {onRemoveVenue && (
                      <button
                        onClick={() => onRemoveVenue(v.id)}
                        className="text-xs text-rose-600 hover:underline flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

            {vendors
              .filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((v) => (
                <div key={v.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div className="flex space-x-3 mb-3">
                    <img src={v.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded">{v.category}</span>
                      <h4 className="font-bold text-slate-900 text-xs mt-1">{v.name}</h4>
                      <p className="text-xs text-slate-500">${v.hourlyRate}/hr</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <span className="text-[10px] font-bold text-emerald-600">Approved</span>
                    {onRemoveVendor && (
                      <button
                        onClick={() => onRemoveVendor(v.id)}
                        className="text-xs text-rose-600 hover:underline flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: USER ROLES */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Platform User RBAC Breakdown</h2>
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">Total Registered Customers</h4>
                <p className="text-slate-500">Event organizers, party hosts & corporate planners</p>
              </div>
              <span className="text-lg font-extrabold text-rose-600">{stats.customerCount}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">Total Service Providers (Vendors)</h4>
                <p className="text-slate-500">Venues, Caterers, Photographers, Decorators</p>
              </div>
              <span className="text-lg font-extrabold text-amber-600">{stats.vendorCount}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
