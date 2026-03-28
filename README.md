# Sasyl Barber, Spa and Salon

Vite + React single-page app for Sasyl Barber, Spa and Salon in Donholm, Nairobi. The site includes marketing pages, Google sign-in, Firebase-backed booking, and a staff dashboard for appointment management.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Firebase Authentication + Cloud Firestore

## Local Setup

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and add your `VITE_FIREBASE_*` values.
   If you want to keep using the bundled Firebase client config, you can leave these blank and keep `firebase-applet-config.json`.
3. Start the dev server:
   `npm run dev`
4. Build for production:
   `npm run build`

## Firebase Notes

- Enable Google sign-in in Firebase Authentication.
- Firestore rules live in `firestore.rules`.
- Staff users need a `/users/{uid}` document with role `staff` or `admin`.
- Booking writes store Firestore timestamps, which matches the current security rules.

## GitHub Readiness

- `.env.local` is ignored and should not be committed.
- Review `firebase-applet-config.json` before publishing if you want to point the site at your own Firebase project.
- The project can be initialized with `git init -b main` before pushing to GitHub if this folder is not already a repository.
