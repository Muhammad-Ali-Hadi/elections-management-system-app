# API Testing Guide - cURL & Postman Examples

All requests assume backend is running on `http://localhost:5000`

---

## 📌 Authentication
JWT tokens are stored in `Authorization` header:
```
Authorization: Bearer <token_from_login>
```

---

## 🔐 VOTER LOGIN

### cURL
```bash
curl -X POST http://localhost:5000/api/voters/login \
  -H "Content-Type: application/json" \
  -d '{
    "flatNumber": "A-1",
    "password": "password@123"
  }'
```

### Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "flatNumber": "A-1",
    "name": "Resident A-1",
    "wing": "A",
    "role": "voter"
  }
}
```

### Save Token (for next requests)
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 👤 GET VOTER PROFILE

### cURL
```bash
curl -X GET http://localhost:5000/api/voters/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Response
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "flatNumber": "A-1",
  "name": "Resident A-1",
  "wing": "A",
  "floorNumber": 1,
  "email": "resident1@allahnnoor.com",
  "phone": "+91-900-1000001",
  "role": "voter"
}
```

---

## 🗳️ CAST VOTE

### cURL
```bash
curl -X POST http://localhost:5000/api/votes/cast \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "electionId": "default-election-2026",
    "votes": {
      "President": "candidate_id_1",
      "Vice President": "candidate_id_2",
      "Secretary": "candidate_id_3",
      "Treasurer": "candidate_id_4"
    }
  }'
```

### Response
```json
{
  "success": true,
  "message": "Vote recorded successfully",
  "vote": {
    "_id": "507f1f77bcf86cd799439012",
    "voterId": "507f1f77bcf86cd799439011",
    "flatNumber": "A-1",
    "electionId": "default-election-2026",
    "votes": {
      "President": "candidate_id_1",
      "Vice President": "candidate_id_2",
      "Secretary": "candidate_id_3",
      "Treasurer": "candidate_id_4"
    },
    "timestamp": "2026-01-15T10:30:00Z"
  }
}
```

---

## 📋 GET CANDIDATES

### cURL
```bash
curl -X GET "http://localhost:5000/api/candidates/default-election-2026"
```

### Response
```json
{
  "success": true,
  "count": 8,
  "candidates": [
    {
      "_id": "candidate_id_1",
      "name": "Ahmed Hassan",
      "position": "President",
      "flatNumber": "A-5",
      "wing": "A",
      "votes": 0,
      "electionId": "default-election-2026"
    },
    {
      "_id": "candidate_id_2",
      "name": "Fatima Khan",
      "position": "President",
      "flatNumber": "B-20",
      "wing": "B",
      "votes": 0,
      "electionId": "default-election-2026"
    }
  ]
}
```

---

## ✅ CHECK VOTER STATUS

### cURL
```bash
curl -X GET "http://localhost:5000/api/votes/status/default-election-2026" \
  -H "Authorization: Bearer $TOKEN"
```

### Response (Not Voted)
```json
{
  "success": true,
  "hasVoted": false,
  "vote": null
}
```

### Response (Already Voted)
```json
{
  "success": true,
  "hasVoted": true,
  "vote": {
    "_id": "vote_id",
    "voterId": "voter_id",
    "votes": { ... },
    "timestamp": "2026-01-15T10:30:00Z"
  }
}
```

---

## 📊 GET ELECTION RESULTS (ADMIN ONLY)

### cURL
```bash
curl -X GET "http://localhost:5000/api/votes/results/default-election-2026" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Response
```json
{
  "success": true,
  "results": {
    "totalVotes": 25,
    "candidateResults": {
      "President": [
        {
          "_id": "candidate_id_1",
          "name": "Ahmed Hassan",
          "votes": 15,
          "percentage": 60
        },
        {
          "_id": "candidate_id_2",
          "name": "Fatima Khan",
          "votes": 10,
          "percentage": 40
        }
      ],
      "Vice President": [ ... ],
      "Secretary": [ ... ],
      "Treasurer": [ ... ]
    },
    "positionWinners": {
      "President": { "name": "Ahmed Hassan", "votes": 15 },
      "Vice President": { ... },
      "Secretary": { ... },
      "Treasurer": { ... }
    }
  }
}
```

---

## 📋 GET ATTENDANCE REPORT (ADMIN ONLY)

