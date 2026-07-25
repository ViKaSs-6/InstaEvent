import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { JWT_SECRET, verifyToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, businessName } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await (User as any).findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const validRole = ['customer', 'vendor', 'admin'].includes(role) ? role : 'customer';

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: validRole,
      businessName: validRole === 'vendor' ? businessName : undefined,
      verified: validRole === 'vendor' || validRole === 'admin',
      avatar: validRole === 'admin'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
        : validRole === 'vendor'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role === 'customer' ? 'Customer' : newUser.role === 'vendor' ? 'Vendor' : 'Admin',
        businessName: newUser.businessName,
        avatar: newUser.avatar,
        verified: newUser.verified
      }
    });
  } catch (err: any) {
    console.error('Registration Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to register user.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await (User as any).findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Wrong password.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role === 'customer' ? 'Customer' : user.role === 'vendor' ? 'Vendor' : 'Admin',
        businessName: user.businessName,
        avatar: user.avatar,
        verified: user.verified,
        phone: user.phone,
        bio: user.bio
      }
    });
  } catch (err: any) {
    console.error('Login Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to log in.' });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await (User as any).findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    return res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role === 'customer' ? 'Customer' : user.role === 'vendor' ? 'Vendor' : 'Admin',
        businessName: user.businessName,
        avatar: user.avatar,
        verified: user.verified,
        phone: user.phone,
        bio: user.bio
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to retrieve user.' });
  }
});

export default router;
