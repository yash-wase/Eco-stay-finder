# 📤 Property Image & Certificate Upload Feature

## Overview
Added comprehensive file upload functionality for:
1. **Property owners** to submit images and certification documents during property listing
2. **Guest house owners** to upload business/ownership certificates during registration
3. **Admin validation workflow** to review all uploaded documents

---

## Features Added

### 1. Owner Registration Certificates (Login.jsx)

#### Business/Ownership Documents Upload
- **Upload up to 5 documents** during owner registration
- Supported formats: PDF, PNG, JPG (up to 5MB each)
- **Optional**: Not required but recommended for faster verification
- Document types: Business license, ownership proof, registration documents
- Real-time preview with file size display
- Remove documents before submission
- Base64 encoding for storage in user profile

#### Benefits
- Establishes owner credibility from the start
- Speeds up property verification process
- Admins can reference during property review
- Stored with owner profile for all their properties

---

### 2. Owner Property Submission (AddProperty.jsx)

#### Property Images Upload
- **Upload up to 5 images** of the property
- Supported formats: PNG, JPG (up to 5MB each)
- **Required**: At least 1 image must be uploaded
- Real-time preview with thumbnail gallery
- Remove images before submission
- Base64 encoding for storage

#### Certificate Documents Upload
- **Upload up to 10 certificate documents**
- Supported formats: PDF, PNG, JPG (up to 10MB each)
- **Conditional requirement**: Required only if certifications are claimed
- Document preview with file type icons (📄 for PDF, 🖼️ for images)
- Remove documents before submission
- Base64 encoding for storage

#### Validation
- Form validates that at least 1 property image is uploaded
- If certifications are selected, certificate documents must be uploaded
- Clear error messages guide the owner

---

### 2. Admin Verification Dashboard (AdminDashboard.jsx)

#### Property Images Gallery
- View all uploaded property images in a grid layout
- Click any image to open full-size in new tab
- Hover effect with "🔍 View" indicator
- Verify images are authentic (not stock photos)
- Count badge shows total images uploaded

#### Certificate Documents Viewer
- List all uploaded certificate documents
- File type icons (📄 PDF, 🖼️ Image)
- **"View & Validate" button** for each document
- Opens document in new tab for verification
- Highlighted section with amber border to draw attention
- Verify certificate authenticity, numbers, expiry dates

#### Verification Workflow
1. Admin reviews property details
2. **Clicks on images** to verify authenticity
3. **Clicks "View & Validate"** on each certificate document
4. Checks certificate numbers against issuing organizations
5. Adds verification notes documenting what was checked
6. Approves or rejects the property

---

### 3. Backend Updates (server.js)

#### POST /properties Endpoint
- Accepts `property_images` array (base64 encoded images)
- Accepts `certificate_documents` array with:
  - `name`: filename
  - `data`: base64 encoded file
  - `type`: MIME type
- **Validation**:
  - At least 1 property image required
  - If certifications claimed, certificate documents required
- Stores images and documents with property data

#### Data Structure
```javascript
{
  _id: "abc123",
  name: "Eco Bamboo Lodge",
  images: [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ],
  certificate_documents: [
    {
      name: "green-globe-certificate.pdf",
      data: "data:application/pdf;base64,JVBERi0xLjQK...",
      type: "application/pdf"
    }
  ],
  verification_status: "pending",
  cert_verified: false,
  ...
}
```

---

## User Experience

### For Guest House Owners (Registration)
1. Navigate to **Login**
2. Select **Guest House Owner** role
3. Fill in name, email, and guest house name
4. **Upload business/ownership certificates** (optional):
   - Click the upload area in the amber box
   - Select up to 5 PDF or image files
   - Preview documents with file sizes
   - Remove any unwanted documents
5. Complete registration
6. Certificates stored with owner profile

### For Property Owners (Listing)
1. Navigate to **List Your Eco Property**
2. Fill in basic property information
3. **Upload property images**:
   - Click the upload area
   - Select 1-5 images
   - Preview thumbnails appear
   - Remove any unwanted images