### cURL
```bash
curl -X GET "http://localhost:5000/api/attendance/report/default-election-2026" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Response
```json
{
  "success": true,
  "report": {
    "totalRegistered": 105,
    "totalPresent": 25,
    "totalVoted": 25,
    "presentButNotVoted": 0,
    "attendanceList": [
      {
        "_id": "attendance_id",
        "voterId": {
          "_id": "voter_id",
          "name": "Resident A-1",
          "flatNumber": "A-1"
        },
        "flatNumber": "A-1",
        "loginTime": "2026-01-15T10:00:00Z",
        "voteTime": "2026-01-15T10:30:00Z",
        "voted": true
      }
    ]
  }
}
```

---

## 👥 GET ALL VOTERS (ADMIN ONLY)

### cURL
```bash
curl -X GET "http://localhost:5000/api/voters/all" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Response
```json
{
  "success": true,
  "count": 105,
  "voters": [
    {
      "_id": "voter_id_1",
      "flatNumber": "A-1",
      "name": "Resident A-1",
      "wing": "A",
      "email": "resident1@allahnnoor.com",
      "phone": "+91-900-1000001",
      "role": "voter"
    },
    {
      "_id": "voter_id_2",
      "flatNumber": "A-2",
      "name": "Resident A-2",
      "wing": "A",
      "email": "resident2@allahnnoor.com",
      "phone": "+91-900-1000002",
      "role": "voter"
    }
  ]
}
```

---

## 👥 CREATE VOTER (ADMIN ONLY)

### cURL
```bash
curl -X POST http://localhost:5000/api/voters/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "flatNumber": "A-46",
    "name": "New Resident",
    "password": "SecurePass@123",
    "wing": "A",
    "floorNumber": 16,
    "email": "newresident@allahnnoor.com",
    "phone": "+91-900-1000046"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Voter registered successfully",
  "voter": {
    "id": "new_voter_id",
    "flatNumber": "A-46",
    "name": "New Resident"
  }
}
```

---

## 🎤 CREATE CANDIDATE (ADMIN ONLY)

### cURL
```bash
curl -X POST http://localhost:5000/api/candidates/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "New Candidate",
    "position": "President",
    "flatNumber": "A-30",
    "wing": "A",
    "description": "Community enthusiast",
    "electionId": "default-election-2026"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Candidate created successfully",
  "candidate": {
    "_id": "new_candidate_id",
    "name": "New Candidate",
    "position": "President",
    "flatNumber": "A-30",
    "wing": "A",
    "votes": 0
  }
}
```

---

## 🏛️ CREATE COMMITTEE MEMBER (ADMIN ONLY)

### cURL
```bash
curl -X POST http://localhost:5000/api/committee/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "New Committee Member",
    "position": "Member",
    "flatNumber": "B-60",
    "wing": "B",
    "email": "member@allahnnoor.com",
    "phone": "+91-98765-43216",
    "responsibilities": "Election oversight",
    "electionId": "default-election-2026"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Election committee member added successfully",
  "member": {
    "_id": "new_member_id",
    "name": "New Committee Member",
    "position": "Member",
    "flatNumber": "B-60",
    "wing": "B"
  }
}
```

---

## 🗑️ DELETE VOTER (ADMIN ONLY)

### cURL
```bash
curl -X DELETE http://localhost:5000/api/voters/voter_id_to_delete \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Response
```json
{
  "success": true,
  "message": "Voter deleted successfully"
}
```

---

## 🗑️ DELETE CANDIDATE (ADMIN ONLY)

### cURL
```bash
curl -X DELETE http://localhost:5000/api/candidates/candidate_id_to_delete \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Response
```json
{
  "success": true,
  "message": "Candidate deleted successfully"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Backend error |

---

## Common Error Responses

### Invalid Credentials
```json
{
  "message": "Invalid flat number or password"
}
```

### Already Voted
```json
{
  "message": "You have already voted in this election"
}
```

### Token Expired
```json
{
  "message": "Invalid or expired token"
}
```

### Access Denied
```json
{
  "message": "Access denied. Admin only."
}
```

---

## Testing Workflow

1. **Login as voter**
   ```bash
   curl -X POST http://localhost:5000/api/voters/login \
     -H "Content-Type: application/json" \
     -d '{"flatNumber": "A-1", "password": "password@123"}'
   ```

2. **Save returned token**
   ```bash
   TOKEN="<token_from_response>"
   ```

3. **Get profile to verify login**
   ```bash
   curl -X GET http://localhost:5000/api/voters/profile \
     -H "Authorization: Bearer $TOKEN"
   ```

4. **Get candidates for election**
   ```bash
   curl -X GET "http://localhost:5000/api/candidates/default-election-2026"
   ```

5. **Cast vote**
   ```bash
   curl -X POST http://localhost:5000/api/votes/cast \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{...}'
   ```

6. **Verify vote was cast**
   ```bash
   curl -X GET "http://localhost:5000/api/votes/status/default-election-2026" \
     -H "Authorization: Bearer $TOKEN"
   ```

---

**API Version**: 1.0.0 | **Last Updated**: January 2026
