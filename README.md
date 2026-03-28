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
- For production, use your own Firebase project in `.env.local` or replace `firebase-applet-config.json`. The bundled config is only a fallback.

## Deployment

- GitHub Actions CI is included in `.github/workflows/ci.yml`. Every push to `main` and every pull request runs `npm ci`, `npm run lint`, and `npm run build`.
- Netlify is supported with `netlify.toml` and `public/_redirects`.
- Vercel is supported with `vercel.json`.
- Firebase Hosting is supported with `firebase.json`.
- Static-host SPA rewrites are already configured for the hosted routes `/services`, `/gallery`, `/about`, `/contact`, `/booking`, and `/staff`.

### Production Checklist

- `.env.local` is ignored and should not be committed.
1. Create a Firebase project you control.
2. Enable Google Authentication in Firebase Authentication.
3. Create Firestore and publish `firestore.rules`.
4. Set the `VITE_FIREBASE_*` environment variables in your hosting platform.
5. Build locally with `npm run build` before deploy.
6. If you deploy on Firebase Hosting, run `firebase deploy`.
7. If you deploy on Vercel or Netlify, point the service at this repo and use the default build settings already included.

## GitHub

- The repository is initialized on `main` and can be pushed to GitHub as a normal Vite app.
- `dist`, local env files, and platform cache folders are ignored.
