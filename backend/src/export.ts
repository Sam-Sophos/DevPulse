import { Router, Request, Response } from 'express';
import { DataExporter, ExportOptions } from './lib/export/exporter';
import fs from 'fs';
import path from 'path';

const router = Router();

// TODO: Add authentication middleware
const TEST_USER_ID = 'test-user-id';

// Create exports directory
const exportsDir = path.join(__dirname, '../../exports');
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

// Export user data
router.post('/export', async (req: Request, res: Response) => {
  try {
    const options: ExportOptions = {
      includeSessions: req.body.includeSessions !== false,
      includeDevLogs: req.body.includeDevLogs !== false,
      includeStats: req.body.includeStats !== false,
      dateRange: req.body.dateRange
    };

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `export_${TEST_USER_ID}_${timestamp}.json`;
    const filePath = path.join(exportsDir, filename);

    // Export to file
    await DataExporter.exportToFile(TEST_USER_ID, options, filePath);

    // Get file info
    const stats = fs.statSync(filePath);

    res.status(200).json({
      success: true,
      message: 'Data exported successfully',
      data: {
        filename,
        fileSize: stats.size,
        downloadUrl: `/api/export/download/${filename}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Export failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Download export file
router.get('/download/:filename', (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(exportsDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Export file not found'
      });
    }

    // Verify file belongs to user (in production, check authorization)
    if (!filename.startsWith(`export_${TEST_USER_ID}_`)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.download(filePath, `devpulse_export_${new Date().toISOString().split('T')[0]}.json`, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Download failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get export preview (without downloading)
router.post('/preview', async (req: Request, res: Response) => {
  try {
    const options: ExportOptions = {
      includeSessions: req.body.includeSessions !== false,
      includeDevLogs: req.body.includeDevLogs !== false,
      includeStats: req.body.includeStats !== false,
      dateRange: req.body.dateRange
    };

    // Get data preview (limited)
    const exportData = await DataExporter.exportUserData(TEST_USER_ID, options);

    // Create preview with limited data
    const preview = {
      metadata: exportData.metadata,
      summary: {
        sessions: exportData.sessions?.length || 0,
        devLogs: exportData.devLogs?.length || 0,
        dailyStats: exportData.dailyStats?.length || 0,
        totalSize: JSON.stringify(exportData).length
      },
      sample: {
        sessions: exportData.sessions?.slice(0, 3),
        devLogs: exportData.devLogs?.slice(0, 2),
        dailyStats: exportData.dailyStats?.slice(0, 2)
      }
    };

    res.status(200).json({
      success: true,
      data: preview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Preview generation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get export history
router.get('/history', (req: Request, res: Response) => {
  try {
    const history = DataExporter.getExportHistory(TEST_USER_ID);

    res.status(200).json({
      success: true,
      data: history.map(item => ({
        filename: item.filename,
        size: item.size,
        createdAt: item.createdAt.toISOString(),
        downloadUrl: `/api/export/download/${item.filename}`
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get export history',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Import data from file upload
router.post('/import', async (req: Request, res: Response) => {
  try {
    // Note: In production, use multer for file uploads
    // For now, expecting JSON in request body
    const importData = req.body;

    if (!importData || !importData.metadata) {
      return res.status(400).json({
        success: false,
        message: 'Invalid import data format'
      });
    }

    const results = await DataExporter.importUserData(TEST_USER_ID, importData);

    res.status(200).json({
      success: true,
      message: 'Data imported successfully',
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Import failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Validate import file
router.post('/validate', (req: Request, res: Response) => {
  try {
    const importData = req.body;

    if (!importData) {
      return res.status(400).json({
        success: false,
        message: 'No data provided'
      });
    }

    // Check required fields
    const errors = [];

    if (!importData.metadata) {
      errors.push('Missing metadata');
    } else {
      if (importData.metadata.version !== '1.0.0') {
        errors.push(`Unsupported version: ${importData.metadata.version}`);
      }
    }

    // Validate sessions if present
    if (importData.sessions) {
      if (!Array.isArray(importData.sessions)) {
        errors.push('Sessions must be an array');
      } else {
        importData.sessions.forEach((session: any, index: number) => {
          if (!session.id) errors.push(`Session ${index} missing id`);
          if (!session.startTime) errors.push(`Session ${index} missing startTime`);
        });
      }
    }

    // Validate dev logs if present
    if (importData.devLogs) {
      if (!Array.isArray(importData.devLogs)) {
        errors.push('Dev logs must be an array');
      } else {
        importData.devLogs.forEach((log: any, index: number) => {
          if (!log.id) errors.push(`Dev log ${index} missing id`);
          if (!log.content) errors.push(`Dev log ${index} missing content`);
        });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(200).json({
      success: true,
      message: 'Import file is valid',
      data: {
        sessions: importData.sessions?.length || 0,
        devLogs: importData.devLogs?.length || 0,
        dailyStats: importData.dailyStats?.length || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Validation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
