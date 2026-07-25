import React, { useState, useEffect, useRef } from 'react';
import { Venue, Vendor, ChatMessage } from '../types';
import { X, Send, Sparkles, ShieldCheck, Check, DollarSign, MessageSquare, Clock, ArrowRight, CornerDownLeft } from 'lucide-react';

interface NegotiationChatModalProps {
  isOpen: boolean;
  item: Venue | Vendor | null;
  onClose: () => void;
  onDirectCheckout: (item: Venue | Vendor, customPrice?: number) => void;
}

export const NegotiationChatModal: React.FC<NegotiationChatModalProps> = ({
  isOpen,
  item,
  onClose,
  onDirectCheckout,
}) => {
  if (!isOpen || !item) return null;

  const isVenue = 'pricePerHour' in item;
  const name = item.name;
  const originalPrice = isVenue ? (item as Venue).pricePerHour : (item as Vendor).hourlyRate;
  const hostName = isVenue ? (item as Venue).hostName : item.name;
  const hostAvatar = isVenue 
    ? (item as Venue).hostAvatar 
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'provider',
      text: `Hello! Thanks for inquiring about ${name}. I am online and happy to answer questions or negotiate custom rates for multi-hour bookings.`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const presetQuestions = [
    "Can you offer a 15% discount for an 8-hour event?",
    "Do you permit outside catering and mixology?",
    "Is sound breakdown time included in hourly rate?",
    "What is your refund policy for rainy days?"
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: 'customer',
      text,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Simulate Provider Reply with Alibaba-style Negotiation Offer
    setTimeout(() => {
      setIsTyping(false);
      const isDiscountRequest = text.toLowerCase().includes('discount') || text.toLowerCase().includes('rate') || text.toLowerCase().includes('price') || text.toLowerCase().includes('15%');
      
      let replyMsg: ChatMessage;

      if (isDiscountRequest) {
        const discountedRate = Math.round(originalPrice * 0.85);
        replyMsg = {
          id: `m_reply_${Date.now()}`,
          sender: 'provider',
          text: `I would love to host your event! I can grant you a special direct booking discount rate of $${discountedRate}/hr (reduced from $${originalPrice}/hr) if confirmed today.`,
          timestamp: 'Just now',
          quoteOffer: {
            originalPrice,
            discountedPrice: discountedRate,
            description: `Exclusive 15% Negotiation Discount for ${name}`,
            accepted: false
          }
        };
      } else {
        replyMsg = {
          id: `m_reply_${Date.now()}`,
          sender: 'provider',
          text: `Great question! Yes, we accommodate flexible setups for ${name}. Let me know your estimated guest count or preferred date so I can send an official quote!`,
          timestamp: 'Just now'
        };
      }

      setMessages((prev) => [...prev, replyMsg]);
    }, 1200);
  };

  const handleAcceptQuote = (msgId: string, customRate: number) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.quoteOffer
          ? { ...m, quoteOffer: { ...m.quoteOffer, accepted: true } }
          : m
      )
    );
    onDirectCheckout(item, customRate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={hostAvatar}
                alt={hostName}
                className="w-10 h-10 rounded-full object-cover border-2 border-rose-500"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-white">{hostName}</h3>
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-extrabold uppercase rounded border border-rose-500/30">
                  Verified Host
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate max-w-xs">{name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Negotiation Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/80 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">
              Alibaba-style Direct Negotiation Channel • Standard Rate: <strong className="font-extrabold">${originalPrice}/hr</strong>
            </span>
          </div>
          <span className="text-[10px] bg-amber-200/60 font-bold px-2 py-0.5 rounded text-amber-900">
            Escrow Protected
          </span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isMe = msg.sender === 'customer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-xs text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-rose-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Special Quote Offer Box */}
                  {msg.quoteOffer && (
                    <div className="mt-3 p-3 bg-slate-900 text-white rounded-xl border border-slate-800 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px]">Official Custom Quote</span>
                        <span className="text-[10px] text-emerald-400 font-semibold">Save 15% Off</span>
                      </div>
                      <p className="text-slate-300 text-[11px] mb-2">{msg.quoteOffer.description}</p>
                      
                      <div className="flex items-baseline space-x-2 mb-3">
                        <span className="text-xl font-extrabold text-white">${msg.quoteOffer.discountedPrice}/hr</span>
                        <span className="text-xs text-slate-400 line-through">${msg.quoteOffer.originalPrice}/hr</span>
                      </div>

                      <button
                        onClick={() => handleAcceptQuote(msg.id, msg.quoteOffer!.discountedPrice)}
                        className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-lg flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept Custom Quote & Book Now</span>
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs bg-white px-3 py-2 rounded-xl border border-slate-200/80 w-max">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse delay-100" />
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse delay-200" />
              <span className="text-[11px] text-slate-500 ml-1">{hostName} is drafting a response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 bg-white border-t border-slate-200/60 overflow-x-auto flex space-x-2 scrollbar-none">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
            >
              "{q}"
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your question or counter offer..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />

          <button
            onClick={() => handleSendMessage()}
            className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
