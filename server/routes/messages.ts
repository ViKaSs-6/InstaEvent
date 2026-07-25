import express, { Request, Response } from 'express';
import { Message } from '../models/Message';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET /api/messages
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });

    // Group messages into chat threads
    const threadsMap = new Map<string, any>();

    for (const msg of messages) {
      const threadId = msg.threadId || 'th_1';
      if (!threadsMap.has(threadId)) {
        threadsMap.set(threadId, {
          id: threadId,
          clientName: 'Alex Rivera',
          clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          eventType: 'Product Launch & Reception',
          itemName: 'The Skyline Glass Penthouse',
          itemCategory: 'Rooftop Venue',
          requestedDate: 'Aug 15, 2026',
          guests: 80,
          offeredPrice: 1520,
          originalPrice: 1750,
          status: 'Negotiating',
          lastMessage: msg.text,
          messages: []
        });
      }

      const thread = threadsMap.get(threadId);
      thread.lastMessage = msg.text;
      thread.messages.push({
        id: msg._id.toString(),
        sender: msg.senderRole,
        text: msg.text,
        timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quoteOffer: msg.quoteOffer
      });
    }

    const threadsList = Array.from(threadsMap.values());
    return res.json(threadsList);
  } catch (err: any) {
    console.error('Fetch Messages Error:', err);
    return res.status(500).json({ error: 'Failed to fetch chat messages.' });
  }
});

// POST /api/messages
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { threadId, text, senderRole, quoteOffer } = req.body;

    const newMsg = await Message.create({
      senderId: req.user?.id,
      threadId: threadId || 'th_1',
      senderRole: senderRole || (req.user?.role === 'vendor' ? 'provider' : 'customer'),
      text: text || '',
      quoteOffer: quoteOffer || undefined,
      timestamp: new Date()
    });

    return res.status(201).json({
      id: newMsg._id.toString(),
      sender: newMsg.senderRole,
      text: newMsg.text,
      timestamp: new Date(newMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quoteOffer: newMsg.quoteOffer
    });
  } catch (err: any) {
    console.error('Send Message Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to send message.' });
  }
});

export default router;
