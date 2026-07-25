import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  customerId?: mongoose.Types.ObjectId | string;
  listingId?: mongoose.Types.ObjectId | string;
  vendorId?: mongoose.Types.ObjectId | string;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  basePrice: number;
  platformFee: number; // dynamically calculated as 5% of basePrice
  totalBilled: number; // basePrice + platformFee
  venueName: string;
  venueImage?: string;
  guests: number;
  vendorNames?: string[];
  referenceId: string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  customerId: { type: Schema.Types.Mixed },
  listingId: { type: Schema.Types.Mixed },
  vendorId: { type: Schema.Types.Mixed },
  bookingDate: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
  basePrice: { type: Number, required: true },
  platformFee: { type: Number, required: true },
  totalBilled: { type: Number, required: true },
  venueName: { type: String, required: true },
  venueImage: { type: String },
  guests: { type: Number, default: 50 },
  vendorNames: { type: [String], default: [] },
  referenceId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
