import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Sparkles, Shield, Store, ArrowRight, Lock, Mail, User as UserIcon, Building2, AlertCircle } from 'lucide-react';
import { apiLogin, apiRegister } from '../api';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSelectUser: (user: User) => void;
}

export const PRESET_USERS: User[] = [
  {
    id: 'usr_customer_1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'Customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (555) 234-5678',
    bio: 'Event organizer & birthday host planning bespoke celebrations across NYC & LA.'
  },
  {
    id: 'usr_vendor_1',
    name: 'Elena Rostova',
    email: 'elena@skylinepenthouse.com',
    role: 'Vendor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    businessName: 'The Skyline Glass Penthouse & Hospitality',
    phone: '+1 (555) 987-6543',
    bio: 'Verified host managing top-rated rooftop spaces and private catering partnerships in SoHo.',
    verified: true
  },
  {
    id: 'usr_admin_1',
    name: 'Sarah Jenkins',
    email: 'admin@instaevents.com',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (555) 000-1122',
    bio: 'Master Platform Administrator for Insta Events trust, safety, and listing verification.',
    verified: true
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'demo' | 'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Customer');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (mode === 'signup') {
        const user = await apiRegister(name, email, password, selectedRole, businessName);
        onSelectUser(user);
      } else {
        const user = await apiLogin(email, password);
        onSelectUser(user);
      }
      if (onClose) onClose();
    } catch (err: any) {
      console.error('Auth Submit Error:', err);
      setErrorMessage(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = async (preset: User) => {
    setLoading(true);
    setErrorMessage('');
    try {
      // Try logging in with preset credentials or register if first time
      try {
        const loggedInUser = await apiLogin(preset.email, 'password123');
        onSelectUser(loggedInUser);
      } catch (loginErr) {
        const regUser = await apiRegister(preset.name, preset.email, 'password123', preset.role, preset.businessName);
        onSelectUser(regUser);
      }
      if (onClose) onClose();
    } catch (err: any) {
      // Fallback
      onSelectUser(preset);
      if (onClose) onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Top Header */}
        <div className="p-6 bg-slate-900 text-white text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">InstaEvent Authentication</h2>
          <p className="text-xs text-slate-300 mt-1">Native JWT & Role-Based Access Control powered by Express + MongoDB</p>
        </div>

        {/* Tab Switcher: Sign In vs Register vs Quick Demo */}
        <div className="flex border-b border-slate-200 bg-slate-50 font-bold text-xs">
          <button
            onClick={() => { setMode('signin'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-center transition-colors ${
              mode === 'signin' ? 'bg-white text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-center transition-colors ${
              mode === 'signup' ? 'bg-white text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => { setMode('demo'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-center transition-colors ${
              mode === 'demo' ? 'bg-white text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Quick Role Demo
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode !== 'demo' && (
            <form onSubmit={handleEmailAuthSubmit} className="space-y-3.5">
              
              {/* Role Selection when Sign Up */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Select Account Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { role: 'Customer' as UserRole, label: 'Customer', icon: UserIcon },
                      { role: 'Vendor' as UserRole, label: 'Service Provider', icon: Store },
                      { role: 'Admin' as UserRole, label: 'Admin', icon: Shield }
                    ].map((r) => {
                      const Icon = r.icon;
                      const isSelected = selectedRole === r.role;
                      return (
                        <button
                          key={r.role}
                          type="button"
                          onClick={() => setSelectedRole(r.role)}
                          className={`p-2 rounded-xl border text-[11px] font-bold flex items-center justify-center space-x-1 transition-all ${
                            isSelected
                              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{r.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Name field if Sign Up */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. jordan@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Business Name if Vendor & Sign Up */}
              {mode === 'signup' && selectedRole === 'Vendor' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business / Brand Name</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. SoHo Hospitality Group"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all mt-2 disabled:opacity-60"
              >
                {loading ? 'Processing JWT Auth...' : mode === 'signup' ? `Register ${selectedRole} Account` : 'Sign In'}
              </button>
            </form>
          )}

          {mode === 'demo' && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block text-center mb-1">
                Choose a pre-seeded account profile to test RBAC features
              </span>

              {/* Persona 1: Customer */}
              <button
                onClick={() => handlePresetSelect(PRESET_USERS[0])}
                className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50/50 transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center space-x-3">
                  <img src={PRESET_USERS[0].avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 text-xs">{PRESET_USERS[0].name}</h4>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-extrabold text-[10px] rounded uppercase">
                        Customer
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Explore spaces, bundle events & place bookings</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all shrink-0" />
              </button>

              {/* Persona 2: Vendor */}
              <button
                onClick={() => handlePresetSelect(PRESET_USERS[1])}
                className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center space-x-3">
                  <img src={PRESET_USERS[1].avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 text-xs">{PRESET_USERS[1].name}</h4>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-extrabold text-[10px] rounded uppercase">
                        Service Provider (Vendor)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Manage listings, answer inquiries & track payouts</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all shrink-0" />
              </button>

              {/* Persona 3: Admin */}
              <button
                onClick={() => handlePresetSelect(PRESET_USERS[2])}
                className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center space-x-3">
                  <img src={PRESET_USERS[2].avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 text-xs">{PRESET_USERS[2].name}</h4>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-extrabold text-[10px] rounded uppercase">
                        Master Admin
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Approve vendor listings, track 5% revenue & audit users</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
