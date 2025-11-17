# ⚡ ThrottleCove - Deploy in 15 Minutes

The fastest way to get ThrottleCove live on the internet.

---

## 🎯 What You'll Deploy

- **Frontend**: React app on Netlify (free, fast CDN)
- **Backend**: Express API on Render (free with limitations)
- **Database**: PostgreSQL on Neon (already setup!)

---

## ⚡ Super Quick Deployment

### Step 1: Get Your Database URL (2 min)
You already have this from Neon! It looks like:
```
postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

### Step 2: Deploy Backend to Render (5 min)

1. Go to **https://dashboard.render.com** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Select your **ThrottleCove repository**
4. Fill in:
   - **Name**: `throttlecove-api`
   - **Build**: `npm install && npm run build`
   - **Start**: `npm start`
5. Click **"Advanced"** → Add these:
   ```
   NODE_ENV = production
   DATABASE_URL = [paste your Neon URL here]
   SESSION_SECRET = [run this: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
   PORT = 5000
   ```
6. Click **"Create Web Service"**
7. **Copy your URL**: `https://throttlecove-api.onrender.com` ← Save this!

### Step 3: Deploy Frontend to Netlify (5 min)

1. Go to **https://app.netlify.com** → Sign up with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Select your **ThrottleCove repository**
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
5. Click **"Show advanced"** → Add this:
   ```
   VITE_API_URL = [paste your Render URL from Step 2]
   ```
6. Click **"Deploy site"**
7. **Done!** Your app is live at: `https://[random-name].netlify.app`

### Step 4: Test It (3 min)

1. Visit your Netlify URL
2. Register a new account
3. Add a motorcycle
4. Refresh the page → motorcycle should still be there!

---

## ✅ That's It!

Your app is now live and accessible from anywhere in the world!

### Your URLs:
- **Frontend**: `https://[your-site].netlify.app`
- **Backend**: `https://throttlecove-api.onrender.com`
- **Database**: Neon (already configured)

---

## 📱 Share Your App

Send your Netlify URL to anyone - they can now:
- Create accounts
- Add their motorcycles
- Track maintenance
- Join the community

---

## ⚠️ Free Tier Limitations

**Render (Backend):**
- Sleeps after 15 minutes of inactivity
- Takes 30-60 seconds to wake up on first request
- **Solution**: Upgrade to $7/month for always-on

**Netlify (Frontend):**
- 100GB bandwidth/month
- 300 build minutes/month
- Usually enough for small-medium apps

**Neon (Database):**
- 10GB storage
- 0.5GB RAM
- Pauses after 7 days inactivity (free tier)

---

## 🚀 Upgrade for Production

When you're ready for real users:
- **Render Starter**: $7/month (always-on backend)
- **Neon Pro**: $19/month (better performance)
- **Netlify Pro**: $19/month (optional, more bandwidth)

---

## 🐛 Something Not Working?

| Issue | Fix |
|-------|-----|
| Can't register users | Check Render logs, verify DATABASE_URL |
| "Network Error" | Verify VITE_API_URL in Netlify matches Render URL |
| Backend slow first load | Normal on free tier (waking from sleep) |
| Build failed | Run `npm run build` locally first |

---

## 📚 Want More Details?

- **Full Guide**: `DEPLOYMENT_GUIDE.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST.md`
- **Project Docs**: `COMPLETE_PROJECT_DOCUMENTATION.md`

---

**Deployed in 15 minutes! 🎉** Now go ride! 🏍️
