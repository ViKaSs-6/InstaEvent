import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  senderId?: mongoose.Types.ObjectId | string;
  receiverId?: mongoose.Types.ObjectId | string;
  listingId?: mongoose.Types.ObjectId | string;
  threadId: string;
  senderRole: 'customer' | 'provider';
  text: string;
  quoteOffer?: {
    originalPrice: number;
    discountedPrice: number;
    description: string;
    accepted?: boolean;
  };
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
  listingId: { type: Schema.Types.ObjectId, ref: 'Listing' },
  threadId: { type: String, required: true },
  senderRole: { type: String, enum: ['customer', 'provider'], required: true },
  text: { type: String, required: true },
  quoteOffer: {
    originalPrice: { type: Number },
    discountedPrice: { type: Number },
    description: { type: String },
    accepted: { type: Boolean }
  },
  timestamp: { type: Date, default: Date.now }
});

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
