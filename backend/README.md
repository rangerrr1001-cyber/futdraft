# FUT Draft - Backend API

Full-stack FUT Draft web application backend with PostgreSQL, Express, Socket.IO, and JWT authentication.

## ✅ Completed Implementation

### Database Schema (PostgreSQL)
- ✅ 11 tables with proper foreign keys and indexes
- ✅ Users with spin tracking (daily limit)
- ✅ Players with stats (pace, shooting, passing, dribbling, defending, physical)
- ✅ User inventory (user_players)
- ✅ Teams with formation and playstyle
- ✅ Team composition (team_players)
- ✅ Draft system with expiry
- ✅ Draft selections (draft_players)
- ✅ Match history with results
- ✅ Reference tables (positions, events, ovr_ranges)

### Authentication
- ✅ Registration with validation (username: 3-20 chars, password: 8+ chars)
- ✅ Login with bcrypt password hashing
- ✅ JWT tokens (7-day expiry)
- ✅ Protected route middleware

### Spin Feature
- ✅ Daily spin limit (3 spins per day, UTC timezone)
- ✅ Random selection of position, event, and OVR range
- ✅ Player acquisition matching all filters
- ✅ Allows duplicate players in inventory
- ✅ Automatic reset at UTC midnight

### Team Management
- ✅ Create teams with formation and playstyle
- ✅ Full CRUD operations
- ✅ Validation: 11 players, position slots match formation
- ✅ Ownership verification
- ✅ Formation options: 4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 4-2-2-2, 3-4-3
- ✅ Playstyles: Tiki-Taka, Counter, Long Ball, Total Football

### Draft System
- ✅ Start draft with 5 random formations
- ✅ 30-minute expiry timer
- ✅ Formation selection
- ✅ Position-by-position player selection (5 random options per position)
- ✅ Draft completion tracking
- ✅ Automatic cleanup after match

### Battle System
- ✅ Team Battle: User teams vs random opponents or AI
- ✅ Draft Battle: Drafted teams vs other drafts or AI
- ✅ AI opponent generation when no human opponents available
- ✅ Match initialization with WebSocket room creation

### Match Engine
- ✅ Stats-based simulation (~50 events per match)
- ✅ Event types: KICKOFF, PASS, SHOT, GOAL, SAVE, MISS, TACKLE, INTERCEPTION, DRIBBLE, HALF_TIME, FULL_TIME
- ✅ Formation modifiers (e.g., 4-3-3 = +15% wide play)
- ✅ Playstyle modifiers (e.g., Tiki-Taka = +10% passing)
- ✅ Randomness factor (±20-30% variance)
- ✅ Contextual commentary generation
- ✅ Player stat influence on outcomes

### WebSocket (Socket.IO)
- ✅ Real-time match events
- ✅ JWT authentication for connections
- ✅ Room-based match streaming
- ✅ Score updates
- ✅ Match end notifications
- ✅ 2-3 second delays between events

### Seed Data
- ✅ 54 realistic players across all positions
- ✅ 6 card events (TOTS, TOTY, ICY, MAGICIANS, HEROES, RULEBREAKERS)
- ✅ 3 OVR ranges (90+, 85-89, 80-84)
- ✅ 10 positions covering all formation needs

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

3. Create database and run migrations:
```bash
createdb futdraft
npm run db:migrate
npm run db:seed
```

4. Start development server:
```bash
npm run dev
```

Server will run on http://localhost:5000

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Spin
- `GET /api/spin/check` - Check remaining spins (protected)
- `POST /api/spin/execute` - Execute spin (protected)
- `GET /api/spin/options` - Get spin options (public)

### Players
- `GET /api/players/me` - Get user's player inventory (protected)

### Teams
- `GET /api/teams` - Get all user teams (protected)
- `POST /api/teams` - Create team (protected)
- `PUT /api/teams/:id` - Update team (protected)
- `DELETE /api/teams/:id` - Delete team (protected)

### Draft
- `POST /api/draft/start` - Start new draft (protected)
- `POST /api/draft/:id/select-formation` - Select formation (protected)
- `GET /api/draft/:id/players/:position` - Get player options (protected)
- `POST /api/draft/:id/select-player` - Select player (protected)
- `GET /api/draft/:id` - Get draft status (protected)
- `DELETE /api/draft/:id` - Cancel draft (protected)

### Battles
- `POST /api/battles/start` - Start Team Battle (protected)
- `POST /api/battles/draft/:id/battle` - Start Draft Battle (protected)

### WebSocket Events
- `join_match` - Join match room
- `match_event` - Receive match events
- `score_update` - Receive score updates
- `match_end` - Receive match result

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts           # PostgreSQL connection pool
│   ├── middleware/
│   │   ├── auth.ts               # JWT authentication middleware
│   │   └── errorHandler.ts      # Global error handler
│   ├── models/                   # (Type definitions in types/)
│   ├── routes/
│   │   ├── auth.routes.ts        # Authentication routes
│   │   ├── spin.routes.ts        # Spin routes
│   │   ├── team.routes.ts        # Team management routes
│   │   ├── draft.routes.ts       # Draft routes
│   │   ├── battle.routes.ts      # Battle routes
│   │   └── player.routes.ts      # Player inventory routes
│   ├── controllers/
│   │   ├── authController.ts     # Auth logic
│   │   ├── spinController.ts     # Spin logic with daily limit
│   │   ├── teamController.ts     # Team CRUD
│   │   ├── draftController.ts    # Draft management
│   │   ├── battleController.ts   # Battle initialization
│   │   └── playerController.ts   # Player inventory
│   ├── services/
│   │   ├── matchEngine.ts        # Match simulation engine
│   │   ├── matchRunner.ts        # WebSocket match execution
│   │   └── formationHelper.ts    # Formation utilities
│   ├── socket/
│   │   └── socketHandler.ts      # Socket.IO setup
│   ├── utils/
│   │   ├── jwt.ts                # JWT utilities
│   │   └── helpers.ts            # Utility functions
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   ├── index.ts                  # Express app configuration
│   └── server.ts                 # HTTP + Socket.IO server
├── database/
│   ├── migrations/
│   │   └── 001_init.sql          # Complete schema
│   └── seeds/
│       ├── 001_positions.sql     # 10 positions
│       ├── 002_events.sql        # 6 events
│       ├── 003_ovr_ranges.sql    # 3 ranges
│       └── 004_players.sql       # 54 players
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## 🧪 Testing

Test with curl or any API client:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Execute spin (with token)
curl -X POST http://localhost:5000/api/spin/execute \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚀 Deployment

The backend is ready for deployment to any Node.js hosting service (Railway, Render, Fly.io).

Set environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Random secret key
- `PORT` - Server port (default: 5000)
- `CORS_ORIGIN` - Frontend URL
- `NODE_ENV` - production

## Generated with Compyle