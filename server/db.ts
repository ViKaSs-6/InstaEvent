import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/User';
import { Listing } from './models/Listing';
import { Booking } from './models/Booking';
import { Message } from './models/Message';

export async function connectToDatabase() {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.log('No MONGODB_URI found in environment. Initializing MongoMemoryServer...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log(`In-memory MongoDB instance active at: ${mongoUri}`);
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
      console.log('Successfully connected to MongoDB via Mongoose.');
      await seedDatabaseIfEmpty();
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB database:', err);
  }
}

async function seedDatabaseIfEmpty() {
  try {
    // 1. Seed Users
    const userCount = await (User as any).countDocuments();
    let defaultCustomer, defaultVendor, defaultAdmin;

    if (userCount === 0) {
      console.log('Seeding initial users into MongoDB...');
      const defaultPassword = await bcrypt.hash('password123', 10);

      defaultCustomer = await User.create({
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        passwordHash: defaultPassword,
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        phone: '+1 (555) 234-5678',
        bio: 'Event organizer & birthday host planning bespoke celebrations across NYC & LA.'
      });

      defaultVendor = await User.create({
        name: 'Elena Rostova',
        email: 'elena@skylinepenthouse.com',
        passwordHash: defaultPassword,
        role: 'vendor',
        businessName: 'The Skyline Glass Penthouse & Hospitality',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        verified: true,
        phone: '+1 (555) 987-6543',
        bio: 'Verified host managing top-rated rooftop spaces and private catering partnerships in SoHo.'
      });

      defaultAdmin = await User.create({
        name: 'Sarah Jenkins',
        email: 'admin@instaevents.com',
        passwordHash: defaultPassword,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        verified: true,
        phone: '+1 (555) 000-1122',
        bio: 'Master Platform Administrator for Insta Events trust, safety, and listing verification.'
      });
    } else {
      defaultCustomer = await (User as any).findOne({ role: 'customer' });
      defaultVendor = await (User as any).findOne({ role: 'vendor' });
      defaultAdmin = await (User as any).findOne({ role: 'admin' });
    }

    // 2. Seed Listings
    const listingCount = await Listing.countDocuments();
    if (listingCount === 0) {
      console.log('Seeding initial listings into MongoDB...');
      await Listing.create([
        {
          vendorId: defaultVendor?._id,
          title: 'The Skyline Glass Penthouse',
          category: 'Venue',
          description: 'A breathtaking 4,000 sq ft glass terrace overlooking Manhattan skyline. Perfect for high-end cocktail parties, product launches, and intimate wedding receptions.',
          price: 350,
          images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
          ],
          amenities: ['Full Bar Area', 'Pro Sound System', 'Elevator Access', 'High-Speed WiFi', 'Dimmable Lighting', 'Kitchen Access'],
          availability: true,
          status: 'approved',
          location: 'SoHo, New York, NY',
          city: 'New York',
          capacity: 120,
          sqft: 4000,
          rating: 4.96,
          reviewsCount: 128,
          hostName: 'Elena Rostova',
          hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          superhost: true,
          instantBook: true
        },
        {
          vendorId: defaultVendor?._id,
          title: 'Malibu Oceanfront Villa Estate',
          category: 'Venue',
          description: 'Panoramic Pacific Ocean views with expansive infinity pool deck, lush private lawns, and direct beach access. Ideal for luxury galas and milestone celebrations.',
          price: 500,
          images: [
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80'
          ],
          amenities: ['Infinity Pool', 'Valet Parking Area', 'Private Beach Path', 'Outdoor Lounge', 'Catering Kitchen', 'Fire Pit'],
          availability: true,
          status: 'approved',
          location: 'Malibu, Los Angeles, CA',
          city: 'Los Angeles',
          capacity: 200,
          sqft: 7500,
          rating: 4.98,
          reviewsCount: 94,
          hostName: 'Marcus Vance',
          hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          superhost: true,
          instantBook: false
        },
        {
          vendorId: defaultVendor?._id,
          title: 'The Brickwork Loft & Creative Warehouse',
          category: 'Venue',
          description: 'Industrial chic warehouse with exposed brick walls, 20ft timber ceilings, customizable LED rig, and drive-in loading bay.',
          price: 220,
          images: [
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'
          ],
          amenities: ['Freight Elevator', 'Drive-in Loading', 'Stage Platform', 'Acoustic Panels', 'Green Room', 'Modular Furniture'],
          availability: true,
          status: 'approved',
          location: 'Arts District, Los Angeles, CA',
          city: 'Los Angeles',
          capacity: 150,
          sqft: 3200,
          rating: 4.89,
          reviewsCount: 76,
          hostName: 'Devon Hayes',
          hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          superhost: false,
          instantBook: true
        },
        {
          vendorId: defaultVendor?._id,
          title: 'Serenity Secret Botanical Garden',
          category: 'Venue',
          description: 'Tropical paradise featuring rare orchids, stone fountains, fairy-lit weeping banyan trees, and an open-air glass pavilion.',
          price: 280,
          images: [
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80'
          ],
          amenities: ['Glass Pavilion', 'Outdoor Lighting', 'Valet Friendly', 'Restroom Suites'],
          availability: true,
          status: 'approved',
          location: 'Coral Gables, Miami, FL',
          city: 'Miami',
          capacity: 250,
          sqft: 12000,
          rating: 4.95,
          reviewsCount: 112,
          hostName: 'Sofia Delgado',
          hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
          superhost: true,
          instantBook: true
        },
        {
          vendorId: defaultVendor?._id,
          title: 'Artisan Feast Culinary Group',
          category: 'Caterer',
          description: 'Farm-to-table gourmet small plates, raw bars, and interactive live cooking stations tailored for modern events.',
          price: 85,
          images: [
            'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80'
          ],
          amenities: ['Plated 5-Course Tasting', 'Cocktail Tapas & Caviar', 'Live Woodfire Grill Station'],
          availability: true,
          status: 'approved',
          location: 'New York & Tri-State',
          city: 'New York',
          rating: 4.97,
          reviewsCount: 142
        },
        {
          vendorId: defaultVendor?._id,
          title: 'Lumina Cinema & Photography',
          category: 'Photographer',
          description: 'Editorial photojournalistic coverage and 4K drone videography capturing authentic high-energy event moments.',
          price: 250,
          images: [
            'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80'
          ],
          amenities: ['Full Event Documentary + Drone', 'Express Same-Day Highlights', '360 Video Booth Add-on'],
          availability: true,
          status: 'approved',
          location: 'Los Angeles & Travel Nationwide',
          city: 'Los Angeles',
          rating: 4.99,
          reviewsCount: 210
        },
        {
          vendorId: defaultVendor?._id,
          title: 'Botanica Luxe Floral Architecture & Decor',
          category: 'Decorator',
          description: 'Sculptural botanical installations, suspended floral clouds, and opulent table styling for unforgettable visual impact.',
          price: 120,
          images: [
            'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80'
          ],
          amenities: ['Suspended Floral Ceiling Canopy', 'Statement Entrance Archway', 'Monochromatic Table Scapes'],
          availability: true,
          status: 'approved',
          location: 'New York, Los Angeles, Miami',
          city: 'New York',
          rating: 4.95,
          reviewsCount: 84
        }
      ]);
    }

    // 3. Seed Bookings
    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      console.log('Seeding initial bookings into MongoDB...');
      const basePrice = 1520;
      const platformFee = Math.round(basePrice * 0.05); // 5% platform fee
      await Booking.create({
        customerId: defaultCustomer?._id,
        vendorId: defaultVendor?._id,
        bookingDate: '2026-08-15',
        status: 'confirmed',
        basePrice,
        platformFee,
        totalBilled: basePrice + platformFee,
        venueName: 'The Skyline Glass Penthouse',
        venueImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
        guests: 80,
        vendorNames: ['Artisan Feast Culinary Group', 'Lumina Cinema & Photography'],
        referenceId: 'IE-892101'
      });
    }

    // 4. Seed Messages
    const messageCount = await Message.countDocuments();
    if (messageCount === 0) {
      console.log('Seeding initial chat messages into MongoDB...');
      await Message.create([
        {
          senderId: defaultCustomer?._id,
          receiverId: defaultVendor?._id,
          threadId: 'th_1',
          senderRole: 'customer',
          text: 'Hi Elena! We are looking to host a product launch for 90 guests on August 15th. Is the terrace available?',
          timestamp: new Date(Date.now() - 3600000 * 2)
        },
        {
          senderId: defaultVendor?._id,
          receiverId: defaultCustomer?._id,
          threadId: 'th_1',
          senderRole: 'provider',
          text: 'Hello Alex! Yes, August 15th is open. I can offer you a special bundled rate of $320/hr if you book our catering partner as well.',
          quoteOffer: {
            originalPrice: 1750,
            discountedPrice: 1520,
            description: 'Rooftop Venue + Full Bar Setup + Catering Station Discount',
            accepted: true
          },
          timestamp: new Date(Date.now() - 1800000)
        }
      ]);
    }

    console.log('Database seeding complete.');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}
