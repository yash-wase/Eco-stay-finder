Below is a **Software Requirements Document (SRD)** for **EcoStay Finder**.
Unlike the PRD (which focuses on the product vision and user needs), the SRD focuses on **technical requirements, system behavior, modules, interfaces, and constraints** needed to implement the system.

---

# Software Requirements Document (SRD)

## Project: EcoStay Finder – Green Accommodation Discovery Platform

---

# 1. Introduction

## 1.1 Purpose

This document defines the **technical requirements, system architecture, and functional specifications** for the EcoStay Finder platform.

It serves as a reference for developers, designers, and stakeholders to understand:

* System functionality
* Technical modules
* Data structures
* System interactions

The document outlines the software requirements required to build a working prototype of the platform.

---

# 1.2 Scope

EcoStay Finder is a web-based platform that enables travelers to **discover and evaluate eco-friendly accommodations** based on sustainability metrics and certifications.

The system allows users to:

* Search eco accommodations by location
* Compare properties based on sustainability ratings
* Apply sustainability filters
* View detailed eco-impact breakdowns
* Submit booking requests
* Track saved properties and booking statuses

The system will be implemented as a **full-stack web application** consisting of:

* Frontend user interface
* Backend service APIs
* Database storage
* Map-based location visualization

---

# 1.3 Definitions

| Term                   | Definition                                                                              |
| ---------------------- | --------------------------------------------------------------------------------------- |
| Eco-Stay               | An accommodation that follows environmentally sustainable practices                     |
| Eco Score              | A sustainability rating calculated based on environmental metrics                       |
| Sustainability Metrics | Indicators used to evaluate eco practices such as energy efficiency or waste management |
| Certification          | Third-party environmental accreditation for sustainable properties                      |

---

# 2. System Overview

EcoStay Finder consists of the following major components:

1. **Frontend Application**
2. **Backend API Services**
3. **Database Layer**
4. **External Map Services**

The system enables users to search and discover eco accommodations while ensuring sustainability transparency.

---

# 3. System Architecture

The application follows a **three-tier architecture**.

```
Presentation Layer
(Frontend Web Application)

        ↓

Application Layer
(Node.js Backend API)

        ↓

Data Layer
(Database)
```

---

## 3.1 Presentation Layer

Responsible for:

* Rendering user interface
* Handling user interactions
* Managing application state
* Communicating with backend APIs

Technologies:

* React
* Tailwind CSS
* Leaflet (Map interface)

---

## 3.2 Application Layer

Responsible for:

* Business logic
* API endpoints
* Eco score calculation
* Data validation
* Booking request processing

Technologies:

* Node.js
* Express.js

---

## 3.3 Data Layer

Responsible for storing:

* Property listings
* Sustainability data
* User data
* Booking requests
* Saved properties

Database options:

* MongoDB

---

# 4. Functional Requirements

---

# 4.1 Location Search Module

## Description

Allows users to search for eco accommodations by selecting a destination.

## Functional Requirements

FR-1
The system shall allow users to enter a location in the search field.

FR-2
The system shall display suggested destinations.

FR-3
The system shall redirect the user to the listings page after selecting a location.

FR-4
The system shall store the selected location as a query parameter.

---

# 4.2 Eco-Stay Listings Module

## Description

Displays a list of eco-friendly accommodations available in the selected destination.

## Functional Requirements

FR-5
The system shall retrieve eco-stay listings from the database.

FR-6
The system shall display property information including:

* Property name
* Location
* Price per night
* Eco score
* Sustainability highlights
* Property image

FR-7
The system shall allow sorting of listings.

FR-8
The system shall allow navigation to the property detail page.

---

# 4.3 Filter Module

## Description

Allows users to filter properties based on sustainability and travel preferences.

## Functional Requirements

FR-9
The system shall allow filtering by price range.

FR-10
The system shall allow filtering by property type.

FR-11
The system shall allow filtering by sustainability features.

FR-12
The system shall allow filtering by eco certifications.

FR-13
The system shall update the listings based on applied filters.

---

# 4.4 Property Detail Module

## Description

Displays detailed information about a selected eco property.

## Functional Requirements

FR-14
The system shall display property images.

FR-15
The system shall display property description.

FR-16
The system shall display sustainability overview.

FR-17
The system shall display eco rating score.

FR-18
The system shall display eco rating breakdown metrics.

FR-19
The system shall display property amenities.

FR-20
The system shall display map location of the property.

---

# 4.5 Booking Request Module

## Description

Allows users to submit booking requests.

## Functional Requirements

FR-21
The system shall allow users to select check-in date.

FR-22
The system shall allow users to select check-out date.

FR-23
The system shall allow users to specify number of guests.

FR-24
The system shall allow users to submit special requests.

FR-25
The system shall store booking requests in the database.

FR-26
The system shall display confirmation after booking submission.

---

# 4.6 Saved Properties Module

## Description

Allows users to bookmark eco accommodations.

## Functional Requirements

FR-27
The system shall allow users to save properties.

FR-28
The system shall display saved properties in the user dashboard.

FR-29
The system shall allow users to remove saved properties.

---

# 4.7 Booking Status Module

## Description

Allows users to track booking requests.

## Functional Requirements

FR-30
The system shall display booking requests submitted by the user.

FR-31
The system shall show booking status.

Possible statuses:

* Pending
* Confirmed
* Declined
* Completed

---

# 5. Non Functional Requirements

---

## 5.1 Performance

* Page load time should be under **2 seconds**.
* System should handle **at least 100 concurrent users**.

---

## 5.2 Scalability

The system architecture should allow:

* Expansion of property listings
* Increased user traffic
* Future feature additions

---

## 5.3 Security

The system must ensure:

* Secure API endpoints
* Data validation
* Protection against malicious inputs

---

## 5.4 Usability

The system must:

* Provide intuitive navigation
* Present sustainability data clearly
* Allow easy comparison of properties

---

## 5.5 Availability

The platform should maintain **99% uptime** during operation.

---

# 6. Data Model Overview

## 6.1 Property Object

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

## 6.2 Booking Object

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

## 6.3 User Object

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

# 7. API Requirements

Example API endpoints:

### Property APIs

```
GET /properties
GET /properties?location=
GET /property/:id
```

---

### Booking APIs

```
POST /booking-request
GET /user-bookings
```

---

### Saved Properties APIs

```
POST /save-property
DELETE /remove-property
GET /saved-properties
```

---

# 8. External Integrations

## Map Services

Used for location visualization.

Implementation:

* Leaflet.js
* OpenStreetMap

---

# 9. System Constraints

* Must operate without paid API subscriptions.
* Must rely on open-source technologies.
* Must support modern web browsers.

---

# 10. Assumptions

* Eco property data will be available through a predefined dataset.
* Sustainability metrics will be provided by property owners.

---

# 11. Future System Enhancements

Potential upgrades include:

* AI-based eco property recommendations
* Carbon footprint travel calculator
* Integration with global eco-certification databases
* Mobile application version

---
