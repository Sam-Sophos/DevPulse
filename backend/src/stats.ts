import { Router, Request, Response } from 'express';
import { StatsCalculator } from './lib/stats/calculator';

const router = Router();

// TODO: Add authentication middleware
// For now, using test user
const TEST_USER_ID = 'test-user-id';

// Get user time statistics
router.get('/time', (req: Request, res: Response) => {
  try {
    const stats = StatsCalculator.getUserStats(TEST_USER_ID);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch time statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get project statistics
router.get('/projects', (req: Request, res: Response) => {
  try {
    const projectStats = StatsCalculator.getProjectStats(TEST_USER_ID);

    res.status(200).json({
      success: true,
      data: projectStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get daily progress
router.get('/daily-progress', (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 14;
    const progress = StatsCalculator.getDailyProgress(TEST_USER_ID, days);

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily progress',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get weekly summary
router.get('/weekly-summary', (req: Request, res: Response) => {
  try {
    const summary = StatsCalculator.getWeeklySummary(TEST_USER_ID);

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weekly summary',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get productivity insights
router.get('/insights', (req: Request, res: Response) => {
  try {
    const timeStats = StatsCalculator.getUserStats(TEST_USER_ID);
    const projectStats = StatsCalculator.getProjectStats(TEST_USER_ID);
    const weeklySummary = StatsCalculator.getWeeklySummary(TEST_USER_ID);

    // Generate insights based on data
    const insights = [];

    if (timeStats.currentStreak > 0) {
      insights.push({
        type: 'streak',
        message: `You're on a ${timeStats.currentStreak}-day coding streak!`,
        emoji: '🔥',
        priority: 'high'
      });
    }

    if (timeStats.totalFocusTime < 60) {
      insights.push({
        type: 'beginner',
        message: 'Just starting out! Log your first hour of focused coding.',
        emoji: '🚀',
        priority: 'medium'
      });
    } else if (timeStats.totalFocusTime > 1000) {
      insights.push({
        type: 'milestone',
        message: `Amazing! You've logged over ${Math.floor(timeStats.totalFocusTime / 60)} hours of focused work.`,
        emoji: '🏆',
        priority: 'high'
      });
    }

    if (projectStats.length > 0) {
      const topProject = projectStats[0];
      insights.push({
        type: 'project_focus',
        message: `Your main focus is "${topProject.project}" with ${topProject.totalTime} minutes logged.`,
        emoji: '🎯',
        priority: 'medium'
      });
    }

    if (weeklySummary.goalProgress >= 100) {
      insights.push({
        type: 'goal_achieved',
        message: 'Weekly goal achieved! Great work this week.',
        emoji: '✅',
        priority: 'high'
      });
    } else if (weeklySummary.goalProgress > 50) {
      insights.push({
        type: 'goal_progress',
        message: `You're ${weeklySummary.goalProgress}% towards your weekly goal. Keep going!`,
        emoji: '📈',
        priority: 'medium'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        insights,
        summary: {
          totalFocusTime: timeStats.totalFocusTime,
          currentStreak: timeStats.currentStreak,
          weeklyProgress: weeklySummary.goalProgress
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate insights',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
