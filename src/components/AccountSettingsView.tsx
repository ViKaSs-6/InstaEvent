import React, { useState } from 'react';
import { User, Booking } from '../types';
import { User as UserIcon, Calendar, ShieldCheck, Lock, Bell, Check, CreditCard, Download, FileText, Phone, Mail, Sparkles, Building, KeyRound, Eye, Shield } from 'lucide-react';

interface AccountSettingsViewProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  bookings: Booking[];
}

export const AccountSettingsView: React.FC<AccountSettingsViewProps> = ({
  currentUser,
  onUpdateUser,
  bookings,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'security'>('profile');

  // Form State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+1 (555) 234-5678');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [businessName, setBusinessName] = useState(currentUser.businessName || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Security state
  const [twoFactor, setTwoFactor] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name,
      email,
      phone,
      bio,
      businessName: currentUser.role === 'Vendor' ? businessName : undefined
    });
    setSaveSuccess('Account profile updated successfully!');
    setTimeout(() => setSaveSuccess(''), 2500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setPasswordSuccess('Password updated securely!');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(''), 2500);
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-slate-100 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{currentUser.name}</h1>
              <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                currentUser.role === 'Admin' 
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                  : currentUser.role === 'Vendor' 
                  ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}>
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{currentUser.email} • Member since 2026</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Bookings</span>
            <span className="text-base font-extrabold text-slate-900">{bookings.length} Events</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Verification</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center justify-center space-x-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified</span>
            </span>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile & Account Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'bookings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Previous Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'security'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy & Security Rules</span>
        </button>
      </div>

      {/* TAB 1: PROFILE & ACCOUNT SETTINGS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 max-w-3xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Personal Account Details</h2>
              <p className="text-xs text-slate-500">Update your primary contact information and host notification preferences.</p>
            </div>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{saveSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium"
                />
              </div>

              {currentUser.role === 'Vendor' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bio / Host Overview</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* Notification preferences */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Communication Preferences</h3>
              
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs cursor-pointer">
                <span className="font-semibold text-slate-800">Receive SMS notifications for instant booking updates</span>
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs cursor-pointer">
                <span className="font-semibold text-slate-800">Receive email quotes & host chat messages</span>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: PREVIOUS BOOKINGS HISTORY */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Your Reservation History</h2>
              <p className="text-xs text-slate-500">Track current venue bookings, bundle reservations, and payment receipts.</p>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full">
              {bookings.length} Total Record(s)
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold">No previous bookings found</p>
              <p className="mt-1">Head over to the Explore page or Event Builder to make your first reservation.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={booking.venueImage}
                      alt={booking.venueName}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-slate-900 text-sm">{booking.venueName}</h4>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded">
                          {booking.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-slate-500">
                        <span>Date: <strong className="text-slate-800">{booking.date}</strong></span>
                        <span>•</span>
                        <span>Guests: <strong className="text-slate-800">{booking.guests}</strong></span>
                        <span>•</span>
                        <span>Ref ID: <strong className="font-mono text-slate-700">{booking.referenceId || 'IE-992101'}</strong></span>
                      </div>

                      {booking.vendorNames && booking.vendorNames.length > 0 && (
                        <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/60 inline-block">
                          Bundled Services: {booking.vendorNames.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end space-x-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Paid</span>
                      <span className="text-base font-extrabold text-rose-600">${booking.totalAmount}</span>
                    </div>

                    <button
                      onClick={() => alert(`Official Invoice & Tax Receipt for Booking ${booking.referenceId || 'IE-992101'} has been sent to ${currentUser.email}.`)}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-xs flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRIVACY & SECURITY RULES */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Security Controls */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Security Credentials & Authentication</h2>
              <p className="text-xs text-slate-500">Manage password credentials and multi-factor authentication locks.</p>
            </div>

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Update Security Password
              </button>
            </form>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Multi-Factor Security</h3>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-slate-500">Require an SMS or authenticator code when signing into new browsers.</p>
                </div>
                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                    twoFactor ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {twoFactor ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Platform Rules & Escrow Rules */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="font-extrabold text-sm tracking-tight text-white">Escrow & Privacy Guarantee</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Insta Events operates strict trust and safety policies to protect both hosts and event organizers:
            </p>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>100% Escrow Protection:</strong> Funds are held securely until 24 hours after event completion.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Verified Provider Inspection:</strong> All hosts and vendors must pass identity checks.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Zero Hidden Fees:</strong> Complete transparency on venue cleaning, sound equipment, and service fees.</span>
              </li>
            </ul>
          </div>

        </div>
      )}

    </div>
  );
};
