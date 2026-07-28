Below is a **GitHub-ready `architecture.md` file** for your project.
It is written in **clean Markdown with simple diagrams using code blocks**, so it will copy correctly into your repository.

You can place it in:

```
docs/architecture.md
```

or

```
architecture.md
```

---

# 🏗️ EcoStay Finder – System Architecture

## 1. Overview

EcoStay Finder follows a **three-layer architecture** designed for scalability, modularity, and maintainability.

The system consists of:

* **Frontend Layer** – User interface and interactions
* **Backend Layer** – API services and business logic
* **Data Layer** – Database storage for properties, users, and bookings

The system allows travelers to **search, compare, and request bookings for eco-friendly accommodations** while providing transparent sustainability metrics.

---

# 2. High-Level Architecture

```
User (Browser)
       │
       ▼
Frontend Application
(React + Tailwind)
       │
       ▼
API Layer
(Node.js + Express)
       │
       ▼
Database
(MongoDB)
```

---

# 3. System Components

## 3.1 Frontend Layer

The frontend is responsible for:

* Rendering UI
* Handling user interactions
* Managing application state
* Fetching data from APIs

### Key Technologies

* React
* Vite
* Tailwind CSS
* React Router
* Leaflet.js

### Responsibilities

* Location search
* Property listing display
* Sustainability filtering
* Property detail view
* Booking request form
* User dashboard

---

## 3.2 Backend Layer

The backend manages business logic and provides APIs for the frontend.

### Technologies

* Node.js
* Express.js

### Responsibilities

* Property listing APIs
* Filter and search processing
* Eco rating calculation
* Booking request processing
* Saved properties management

---

## 3.3 Database Layer

The database stores all persistent data.

### Database

MongoDB (Atlas free tier)

### Stored Data

* Property listings
* Sustainability metrics
* Booking requests
* Saved properties
* User information

---

# 4. Component Architecture

Frontend components are organized into **pages and reusable components**.

```
Frontend

Pages
 ├ Home
 ├ Listings
 ├ Filters
 ├ PropertyDetail
 ├ Booking
 └ Dashboard

Components
 ├ Navbar
 ├ SearchBar
 ├ PropertyCard
 ├ EcoScoreBadge
 ├ FilterPanel
 ├ BookingForm
 ├ BookingCard
 └ MapComponent
```

Reusable components improve maintainability and allow UI consistency across pages.

---

# 5. Data Flow

Typical data flow for the application:

```
User searches location
        │
        ▼
Frontend sends request to API
        │
        ▼
Backend retrieves property data
        │
        ▼
Database returns eco-stay listings
        │
        ▼
Backend processes filters and eco score
        │
        ▼
Frontend renders property listings
```

---

# 6. User Flow

Typical user journey through the system:

```
Home Page
   │
   ▼
Location Search
   │
   ▼
Eco-Stay Listings
   │
   ▼
Apply Sustainability Filters
   │
   ▼
Property Detail View
   │
   ▼
Booking Request
   │
   ▼
Booking Status Dashboard
```

---

# 7. API Architecture

The frontend communicates with the backend through REST APIs.

### Property APIs

```
GET /properties
GET /properties?location=
GET /property/:id
```

### Booking APIs

```
POST /booking-request
GET /user-bookings
```

### Saved Property APIs

```
POST /save-property
DELETE /remove-property
GET /saved-properties
```

---

# 8. Database Schema Overview

## Property Schema

```
Property
{
  id
  name
  location
  description
  price_per_night
  eco_score
  sustainability_features
  certifications
  amenities
  images
}
```

---

## Booking Schema

```
Booking
{
  id
  property_id
  user_id
  check_in
  check_out
  guests
  status
}
```

---

## User Schema

```
User
{
  id
  name
  email
  saved_properties
  bookings
}
```

---

# 9. External Services

The project uses free and open-source services.

### Map Service

* Leaflet.js
* OpenStreetMap

Purpose:

* Display eco-stay locations
* Allow geographic exploration

---

# 10. Deployment Architecture

Example deployment setup:

```
User Browser
      │
      ▼
Frontend Hosting
(Vercel / Netlify)
      │
      ▼
Backend Server
(Render / Railway)
      │
      ▼
Database
(MongoDB Atlas)
```

---

# 11. Performance Considerations

To ensure smooth user experience:

* Lazy load property images
* Optimize API queries
* Use pagination for listings
* Cache frequently accessed data

---

# 12. Security Considerations

Basic security measures include:

* Input validation
* Secure API endpoints
* Protection against injection attacks
* Rate limiting for API requests

---

# 13. Scalability Considerations

The architecture allows scaling through:

* API modularization
* Cloud database hosting
* Stateless backend services
* Component-based frontend design

---

# 14. Future Architecture Enhancements

Potential improvements:

* Microservices architecture
* AI recommendation engine
* Real-time booking confirmations
* Mobile application backend
* Integration with eco-certification databases

---

# 15. Project Documentation Structure

Recommended documentation structure for the repository:

```
README.md
PRD.md
SRD.md
design.md
frontend-ui-ux.md
architecture.md
```

---

