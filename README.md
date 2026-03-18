# 🌿 EcoStay Finder

> **Green Accommodation Discovery Platform** — Connect eco-conscious travellers with verified sustainable stays across India and beyond.

![EcoStay Banner](./frontend/public/hero.png)

---

## 📖 Overview

EcoStay Finder is a full-stack web application that helps travellers discover, explore, and book eco-certified accommodations. Guest house owners can list their properties, manage bookings, and accept or decline requests — all through a clean, role-based interface.

Built as a hackathon prototype showcasing sustainable tourism technology.

---

## ✨ Features

### 🧭 For Travellers (Customers)
- 🔍 **Search & Filter** — Browse properties by destination, eco-score, price range, and property type
- 🗺️ **Interactive Map** — Leaflet.js map with custom eco markers for all listings
- 💚 **Eco Score** — Each property is rated across 6 sustainability pillars (0–120 scale)
- ❤️ **Save Properties** — Bookmark favourites to a personal wishlist
- 📋 **Book Stays** — Send booking requests with check-in/out dates, guests, and a personal message
- 📊 **Dashboard** — View all bookings with real-time status (Pending / Confirmed / Declined)

### 🏡 For Guest House Owners
- ➕ **List a Property** — Full property form with type, amenities, sustainability features, certifications, and eco-score sliders
- 📥 **Manage Bookings** — View all incoming requests for owned properties
- ✅ **Accept / ❌ Decline** — One-click booking confirmation or rejection
- 🏠 **My Properties** — See all listed properties with image, price, and eco score

### 🔐 Authentication
- Role-based login — **Customer**, **Guest House Owner**, or **Admin**
- Email-based stable identity (persists across sessions)
- No password required (demo mode)
- Protected routes per role

### 🛡️ Admin Verification System
- **Property Verification** — Admin reviews and approves/rejects new property listings
- **Certification Validation** — Verify green certificates and eco claims
- **Eco Score Audit** — Review sustainability features and scoring accuracy
- **Verification Queue** — Centralized dashboard for pending properties
- **Trust Badges** — Verified properties display blue checkmark badges

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v4 |
| **Routing** | React Router v6 |
| **State** | React Context API + localStorage |
| **Map** | Leaflet.js with react-leaflet |
| **HTTP Client** | Axios |
| **Backend** | Node.js, Express.js |
| **Database** | JSON file store (no external DB required) |
| **Animations** | CSS Keyframes + IntersectionObserver |

---

## 📁 Project Structure

```
EcoStay/
├── backend/
│   ├── data/                   # JSON file store (auto-created)
│   │   ├── properties.json
│   │   ├── bookings.json
│   │   └── saved.json
│   ├── server.js               # Express API + auto-seed (12 properties)
│   ├── seed.js                 # Standalone seed script
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── hero.png            # AI-generated hero image
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx          # Role-aware navigation
│       │   ├── PropertyCard.jsx    # Listing card with save + eco badge
│       │   ├── EcoScoreBadge.jsx   # Colour-coded eco score (Platinum→Basic)
│       │   ├── FilterPanel.jsx     # Sidebar filters (score, price, type)
│       │   ├── BookingCard.jsx     # Read-only booking status for customers
│       │   ├── BookingForm.jsx     # Booking request form
│       │   └── MapComponent.jsx    # Leaflet map with markers
│       ├── pages/
│       │   ├── Home.jsx            # Landing page with motion & animations
│       │   ├── Listings.jsx        # Search results + map split view
│       │   ├── PropertyDetail.jsx  # Full property page
│       │   ├── Dashboard.jsx       # Customer: saved + bookings
│       │   ├── Login.jsx           # Role-selection login
│       │   ├── OwnerDashboard.jsx  # Owner: manage bookings & properties
│       │   ├── AddProperty.jsx     # Owner: list a new property
│       │   └── AdminDashboard.jsx  # Admin: verify properties & certifications
│       ├── state/
│       │   └── AppContext.jsx      # Global state (user, filters, saved)
│       ├── services/
│       │   └── api.js              # Axios API service layer
│       └── index.css              # Tailwind + custom animations
│
├── prd.md                      # Product Requirements Document
├── srd.md                      # System Requirements Document
├── design.md                   # UI/UX Design Specification
├── architechture.md            # System Architecture
├── frontend-ui-ux.md           # Frontend UI/UX Guidelines
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** v9+

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Ecostay
```

