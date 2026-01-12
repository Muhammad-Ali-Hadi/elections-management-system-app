# 🗳️ Elections Management System - Quick Reference

## 📦 Project Structure
```
Elections/
├── backend/              # Node.js/Express API server
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # API logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   ├── server.js        # Main server
│   ├── seed.js          # Database seeding
│   ├── package.json
│   ├── .env             # Config (MongoDB URI)
│   └── README.md
│
└── elections/           # React frontend
    ├── src/
    │   ├── components/  # Login, Router
    │   ├── pages/       # Vote casting, Results
    │   ├── panels/      # Admin panel, User panel
    │   ├── services/    # API calls (api.js)
    │   └── App.jsx
    ├── .env             # Frontend config
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Quick Start

### Terminal 1: Database Seeding
```bash
cd backend
npm install
npm run seed
```

### Terminal 2: Backend Server
```bash
cd backend
npm run dev
# Should show: "Election API server running on port 5000"
```

### Terminal 3: Frontend Server
```bash
cd elections
npm install
npm run dev
# Should open: http://localhost:5173
```

---

## 🔐 Login Credentials

### Admin
```
Username: admin
Password: admin@12345
Role: Administrator
Access: Dashboard, Results, Candidate Management, Voter Management
```

### Voters
```
Flat Numbers: A-1 to A-45 (Wing A)
             B-1 to B-60 (Wing B)
Password: password@123 (ALL voters)
Role: Voter
Access: Vote Casting, My Profile
```

---

## 📊 Seeded Data Summary

| Entity | Count | Details |
|--------|-------|---------|
| Voters | 105 | A-1 to A-45, B-1 to B-60 |
| Admin | 1 | admin / admin@12345 |
| Elections | 1 | 2026 Annual Elections |
| Candidates | 8 | 2 per position (4 positions) |
| Committee | 6 | 1 Chief, 1 Co-Chief, 4 Members |

---

## 🔑 API Endpoints

### Auth (Public)
- `POST /api/voters/login` - Login voter
- `POST /api/voters/create` - Create voter (Admin)

### Voting
- `POST /api/votes/cast` - Cast vote
- `GET /api/votes/status/:electionId` - Check if voted
- `GET /api/votes/results/:electionId` - Get results (Admin)

### Attendance
- `POST /api/attendance/record` - Record login
- `GET /api/attendance/report/:electionId` - Get report (Admin)

### Candidates
- `GET /api/candidates/:electionId` - List candidates
- `POST /api/candidates/create` - Add candidate (Admin)

### Committee
- `GET /api/committee/:electionId` - List members
- `POST /api/committee/create` - Add member (Admin)

---

## 🛠️ Common Commands

```bash
# Backend
npm install              # Install dependencies
npm run dev             # Start dev server with auto-reload
npm run start           # Start production server
npm run seed            # Populate database

# Frontend
npm install             # Install dependencies
npm run dev             # Start dev server with Vite
npm run build           # Build for production
npm run preview         # Preview production build
```

---

## 🧪 Test Scenarios

### Scenario 1: Voter Login & Vote
1. Go to http://localhost:5173
2. Enter Flat: A-1, Password: password@123
3. Click Vote tab
4. Select candidates for all positions
5. Submit vote
6. View My Profile to confirm

### Scenario 2: Admin Dashboard
1. Go to http://localhost:5173
2. Click "Switch to Admin Login"
3. Username: admin, Password: admin@12345
4. Access Dashboard → Finalize Results
5. View voting statistics

### Scenario 3: Multiple Voters
1. Login as A-5 and vote
2. Logout
3. Login as B-25 and vote
4. Logout
5. Login as admin and check attendance report

---

## 📱 Frontend Features

| Page | Voter Access | Admin Access |
|------|:-----:|:-----:|
| Login | ✓ | ✓ |
| Vote Casting | ✓ | ✗ |
| My Profile | ✓ | ✗ |
| Results | ✗ | ✓ |
| Dashboard | ✗ | ✓ |

---

## 🗄️ MongoDB Collections

**Voters**: 105 documents (A-1 to B-60)
**Admins**: 1 document
**Elections**: 1 document
**Candidates**: 8 documents
**ElectionCommitteeMembers**: 6 documents
**Votes**: Empty (populated as votes are cast)
**Attendance**: Empty (populated on login)

---

## ⚙️ Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot connect MongoDB | Check URI in `.env` & MongoDB is running |
| Port 5000 in use | `lsof -i :5000` and kill process |
| Frontend can't reach API | Ensure backend is running on 5000 |
| Login fails | Run `npm run seed` to populate voters |
| Token expired | Logout and login again |

---

## 📝 File Locations

| File | Path |
|------|------|
| Login Component | `elections/src/components/Login.jsx` |
| Admin Panel | `elections/src/panels/adminpanel.jsx` |
| Vote Casting | `elections/src/pages/vote_casting.jsx` |
| API Service | `elections/src/services/api.js` |
| Voter Model | `backend/models/Voter.js` |
| Vote Controller | `backend/controllers/voteController.js` |
| Seed Script | `backend/seed.js` |

---

## 🔄 Data Flow

```
User Login
    ↓
Frontend: Login Component
    ↓
Backend: voterAPI.login()
    ↓
MongoDB: Find voter, verify password
    ↓
JWT Token returned & stored in localStorage
    ↓
Access API endpoints with Authorization header
```

---

## 📞 Support Checklist

Before reporting issues:
- [ ] MongoDB is running and connected
- [ ] Backend server is on port 5000
- [ ] Frontend server is on port 5173
- [ ] Database has been seeded (`npm run seed`)
- [ ] No error messages in browser console (F12)
- [ ] No error messages in terminal
- [ ] Check network tab for API response codes

---

## 📅 Features Summary

✅ User authentication with JWT
✅ Role-based access control (Admin/Voter)
✅ Database storage with MongoDB
✅ Vote casting and recording
✅ Real-time attendance tracking
✅ Admin dashboard with results
✅ Voter profiles and voting history
✅ Election committee management
✅ Candidate management
✅ Security: Password hashing, token verification

---

## 🎯 Next Steps

1. **Run seed script** to populate database
2. **Start backend** on port 5000
3. **Start frontend** on port 5173
4. **Test with sample credentials**
5. **Deploy when ready**

---

**Version**: 1.0.0 | **Date**: January 2026 | **Status**: ✅ Ready for Testing
