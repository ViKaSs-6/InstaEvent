import express, { Request, Response } from 'express';
import { Listing } from '../models/Listing';
import { verifyToken, isVendor, isAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET /api/listings
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, city, status } = req.query;
    const filter: any = {};

    // By default, public endpoint shows approved listings unless requested
    if (status) {
      filter.status = status;
    } else {
      filter.status = 'approved';
    }

    if (category && category !== 'all') {
      filter.category = new RegExp(category as string, 'i');
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { category: searchRegex }
      ];
    }

    if (city) {
      filter.city = new RegExp(city as string, 'i');
    }

    const listings = await Listing.find(filter).sort({ createdAt: -1 });

    // Format output for frontend compatibility
    const formatted = listings.map((item) => ({
      id: item._id.toString(),
      name: item.title,
      title: item.title,
      category: item.category,
      description: item.description,
      pricePerHour: item.price,
      price: item.price,
      hourlyRate: item.price,
      images: item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'],
      image: item.images[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      amenities: item.amenities,
      popularPackages: item.amenities,
      bio: item.description,
      priceRange: `$$$ ($${item.price}/hr)`,
      availability: item.availability,
      status: item.status === 'approved' ? 'Approved' : item.status === 'pending' ? 'Pending' : 'Rejected',
      location: item.location,
      city: item.city || 'New York',
      capacity: item.capacity || 100,
      sqft: item.sqft || 2000,
      rating: item.rating || 4.9,
      reviewsCount: item.reviewsCount || 12,
      hostName: item.hostName || 'Verified Host',
      hostAvatar: item.hostAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      superhost: item.superhost ?? true,
      instantBook: item.instantBook ?? true
    }));

    return res.json(formatted);
  } catch (err: any) {
    console.error('Fetch Listings Error:', err);
    return res.status(500).json({ error: 'Failed to fetch listings.' });
  }
});

// GET /api/listings/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const item = await (Listing as any).findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Listing not found.' });
    }
    return res.json(item);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch listing.' });
  }
});

// POST /api/listings (Create Listing)
router.post('/', verifyToken, isVendor, async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, description, price, images, amenities, location, capacity, sqft } = req.body;

    if (!title || !category || !price) {
      return res.status(400).json({ error: 'Title, category, and price are required.' });
    }

    const newListing = await Listing.create({
      vendorId: req.user?.id,
      title,
      category,
      description: description || '',
      price: Number(price),
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80'],
      amenities: Array.isArray(amenities) ? amenities : [],
      location: location || 'New York, NY',
      capacity: Number(capacity) || 100,
      sqft: Number(sqft) || 2000,
      status: req.user?.role === 'admin' ? 'approved' : 'pending',
      hostName: req.user?.name || 'Verified Host',
      rating: 5.0,
      reviewsCount: 1
    });

    return res.status(201).json(newListing);
  } catch (err: any) {
    console.error('Create Listing Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to create listing.' });
  }
});

// PUT /api/listings/:id
router.put('/:id', verifyToken, isVendor, async (req: AuthRequest, res: Response) => {
  try {
    const updated = await (Listing as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Listing not found.' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update listing.' });
  }
});

// DELETE /api/listings/:id
router.delete('/:id', verifyToken, isVendor, async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await (Listing as any).findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Listing not found.' });
    }
    return res.json({ message: 'Listing deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete listing.' });
  }
});

// PATCH /api/listings/:id/status (Admin Moderation)
router.patch('/:id/status', verifyToken, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body; // 'approved' | 'rejected'
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const updated = await (Listing as any).findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update listing status.' });
  }
});

export default router;
