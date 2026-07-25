import express, { Response } from 'express';
import { User } from '../models/User';
import { Listing } from '../models/Listing';
import { Booking } from '../models/Booking';
import { verifyToken, isAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', verifyToken, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const customerCount = await User.countDocuments({ role: 'customer' });
    const vendorCount = await User.countDocuments({ role: 'vendor' });

    const totalBookings = await Booking.countDocuments();
    const bookings = await Booking.find();

    // Calculate gross platform volume and platform revenue (5% of base price)
    let grossVolume = 0;
    let platformRevenue = 0;

    for (const b of bookings) {
      grossVolume += b.basePrice || 0;
      platformRevenue += b.platformFee || Math.round((b.basePrice || 0) * 0.05);
    }

    const pendingListingsCount = await Listing.countDocuments({ status: 'pending' });
    const approvedListingsCount = await Listing.countDocuments({ status: 'approved' });

    return res.json({
      totalUsers,
      customerCount,
      vendorCount,
      totalBookings,
      grossVolume,
      platformRevenue, // 5% platform fee dynamically calculated
      pendingListingsCount,
      approvedListingsCount
    });
  } catch (err: any) {
    console.error('Fetch Admin Stats Error:', err);
    return res.status(500).json({ error: 'Failed to fetch admin stats.' });
  }
});

export default router;
