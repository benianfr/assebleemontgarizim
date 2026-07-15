# Firebase Setup Guide

This guide will help you connect the Assemblée Mont Garizim project to Firebase.

## Prerequisites

1. Create a Firebase account at [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new Firebase project

## Installation

Install the Firebase SDK:

```bash
npm install firebase
```

## Configuration

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Go to Firebase Console → Project Settings → General
3. Scroll down to "Your apps" section
4. Add a Web app to get your configuration
5. Copy the configuration values to your `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Firestore Database Setup

1. Go to Firebase Console → Build → Firestore Database
2. Click "Create Database"
3. Choose a location (e.g., europe-west)
4. Start in Test Mode or Production Mode
5. Create the following collection structure:

### testimonials collection
- **nom** (string): Last name
- **prenom** (string): First name
- **telephone** (string): Phone number
- **titre** (string): Testimonial title
- **temoignage** (string): Testimonial content
- **approved** (boolean): Approval status (default: false)
- **createdAt** (timestamp): Creation timestamp

### history collection
- **year** (string): Year
- **title** (string): Title
- **description** (string): Description
- **order** (number): Display order

### about/founder document
- **name** (string): Founder name
- **title** (string): Founder title
- **ph** (string): Placeholder image class
- **description** (string): Description
- **verse** (string): Bible verse

### locations collection
- **ph** (string): Placeholder image class
- **name** (string): Location name
- **pastor** (string): Pastor name
- **address** (string): Address
- **schedule** (string): Schedule
- **order** (number): Display order

## Seed Initial Data

To populate Firestore with the initial data from the a-propos page:

1. Ensure your `.env.local` is configured with Firebase credentials
2. Run the seed script:
```bash
node scripts/seed-firestore.js
```

This will add:
- 5 history items (2006-2024)
- Founder information (Pasteur Emmanuel Kouassi)
- 4 locations (Cocody, Yopougon, Marcory, Treichville)

## Firestore Security Rules

For production, set up proper security rules in Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /testimonials/{document=**} {
      allow read: if true;
      allow create: if request.auth != null || request.resource.data.approved == false;
      allow update, delete: if request.auth != null;
    }
    match /history/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /about/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /locations/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Features Implemented

- ✅ Firebase initialization (`lib/firebase.ts`)
- ✅ Firestore database connection
- ✅ Testimonial submission to Firestore
- ✅ Testimonial retrieval from Firestore
- ✅ History data from Firestore
- ✅ Founder data from Firestore
- ✅ Locations data from Firestore
- ⏳ Authentication (optional, for admin approval)

## Usage

### Submit a Testimonial

The testimonial form at `/temoignages` automatically submits to Firestore. Testimonials are stored with `approved: false` and require admin approval before being displayed.

### Retrieve Approved Testimonials

```typescript
import { getApprovedTestimonials } from "@/lib/firestore";

const { testimonials } = await getApprovedTestimonials(10);
```

### Get About Page Data

```typescript
import { getHistory, getFounder, getLocations } from "@/lib/firestore";

const { history } = await getHistory();
const { founder } = await getFounder();
const { locations } = await getLocations();
```

## Next Steps

1. Install Firebase SDK: `npm install firebase`
2. Configure environment variables
3. Set up Firestore database
4. Run seed script to populate initial data
5. Configure security rules
6. Test the testimonial submission form
7. (Optional) Add Firebase Authentication for admin panel