4. Select certifications (if applicable)
5. **Upload certificate documents**:
   - Upload area appears when certifications selected
   - Click to upload PDFs or images
   - Documents listed with file names
   - Remove any unwanted documents
6. Complete eco score breakdown
7. Submit property
8. Property enters pending verification

### For Admins
1. Login as **Admin**
2. View pending properties on dashboard
3. For each property:
   - **View property images** - click to open full size
   - **Validate certificates** - click "View & Validate" button
   - Review eco score claims
   - Add verification notes
4. Approve or reject property
5. Verified properties become visible to customers

---

## Technical Implementation

### File Handling
- **Client-side**: FileReader API converts files to base64
- **Storage**: Base64 strings stored in JSON database
- **Display**: Base64 data URLs rendered directly in `<img>` tags
- **Download**: `window.open(data, '_blank')` opens documents

### Why Base64?
- No file server required
- Works with JSON file-based database
- Simple implementation for prototype
- Easy to migrate to cloud storage later (S3, Cloudinary)

### Future Enhancements
- Cloud storage integration (AWS S3, Cloudinary)
- Image compression and optimization
- Multiple file format support
- Drag-and-drop upload
- Progress bars for large files
- Image cropping/editing tools

---

## Validation Rules

### Property Images
- Minimum: 1 image
- Maximum: 5 images
- File types: PNG, JPG, JPEG
- Max size: 5MB per image
- Required for all properties

### Certificate Documents
- Minimum: 0 (if no certifications claimed)
- Maximum: 10 documents
- File types: PDF, PNG, JPG, JPEG
- Max size: 10MB per file
- Required only if certifications are claimed

---

## Security Considerations

1. **File Size Limits**: Prevent large file uploads
2. **File Type Validation**: Only allow images and PDFs
3. **Admin-Only Access**: Only admins can view certificate documents
4. **Base64 Encoding**: Files stored as data URLs, not executable
5. **Manual Review**: Human verification prevents automated fraud

---

## Testing Checklist

### Owner Flow
- [ ] Upload 1 property image - should succeed
- [ ] Upload 5 property images - should succeed
- [ ] Try to upload 6 images - should show error
- [ ] Remove an uploaded image - should work
- [ ] Select certifications without uploading docs - should show error
- [ ] Upload certificate PDFs - should preview correctly
- [ ] Upload certificate images - should preview correctly
- [ ] Submit property - should enter pending state

### Admin Flow
- [ ] View pending property with images
- [ ] Click on property image - should open full size
- [ ] View certificate documents list
- [ ] Click "View & Validate" on PDF - should open in new tab
- [ ] Click "View & Validate" on image - should open in new tab
- [ ] Add verification notes
- [ ] Approve property - should become verified
- [ ] Verified property shows blue checkmark to customers

---

## Files Modified

1. **frontend/src/pages/AddProperty.jsx**
   - Added image upload state and handlers
   - Added certificate upload state and handlers
   - Added upload UI components
   - Added validation logic

2. **frontend/src/pages/AdminDashboard.jsx**
   - Added property images gallery
   - Added certificate documents viewer
   - Added "View & Validate" buttons
   - Enhanced verification workflow

3. **backend/server.js**
   - Updated POST /properties endpoint
   - Added validation for images and certificates
   - Store uploaded files with property data

4. **VERIFICATION.md**
   - Updated documentation with upload features
   - Added testing instructions

---

## Benefits

### For Platform Trust
- ✅ Verify property authenticity with real photos
- ✅ Validate green certifications with documents
- ✅ Prevent fraudulent listings
- ✅ Build customer confidence

### For Property Owners
- ✅ Easy upload process
- ✅ Visual feedback with previews
- ✅ Clear requirements
- ✅ Professional presentation

### For Admins
- ✅ All verification materials in one place
- ✅ Easy document viewing
- ✅ Efficient review workflow
- ✅ Audit trail with notes

---

## Conclusion

The upload feature completes the verification system by allowing owners to submit proof of their claims and enabling admins to validate authenticity. This builds trust in the EcoStay platform and ensures only legitimate eco-certified properties are listed.

🌿 **Every verified property with real photos and certificates strengthens the eco-tourism community.**
