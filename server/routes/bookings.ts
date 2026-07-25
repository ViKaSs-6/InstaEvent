import express, { Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET /api/bookings
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user?.role;
    const userId = req.user?.id;

    let filter: any = {};
    if (role === 'customer') {
      filter = { $or: [{ customerId: userId }, { customerId: { $exists: false } }, { customerId: null }] };
    } else if (role === 'vendor') {
      filter = { $or: [{ vendorId: userId }, { vendorId: { $exists: false } }, { vendorId: null }] };
    }
    // If admin, filter is empty {} so all bookings are returned!

    const bookings = await (Booking as any).find(filter).sort({ createdAt: -1 });

    const formatted = bookings.map((b) => ({
      id: b._id.toString(),
      venueName: b.venueName,
      venueImage: b.venueImage || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      date: b.bookingDate,
      guests: b.guests,
      basePrice: b.basePrice,
      platformFee: b.platformFee,
      totalAmount: b.totalBilled,
      status: b.status === 'confirmed' ? 'Confirmed' : b.status === 'pending' ? 'Pending' : 'Completed',
      vendorNames: b.vendorNames,
      referenceId: b.referenceId
    }));

    return res.json(formatted);
  } catch (err: any) {
    console.error('Fetch Bookings Error:', err);
    return res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// POST /api/bookings
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { venueName, venueImage, date, guests, totalAmount, baseAmount, vendorNames, listingId, vendorId } = req.body;

    const rawBasePrice = Number(baseAmount || totalAmount || 1000);
    const platformFee = Math.round(rawBasePrice * 0.05); // 5% platform fee rule
    const totalBilled = rawBasePrice + platformFee;

    const newBooking = await (Booking as any).create({
      customerId: req.user?.id,
      listingId: listingId || undefined,
      vendorId: vendorId || undefined,
      bookingDate: date || new Date().toISOString().split('T')[0],
      status: 'confirmed',
      basePrice: rawBasePrice,
      platformFee,
      totalBilled,
      venueName: venueName || 'Custom Event Package',
      venueImage: venueImage || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      guests: Number(guests) || 50,
      vendorNames: Array.isArray(vendorNames) ? vendorNames : [],
      referenceId: `IE-${Math.floor(100000 + Math.random() * 900000)}`
    });

    console.log('✅ New Booking created in MongoDB:', newBooking._id.toString(), 'for customer:', req.user?.id);

    return res.status(201).json({
      id: newBooking._id.toString(),
      venueName: newBooking.venueName,
      venueImage: newBooking.venueImage,
      date: newBooking.bookingDate,
      guests: newBooking.guests,
      basePrice: newBooking.basePrice,
      platformFee: newBooking.platformFee,
      totalAmount: newBooking.totalBilled,
      status: 'Confirmed',
      vendorNames: newBooking.vendorNames,
      referenceId: newBooking.referenceId
    });
  } catch (err: any) {
    console.error('Create Booking Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to create booking.' });
  }
});

// PATCH /api/bookings/:id/status
router.patch('/:id/status', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const updated = await (Booking as any).findByIdAndUpdate(
      req.params.id,
      { status: status.toLowerCase() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Booking not found.' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update booking status.' });
  }
});

export default router;
