# ThrottleCove Deployment Guide
## Deploying to Netlify (Frontend) + Render/Railway (Backend) + Neon (Database)

This guide will walk you through deploying ThrottleCove to production using:
- **Netlify** for the frontend (static React app)
- **Render or Railway** for the backend (Express API)
- **Neon Database** for PostgreSQL (already configured)

---

## 📋 **Prerequisites**

Before you begin, make sure you have:
- [ ] GitHub account (to connect repositories)
- [ ] Netlify account (free tier available)
- [ ] Render or Railway account (free tier available)
- [ ] Neon Database account (free tier available - you already have this)
- [ ] Your Neon database connection string

---

## 🗄️ **Part 1: Database Setup (Neon)**

### You Already Have This! ✅

Your database is already configured and ready. You should have a `DATABASE_URL` that looks like:
```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**Keep this URL safe** - you'll need it for the backend deployment.

### Verify Your Database:

1. Log into your Neon dashboard: https://console.neon.tech
2. Confirm your database exists
3. Copy your connection string (you'll need it in Part 3)

---

## 🎨 **Part 2: Frontend Deployment (Netlify)**

### Option A: Deploy via Netlify UI (Recommended for beginners)

1. **Build Your Frontend Locally First (Optional - to test)**
   ```bash
   npm run build
   ```
   This creates a `dist/public` folder with your static files.

2. **Push Your Code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your ThrottleCove repository

4. **Configure Build Settings**
   - **Base directory**: Leave empty
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
   - Click "Show advanced" and add environment variable:
     - **Key**: `VITE_API_URL`
     - **Value**: `https://your-backend-url.com` (you'll get this in Part 3)

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your frontend
   - You'll get a URL like `https://random-name-123.netlify.app`

6. **Custom Domain (Optional)**
   - Go to "Domain settings" in Netlify
   - Add your custom domain
   - Follow DNS configuration instructions

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize your site
netlify init

# Deploy
netlify deploy --prod
```

---

## 🚀 **Part 3: Backend Deployment**

You have two great options for deploying the Express backend:

### Option A: Deploy to Render (Recommended)

1. **Push Code to GitHub** (if you haven't already)
   ```bash
   git add .
   git commit -m "Ready for backend deployment"
   git push origin main
   ```

2. **Create New Web Service on Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your ThrottleCove repository

3. **Configure the Service**
   - **Name**: `throttlecove-api`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

4. **Add Environment Variables**
   Click "Advanced" and add these variables:
   
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://your-neon-connection-string-here
   SESSION_SECRET=generate-a-long-random-string-here
   PORT=5000
   ```
   
   **To generate a secure SESSION_SECRET**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - You'll get a URL like `https://throttlecove-api.onrender.com`

6. **Update Frontend with Backend URL**
   - Go back to Netlify dashboard
   - Navigate to "Site settings" → "Environment variables"
   - Update `VITE_API_URL` with your Render URL: `https://throttlecove-api.onrender.com`
   - Trigger a new deployment in Netlify

### Option B: Deploy to Railway

1. **Sign Up/Login to Railway**
   - Go to https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your ThrottleCove repository

3. **Configure Service**
   Railway will auto-detect your Node.js app. Add these environment variables:
   
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://your-neon-connection-string-here
   SESSION_SECRET=your-generated-secret-here
   PORT=5000
   ```

4. **Deploy**
   - Railway will automatically deploy
   - You'll get a URL like `https://throttlecove-production.up.railway.app`

5. **Update Netlify**
   - Add the Railway URL to Netlify's `VITE_API_URL` environment variable
   - Redeploy the frontend

---

## 🔧 **Part 4: Database Schema Deployment**

After deploying your backend, push the database schema to Neon:

1. **Connect to Your Backend** (via Render/Railway dashboard or SSH)

2. **Run Database Migration**
   ```bash
   npm run db:push
   ```
   
   Or manually via the SQL tool in Neon dashboard if needed.

3. **Verify Tables**
   - Log into Neon dashboard
   - Go to "SQL Editor"
   - Run: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
   - You should see all your tables: users, motorcycles, maintenance_records, etc.

---

## 🎯 **Part 5: Post-Deployment Checklist**

### Test Your Deployment:

1. **Frontend Loading**
   - [ ] Visit your Netlify URL
   - [ ] Confirm homepage loads correctly
   - [ ] Check that all images and assets load

2. **Backend API**
   - [ ] Visit `https://your-backend-url.com/api/health` (if you have a health endpoint)
   - [ ] Should return status 200

