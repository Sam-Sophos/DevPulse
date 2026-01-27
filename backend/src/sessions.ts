import { Router, Request, Response } from 'express';
import { Session, SessionCreate, SessionUpdate } from '../../types/session';

const router = Router();

// In-memory storage for development
const sessions: Session[] = [];

// Get all sessions
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: sessions,
    count: sessions.length
  });
});

// Create new session
router.post('/', (req: Request, res: Response) => {
  try {
    const sessionData: SessionCreate = req.body;
    const newSession: Session = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      project: sessionData.project || 'Untitled Project',
      tags: sessionData.tags || [],
      notes: sessionData.notes,
      isActive: true
    };

    sessions.push(newSession);

    res.status(201).json({
      success: true,
      message: 'Session started successfully',
      data: newSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to start session',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// End a session
router.patch('/:id/end', (req: Request, res: Response) => {
  const { id } = req.params;
  const session = sessions.find(s => s.id === id);

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    });
  }

  if (!session.isActive) {
    return res.status(400).json({
      success: false,
      message: 'Session already ended'
    });
  }

  const endTime = new Date().toISOString();
  const startTime = new Date(session.startTime);
  const duration = Math.round((new Date(endTime).getTime() - startTime.getTime()) / (1000 * 60));

  session.endTime = endTime;
  session.duration = duration;
  session.isActive = false;

  res.status(200).json({
    success: true,
    message: 'Session ended successfully',
    data: session
  });
});

// Get today's sessions
router.get('/today', (req: Request, res: Response) => {
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => 
    s.startTime.startsWith(today)
  );

  const totalFocusTime = todaySessions
    .filter(s => s.duration)
    .reduce((total, s) => total + (s.duration || 0), 0);

  res.status(200).json({
    success: true,
    data: {
      sessions: todaySessions,
      stats: {
        totalSessions: todaySessions.length,
        totalFocusTime,
        activeSessions: todaySessions.filter(s => s.isActive).length
      }
    }
  });
});

export default router;
