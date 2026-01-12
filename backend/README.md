# Election Backend API

This is the backend API for the Allah Noor Elections Management System.

## Installation

```bash
cd backend
npm install
```

## Environment Setup

Create a `.env` file in the root of the backend folder:

```
MONGODB_URI=mongodb://localhost:27017/elections_db
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Voter Endpoints
- `POST /api/voters/login` - Login voter
- `GET /api/voters/profile` - Get voter profile
- `PUT /api/voters/profile` - Update voter profile
- `POST /api/voters/create` - Create voter (Admin)
- `GET /api/voters/all` - Get all voters (Admin)
- `DELETE /api/voters/:voterId` - Delete voter (Admin)

### Candidate Endpoints
- `GET /api/candidates/:electionId` - Get all candidates
- `GET /api/candidates/position/:electionId/:position` - Get candidates by position
- `POST /api/candidates/create` - Create candidate (Admin)
- `PUT /api/candidates/:candidateId` - Update candidate (Admin)
- `DELETE /api/candidates/:candidateId` - Delete candidate (Admin)

### Vote Endpoints
- `POST /api/votes/cast` - Cast vote
- `GET /api/votes/status/:electionId` - Check voter status
- `GET /api/votes/results/:electionId` - Get election results (Admin)
- `GET /api/votes/position/:electionId/:position` - Get votes by position (Admin)

### Attendance Endpoints
- `POST /api/attendance/record` - Record attendance
- `GET /api/attendance/report/:electionId` - Get attendance report (Admin)
- `GET /api/attendance/:flatNumber/:electionId` - Get attendance by flat (Admin)
- `PUT /api/attendance/:attendanceId/vote-status` - Update vote status (Admin)

### Committee Endpoints
- `GET /api/committee/:electionId` - Get committee members
- `POST /api/committee/create` - Create committee member (Admin)
- `PUT /api/committee/:memberId` - Update committee member (Admin)
- `DELETE /api/committee/:memberId` - Delete committee member (Admin)

## Database Models

- **Voter** - Flat resident voter information
- **Candidate** - Election candidates
- **Vote** - Cast votes
- **Attendance** - Voter attendance records
- **ElectionCommiteeMember** - Election committee details
- **Election** - Election information

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```