3. **Full Stack Integration**
   - [ ] Try registering a new user
   - [ ] Try logging in
   - [ ] Try adding a motorcycle
   - [ ] Verify data persists after page refresh

4. **Database Connection**
   - [ ] Check Render/Railway logs for "Database initialized successfully"
   - [ ] No SSL connection errors
   - [ ] Queries executing properly

---

## 🔐 **Security Checklist**

Before going live with real users:

- [ ] `SESSION_SECRET` is a strong, random string (not the default)
- [ ] `DATABASE_URL` is only in environment variables (not committed to Git)
- [ ] CORS is properly configured in backend
- [ ] HTTPS is enabled (Netlify and Render/Railway do this automatically)
- [ ] Rate limiting is active
- [ ] Input validation is in place
- [ ] Password hashing with bcrypt is working

---

## 📊 **Monitoring Your Application**

### Backend Monitoring (Render/Railway):
- Check logs regularly for errors
- Monitor memory and CPU usage
- Set up alerts for downtime

### Database Monitoring (Neon):
- Monitor connection count
- Check query performance
- Review storage usage

### Frontend Monitoring (Netlify):
- Check build logs
- Monitor bandwidth usage
- Review analytics

---

## 🐛 **Troubleshooting Common Issues**

### Frontend shows "Network Error" or "Failed to fetch"

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Verify `VITE_API_URL` is set correctly in Netlify
2. Check backend is running (visit backend URL directly)
3. Verify CORS is configured on backend
4. Check browser console for exact error

### "Database connection failed"

**Problem**: Backend can't connect to Neon

**Solutions**:
1. Verify `DATABASE_URL` in Render/Railway environment variables
2. Check connection string has `?sslmode=require` at the end
3. Verify Neon database is not paused (Neon pauses after inactivity on free tier)
4. Check Render/Railway logs for exact error

### "Session not persisting" or "Logged out immediately"

**Problem**: Session storage issue

**Solutions**:
1. Verify `SESSION_SECRET` is set
2. For production, consider upgrading to Redis session storage
3. Check cookie settings in Express config
4. Verify frontend and backend are on HTTPS

### Build fails on Netlify

**Problem**: Frontend build errors

**Solutions**:
1. Run `npm run build` locally first
2. Check for TypeScript errors
3. Verify all environment variables with `VITE_` prefix are set
4. Review Netlify build logs for specific errors

### Backend crashes on Render/Railway

**Problem**: Server errors or out of memory

**Solutions**:
1. Check Render/Railway logs for error messages
2. Verify all environment variables are set
3. Consider upgrading from free tier if needed
4. Check for memory leaks in code

---

## 💰 **Cost Breakdown**

### Free Tier (Perfect for getting started):
- **Netlify**: 100GB bandwidth/month, 300 build minutes/month
- **Render**: 750 hours/month (but sleeps after inactivity)
- **Railway**: $5 free credit/month
- **Neon**: 10GB storage, 0.5GB RAM

### Recommended Paid Tier (For production with users):
- **Netlify Pro**: $19/month (better performance, more bandwidth)
- **Render Starter**: $7/month (always-on, better specs)
- **Neon Pro**: $19/month (more storage, better performance)
- **Total**: ~$45/month for solid production setup

---

## 🚀 **Alternative: All-in-One Deployment**

If you prefer to keep frontend and backend together:

### Deploy Entire App to Render/Railway:

1. Keep the current monorepo structure
2. Deploy to Render/Railway as a Node.js app
3. Remove `VITE_API_URL` (frontend and backend on same domain)
4. Backend serves both API and static frontend files

**Pros**: Simpler setup, single deployment
**Cons**: Less scalable, can't use Netlify's CDN benefits

---

## 📝 **Environment Variables Quick Reference**

### Netlify (Frontend):
```
VITE_API_URL=https://your-backend-url.com
```

### Render/Railway (Backend):
```
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
SESSION_SECRET=your-64-character-random-string
PORT=5000
```

### Neon (Database):
Already configured - just copy connection string to backend.

---

## ✅ **Success! Your App is Live**

Once everything is deployed:

1. Share your Netlify URL with users
2. Consider setting up a custom domain
3. Monitor logs and performance
4. Set up automated backups for your database
5. Plan for scaling as you grow

**Your ThrottleCove app is now production-ready and accessible to the world!** 🏍️✨

---

## 📞 **Need Help?**

- **Netlify Docs**: https://docs.netlify.com
- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **Neon Docs**: https://neon.tech/docs
- **ThrottleCove Documentation**: See `COMPLETE_PROJECT_DOCUMENTATION.md` in this repository

---

**Last Updated**: November 2025
**Version**: 1.0
