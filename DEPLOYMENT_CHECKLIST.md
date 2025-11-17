# 🚀 Quick Deployment Checklist

Use this checklist to deploy ThrottleCove to production in under 30 minutes.

---

## Pre-Deployment Setup (5 minutes)

### 1. Prepare Environment Variables
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in your Neon `DATABASE_URL`
- [ ] Generate SESSION_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Save these values - you'll need them for deployment

### 2. Test Locally
- [ ] Run `npm run build` successfully
- [ ] Run `npm start` and verify app works
- [ ] Test user registration and login
- [ ] Verify database connection works

### 3. Commit Your Code
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

---

## Database Setup (Already Done! ✅)

- [x] Neon database created
- [x] Connection string obtained
- [x] Database tables created
- [x] SSL connection configured

**Your DATABASE_URL**: Keep this safe!

---

## Backend Deployment (10 minutes)

### Option A: Render (Recommended)
1. [ ] Go to https://dashboard.render.com
2. [ ] Click "New +" → "Web Service"
3. [ ] Connect GitHub repo
4. [ ] Set build command: `npm install && npm run build`
5. [ ] Set start command: `npm start`
6. [ ] Add environment variables:
   - `NODE_ENV=production`
   - `DATABASE_URL=your-neon-url`
   - `SESSION_SECRET=your-generated-secret`
   - `PORT=5000`
7. [ ] Click "Create Web Service"
8. [ ] Wait for deployment (3-5 minutes)
9. [ ] Copy your backend URL (e.g., `https://throttlecove-api.onrender.com`)

### Option B: Railway (Alternative)
1. [ ] Go to https://railway.app
2. [ ] Click "New Project" → "Deploy from GitHub"
3. [ ] Select your repo
4. [ ] Add environment variables (same as Render)
5. [ ] Deploy automatically starts
6. [ ] Copy your backend URL

**✅ Backend URL**: ___________________________________

---

## Frontend Deployment (10 minutes)

### Netlify Deployment
1. [ ] Go to https://app.netlify.com
2. [ ] Click "Add new site" → "Import an existing project"
3. [ ] Connect GitHub
4. [ ] Select ThrottleCove repository
5. [ ] Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
6. [ ] Add environment variable:
   - Key: `VITE_API_URL`
   - Value: Your backend URL from above
7. [ ] Click "Deploy site"
8. [ ] Wait for build (2-3 minutes)
9. [ ] Copy your frontend URL (e.g., `https://throttlecove-xyz.netlify.app`)

**✅ Frontend URL**: ___________________________________

---

## Post-Deployment Testing (5 minutes)

### 1. Test Frontend
- [ ] Visit your Netlify URL
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] All images load

### 2. Test Backend Connection
- [ ] Open browser DevTools → Network tab
- [ ] Try to register a new user
- [ ] Check if API calls go to your backend URL
- [ ] Verify no CORS errors

### 3. Test Full Authentication Flow
- [ ] Register a new test account
- [ ] Verify registration success
- [ ] Log out
- [ ] Log back in
- [ ] Verify session persists

### 4. Test Database Persistence
- [ ] Add a motorcycle
- [ ] Close browser completely
- [ ] Re-open and login
- [ ] Verify motorcycle is still there ✅

---

## Optional: Custom Domain Setup

### For Netlify (Frontend)
1. [ ] Go to Netlify → Site settings → Domain management
2. [ ] Click "Add custom domain"
3. [ ] Enter your domain (e.g., `throttlecove.com`)
4. [ ] Update DNS settings with your domain provider
5. [ ] Wait for SSL certificate (automatic, ~1 hour)

### For Render (Backend)
1. [ ] Upgrade to paid plan ($7/month minimum)
2. [ ] Go to Settings → Custom Domains
3. [ ] Add `api.throttlecove.com`
4. [ ] Update DNS with CNAME record
5. [ ] Update Netlify `VITE_API_URL` to new domain

---

## Monitoring Setup (Optional but Recommended)

### Render Dashboard
- [ ] Bookmark your Render dashboard
- [ ] Enable email notifications for failures
- [ ] Check logs regularly: Dashboard → Logs

### Netlify Dashboard
- [ ] Enable deploy notifications
- [ ] Set up Slack/Discord webhooks (optional)
- [ ] Monitor build minutes usage

### Neon Dashboard
- [ ] Check database usage weekly
- [ ] Monitor query performance
- [ ] Set up billing alerts

---

## Security Final Checks

- [ ] `SESSION_SECRET` is strong and random (not "change-this")
- [ ] `DATABASE_URL` is only in environment variables (not in code)
- [ ] `.env` is in `.gitignore` (verify it's not committed)
- [ ] HTTPS is enabled on both frontend and backend ✅ (automatic)
- [ ] CORS is configured to only allow your frontend domain
- [ ] Rate limiting is active on API endpoints

---

## 🎉 Launch Checklist

Before sharing with users:

- [ ] All tests above passed ✅
- [ ] Database backups configured (Neon auto-backups on paid plans)
- [ ] Error monitoring setup (optional: Sentry, LogRocket)
- [ ] Analytics setup (optional: Google Analytics, Plausible)
- [ ] Terms of Service page created (if collecting user data)
- [ ] Privacy Policy page created (if collecting user data)
- [ ] Contact/Support email configured

---

## Common Issues & Quick Fixes

| Problem | Solution |
|---------|----------|
| "Network Error" on login | Check `VITE_API_URL` in Netlify env vars |
| Backend shows "Database error" | Verify `DATABASE_URL` in Render, check Neon isn't paused |
| Sessions don't persist | Verify `SESSION_SECRET` is set on backend |
| Build fails on Netlify | Run `npm run build` locally, fix any errors |
| CORS error in browser | Check backend CORS config allows frontend domain |
| Render service sleeping | Upgrade to paid plan or ping it every 10 mins |

---

## 📊 Costs Summary

**Free Tier (Great for testing):**
- Netlify: Free
- Render: Free (sleeps after 15 mins inactivity)
- Neon: Free (0.5GB RAM, 10GB storage)
- **Total: $0/month**

**Recommended Production Setup:**
- Netlify Pro: $19/month (or stay free if bandwidth is low)
- Render Starter: $7/month (always-on)
- Neon Pro: $19/month (better performance)
- **Total: ~$45/month for solid production**

---

## 🎯 Success Metrics

After 24 hours, check:
- [ ] Zero deployment errors
- [ ] All API endpoints responding
- [ ] Database queries working
- [ ] Users can register and login
- [ ] Data persists correctly

**Congratulations! ThrottleCove is live! 🏍️**

---

## Next Steps After Launch

1. Monitor logs daily for first week
2. Collect user feedback
3. Plan feature updates
4. Consider adding:
   - Email verification
   - Password reset flow
   - Social login (Google, Facebook)
   - Push notifications
   - Mobile app (React Native)

---

**Need detailed instructions?** See `DEPLOYMENT_GUIDE.md` for full step-by-step guide.

**Questions?** Check the troubleshooting section in `DEPLOYMENT_GUIDE.md`
