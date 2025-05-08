# Sudoku Game

A modern Sudoku game built with React, Node.js, and TypeScript.

## Project Structure

```
sudoku/
├── frontend/          # React frontend
├── backend/           # Node.js backend
└── shared/           # Shared TypeScript code
```

## Local Development

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. Deploy

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the root directory to `backend`
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`

## Environment Variables

### Backend
Create a `.env` file in the backend directory:
```
PORT=5001
```

### Frontend
Update the `API_BASE_URL` in `frontend/src/components/Game.tsx` to point to your Render deployment URL. 