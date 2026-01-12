# 📋 Database Seeding & Voter Credentials Summary

## ✅ What Has Been Created

### 1. **Seeding Script** (`backend/seed.js`)
A Node.js script that automatically populates your MongoDB database with:
- 105 voters (all flat numbers A-1 to A-45 and B-1 to B-60)
- 1 admin user with full permissions
- 1 complete election for 2026
- 8 sample candidates (2 for each position)
- 6 election committee members

### 2. **Voter Credentials**
```
Format: Flat Number / Password
Examples:
  A-1 / password@123
  A-25 / password@123
  B-1 / password@123
  B-60 / password@123

✅ SAME PASSWORD FOR ALL VOTERS: password@123
```

### 3. **Admin Credentials**
```
Username: admin
Password: admin@12345
```

### 4. **Committee Members**
6 committee members with roles:
- 1 Chief (Mr. Raj Patel - A-1)
- 1 Co-Chief (Mrs. Priya Sharma - B-1)
- 4 Members with different responsibilities

---

## 🚀 How to Run the Seeding Script

### Step 1: Open Terminal in Backend Folder
```bash
cd c:\Users\aquar\Web_Dev\Elections\backend
```

### Step 2: Install Dependencies (if not already done)
```bash
npm install
```

### Step 3: Ensure MongoDB is Connected
- Verify your `.env` file has correct MongoDB URI
- Make sure MongoDB is running

### Step 4: Run the Seed Script
```bash
npm run seed
```

### Expected Output:
```
✓ Connected to MongoDB
✓ Cleared existing data
✓ Admin created - Username: admin, Password: admin@12345
✓ Created 105 voters (A-1 to A-45, B-1 to B-60)
  Voter credentials - Flat: A-1 to A-45 or B-1 to B-60, Password: password@123
✓ Election created: 2026 Annual Elections - Allah Noor
✓ Created 8 sample candidates
✓ Created 6 election committee members

============================================================
✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!
============================================================

📋 LOGIN CREDENTIALS:
────────────────────────────────────────────────────────────
ADMIN LOGIN:
  Username: admin
  Password: admin@12345

VOTER LOGIN:
  Flat Numbers: A-1 to A-45, B-1 to B-60
  Password: password@123
  (Same password for all voters)
────────────────────────────────────────────────────────────
```

---

## 🔍 Verify in MongoDB Compass

After running the seed script, verify the data in MongoDB Compass:

### Collections Created:
1. **voters** - Should have 105 documents
2. **admins** - Should have 1 document
3. **elections** - Should have 1 document
4. **candidates** - Should have 8 documents
5. **electioncommiteemembers** - Should have 6 documents
6. **votes** - Should be empty (populated as votes are cast)
7. **attendance** - Should be empty (populated on login)

### Sample Voter Record:
```json
{
  "_id": ObjectId("..."),
  "flatNumber": "A-1",
  "name": "Resident A-1",
  "password": "$2a$10$...",  // Hashed with bcryptjs
  "wing": "A",
  "floorNumber": 1,
  "email": "resident1@allahnnoor.com",
  "phone": "+91-900-1000001",
  "role": "voter",
  "createdAt": ISODate("2026-01-01T00:00:00Z")
}
```

---

## 📊 Database Statistics After Seeding

| Entity | Count | Details |
|--------|-------|---------|
| **Voters** | 105 | A-1 to A-45 (Wing A), B-1 to B-60 (Wing B) |
| **Admin** | 1 | admin@12345 |
| **Elections** | 1 | 2026 Annual Elections - Allah Noor |
| **Candidates** | 8 | 2 each for President, V.P., Secretary, Treasurer |
| **Committee Members** | 6 | 1 Chief, 1 Co-Chief, 4 Members |
| **Total Flats** | 105 | 45 in Wing A + 60 in Wing B |

---

## 🎯 Test Login Examples

### Test as Voter A-1
```
Flat Number: A-1
Password: password@123
```
✅ Should redirect to vote casting page

### Test as Voter B-30
```
Flat Number: B-30
Password: password@123
```
✅ Should redirect to vote casting page

### Test as Admin
```
Username: admin
Password: admin@12345
```
✅ Should redirect to admin dashboard

---

## 📝 Important Notes

### Passwords
- **All voters** use the same password: `password@123`
- **Admin** uses: `admin@12345`
- Passwords are hashed with bcryptjs (never stored in plain text)

