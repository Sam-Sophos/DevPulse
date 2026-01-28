import { Router, Request, Response } from 'express';
import db from './lib/database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all dev logs
router.get('/', (req: Request, res: Response) => {
  try {
    const userId = 'test-user-id';
    
    const logs = db.prepare(`
      SELECT 
        id, user_id as userId, 
        datetime(date) as date,
        content, tags, mood
      FROM dev_logs 
      WHERE user_id = ? 
      ORDER BY date DESC 
      LIMIT 100
    `).all(userId);

    // Parse JSON tags
    const parsedLogs = logs.map(log => ({
      ...log,
      tags: JSON.parse(log.tags),
      date: log.date
    }));

    res.status(200).json({
      success: true,
      data: parsedLogs,
      count: parsedLogs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dev logs',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new dev log
router.post('/', (req: Request, res: Response) => {
  try {
    const userId = 'test-user-id';
    const { content, tags, mood } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    const logId = uuidv4();
    const date = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO dev_logs (id, user_id, date, content, tags, mood)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      logId,
      userId,
      date,
      content.trim(),
      JSON.stringify(tags || []),
      mood ? parseInt(mood) : 3
    );

    const newLog = {
      id: logId,
      userId,
      date,
      content: content.trim(),
      tags: tags || [],
      mood: mood ? parseInt(mood) : 3
    };

    res.status(201).json({
      success: true,
      message: 'Dev log saved successfully',
      data: newLog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to save dev log',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get today's dev logs
router.get('/today', (req: Request, res: Response) => {
  try {
    const userId = 'test-user-id';
    const today = new Date().toISOString().split('T')[0];
    
    const todayLogs = db.prepare(`
      SELECT 
        id, user_id as userId, 
        datetime(date) as date,
        content, tags, mood
      FROM dev_logs 
      WHERE user_id = ? 
        AND date(date) = date(?)
      ORDER BY date DESC
    `).all(userId, today);

    // Parse JSON tags
    const parsedLogs = todayLogs.map(log => ({
      ...log,
      tags: JSON.parse(log.tags),
      date: log.date
    }));

    res.status(200).json({
      success: true,
      data: parsedLogs,
      count: parsedLogs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s logs',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
