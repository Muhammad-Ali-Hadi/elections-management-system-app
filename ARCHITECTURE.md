# System Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     ELECTIONS MANAGEMENT SYSTEM                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐         ┌──────────────────────────┐
│     FRONTEND (React)      │         │    BACKEND (Node.js)     │
│   localhost:5173          │         │   localhost:5000         │
├──────────────────────────┤         ├──────────────────────────┤
│ • Login Component        │◄───────►│ • Auth Middleware        │
│ • Vote Casting Page      │  HTTP   │ • Voter Controller       │
│ • Results Page           │  REST   │ • Vote Controller        │
│ • Admin Panel            │  API    │ • Candidate Controller   │
│ • User Profile Panel     │         │ • Attendance Controller  │
│ • API Service (api.js)   │         │ • Committee Controller   │
│ • Vite Dev Server        │         │ • Express Server         │
└──────────────────────────┘         └──────────────────────────┘
         │                                      │
         │                                      │
         └──────────────┬───────────────────────┘
                        │
                        │ MongoDB Connection
                        ▼
        ┌──────────────────────────────────┐
        │   MONGODB DATABASE               │
        │   (localhost:27017)              │
        ├──────────────────────────────────┤
        │ Collections:                     │
        │ • voters (105 documents)         │
        │ • admins (1 document)            │
        │ • elections (1 document)         │
        │ • candidates (8 documents)       │
        │ • votes (populated as votes)     │
        │ • attendance (populated on login)│
        │ • committee (6 documents)        │
        └──────────────────────────────────┘
```

---

## 🔄 Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

VOTER LOGIN:
  1. User enters Flat Number (A-1) & Password (password@123)
           │
           ▼
  2. Frontend: voterAPI.login(flatNumber, password)
           │
           ▼
  3. Backend: POST /api/voters/login
           │
           ▼
  4. MongoDB: Find voter by flatNumber
           │
           ▼
  5. Verify password with bcryptjs.compare()
           │
           ├─ MATCH ─► Generate JWT Token
           │
           └─ NO MATCH ─► Return Error "Invalid credentials"
                          │
                          ▼
                      Show Error Message
                          │
                          ▼
                      Return Error to Frontend
           │
           ▼
  6. Frontend: Store token in localStorage
           │
           ▼
  7. Redirect to Voting Page
           │
           ▼
  8. All subsequent requests include token in Authorization header

ADMIN LOGIN:
  • Uses hardcoded credentials (admin / admin@12345)
  • Not validated against database (local validation only)
  • Redirects to Admin Dashboard

TOKEN VALIDATION:
  • Every protected API request requires valid JWT
  • Token stored in: localStorage.authToken
  • Token sent as: Authorization: Bearer {token}
  • Token expires in: 24 hours
  • Backend verifies token before processing request
```

---

## 📊 Data Models Relationship

```
┌──────────────────────────────────────────────────────────────────┐
│                    DATABASE RELATIONSHIPS                        │
└──────────────────────────────────────────────────────────────────┘

ELECTION (1)
├─ name: "2026 Annual Elections - Allah Noor"
├─ positions: [President, V.P., Secretary, Treasurer]
├─ startDate, endDate, isOpen
└─ totalFlats: {wingA: 45, wingB: 60}
    │
    ├──────────────┬──────────────┬──────────────┐
    │              │              │              │
    ▼              ▼              ▼              ▼
CANDIDATES (8)   VOTERS (105)   VOTES        COMMITTEE (6)
│                │              │            │
├─ name         ├─ flatNumber  ├─ voterId ──┼─ name
├─ position     ├─ name        ├─ votes      ├─ position
├─ flatNumber   ├─ password    ├─ timestamp  ├─ flatNumber
├─ votes (0..105)├─ wing       └─ electionId ├─ email
└─ electionId   ├─ email                     └─ phone
                ├─ phone
                ├─ role
                └─ electionId

ATTENDANCE (populated on login)
├─ voterId ──────► VOTER
├─ loginTime
├─ voteTime
├─ voted: true/false
└─ electionId

ADMIN
├─ username: "admin"
├─ password: "admin@12345"
├─ email: "admin@allahnnoor.com"
├─ role: "admin"
└─ permissions: [manage_election, manage_voters, view_results]
```

---

## 🔐 Security Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                             │
└──────────────────────────────────────────────────────────────────┘

LAYER 1: PASSWORD SECURITY
  User enters password
       │
       ▼
  bcryptjs.hash(password, 10)
       │
       ▼
  Hashed password stored in MongoDB
  (Original password NEVER stored)


LAYER 2: AUTHENTICATION
  Login attempt
       │
       ▼
  Verify password with bcryptjs.compare()
       │
       ▼
  On success: Generate JWT Token
  On failure: Return "Invalid credentials"


LAYER 3: TOKEN MANAGEMENT
  JWT Token created with:
  • User ID
  • Flat Number
  • Role (voter/admin)
  • Expiration (24 hours)


LAYER 4: AUTHORIZATION
  Request with Authorization header
       │
       ▼
  Verify JWT token signature
       │
       ├─ VALID ───► Check user role
       │             │
       │             ├─ Admin ───► Allow admin endpoints
       │             │
       │             └─ Voter ───► Allow voter endpoints
       │
       └─ INVALID ──► Return 401 Unauthorized


LAYER 5: ROLE-BASED ACCESS CONTROL (RBAC)
  
  VOTER can:
  ✓ View candidates
  ✓ Cast vote (once)
  ✓ View own profile
  ✗ Cannot view results
  ✗ Cannot manage voters
  ✗ Cannot manage candidates

  ADMIN can:
  ✓ View all voters
  ✓ View results
  ✓ Manage candidates
  ✓ Manage committee
  ✓ View attendance reports
  ✓ Finalize results
  ✗ Cannot vote


