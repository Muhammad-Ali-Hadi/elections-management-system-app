# Quick Start Guide

## Starting the Application

### Terminal 1 - MongoDB
```bash
mongod --dbpath "C:\MongoDB\data\db"
```

### Terminal 2 - Backend
```bash
cd c:/Users/aquar/Web_Dev/Elections/backend
npm start
```

Backend will start on: **http://localhost:5001**

### Terminal 3 - Frontend
```bash
cd c:/Users/aquar/Web_Dev/Elections/elections
npm run dev
```

Frontend will start on: **http://localhost:5174**

---

## Access the Application

Open your browser and go to: **http://localhost:5174**

### Admin Login
- Username: `admin`
- Password: `admin@12345`

**Features**:
- Add/Edit/Delete candidates
- View real-time voting results
- Finalize and declare election results
- Monitor voter attendance

### Voter Login
- Flat Number: `A-1` to `B-60` (e.g., `A-1`, `B-45`)
- Password: `password@123`

**Features**:
- Vote for candidates in multiple positions
- View live election results
- Check voting status

---

## API Testing (Using curl)

### Test Admin Login
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin@12345"}' \
  http://localhost:5001/api/admin/login
```

### Test Voter Login
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"flatNumber":"A-1","password":"password@123"}' \
  http://localhost:5001/api/voters/login
```

### Test Vote Casting
```bash
curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"electionId":"6957030455dee196ac3b31c4","votes":{"President":"CANDIDATE_ID"}}' \
  http://localhost:5001/api/votes/cast
```

### Get Results
```bash
curl -X GET http://localhost:5001/api/results/6957030455dee196ac3b31c4
```

---

## Common Issues & Solutions

### "Failed to fetch" on login
1. ✅ Check if backend is running on port 5001
2. ✅ Check if MongoDB is running on port 27017
3. ✅ Hard refresh browser (Ctrl+F5)

### Backend won't start
```bash
# Kill existing node processes
taskkill /F /IM node.exe

# Then restart backend
npm start
```

### Database issues
```bash
# Reseed database
npm run seed
```

---

## System Architecture

```
Frontend (React + Vite)
├── Login Component
├── Admin Panel (Candidates, Results)
├── Voter Panel (Voting, Results)
└── Results Page (Live/Finalized)
      ↓
Backend (Node.js + Express)
├── Authentication Routes
├── Candidate Routes
├── Vote Routes
├── Results Routes
├── Attendance Routes
└── Admin Routes
      ↓
Database (MongoDB)
├── admins
├── voters
├── candidates
├── elections
├── votes
├── results
├── attendances
└── electioncommiteemembers
```

---

## Database Collections

### admins
```javascript
{ username, password (hashed), name, role: 'admin' }
```

### voters
```javascript
{ flatNumber, wing, name, password (hashed), email }
```

### candidates
```javascript
{ name, position, flatNumber, wing, description, image, votes, electionId }
```

### votes
```javascript
{ voterId, flatNumber, electionId, votes: {...}, timestamp }
```

### results
```javascript
{ 
  electionId, 
  candidateResults: [{candidateId, position, totalVotes, votedByFlats}],
  votingStatistics: {...},
  electionStatus
}
```

### attendances
```javascript
{ voterId, flatNumber, electionId, loginTime, voteTime, voted }
```

---

## Important Notes

- All voters have the same password: `password@123`
- Admin credentials are: `admin` / `admin@12345`
- Election ID for testing: `6957030455dee196ac3b31c4`
- Frontend auto-saves state to localStorage
- Results update every 5 seconds on the results page
- JWT tokens expire after 24 hours

---

## Support

For issues or questions, check:
1. [SYSTEM_STATUS.md](./SYSTEM_STATUS.md) - Full system status
2. Backend console for error logs
3. Browser console for frontend errors
4. MongoDB logs if database issues occur
