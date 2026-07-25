export type UserRole = 'Customer' | 'Vendor' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  bio?: string;
  businessName?: string;
  verified?: boolean;
}

export type NavTab = 
  | 'Home' 
  | 'Explore' 
  | 'Event Builder' 
  | 'Vendor Portal' 
  | 'Admin Dashboard' 
  | 'My Chats' 
  | 'Account';

export interface Venue {
  id: string;
  name: string;
  location: string;
  city: string;
  category: string;
  rating: number;
  reviewsCount: number;
  capacity: number;
  pricePerHour: number;
  images: string[];
  description: string;
  amenities: string[];
  superhost: boolean;
  instantBook: boolean;
  sqft: number;
  hostName: string;
  hostAvatar: string;
  status?: 'Approved' | 'Pending' | 'Rejected';
}

export interface Vendor {
  id: string;
  name: string;
  category: 'Catering' | 'Photography' | 'DJ & Music' | 'Florist' | 'Mixology' | 'Decor';
  rating: number;
  reviewsCount: number;
  priceRange: string;
  hourlyRate: number;
  image: string;
  bio: string;
  location: string;
  popularPackages: string[];
  status?: 'Approved' | 'Pending' | 'Rejected';
}

export interface Booking {
  id: string;
  venueName: string;
  venueImage: string;
  date: string;
  guests: number;
  totalAmount: number;
  status: 'Confirmed' | 'Pending' | 'Completed';
  vendorNames?: string[];
  referenceId?: string;
  paymentMethod?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'provider';
  text: string;
  timestamp: string;
  quoteOffer?: {
    originalPrice: number;
    discountedPrice: number;
    description: string;
    accepted?: boolean;
  };
}

export interface InboundInquiry {
  id: string;
  clientName: string;
  clientAvatar?: string;
  eventType: string;
  itemName: string;
  itemCategory: string;
  requestedDate: string;
  guests: number;
  offeredPrice: number;
  originalPrice: number;
  status: 'Pending' | 'Negotiating' | 'Accepted' | 'Declined';
  lastMessage: string;
  itemImage?: string;
  messages?: ChatMessage[];
}

export interface PendingListing {
  id: string;
  type: 'Venue' | 'Vendor';
  title: string;
  category: string;
  hostName: string;
  price: number;
  location: string;
  image: string;
  description: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
}
