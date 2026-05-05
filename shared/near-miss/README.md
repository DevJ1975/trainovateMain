# `shared/near-miss/`

Platform-agnostic core of the near-miss reporting module. **Consumed by both
the Next.js web app and any React Native / Expo client.**

## What's here

| File | Contents | Safe in RN? |
|------|----------|-------------|
| `types.ts` | Domain types (`NearMissReport`, `Attachment`, `ContributingFactor`, etc.) | ✅ |
| `constants.ts` | Hazard categories, severity levels, statuses, factor types + label helpers | ✅ |
| `validation.ts` | Limits and a pure `validateCreateReport()` function | ✅ |
| `format.ts` | `relativeTime()` — locale-friendly relative time strings | ✅ |
| `api.ts` | `createNearMissApi({ baseUrl, getToken })` — typed fetch client | ✅ |

**Rules**: this folder must not import from `node:*`, `next/*`, `fs`, `crypto`,
DOM types, or Tailwind. Server-only or web-only helpers go in `lib/near-miss/`
or `components/` instead. The Next.js web app re-exports these from
`lib/near-miss/types.ts` so existing imports keep working.

## Using it from Expo

1. Inside your Expo project's `tsconfig.json`, add a path that resolves to
   this folder:

   ```jsonc
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@nm-shared/*": ["../trainovateMain/shared/near-miss/*"]
       }
     }
   }
   ```

   Update `metro.config.js` so Metro can resolve that path:

   ```js
   const path = require("path");
   const { getDefaultConfig } = require("expo/metro-config");

   const config = getDefaultConfig(__dirname);
   config.watchFolders = [path.resolve(__dirname, "../trainovateMain/shared")];
   config.resolver.extraNodeModules = {
     "@nm-shared": path.resolve(__dirname, "../trainovateMain/shared/near-miss"),
   };
   module.exports = config;
   ```

2. Drive the API from your screens:

   ```ts
   import * as SecureStore from "expo-secure-store";
   import { createNearMissApi } from "@nm-shared/api";

   const api = createNearMissApi({
     baseUrl: process.env.EXPO_PUBLIC_API_URL!,
     getToken: () => SecureStore.getItemAsync("nm_token"),
   });

   // Public — anonymous submission
   const { report, receiptCode } = await api.createReport({
     anonymous: true,
     locationText: "Loading bay 3",
     hazardCategory: "slip_trip",
     severityPotential: "high",
     description: "Hydraulic oil leak from forklift...",
   });
   if (receiptCode) await SecureStore.setItemAsync("nm_receipt", receiptCode);

   // Mobile login
   const session = await api.signIn({ email, password });
   await SecureStore.setItemAsync("nm_token", session.token);

   // Authenticated triage list
   const reports = await api.listReports();
   ```

3. Photo uploads. RN's `fetch` accepts a `FormData` whose value is
   `{ uri, name, type }`:

   ```ts
   const photo = {
     uri: imagePickerResult.uri,
     name: "near-miss.jpg",
     type: "image/jpeg",
   } as unknown as Blob;
   await api.uploadPhoto(report.id, photo, { code: receiptCode });
   ```

4. Display attachments via `api.attachmentUrl(id, { code })` — pass it to
   `<Image source={{ uri: url }} />`. The web app uses the same endpoint
   with cookie auth.

## What still has to live in the app, not in shared

- DB access (`lib/near-miss/store.ts`) — server-only, talks to SQLite/Drizzle.
- Filesystem storage (`lib/near-miss/storage.ts`) — Node-only. Production swap
  to S3 keeps the same interface.
- Notification dispatcher (`lib/near-miss/notifications.ts`) — runs in the
  Node runtime where we have channel SDKs (Slack, Twilio, SES). Mobile gets
  push via a separate flow (FCM/APNs) that this dispatcher would route to.
- Auth session (`lib/auth/session.ts`) — issues HMAC-signed bearer tokens.
  Mobile receives the token via `POST /api/auth/token` and includes it as
  `Authorization: Bearer …`.

## API surface

| Method & path | Auth | Used for |
|---------------|------|----------|
| `GET /api/near-miss/categories` | none | Static reference data; cache aggressively |
| `POST /api/near-miss/reports` | none | Submit a new report (anonymous or named) |
| `GET /api/near-miss/reports` | bearer | Triage queue list |
| `GET /api/near-miss/reports/[id]` | bearer | Triage detail |
| `GET /api/near-miss/reports/by-reference/[ref]` | none | Post-submit confirmation |
| `GET /api/near-miss/reports/by-code/[code]` | none | Anonymous status lookup |
| `POST /api/near-miss/reports/[id]/attachments` | bearer or `?code=` | Upload a photo |
| `GET /api/attachments/[id]` | cookie/bearer or `?code=` | Stream a stored photo |
| `POST /api/auth/token` | none | Exchange email+password for bearer token |
| `GET /api/auth/me` | bearer | Whoami for the held token |

The triage write endpoints (status change, factor add, action add, complete)
are not yet exposed over HTTP — the web triage console uses Next.js server
actions today. Add them under `/api/near-miss/reports/[id]/...` when you wire
mobile triage.
