# 🛡️ Property Verification System

## Overview

The EcoStay Finder platform includes a comprehensive verification system to ensure property authenticity and validate green certifications. This builds trust with eco-conscious travelers by confirming that listed properties meet genuine sustainability standards.

---

## How It Works

### 1. Property Submission (Owner)
When a guest house owner adds a new property through the **Add Property** form:
- **Required uploads:**
  - At least 1 property image (up to 5 images, PNG/JPG, max 5MB each)
  - Certificate documents if certifications are claimed (up to 10 files, PDF/images, max 10MB each)
- Property is created with `verification_status: 'pending'`
- `cert_verified: false` by default
- Property enters the admin verification queue
- Not visible to customers until verified

### 2. Admin Review Process
Admins access the **Admin Dashboard** to review pending properties:

#### What Admins Verify:
- **Property Images** — View all uploaded photos to confirm authenticity (not stock images)
- **Ownership Proof** — Confirm the owner legitimately operates the property
- **Green Certifications** — Click "View & Validate" on each certificate document to verify authenticity
- **Eco Score Claims** — Audit sustainability features against the self-reported eco score
- **Property Details** — Verify address, amenities, and descriptions are accurate

#### Verification Actions:
- **View Documents** — Click on certificate documents to open and validate them
- **View Images** — Click on property images to view full-size versions
- **Approve (✅ Verified)** — Property becomes visible to customers with verification badge
- **Reject (❌ Rejected)** — Property remains hidden; owner can be notified to resubmit with corrections
- **Add Notes** — Document what was verified (e.g., "Checked Green Globe certificate #12345")

### 3. Customer Experience
Once verified:
- Properties display a **blue "✓ Verified" badge** on listing cards and detail pages
- Builds trust and credibility
- Customers can filter by verified properties (future enhancement)

---

## API Endpoints

### Get Pending Properties (Admin Only)
```http
GET /admin/pending-properties
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "abc123",
      "name": "Eco Bamboo Lodge",
      "verification_status": "pending",
      "cert_verified": false,
      "certifications": ["Green Globe", "EarthCheck"],
      "eco_score": 95,
      ...
    }
  ]
}
```

### Verify Property (Admin Only)
```http
PATCH /properties/:id/verify
Content-Type: application/json

{
  "status": "verified",  // or "rejected"
  "note": "Verified Green Globe certificate #12345 and site inspection photos"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "abc123",
    "verification_status": "verified",
    "cert_verified": true,
    "verification_note": "Verified Green Globe certificate #12345...",
    "verified_at": "2026-03-07T10:30:00.000Z"
  }
}
```

---

## Verification Checklist

Admins should verify the following before approving:

### 📄 Documentation
- [ ] Property ownership documents
- [ ] Business registration/license
- [ ] Green certification documents (PDFs, certificate numbers) - **Now uploaded by owners**
- [ ] Photos of sustainability features - **Now uploaded by owners**
- [ ] Property images verified as authentic (not stock photos)

### 🌱 Sustainability Claims
- [ ] Solar panels/renewable energy systems visible
- [ ] Water conservation systems documented
- [ ] Waste management practices verified
- [ ] Sustainable building materials confirmed
- [ ] Community impact programs validated
- [ ] Carbon reduction initiatives documented

### 🏅 Certifications
- [ ] Certificate numbers verified with issuing organizations
- [ ] Certification expiry dates checked
- [ ] Certification scope matches property type
- [ ] No fraudulent or fake certificates

### 📍 Property Details
- [ ] Address and location accurate
- [ ] Photos are of the actual property (not stock images)
- [ ] Amenities list is truthful
- [ ] Pricing is reasonable and accurate

---

## User Roles

### Customer
- Can only see **verified** properties
- Cannot access pending or rejected listings
- Sees verification badges on trusted properties

### Guest House Owner
- Can add new properties (enter pending state)
- Can view their own pending properties
- Cannot self-verify

### Admin
- Full access to verification dashboard
- Can approve or reject properties
- Can add verification notes
- Responsible for maintaining platform trust

---

## Future Enhancements

### Automated Verification
- Integration with certification authority APIs (Green Globe, EarthCheck)
- Automated certificate number validation
- AI-powered image verification (detect stock photos)

### Enhanced Trust Signals
- Verification expiry dates (annual re-verification)
- Verification level tiers (Basic, Standard, Premium)
- Public verification history/audit log
- Owner response to verification feedback

### Customer Features
- Filter by "Verified Only"
- Sort by verification date (newest verified first)
- Report suspicious properties
- View verification details (what was checked)

---

## Security Considerations

1. **Admin Access Control** — Only authorized admins can verify properties
2. **Audit Trail** — All verification actions logged with timestamps
3. **Fraud Prevention** — Manual review prevents fake certifications
4. **Data Privacy** — Verification notes not exposed to customers
5. **Owner Notifications** — Owners notified of approval/rejection (future)

---

## Testing the System

### As Owner:
1. Login as **Guest House Owner**
2. Add a new property via **List Your Eco Property**
3. **Upload property images** (at least 1, up to 5)
4. Select certifications you have
5. **Upload certificate documents** (PDF or images)
6. Fill in eco score breakdown
7. Submit - property enters pending state
8. Check **My Properties** — should show "Pending Verification" badge

### As Admin:
1. Login as **Admin**
2. Navigate to **Admin Dashboard**
3. Review pending property details
4. **Click on property images** to view full size and verify authenticity
5. **Click "View & Validate"** on certificate documents to open and verify them
6. Check eco score breakdown matches claimed features
7. Click **Review & Verify**
8. Add verification notes (e.g., "Verified Green Globe cert #12345, images authentic")
9. Click **Approve & Verify** or **Reject**

### As Customer:
1. Login as **Customer**
2. Browse **Listings**
3. Verified properties show blue "✓ Verified" badge
4. Pending/rejected properties are hidden

---

## Conclusion

The verification system ensures EcoStay Finder maintains high standards for eco-certified accommodations. By validating ownership, certifications, and sustainability claims, we build trust with travelers and support legitimate eco-tourism businesses.

🌍 **Every verified property supports a more sustainable future.**
