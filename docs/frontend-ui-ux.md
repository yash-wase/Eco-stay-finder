Below is a **clean `frontend-ui-ux.md` file in GitHub-compatible Markdown**.
It focuses specifically on **frontend architecture, UI component system, state management, and UX behavior**, which is typically separate from a general design document.

You can **copy-paste this directly into your repo** as:

```
docs/frontend-ui-ux.md
```

or

```
frontend-ui-ux.md
```

---

# 🖥️ EcoStay Finder – Frontend / UI / UX Specification

## 1. Overview

The frontend of **EcoStay Finder** is responsible for delivering a responsive, intuitive, and transparent interface that allows users to discover eco-friendly accommodations and evaluate their sustainability practices.

The frontend system focuses on:

* Discoverability of eco stays
* Sustainability transparency
* Easy property comparison
* Simple booking workflow

The UI follows a **component-based architecture** for scalability and maintainability.

---

# 2. Frontend Architecture

The frontend follows a **layered architecture model**.

```
UI Pages
   ↓
Reusable Components
   ↓
State Management
   ↓
Service Layer (API Calls)
   ↓
Backend API
```

### Architecture Layers

**UI Pages**

Responsible for layout and user interaction.

**Reusable Components**

Shared UI elements used across pages.

**State Management**

Handles application data such as listings, filters, and user actions.

**Service Layer**

Handles communication with backend APIs.

---

# 3. Technology Stack

| Technology          | Purpose                     |
| ------------------- | --------------------------- |
| React               | Frontend framework          |
| Vite                | Fast development build tool |
| Tailwind CSS        | UI styling                  |
| React Router        | Navigation and routing      |
| Leaflet.js          | Map visualization           |
| Chart.js / Recharts | Eco score visualization     |

---

# 4. Application Structure

Example frontend folder structure:

```
src/

components/
  Navbar
  PropertyCard
  EcoScoreBadge
  FilterPanel
  BookingForm
  BookingCard
  MapComponent

pages/
  Home
  Listings
  Filters
  PropertyDetail
  Booking
  Dashboard

services/
  propertyService
  bookingService
  userService

state/
  appState
  filterState

assets/
  images
  icons
```

---

# 5. Navigation Flow

Application routes:

```
/home
/listings
/property/:id
/booking/:id
/dashboard
```

Navigation flow:

```
Home
 ↓
Listings
 ↓
Property Details
 ↓
Booking Request
 ↓
Dashboard
```

---

# 6. Page Specifications

---

# 6.1 Home – Location Selection

## Purpose

Allows users to search for eco-friendly stays by destination.

## Key Components

* Navbar
* SearchBar
* RecentSearchList
* MapPreview
* ExploreButton

## UI Layout

```
Navbar
Search Bar
Recent Searches
Suggested Destinations
Map Preview
Explore Button
```

## UX Behavior

User enters a location → system redirects to listings page.

---

# 6.2 Listings – Eco Stay Discovery

## Purpose

Displays eco-friendly accommodations in the selected location.

## Key Components

* ListingsHeader
* FilterButton
* SortDropdown
* PropertyGrid
* PropertyCard

## Property Card Structure

```
PropertyCard

PropertyImage
EcoScoreBadge
PropertyName
Location
Price
SustainabilityIcons
ViewDetailsButton
SaveButton
```

## UX Behavior

Users can:

* Compare eco scores
* View sustainability highlights
* Save properties

---

# 6.3 Filters – Sustainability Criteria

## Purpose

Allows users to refine listings based on sustainability practices.

## Components

* PriceRangeSlider
* PropertyTypeSelector
* SustainabilityFeaturesCheckbox
* CertificationFilter
* ApplyFiltersButton

## Filter Categories

**Price Range**

Slider input.

**Property Type**

* Eco Hotel
* Eco Resort
* Sustainable Homestay

**Sustainability Features**

* Renewable energy
* Water conservation
* Waste recycling
* Plastic free
* Organic food

**Certifications**

* Green Key
* EarthCheck
* LEED
* GSTC

---

# 6.4 Property Detail Page

## Purpose

Provides complete details about a selected eco property.

## Page Sections

```
Image Gallery
Property Overview
Eco Score Section
Sustainability Breakdown
Amenities
Location Map
Reviews
Booking Button
```

## Key Components

* ImageGallery
* EcoScoreBadge
* SustainabilityMetrics
* AmenitiesGrid
* MapComponent
* BookingCTA

## UX Behavior

Users can review sustainability practices before booking.

---

# 6.5 Booking Request Page

## Purpose

Collect booking information from users.

## Components

* BookingForm
* StaySummary
* SubmitButton

## Booking Form Fields

* Check-in date
* Check-out date
* Guest count
* Special request

## UX Behavior

User submits booking → confirmation message displayed.

---

# 6.6 Dashboard – Saved & Booking Status

## Purpose

Allows users to manage saved properties and bookings.

## Layout

```
Tabs

Saved Properties
Booking Status
```

---

## Saved Properties

Grid of bookmarked eco stays.

Card components:

* Property image
* Eco score
* Property name
* View details button

---

## Booking Status

Displays booking requests.

Booking card includes:

* Property name
* Booking dates
* Status tag

### Status Types

* Pending
* Confirmed
* Declined
* Completed

---

# 7. State Management

Global state variables include:

```
user
selectedLocation
propertyListings
activeFilters
savedProperties
bookings
```

State updates occur when:

* Location changes
* Filters are applied
* Properties are saved
* Booking requests are submitted

---

# 8. UI Component Library

Reusable UI components include:

* Navbar
* SearchBar
* PropertyCard
* EcoScoreBadge
* FilterPanel
* BookingForm
* BookingCard
* MapComponent
* ImageGallery

---

# 9. Responsive Design

The UI must support multiple device sizes.

### Desktop

* Grid layout
* 3 property cards per row

### Tablet

* 2 property cards per row

### Mobile

* 1 property card per row
* Bottom navigation

---

# 10. UX Interaction Guidelines

### Micro Interactions

Examples include:

* Hover animation on property cards
* Save icon toggle animation
* Filter panel slide animation
* Eco score progress animation
* Map marker highlight

---

# 11. Accessibility

The interface must support:

* High color contrast
* Accessible form inputs
* Keyboard navigation
* Screen reader compatibility

---

# 12. Performance Considerations

Frontend performance requirements:

* Page load time under **2 seconds**
* Lazy loading for images
* Optimized component rendering
* Efficient API calls

---

# 13. Future Frontend Improvements

Possible UI enhancements include:

* Eco score visualization charts
* Property comparison feature
* Sustainability impact dashboard
* AI-based property recommendations
* Mobile application interface

---

## Repository Documentation Structure

Recommended documentation structure:

```
README.md
PRD.md
SRD.md
design.md
frontend-ui-ux.md
architecture.md
```

---