LAYER 6: DATA VALIDATION
  • Input sanitization
  • Type checking
  • Required field validation
  • Unique constraint enforcement (flatNumber, email)
```

---

## 🔄 Voting Process Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    VOTING PROCESS FLOW                           │
└──────────────────────────────────────────────────────────────────┘

1. VOTER LOGIN
   Flat Number: A-1
   Password: password@123
          │
          ▼
   ✓ Valid ──► Token stored ──► Redirect to vote page


2. FETCH CANDIDATES
   GET /api/candidates/{electionId}
          │
          ▼
   Display list of candidates by position:
   ┌─ President (2 candidates)
   ├─ Vice President (2 candidates)
   ├─ Secretary (2 candidates)
   └─ Treasurer (2 candidates)


3. SELECT CANDIDATES
   Voter selects one candidate for each position
   selectedCandidates = {
     President: candidate_id_1,
     Vice President: candidate_id_2,
     Secretary: candidate_id_3,
     Treasurer: candidate_id_4
   }
          │
          ▼
   Enable Submit Button


4. CAST VOTE
   POST /api/votes/cast
   Headers: Authorization: Bearer {token}
   Body: {electionId, votes}
          │
          ▼
   Backend checks: Has this voter already voted?
          │
          ├─ YES ──► Error: "Already voted"
          │
          └─ NO ──► Continue
                   │
                   ▼
                   Save vote to database
                   Update candidate vote counts
                   Record attendance (voteTime)
                   │
                   ▼
                   Response: ✓ Vote recorded


5. CONFIRMATION
   Display: "Thank you for voting!"
   Button: Go to My Profile
          │
          ▼
   Voter cannot vote again (prevented by check)


6. PREVENT DUPLICATE VOTING
   Next login attempt:
   hasVoted = electionData.votes[voterId] !== undefined
          │
          ├─ VOTED ──► Show success message (read-only)
          │
          └─ NOT VOTED ──► Show voting form


7. RESULTS (ADMIN ONLY)
   GET /api/votes/results/{electionId}
          │
          ▼
   Calculate votes per candidate per position
          │
          ▼
   Determine winners
          │
          ▼
   Display statistics and results
```

---

## 📡 API Communication Pattern

```
┌──────────────────────────────────────────────────────────────────┐
│                    API COMMUNICATION FLOW                        │
└──────────────────────────────────────────────────────────────────┘

FRONTEND (React)              BACKEND (Express)         DATABASE (MongoDB)
     │                              │                           │
     │ 1. Login Request             │                           │
     ├──────────────────────────────►                           │
     │ {flatNumber, password}        │                           │
     │                              │ 2. Query Voter             │
     │                              ├──────────────────────────► 
     │                              │ findOne({flatNumber})      │
     │                              │                           │
     │                              │◄──────────────────────────┤
     │                              │ Voter document             │
     │                              │                           │
     │                              │ 3. Hash comparison        │
     │                              │ (bcryptjs.compare)        │
     │                              │                           │
     │ 4. Login Response            │                           │
     │◄──────────────────────────────┤                           │
     │ {token, user}                │                           │
     │                              │                           │
     │ (Store token in localStorage)                            │
     │                              │                           │
     │ 5. Get Candidates (w/ token) │                           │
     ├──────────────────────────────►                           │
     │ Auth: Bearer {token}         │                           │
     │                              │ 6. Query Candidates       │
     │                              ├──────────────────────────► 
     │                              │ find({electionId})        │
     │                              │                           │
     │                              │◄──────────────────────────┤
     │                              │ Candidates array          │
     │                              │                           │
     │ 7. Candidates Response       │                           │
     │◄──────────────────────────────┤                           │
     │ {candidates}                 │                           │
     │                              │                           │
     │ 8. Cast Vote (w/ token)      │                           │
     ├──────────────────────────────►                           │
     │ Auth: Bearer {token}         │                           │
     │ {electionId, votes}          │                           │
     │                              │ 9. Insert Vote            │
     │                              ├──────────────────────────► 
     │                              │ insertOne(voteData)       │
     │                              │                           │
     │                              │ 10. Update Candidate      │
     │                              ├──────────────────────────► 
     │                              │ updateOne({votes: +1})    │
     │                              │                           │
     │                              │ 11. Record Attendance     │
     │                              ├──────────────────────────► 
     │                              │ updateOne({voted: true})  │
     │                              │                           │
     │                              │◄──────────────────────────┤
     │                              │ Success                   │
     │                              │                           │
     │ 12. Vote Response            │                           │
     │◄──────────────────────────────┤                           │
     │ {success: true}              │                           │
     │                              │                           │
     │ Display: "Thank You!"        │                           │
     │                              │                           │
```

---

## 📈 Performance Optimization

```
INDEXING:
├─ voters.flatNumber (UNIQUE, INDEXED)
├─ votes.voterId (INDEXED)
├─ candidates.position (INDEXED)
└─ attendance.flatNumber (INDEXED)

CACHING:
├─ JWT Token in localStorage
├─ User profile in component state
└─ Candidates list in component state

PAGINATION (future):
├─ Voters list (admin)
├─ Candidates list
└─ Attendance report
```

---

## ✅ System Status

- **Authentication**: ✓ JWT-based with token storage
- **Authorization**: ✓ Role-based access control
- **Database**: ✓ MongoDB with 7 collections
- **API Security**: ✓ Protected endpoints with middleware
- **Vote Security**: ✓ One vote per voter enforcement
- **Data Integrity**: ✓ Password hashing, data validation
- **Error Handling**: ✓ Proper HTTP status codes and messages

---

**Architecture Version**: 1.0 | **Last Updated**: January 2026
