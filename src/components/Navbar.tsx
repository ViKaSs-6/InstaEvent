import React, { useState } from 'react';
import { NavTab, User } from '../types';
import { Sparkles, Calendar, Heart, PlusCircle, User as UserIcon, Menu, X, Check, MessageSquare, Shield, Store, LogOut, Settings, UserCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentUser: User;
  favoritesCount: number;
  bookingsCount: number;
  unreadChatsCount?: number;
  onOpenBookings: () => void;
  onOpenHostModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  favoritesCount,
  bookingsCount,
  unreadChatsCount = 1,
  onOpenBookings,
  onOpenHostModal,
  onOpenAuthModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Dynamic Navigation items based on Role
  const navItems: NavTab[] = ['Home', 'Explore', 'Event Builder'];
  
  if (currentUser.role === 'Vendor' || currentUser.role === 'Admin') {
    navItems.push('Vendor Portal');
  }
  
  if (currentUser.role === 'Admin') {
    navItems.push('Admin Dashboard');
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('Home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-xl text-slate-900 tracking-tight">Insta Events</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-600 rounded-md border border-rose-100 uppercase tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Extraordinary Venues & Creators</p>
          </div>
        </div>

        {/* Navigation Tabs - Desktop */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60">
          {navItems.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                id={`nav-tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* List Space / Host */}
          <button
            onClick={onOpenHostModal}
            className="hidden lg:flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-rose-600 hover:bg-rose-50/80 px-3 py-2 rounded-full border border-slate-200 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-rose-500" />
            <span>List Space</span>
          </button>

          {/* Dedicated 'My Chats' Button */}
          <button
            onClick={() => setActiveTab('My Chats')}
            className={`relative p-2.5 rounded-full transition-colors ${
              activeTab === 'My Chats'
                ? 'bg-rose-50 text-rose-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="My Direct Messages"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadChatsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadChatsCount}
              </span>
            )}
          </button>

          {/* Bookings Drawer Launcher */}
          <button
            onClick={onOpenBookings}
            className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
            title="My Bookings"
          >
            <Calendar className="w-5 h-5" />
            {bookingsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {bookingsCount}
              </span>
            )}
          </button>

          {/* Favorites Indicator */}
          <div 
            className="relative p-2.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer hidden sm:block" 
            onClick={() => setActiveTab('Explore')}
          >
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </div>

          {/* User Profile Menu Button & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-2 p-1 pl-2.5 border border-slate-200 rounded-full hover:shadow-md transition-shadow bg-white"
            >
              <Menu className="w-4 h-4 text-slate-500" />
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                
                {/* User Header Info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="font-bold text-xs text-slate-900 truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  <div className="mt-1.5 flex items-center space-x-1.5">
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                      currentUser.role === 'Admin' ? 'bg-indigo-100 text-indigo-800' : currentUser.role === 'Vendor' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {currentUser.role} Account
                    </span>
                  </div>
                </div>

                {/* Dropdown Links */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('Account');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Account Profile & Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('My Chats');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium flex items-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span>My Chats & Vendor Quotes</span>
                  </button>

                  {currentUser.role === 'Vendor' && (
                    <button
                      onClick={() => {
                        setActiveTab('Vendor Portal');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium flex items-center space-x-2"
                    >
                      <Store className="w-4 h-4 text-amber-500" />
                      <span>Vendor Portal Dashboard</span>
                    </button>
                  )}

                  {currentUser.role === 'Admin' && (
                    <button
                      onClick={() => {
                        setActiveTab('Admin Dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium flex items-center space-x-2"
                    >
                      <Shield className="w-4 h-4 text-indigo-500" />
                      <span>Admin Oversight Dashboard</span>
                    </button>
                  )}
                </div>

                {/* Switch Role / Sign Out */}
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenAuthModal();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-bold flex items-center space-x-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Switch Role / Sign Out</span>
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navItems.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between ${
                activeTab === tab ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{tab}</span>
              {activeTab === tab && <Check className="w-4 h-4 text-rose-600" />}
            </button>
          ))}

          <button
            onClick={() => {
              setActiveTab('My Chats');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between text-slate-700 hover:bg-slate-50"
          >
            <span>My Chats</span>
            <MessageSquare className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => {
              setActiveTab('Account');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between text-slate-700 hover:bg-slate-50"
          >
            <span>Account Profile & Settings</span>
            <Settings className="w-4 h-4 text-slate-400" />
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            <button
              onClick={() => {
                onOpenAuthModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl"
            >
              <UserCheck className="w-4 h-4 text-rose-400" />
              <span>Switch Role / Account ({currentUser.role})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
