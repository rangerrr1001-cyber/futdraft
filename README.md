# FUT Draft Web Application

A full-stack FIFA Ultimate Team inspired draft and battle web application with real-time match simulation.

## 🎯 Project Overview

FUT Draft is a complete web application that allows users to:
1. **Spin** for random player cards (daily limit of 3 spins)
2. **Build Teams** from owned players with formations and playstyles
3. **Battle** with teams against AI or other players
4. **Draft Mode** for temporary team building and battles
5. **Live 2D Match Simulation** with WebSocket real-time updates

## ✅ Implementation Status

### Backend (100% Complete)
- ✅ **Database**: PostgreSQL with 11 tables, migrations, and 54 seed players
- ✅ **Authentication**: JWT-based with bcrypt password hashing
- ✅ **Spin System**: Daily limit (3 spins/day UTC), random player acquisition
- ✅ **Team Management**: Full CRUD with 6 formations and 4 playstyles
- ✅ **Draft System**: 30-minute sessions with position-by-position selection
- ✅ **Battle System**: Team Battle and Draft Battle with AI opponents
- ✅ **Match Engine**: Stats-based simulation with 50+ events per match
- ✅ **WebSocket**: Real-time match streaming via Socket.IO
- ✅ **API**: All endpoints fully implemented and tested

### Frontend (Core Infrastructure Complete)
- ✅ **Project Setup**: Vite + React 18 + TypeScript
- ✅ **Type Definitions**: Complete TypeScript interfaces
- ✅ **API Service**: Axios with JWT interceptors
- ✅ **Socket.IO Client**: WebSocket connection management
- ✅ **Auth Context**: Authentication state management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

1. Navigate to backend:
```bash
cd backend
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

3. Setup database:
```bash
createdb futdraft
npm run db:migrate
npm run db:seed
```

4. Start server:
```bash
npm run dev
```

Backend runs on http://localhost:5000

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

## 📡 Key Features

- **Spin System**: 3 daily spins with UTC midnight reset
- **54 Seeded Players**: Realistic stats across all positions
- **6 Formations**: 4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 4-2-2-2, 3-4-3
- **4 Playstyles**: Tiki-Taka, Counter, Long Ball, Total Football
- **Stats-Based Match Engine**: Player attributes determine outcomes
- **Real-Time WebSocket**: Live match streaming with commentary

## 📚 Documentation

- **Backend**: See `backend/README.md` for complete API documentation
- **Planning**: See `planning.md` for full specifications

## Generated with Compyle