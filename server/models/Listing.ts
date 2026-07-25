import mongoose, { Schema, Document } from 'mongoose';

export interface IListing extends Document {
  vendorId?: mongoose.Types.ObjectId | string;
  title: string;
  category: 'Venue' | 'Caterer' | 'Photographer' | 'Decorator' | string;
  description: string;
  price: number; // hourly rate or base package price
  images: string[];
  amenities: string[];
  availability: boolean;
  status: 'pending' | 'approved' | 'rejected';
  location: string;
  city?: string;
  capacity?: number;
  sqft?: number;
  rating?: number;
  reviewsCount?: number;
  hostName?: string;
  hostAvatar?: string;
  superhost?: boolean;
  instantBook?: boolean;
  createdAt: Date;
}

const ListingSchema = new Schema<IListing>({
  vendorId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String], default: [] },
  amenities: { type: [String], default: [] },
  availability: { type: Boolean, default: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  location: { type: String, default: 'New York, NY' },
  city: { type: String, default: 'New York' },
  capacity: { type: Number, default: 100 },
  sqft: { type: Number, default: 2000 },
  rating: { type: Number, default: 4.9 },
  reviewsCount: { type: Number, default: 12 },
  hostName: { type: String, default: 'Verified Host' },
  hostAvatar: { type: String, default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  superhost: { type: Boolean, default: true },
  instantBook: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const Listing = mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);