### 2. Start the Backend
```bash
cd backend
npm install
$env:PORT=4000; node server.js
```
The API starts at **http://localhost:4000** and auto-seeds 12 eco properties on first run.

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The app opens at **http://localhost:5173**

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/properties` | List all properties (with filters) |
| `GET` | `/properties/:id` | Get a single property |
| `POST` | `/properties` | Add a new property (owner) - enters pending verification |
| `PATCH` | `/properties/:id/verify` | Admin approves or rejects property (status: verified/rejected) |
| `GET` | `/admin/pending-properties` | Get all properties pending verification |
| `GET` | `/owner-properties?owner_id=` | Get owner's properties |
| `GET` | `/owner-bookings?owner_id=` | Get bookings for owner's properties |
| `POST` | `/booking-request` | Create a booking request |
| `PATCH` | `/booking-request/:id/status` | Accept / Decline a booking |
| `GET` | `/user-bookings` | Get all bookings |
| `GET` | `/saved-properties` | Get saved properties |
| `POST` | `/save-property` | Save a property |
| `DELETE` | `/remove-property/:id` | Unsave a property |

### Query Filters for `GET /properties`
| Param | Example | Description |
|---|---|---|
| `location` | `?location=Goa` | Filter by location |
| `type` | `?type=treehouse` | Filter by stay type |
| `minScore` | `?minScore=80` | Minimum eco score |
| `maxPrice` | `?maxPrice=10000` | Max price per night (₹) |

---

## 👤 User Roles & Flow

```
/login
  ├── Customer  →  /           (Home → Explore → Book → Dashboard)
  ├── Owner     →  /owner-dashboard  (View Bookings → Accept/Decline → Add Property)
  └── Admin     →  /admin-dashboard  (Verify Properties → Approve/Reject → Audit Certifications)
```

### Customer Flow
1. Login as **Customer**
2. Browse listings or search by destination
3. View property details and eco score breakdown
4. Submit a booking request
5. Track booking status in **Dashboard** (Pending → Confirmed/Declined by owner)

### Owner Flow
1. Login as **Guest House Owner**
2. View incoming booking requests on **Owner Dashboard**
3. **Accept** ✅ or **Decline** ❌ each booking
4. Add a new property via **List Your Eco Property** form (enters pending verification)
5. Monitor all properties in **My Properties** tab

### Admin Flow
1. Login as **Admin**
2. View all pending property listings on **Admin Dashboard**
3. Review property details, certifications, and eco score claims
4. **Verify** ✅ properties with valid documentation or **Reject** ❌ fraudulent listings
5. Add verification notes for record-keeping
6. Approved properties display verification badges to customers

---

## 🌱 Eco Score System

Each property is scored across **6 sustainability pillars** (0–20 each, max 120):

| Pillar | Icon |
|---|---|
| Renewable Energy | ☀️ |
| Water Conservation | 💧 |
| Waste Management | ♻️ |
| Sustainable Materials | 🎋 |
| Community Impact | 🤝 |
| Carbon Reduction | 🌍 |

**Tiers:**
- 🏆 **Platinum** — 100–120
- 🥇 **Gold** — 80–99
- 🥈 **Silver** — 60–79
- 🥉 **Bronze** — 40–59
- 🌱 **Basic** — < 40

---

## 🎨 UI Highlights

- **Hero section** with real eco-lodge photography + floating animated orbs
- **Scroll-triggered reveals** — sections animate as you scroll down
- **Animated stat counters** — numbers count up when in view
- **Certification marquee** — scrolling ticker of eco certifications
- **Spring-eased card hover** — lift effect with green ambient glow
- **Panning gradient CTA** — polka-dot overlay on animated gradient background
- **Role-coloured Navbar** — green for customers, amber for owners

---

## 📦 Seeded Properties

12 eco properties are auto-seeded on first launch across:

| Destination | Properties |
|---|---|
| 🇮🇳 Goa | The Bamboo Nest, Eco Wave Retreat |
| 🇮🇳 Kerala | Vypin Fisherman's Village, Backwater Treehouse, Munnar Forest Hut, Periyar Jungle Camp |
| 🇮🇩 Bali | Ubud Jungle Villa, Tabanan Rice Terrace Lodge |
| 🇨🇷 Costa Rica | Arenal Rainforest Eco Lodge, Osa Canopy Retreat |
| 🇮🇳 Himachal Pradesh | Spiti Valley Solar Homestay |
| 🇮🇳 Uttarakhand | Rishikesh River Camp |

---

## 📄 Documentation

| File | Description |
|---|---|
| [`prd.md`](./prd.md) | Product Requirements Document |
| [`srd.md`](./srd.md) | System Requirements Document |
| [`design.md`](./design.md) | UI/UX Design Specification |
| [`architechture.md`](./architechture.md) | System Architecture Overview |
| [`frontend-ui-ux.md`](./frontend-ui-ux.md) | Frontend Design Guidelines |
| [`VERIFICATION.md`](./VERIFICATION.md) | Property & Certification Verification System |

---

## 🤝 Contributing

This is a hackathon prototype. Future improvements could include:
- ✅ **Property verification system** (implemented — see [VERIFICATION.md](./VERIFICATION.md))
- Real user authentication (JWT / OAuth)
- MongoDB integration
- Property image uploads
- Search result pagination
- User reviews & ratings
- Email notifications for booking updates
- Automated certification validation via APIs

---

## 📜 License

MIT License — feel free to use, modify, and distribute.

---

<div align="center">
  <strong>🌍 Built for a sustainable future · EcoStay Finder</strong><br/>
  <em>Every booking supports local communities and the planet.</em>
</div>
