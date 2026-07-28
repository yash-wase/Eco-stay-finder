Below is a **clean `design.md` file written in proper Markdown** so it can be **directly copied into your repository** without spacing or formatting issues.
This document focuses on **UI/UX design, page structure, and component architecture**.

---

# 🎨 EcoStay Finder – UI/UX Design Document

## 1. Design Overview

EcoStay Finder is designed to provide travelers with a **transparent, simple, and comparison-friendly interface** for discovering eco-friendly accommodations.

The design emphasizes:

* Sustainability transparency
* Clear comparison of eco properties
* Minimal cognitive load
* Simple navigation

The interface uses a **card-based layout** to present eco accommodations and visually highlight sustainability metrics.

---

# 2. Design Principles

### Transparency

Sustainability metrics and certifications must be clearly visible to users.

### Simplicity

Users should be able to find eco accommodations in **minimal steps**.

### Comparison Friendly

Users should easily compare:

* Eco ratings
* Sustainability features
* Prices

### Trust

The design should build trust using:

* Certification badges
* Eco rating breakdowns
* Verified property tags

---

# 3. Visual Design System

## Color Palette

Primary Colors

| Color   | Usage                 |
| ------- | --------------------- |
| #1B5E20 | Primary brand color   |
| #4CAF50 | Eco rating indicators |
| #E8F5E9 | Background accents    |

Neutral Colors

| Color   | Usage           |
| ------- | --------------- |
| #FFFFFF | Main background |
| #F5F5F5 | Card background |
| #424242 | Text            |

Accent Colors

| Color   | Usage       |
| ------- | ----------- |
| #64B5F6 | Map markers |
| #FFC107 | Ratings     |

---

## Typography

Recommended Fonts

* Inter
* Poppins

Typography hierarchy

| Element       | Size    | Weight    |
| ------------- | ------- | --------- |
| Page Title    | 28–32px | Bold      |
| Section Title | 20–24px | Semi Bold |
| Card Title    | 16–18px | Medium    |
| Body Text     | 14–16px | Regular   |
| Metadata      | 12–13px | Light     |

---

# 4. Layout Structure

The application follows a **consistent layout across all pages**.

```
App Layout

Navbar
Main Content
Footer
```

## Navbar Components

* Logo
* Search Bar
* Explore
* Saved
* Bookings
* Profile

---

# 5. Screen Designs

---

# 5.1 Location Selection Screen

## Purpose

Allows users to select a destination for eco-friendly stays.

## Components

Location Search Bar

Recent Searches

Destination Suggestions

Map Preview

Explore Button

## Layout

```
Header
Search Bar
Recent Searches
Suggested Destinations
Map Preview
Explore Button
```

## Key Interaction

User searches destination → redirected to listings page.

---

# 5.2 Eco-Stay Listings Screen

## Purpose

Displays eco-friendly accommodations available in the selected location.

## Components

Location Header

Filter Button

Sort Button

Property Grid

## Property Card Structure

Each property is displayed as a card.

```
Property Card

Property Image
Eco Badge
Property Name
Location
Price per Night
Eco Score
Sustainability Highlights
View Details Button
Save Button
```

## Sustainability Highlights

Example icons:

* Solar Energy
* Water Recycling
* Plastic Free
* Organic Food

---

# 5.3 Filter & Sustainability Criteria Screen

## Purpose

Allows users to refine search results based on sustainability criteria.

## Filter Categories

### Price Range

Slider to select price range.

### Property Type

Checkbox options:

* Eco Hotel
* Eco Resort
* Sustainable Homestay

### Sustainability Features

Checkbox options:

* Renewable Energy
* Water Conservation
* Waste Recycling
* Plastic Free Policy
* Organic Food

### Certifications

Checkbox options:

* Green Key
* EarthCheck
* LEED
* GSTC

## Layout

```
Filter Panel

Price Range
Property Type
Sustainability Features
Certifications

Apply Filters Button
Reset Button
```

---

# 5.4 Property Detail Screen

## Purpose

Provides complete information about a selected eco accommodation.

## Sections

### Image Gallery

Property images displayed in slider.

### Property Overview

* Property Name
* Location
* Price per night
* Eco Score

### Sustainability Overview

Description of eco-friendly practices.

### Eco Rating Breakdown

Displays sustainability metrics.

Example:

| Category           | Score |
| ------------------ | ----- |
| Energy Efficiency  | 4.5   |
| Water Conservation | 4     |
| Waste Management   | 5     |
| Community Support  | 4     |

### Amenities

Examples:

* WiFi
* Organic Restaurant
* Nature Trails
* Bicycle Rentals

### Map Location

Shows property location on map.

### Reviews

User feedback regarding sustainability and experience.

---

# 5.5 Booking Request Screen

## Purpose

Allows users to request bookings for eco accommodations.

## Form Fields

* Check-in Date
* Check-out Date
* Number of Guests
* Special Requests

## Layout

```
Booking Form

Check-in Date
Check-out Date
Guest Count
Special Requests

Stay Summary
Submit Booking Request Button
```

---

# 5.6 Saved & Booking Status Screen

## Purpose

Allows users to manage saved properties and track booking requests.

## Layout

```
Tabs

Saved Properties
Booking Status
```

---

## Saved Properties Section

Displays bookmarked properties.

Property card includes:

* Image
* Property name
* Eco score
* View details button

---

## Booking Status Section

Displays booking requests.

Booking card shows:

* Property name
* Booking dates
* Status

### Status Types

* Pending
* Confirmed
* Declined
* Completed

---

# 6. UI Components Library

Reusable components used across the application.

* Navbar
* Property Card
* Eco Score Badge
* Filter Panel
* Booking Form
* Booking Card
* Map Component
* Image Gallery Slider

---

# 7. Responsive Design

The interface must support multiple screen sizes.

Desktop

* Grid layout
* 3 property cards per row

Tablet

* 2 property cards per row

Mobile

* 1 property card per row
* Bottom navigation

---

# 8. Accessibility

The design must ensure:

* High color contrast
* Readable typography
* Accessible buttons
* Keyboard navigation support

---

# 9. Interaction Design

Examples of micro-interactions:

* Card hover effects
* Save button animation
* Filter panel slide animation
* Eco score progress animation
* Map marker highlighting

---

# 10. Future Design Improvements

Potential enhancements:

* Eco score visualization charts
* Carbon footprint calculator
* Property comparison interface
* AI-based eco stay recommendations
* Mobile application UI

---

✅ Now your repo can contain:

```
README.md
PRD.md
SRD.md
design.md
```
