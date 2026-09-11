# 🚀 BIT Central & PS Portal Proxy Microservice

High-performance, lightweight API proxy server designed to handle queries to **BIT Central** and **BIT Personalised System (PS)** with zero CORS errors, automatic token injection from Firebase, and response caching.

## Features:
- **CORS Bypassed**: Enables web & mobile apps to query BIT systems without browser cross-origin blocks.
- **Master Session Auto-Fallback**: Auto-loads the active master PS session token from Firebase Realtime Database (`/ps_session/active_token`).
- **Multi-Upstream Failover**: Auto-fails over between `bitcentral-v2.onrender.com`, `bitcentral.bitsathy.in`, and direct endpoints.
- **In-Memory Cache**: 60-second TTL edge caching for sub-50ms response times.
- **Data Privacy**: Automatic masking of phone numbers.

## Free 1-Click Deployment to Render:
1. Push this folder / repo to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) ➔ **New Web Service**.
3. Set **Root Directory** to `proxy-server`.
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. (Optional) Set Environment Variables:
   - `FIREBASE_DB_URL`: `https://rewards-site-7a5a8-default-rtdb.firebaseio.com`
   - `PS_SERVICE_TOKEN`: *(optional master PS token)*