### Flat Numbers Format
- **Wing A**: A-1, A-2, A-3, ... A-45
- **Wing B**: B-1, B-2, B-3, ... B-60
- Each flat has unique number (primary identifier)

### Email Format
- Voters: `resident{number}@allahnnoor.com` (e.g., resident5@allahnnoor.com)
- Wing B voters: `resident-b{number}@allahnnoor.com`
- Admin: `admin@allahnnoor.com`
- Committee: Individual emails as defined in script

### Security Features
✅ Passwords are hashed with bcryptjs (10 salt rounds)
✅ JWT tokens for authentication
✅ Role-based access control (admin vs voter)
✅ Token expiration (24 hours)

---

## 🔄 Testing Workflow

### 1. Seed Database
```bash
npm run seed
```

### 2. Start Backend
```bash
npm run dev
# Terminal shows: "Election API server running on port 5000"
```

### 3. Start Frontend (different terminal)
```bash
cd ../elections
npm run dev
# Browser opens: http://localhost:5173
```

### 4. Test Login
- Try admin credentials
- Try voter credentials
- Verify JWT token is stored in localStorage

### 5. Test Voting
- Cast votes as voter
- Check attendance records as admin
- Verify results are calculating correctly

### 6. Multiple Voter Test
- Login as A-1, vote, logout
- Login as A-2, vote, logout
- Login as admin, check results

---

## ⚙️ If You Need to Change Passwords

Edit `backend/seed.js`:

### Change Admin Password
Find line ~25:
```javascript
const adminPassword = await bcrypt.hash('admin@12345', 10);
```
Change `'admin@12345'` to your desired password.

### Change Voter Password
Find line ~44:
```javascript
const basePassword = 'password@123';
```
Change `'password@123'` to your desired password.

Then run `npm run seed` again to update database.

---

## 🆘 Troubleshooting

### Issue: "ECONNREFUSED - Cannot connect to MongoDB"
**Solution:**
1. Check MongoDB is running
2. Verify MongoDB URI in `.env`
3. Check network access (if using MongoDB Atlas)

### Issue: "Collection already exists"
**Solution:** The script automatically clears data. Just run again.

### Issue: "bcryptjs not found"
**Solution:**
```bash
npm install bcryptjs
```

### Issue: "Seed script runs but data not in Compass"
**Solution:**
1. Verify MongoDB URI is correct
2. Try refreshing connection in Compass
3. Check database name in URI matches

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Seed database | `npm run seed` |
| Start backend | `npm run dev` |
| Start frontend | `npm run dev` (in elections folder) |
| Clear & reseed | `npm run seed` |
| View database | Open MongoDB Compass |
| Test API | See API_TESTING.md |

---

## 🎯 Sample Login Tests

### All Wing A Voters
- A-1, A-2, A-3, ... A-45
- Password: password@123

### All Wing B Voters
- B-1, B-2, B-3, ... B-60
- Password: password@123

### Sample Candidates
- Ahmed Hassan (A-5) - President
- Fatima Khan (B-20) - President
- Mohammed Ali (A-12) - Vice President
- Aisha Malik (B-35) - Vice President
- Ibrahim Said (A-18) - Secretary
- Zainab Ahmed (B-42) - Secretary
- Omar Hassan (A-25) - Treasurer
- Noor Ibrahim (B-55) - Treasurer

### Sample Committee
- Chief: Raj Patel (A-1)
- Co-Chief: Priya Sharma (B-1)
- Members: Vikram Singh (A-10), Deepa Nair (B-30), Arjun Das (A-35), Sneha Gupta (B-50)

---

## 📄 Documentation Files

| File | Purpose |
|------|---------|
| `QUICK_REFERENCE.md` | Fast lookup for commands & credentials |
| `DATABASE_SEEDING.md` | Detailed seeding guide with examples |
| `API_TESTING.md` | cURL examples for all API endpoints |
| `SETUP_GUIDE.md` | Complete setup instructions |

---

## ✅ Completion Checklist

- [x] Seeding script created (`seed.js`)
- [x] Package.json updated with `npm run seed` command
- [x] All 105 voters (A-1 to B-60) created with passwords
- [x] Admin user created (admin / admin@12345)
- [x] Election created (2026 Annual Elections)
- [x] 8 candidates created (2 per position)
- [x] 6 committee members created
- [x] Documentation complete
- [x] Ready for testing!

---

**Status**: ✅ **READY FOR DEPLOYMENT**

Your database is now fully populated and ready for testing! 🎉

Run `npm run seed` to populate the database, then start both servers and test with the credentials above.
