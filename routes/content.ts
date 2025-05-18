import express, { Response, NextFunction } from 'express';
import { Content } from '../models/Content';
import { Authenticate} from '../middleware/authMiddleware';
import AuthenticatedRequest from '../middleware/authMiddleware';
const router = express.Router();

// Create new content
router.post('/', Authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { type, link, title, tags } = req.body;
  const userId = req.userID;

  try {
    const newContent = new Content({
      type,
      link,
      title,
      tags,
      user: userId,
    });

    await newContent.save();
    res.status(200).json({ message: 'Content added!', content: newContent });
  } catch (err) {
    res.status(500).json({ message: 'Content not added!', error: err });
  }
});

// Get all content for a user
router.get('/', Authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userID;
  try {
    const contents = await Content.find({ user: userId });
    res.status(200).json(contents);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching contents', error: err });
  }
});

// Get specific content by ID
router.get('/:id', Authenticate, async (req: AuthenticatedRequest, res: Response):Promise<any> => {
  const { id } = req.params;

  try {
    const content = await Content.findById(id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.status(200).json(content);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching content', error: err });
  }
});

// Delete specific content by ID
router.delete('/:id', Authenticate, async (req: AuthenticatedRequest, res: Response) :Promise<any> => {
  const { id } = req.params;
  const userId = req.userID;

  try {
    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    if (content.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    await content.deleteOne();
    res.status(200).json({ message: 'Content deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting content', error: err });
  }
});

export default router;
