import { Router, Request, Response } from 'express';
import db from './lib/database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all sessions for current user
router.get('/', (req: Request, res: Response) => {
  try {
    const userId = 'test-user-id';
    
    const sessions = db.prepare(`
      SELECT 
        id, user_id as userId, 
        datetime(start_time) as startTime,
        datetime(end_time) as endTime,
        duration, project, tags, notes, is_active as isActive
      FROM sessions 
      WHERE user_id = ? 
      ORDER BY start_time DESC 
      LIMIT 50
    `).all(userId);

    // Parse JSON tags
    const parsedSessions = sessions.map(session => ({
      ...session,
      tags: JSON.parse(session.tags),
      startTime: session.startTime,
      endTime: session.endTime || undefined
    }));

    res.status(200).json({
      success: true,
      data: parsedSessions,
      count: parsedSessions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new session
router.post('/', (req: Request, res: Response) => {
  try {
    const userId = 'test-user-id';
    const { project, tags, notes } = req.body;

    const sessionId = uuidv4();
    const startTime = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO sessions (id, user_id, start_time, project, tags, notes, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      sessionId,
      userId,
      startTime,
      project || 'Untitled Project',
      JSON.stringify(tags || []),
      notes || null,
      true
    );

    const newSession = {
      id: sessionId,
      userId,
      startTime,
      project: project || 'Untitled Project',
      tags: tags || [],
      notes: notes || undefined,
      isActive: true
    };

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
  try {
    const { id } = req.params;
    
    const session = db.prepare(`
      SELECT * FROM sessions WHERE id = ?
    `).get(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (!session.is_active) {
      return res.status(400).json({
        success: false,
        message: 'Session already ended'
      });
    }

    const endTime = new Date().toISOString();
    const startTime = new Date(session.start_time);
    const duration = Math.round((new Date(endTime).getTime() - startTime.getTime()) / (1000 * 60));

    db.prepare(`
      UPDATE sessions 
      SET end_time = ?, duration = ?, is_active = ?
      WHERE id = ?
    `).run(endTime, duration, false, id);

    // Update daily stats
    updateDailyStats(session.user_id, session.start_time.split('T')[0], duration, session.project, session.tags);

    const updatedSession = {
      id: session.id,
      userId: session.user_id,
      startTime: session.start_time,
      endTime,
      duration,
      project: session.project,
      tags: JSON.parse(session.tags),
      notes: session.notes || undefined,
      isActive: false
    };

    res.status(200).json({
      success: true,
      message: 'Session ended successfully',
      data: updatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to end session',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get today's sessions
router.get('/today', (req: Request, res: Response) => {
  try {
    const userId = 'test-user-id';
    const today = new Date().toISOString().split('T')[0];
    
    const todaySessions = db.prepare(`
      SELECT 
        id, user_id as userId, 
        datetime(start_time) as startTime,
        datetime(end_time) as endTime,
        duration, project, tags, notes, is_active as isActive
      FROM sessions 
      WHERE user_id = ? 
        AND date(start_time) = date(?)
      ORDER BY start_time DESC
    `).all(userId, today);

    // Parse JSON tags
    const parsedSessions = todaySessions.map(session => ({
      ...session,
      tags: JSON.parse(session.tags),
      startTime: session.startTime,
      endTime: session.endTime || undefined
    }));

    const activeSessions = parsedSessions.filter(s => s.isActive);
    const completedSessions = parsedSessions.filter(s => !s.isActive && s.duration);
    const totalFocusTime = completedSessions.reduce((total, s) => total + (s.duration || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        sessions: parsedSessions,
        stats: {
          totalSessions: parsedSessions.length,
          activeSessions: activeSessions.length,
          completedSessions: completedSessions.length,
          totalFocusTime,
          averageSessionLength: completedSessions.length > 0 
            ? Math.round(totalFocusTime / completedSessions.length)
            : 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s sessions',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper function to update daily stats
function updateDailyStats(userId: string, date: string, duration: number, project: string, tagsString: string) {
  const tags = JSON.parse(tagsString);
  
  const existingStats = db.prepare(`
    SELECT * FROM daily_stats WHERE user_id = ? AND date = date(?)
  `).get(userId, date);

  if (existingStats) {
    // Parse existing arrays
    const existingProjects = JSON.parse(existingStats.projects || '[]');
    const existingTags = JSON.parse(existingStats.tags || '[]');
    
    db.prepare(`
      UPDATE daily_stats 
      SET 
        total_sessions = total_sessions + 1,
        total_focus_time = total_focus_time + ?,
        projects = ?,
        tags = ?
      WHERE id = ?
    `).run(
      duration,
      JSON.stringify([...existingProjects, project]),
      JSON.stringify([...existingTags, ...tags]),
      existingStats.id
    );
  } else {
    db.prepare(`
      INSERT INTO daily_stats (id, user_id, date, total_sessions, total_focus_time, projects, tags)
      VALUES (?, ?, date(?), ?, ?, ?, ?)
    `).run(
      uuidv4(),
      userId,
      date,
      1,
      duration,
      JSON.stringify([project]),
      JSON.stringify(tags)
    );
  }
}

export default router;
