import React, { useState } from 'react';
import { User, Venue, Vendor, ChatMessage } from '../types';
import { MessageSquare, Send, Sparkles, Check, Search, ShieldCheck, Clock, User as UserIcon, ArrowRight, CornerDownLeft } from 'lucide-react';
import { apiSendMessage } from '../api';

export interface ChatThread {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  itemName: string;
  itemImage: string;
  itemType: 'Venue' | 'Vendor';
  hourlyRate: number;
  lastUpdated: string;
  unread: boolean;
  messages: ChatMessage[];
}

interface MessagesHubViewProps {
  currentUser: User;
  venues: Venue[];
  vendors: Vendor[];
  threads: ChatThread[];
  onDirectCheckout: (item: Venue | Vendor, customPrice?: number) => void;
}

export const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'th_1',
    partnerName: 'Elena Rostova (Host)',
    partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    itemName: 'The Skyline Glass Penthouse',
    itemImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    itemType: 'Venue',
    hourlyRate: 350,
    lastUpdated: '10:42 AM',
    unread: true,
    messages: [
      {
        id: 'm101',
        sender: 'provider',
        text: 'Hello! Thanks for inquiring about The Skyline Glass Penthouse. We have availability for your weekend date.',
        timestamp: '10:30 AM'
      },
      {
        id: 'm102',
        sender: 'customer',
        text: 'Hi Elena! Can you offer a 15% discount for an 8-hour booking for 80 guests?',
        timestamp: '10:35 AM'
      },
      {
        id: 'm103',
        sender: 'provider',
        text: 'I would love to host your event! I can grant you a special direct booking discount rate of $297/hr (reduced from $350/hr).',
        timestamp: '10:42 AM',
        quoteOffer: {
          originalPrice: 350,
          discountedPrice: 297,
          description: '15% Direct Booking Discount for 8-Hour Penthouse Reservation',
          accepted: false
        }
      }
    ]
  },
  {
    id: 'th_2',
    partnerName: 'Artisan Feast Culinary',
    partnerAvatar: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    itemName: 'Artisan Feast Culinary Group',
    itemImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    itemType: 'Vendor',
    hourlyRate: 85,
    lastUpdated: 'Yesterday',
    unread: false,
    messages: [
      {
        id: 'm201',
        sender: 'provider',
        text: 'Greetings! Our executive chef has curated seasonal tasting menus for corporate & private receptions.',
        timestamp: 'Yesterday'
      },
      {
        id: 'm202',
        sender: 'customer',
        text: 'Do you accommodate vegan and gluten-free dietary options for cocktail receptions?',
        timestamp: 'Yesterday'
      },
      {
        id: 'm203',
        sender: 'provider',
        text: 'Absolutely! 40% of our small plates are plant-based and allergen friendly. Let us know if you want custom wine pairings!',
        timestamp: 'Yesterday'
      }
    ]
  },
  {
    id: 'th_3',
    partnerName: 'Lumina Cinema & Photo',
    partnerAvatar: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    itemName: 'Lumina Cinema & Photography',
    itemImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    itemType: 'Vendor',
    hourlyRate: 250,
    lastUpdated: 'Jul 22',
    unread: false,
    messages: [
      {
        id: 'm301',
        sender: 'provider',
        text: 'Hi there! We include 4K drone cinematography in all 6+ hour photography packages.',
        timestamp: 'Jul 22'
      }
    ]
  }
];

