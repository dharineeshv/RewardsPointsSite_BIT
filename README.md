# Reward Points Site - Bannari Amman Institute of Technology

A modern, responsive student portal for tracking, exploring, and inspecting student Reward Points (RP), department leaderboards, and semester achievements at Bannari Amman Institute of Technology (BIT Sathy).

---

## 🚀 Key Features

- **Official Google OAuth Login**: Restricted to `@bitsathy.ac.in` domain accounts.
- **Live Search & Autocomplete**: Instant search for any student by Name or Roll Number with points balance.
- **Student Profile Dashboard**: Live details including batch, department, faculty mentor, contact info, and active reward points.
- **Dynamic 19 Department Leaderboards**:
  - Separate cards for all 19 departments across BIT.
  - Live descending order student rankings with top 3 podium highlights (🥇 Gold, 🥈 Silver, 🥉 Bronze).
  - Academic Year filters (Year I, Year II, Year III, Year IV, and All Years).
- **Interactive Student Details Modal**: Detailed breakdowns of cumulative RP, redeemed points, and active balance.
- **100% Responsive Design**: Tailored experiences for mobile phones (with fixed bottom navigation bar), tablets, laptops, and ultra-wide screens.
- **Pure Dark Theme**: Clean high-contrast dark theme.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Auth**: `@react-oauth/google` + `jwt-decode`
- **APIs**:
  - `GET /v2/profile?email=...`
  - `GET /search?q=...`
  - `GET /rewards?roll_no=...`
  - `GET /averages`
---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/dharineeshv/RewardsPointsSite_BIT.git
cd RewardsPointsSite_BIT
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

---

## 👨‍💻 Developed by
**Dharineesh V**  
Bannari Amman Institute of Technology
