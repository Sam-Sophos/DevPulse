# DevPulse

Developer productivity and reflection platform.

## Structure
- `/frontend` - Next.js app
- `/backend` - Express API

## Database
- **Development**: SQLite (no installation required)
- **Production**: PostgreSQL (planned migration)
- **Schema**: Users, Sessions, Dev Logs, Daily Stats

## API v1.2.0 Features
- Session tracking with start/end functionality
- Dev logs with mood tracking
- Daily statistics aggregation
- SQLite database with automatic initialization
- Health check with database status

## Quick Test
1. Start backend: `cd backend && npm run dev`
2. Test API: `curl http://localhost:3001/api/health`
3. Insert sample data: `curl -X POST http://localhost:3001/api/sample-data`
