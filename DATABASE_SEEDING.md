# Database Seeding Guide

## What Will Be Seeded

The seeding script will populate your MongoDB database with:

### 1. **Admin User**
- Username: `admin`
- Password: `admin@12345`
- Email: admin@allahnnoor.com
- Permissions: manage_election, manage_voters, view_results

### 2. **All Flat Residents (105 voters)**
- **Wing A**: Flats A-1 to A-45 (45 flats)
- **Wing B**: Flats B-1 to B-60 (60 flats)
- **Password for all voters**: `password@123`

**Voter Details Include:**
- Flat Number (unique identifier)
- Name: "Resident {FlatNumber}"
- Email: resident{number}@allahnnoor.com
- Phone: Generated unique number for each
- Floor number calculated automatically

### 3. **Sample Election**
- Name: 2026 Annual Elections - Allah Noor
- Status: Open for voting
- Positions: President, Vice President, Secretary, Treasurer

### 4. **Sample Candidates (8 total)**
- 2 candidates for each position
- Mix of Wing A and Wing B residents
- Example: Ahmed Hassan (A-5) for President

### 5. **Election Committee (6 members)**
- 1 Chief
- 1 Co-Chief  
- 4 Committee Members
- Mix of responsibilities

---

## How to Seed the Database

### Step 1: Install Dependencies (if not done)
```bash
cd c:\Users\aquar\Web_Dev\Elections\backend
npm install
```

### Step 2: Ensure MongoDB is Running
- If using local MongoDB: Make sure MongoDB service is running
- If using MongoDB Atlas: Verify connection string in `.env`

### Step 3: Run the Seed Script
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

📊 ELECTION DATA CREATED:
  Election ID: [generated ID]
  Total Voters: 105
  Total Candidates: 8
  Committee Members: 6
────────────────────────────────────────────────────────────

🎯 NEXT STEPS:
  1. Start backend server: npm run dev
  2. Start frontend server: npm run dev (in elections folder)
  3. Login with admin credentials in the UI
  4. Or login with any voter flat number (A-1, B-25, etc.)
────────────────────────────────────────────────────────────
```

---

## Test Login Credentials

### Admin Panel
```
Login Type: Admin
Username: admin
Password: admin@12345
```

### Voter Panel (Choose Any)
```
Flat Number: A-1
Password: password@123

--- OR ---

Flat Number: B-30
Password: password@123

--- OR ANY FLAT FROM A-1 TO B-60 ---
```

---

## Verify Seeding in MongoDB Compass

### 1. Open MongoDB Compass
### 2. Connect to your MongoDB instance
### 3. Check these collections exist:
   - `voters` (105 documents)
   - `admins` (1 document)
   - `elections` (1 document)
   - `candidates` (8 documents)
   - `electioncommiteemembers` (6 documents)

---

## Sample Voter Records

### Sample Voter 1 (Wing A)
```json
{
  "flatNumber": "A-5",
  "name": "Resident A-5",
  "password": "hashed_password",
  "wing": "A",
  "floorNumber": 2,
  "email": "resident5@allahnnoor.com",
  "phone": "+91-900-1000005",
  "role": "voter"
}
```

### Sample Voter 2 (Wing B)
```json
{
  "flatNumber": "B-30",
  "name": "Resident B-30",
  "password": "hashed_password",
  "wing": "B",
  "floorNumber": 8,
  "email": "resident-b30@allahnnoor.com",
  "phone": "+91-901-1000030",
  "role": "voter"
}
```

---

## Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Ensure MongoDB is running
- Check connection string in `.env` file
- Verify network access if using MongoDB Atlas

### Issue: "Collection already exists" error
**Solution:**
- The script automatically clears existing data
- Run `npm run seed` again

### Issue: "Module not found: bcryptjs"
**Solution:**
```bash
npm install bcryptjs
```

### Issue: "Connection timeout"
**Solution:**
- Check MongoDB URI in `.env`
- For Atlas: Whitelist your IP address in security settings
- For local: Ensure MongoDB daemon is running

---

## Next Steps After Seeding

1. **Start Backend Server:**
   ```bash
   npm run dev
   ```
   (Should show: "Election API server running on port 5000")

2. **Start Frontend Server (in separate terminal):**
   ```bash
   cd ../elections
   npm run dev
   ```

3. **Test the Application:**
   - Go to http://localhost:5173
   - Try admin login: admin / admin@12345
   - Try voter login: A-1 / password@123
   - Cast votes
   - View results

---

## Modifying Seed Data

To change default passwords or add more data, edit `seed.js`:

### Change Admin Password:
Find this line:
```javascript
const adminPassword = await bcrypt.hash('admin@12345', 10);
```
Change `'admin@12345'` to your desired password.

### Change Voter Password:
Find this line:
```javascript
const basePassword = 'password@123';
```
Change `'password@123'` to your desired password.

### Add More Candidates:
Add entries to the `candidates` array in seed.js with desired position and flatNumber.

---

## Important Notes

⚠️ **Security Reminder:**
- The default passwords used are for development/testing only
- Change passwords before deploying to production
- Never commit `.env` files with actual credentials to version control

---

## Database Collections Structure

### voters
- flatNumber (unique)
- name
- password (hashed)
- wing (A or B)
- floorNumber
- email
- phone
- role

### admins
- username (unique)
- password (hashed)
- email (unique)
- name
- role
- permissions

### elections
- name
- description
- startDate
- endDate
- isOpen
- societyName
- positions
- totalFlats

### candidates
- name
- position
- flatNumber
- wing
- description
- votes (counter)
- electionId

### electioncommiteemembers
- name
- position
- flatNumber
- wing
- email
- phone
- responsibilities
- electionId

### votes
- voterId
- flatNumber
- electionId
- votes (object with positions as keys)
- timestamp

### attendance
- voterId
- flatNumber
- name
- electionId
- loginTime
- voteTime
- voted (boolean)
- ipAddress
- userAgent

---

## Quick Reference

| Command | Action |
|---------|--------|
| `npm run seed` | Populate database with demo data |
| `npm run dev` | Start backend server |
| `npm run start` | Start backend in production |

---

That's it! Your database is now ready for testing. 🎉