export const MessagesHubView: React.FC<MessagesHubViewProps> = ({
  currentUser,
  venues,
  vendors,
  threads,
  onDirectCheckout,
}) => {
  const [activeThreadId, setActiveThreadId] = useState<string>('th_1');
  const [searchFilter, setSearchFilter] = useState('');
  const [inputText, setInputText] = useState('');

  const displayThreads = threads && threads.length > 0 ? threads : INITIAL_THREADS;
  const activeThread = displayThreads.find((t) => t.id === activeThreadId) || displayThreads[0];

  const filteredThreads = displayThreads.filter(
    (t) =>
      t.partnerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.itemName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeThread) return;

    const userMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: currentUser.role === 'Vendor' ? 'provider' : 'customer',
      text,
      timestamp: 'Just now'
    };

    const updatedThread: ChatThread = {
      ...activeThread,
      lastUpdated: 'Just now',
      unread: false,
      messages: [...activeThread.messages, userMsg]
    };

    // Save directly to MongoDB Express API
    try {
      await apiSendMessage({ threadId: activeThread.id, text });
    } catch (err) {
      console.error(err);
    }

    if (!textToSend) setInputText('');

    // Simulate Provider Automated Response
    setTimeout(async () => {
      if (currentUser.role !== 'Vendor') {
        const isDiscountRequest = text.toLowerCase().includes('discount') || text.toLowerCase().includes('rate') || text.toLowerCase().includes('price');
        const discountedPrice = Math.round(activeThread.hourlyRate * 0.88);

        const replyText = isDiscountRequest
          ? `Thank you for reaching out! We can issue a custom quote of $${discountedPrice}/hr for your requested date.`
          : `Thanks for your message! Our team has updated your event notes.`;

        const quoteOffer = isDiscountRequest ? {
          originalPrice: activeThread.hourlyRate,
          discountedPrice,
          description: `Custom direct message quote for ${activeThread.itemName}`,
          accepted: false
        } : undefined;

        try {
          await apiSendMessage({
            threadId: activeThread.id,
            text: replyText,
            senderRole: 'provider',
            quoteOffer
          });
        } catch (err) {
          console.error(err);
        }
      }
    }, 1200);
  };

  const handleAcceptQuoteInThread = async (msgId: string, customRate: number) => {
    if (!activeThread) return;

    // Find venue or vendor item object to launch checkout
    const matchingVenue = venues.find((v) => v.name === activeThread.itemName);
    const matchingVendor = vendors.find((v) => v.name === activeThread.itemName);
    const item = matchingVenue || matchingVendor || venues[0];

    onDirectCheckout(item, customRate);
  };

  return (
    <div className="py-6 max-w-6xl mx-auto space-y-4">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Messages Hub & Vendor Inquiries</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage live chats, price negotiations, and custom host quotes synced in Firestore.</p>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        
        {/* LEFT COLUMN: Thread List (4 Cols) */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/60">
          
          {/* Search Box */}
          <div className="p-3.5 border-b border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search hosts or listings..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredThreads.map((th) => {
              const isActive = activeThread && th.id === activeThread.id;
              const lastMsg = th.messages[th.messages.length - 1];

              return (
                <button
                  key={th.id}
                  onClick={() => {
                    setActiveThreadId(th.id);
                  }}
                  className={`w-full p-4 text-left flex items-start space-x-3 transition-colors ${
                    isActive ? 'bg-white border-l-4 border-l-rose-600 shadow-xs' : 'hover:bg-slate-100/80'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={th.partnerAvatar}
                      alt={th.partnerName}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                    {th.unread && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{th.partnerName}</h4>
                      <span className="text-[10px] text-slate-400">{th.lastUpdated}</span>
                    </div>

                    <p className="text-[11px] font-semibold text-rose-600 truncate">{th.itemName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{lastMsg ? lastMsg.text : 'No messages yet'}</p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: Active Chat Window (8 Cols) */}
        {activeThread ? (
          <div className="md:col-span-8 flex flex-col h-full bg-white">
            
            {/* Thread Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <img
                  src={activeThread.partnerAvatar}
                  alt={activeThread.partnerName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-rose-500"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-white">{activeThread.partnerName}</h3>
                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-extrabold uppercase rounded border border-rose-500/30">
                      Direct Partner
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{activeThread.itemName} • ${activeThread.hourlyRate}/hr</p>
                </div>
              </div>

              <button
                onClick={() => {
                  const item = venues.find(v => v.name === activeThread.itemName) || vendors.find(v => v.name === activeThread.itemName) || venues[0];
                  onDirectCheckout(item, activeThread.hourlyRate);
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1"
              >
                <span>Book This Space</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chat History Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40 min-h-[380px]">
              {activeThread.messages.map((msg) => {
                const isMe = currentUser.role === 'Vendor' ? msg.sender === 'provider' : msg.sender === 'customer';
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-rose-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {msg.quoteOffer && (
                        <div className="mt-3 p-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px]">Official Custom Quote</span>
                            <span className="text-[10px] text-emerald-400 font-semibold">Special Rate</span>
                          </div>
                          <p className="text-slate-300 text-[11px] mb-2">{msg.quoteOffer.description}</p>
                          
                          <div className="flex items-baseline space-x-2 mb-3">
                            <span className="text-lg font-extrabold text-white">${msg.quoteOffer.discountedPrice}/hr</span>
                            <span className="text-xs text-slate-400 line-through">${msg.quoteOffer.originalPrice}/hr</span>
                          </div>

                          {!msg.quoteOffer.accepted ? (
                            <button
                              onClick={() => handleAcceptQuoteInThread(msg.id, msg.quoteOffer!.discountedPrice)}
                              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center space-x-1 shadow-sm transition-all"
                            >
                              <Check className="w-4 h-4" />
                              <span>Accept Offer & Proceed to Checkout</span>
                            </button>
                          ) : (
                            <div className="p-2 bg-emerald-950/60 text-emerald-400 text-center font-bold text-xs rounded-lg border border-emerald-800">
                              Quote Accepted & Confirmed
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                );
              })}
            </div>

            {/* Input Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message or negotiate terms..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          <div className="md:col-span-8 flex items-center justify-center text-slate-400 text-xs p-12">
            Select a conversation thread on the left to start chatting.
          </div>
        )}

      </div>
    </div>
  );
};
