# Elections Management System - Setup & Testing Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn

## 1. Backend Setup

### Step 1: Install Dependencies
```bash
cd c:\Users\aquar\Web_Dev\Elections\backend
npm install
```

### Step 2: Configure MongoDB
Update `.env` file with your MongoDB connection:
```env
MONGODB_URI=your_mongodb_connection_string_here
PORT=5000
JWT_SECRET=your-secret-key-here-change-in-production
NODE_ENV=development
```

### Step 3: Seed Demo Data (Optional)
Create initial voters and candidates in MongoDB. You can use MongoDB Compass or a script.

**Example: Add Demo Voter:**
```javascript
// In MongoDB Compass, run this in the console:
db.voters.insertOne({
  flatNumber: "A-1",
  name: "John Doe",
  password: "$2a$10$... (hashed)", // Use bcryptjs to hash
  wing: "A",
  floorNumber: 1,
  email: "a1@example.com",
  phone: "1234567890",
  role: "voter"
})
```

### Step 4: Start Backend Server
```bash
npm run dev
```

You should see: `Election API server running on port 5000`

## 2. Frontend Setup

### Step 1: Install Dependencies
```bash
cd c:\Users\aquar\Web_Dev\Elections\elections
npm install
```

### Step 2: Update Environment
The `.env` file is already configured:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 3: Start Frontend Development Server
```bash
npm run dev
```

The app should open at `http://localhost:5173`

## 3. Testing the Application

### Test Admin Login
- Username: `ADMIN`
- Password: `admin123`
- Role: `admin`

### Test Voter Login
1. First, create a voter in MongoDB:
   ```bash
   # Use MongoDB Compass or a script to insert a voter
   ```

2. Or use a sample voter (after seeding):
   - Flat Number: `A-1`
   - Password: (the one you set)

## 4. API Testing with Postman

### Login as Voter
```
POST http://localhost:5000/api/voters/login
Body (JSON):
{
  "flatNumber": "A-1",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

### Get Voter Profile
```
GET http://localhost:5000/api/voters/profile
Headers:
Authorization: Bearer {token_from_login}
```

### Get All Voters (Admin)
```
GET http://localhost:5000/api/voters/all
Headers:
Authorization: Bearer {admin_token}
```

### Create Candidate (Admin)
```
POST http://localhost:5000/api/candidates/create
Headers:
Authorization: Bearer {admin_token}
Body (JSON):
{
  "name": "John Smith",
  "position": "President",
  "flatNumber": "A-1",
  "wing": "A",
  "description": "Community leader",
  "electionId": "default-election-2026"
}
```

### Cast Vote
```
POST http://localhost:5000/api/votes/cast
Headers:
Authorization: Bearer {voter_token}
Body (JSON):
{
  "electionId": "default-election-2026",
  "votes": {
    "President": "candidate_id_1",
    "Vice President": "candidate_id_2",
    "Secretary": "candidate_id_3",
    "Treasurer": "candidate_id_4"
  }
}
```

### Get Election Results (Admin)
```
GET http://localhost:5000/api/votes/results/default-election-2026
Headers:
Authorization: Bearer {admin_token}
```

### Get Attendance Report (Admin)
```
GET http://localhost:5000/api/attendance/report/default-election-2026
Headers:
Authorization: Bearer {admin_token}
```

## 5. Common Issues & Solutions

### Issue: "Cannot GET /api/candidates"
**Solution:** Make sure backend server is running on port 5000

### Issue: "Invalid or expired token"
**Solution:** Token may have expired. Re-login through the frontend

### Issue: "MongoDB connection error"
**Solution:** 
- Check MongoDB is running
- Verify connection string in .env
- Check network access if using MongoDB Atlas

### Issue: CORS error
**Solution:** Backend CORS is already configured. If issues persist, check:
- Frontend is on `localhost:5173`
- Backend is on `localhost:5000`

## 6. Next Steps

1. **Create Election Record**: Insert election data in MongoDB
2. **Add Candidates**: Use API to add election candidates
3. **Add Committee Members**: Add election committee details
4. **Seed Voters**: Add all flat residents as voters
5. **Test Voting**: Login as different voters and cast votes
6. **View Results**: Login as admin to see results

## 7. Database Structure

### Collections to Create:

**voters**
```json
{
  "_id": ObjectId,
  "flatNumber": "A-1",
  "name": "John Doe",
  "password": "hashed_password",
  "wing": "A",
  "floorNumber": 1,
  "email": "email@example.com",
  "phone": "phone",
  "role": "voter",
  "createdAt": Date
}
```

**elections**
```json
{
  "_id": ObjectId,
  "name": "2026 Annual Elections",
  "description": "Annual building elections",
  "startDate": Date,
  "endDate": Date,
  "isOpen": true,
  "societyName": "Allah Noor",
  "positions": ["President", "Vice President", "Secretary", "Treasurer"],
  "totalFlats": {"wingA": 45, "wingB": 60}
}
```

**candidates**
```json
{
  "_id": ObjectId,
  "name": "John Smith",
  "position": "President",
  "flatNumber": "A-1",
  "wing": "A",
  "votes": 0,
  "electionId": ObjectId,
  "createdAt": Date
}
```

**votes**
```json
{
  "_id": ObjectId,
  "voterId": ObjectId,
  "flatNumber": "A-1",
  "electionId": ObjectId,
  "votes": {
    "President": ObjectId,
    "Vice President": ObjectId,
    "Secretary": ObjectId,
    "Treasurer": ObjectId
  },
  "timestamp": Date
}
```

**attendance**
```json
{
  "_id": ObjectId,
  "voterId": ObjectId,
  "flatNumber": "A-1",
  "name": "John Doe",
  "electionId": ObjectId,
  "loginTime": Date,
  "voteTime": Date,
  "voted": true
}
```

## Troubleshooting

For detailed logs, check:
- Backend console for server errors
- Browser console (F12) for frontend errors
- MongoDB Compass for data verification
