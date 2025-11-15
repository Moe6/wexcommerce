# Railway Deployment Guide

This guide will walk you through deploying your wexcommerce application to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. GitHub account (if deploying from GitHub)
3. MongoDB Atlas account (or use Railway's MongoDB service)
4. Environment variables ready (see below)

## Architecture Overview

Your application consists of:
- **Backend**: Express/Node.js API (port 4005)
- **Frontend**: Next.js application (port 8006)
- **Database**: MongoDB
- **Admin**: Next.js admin panel (optional, can be deployed separately)

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. Ensure your code is pushed to GitHub
2. Make sure all dependencies are properly listed in `package.json` files

### Step 2: Create a New Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository (`wexcommerce`)
5. Railway will detect your project structure

### Step 3: Add MongoDB Database

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add MongoDB"**
3. Railway will provision a MongoDB instance
4. Note the connection string (you'll need it for environment variables)

### Step 4: Deploy Backend Service

1. In Railway dashboard, click **"+ New"** → **"GitHub Repo"**
2. Select your repository
3. Configure the backend service:

#### Option A: Using Dockerfile (Recommended)

1. Go to **Settings** → **Build**
2. Set **Dockerfile Path** to `backend/Dockerfile.railway`
3. Leave **Root Directory** empty (Railway uses repo root by default)
4. Go to **Settings** → **Deploy**
5. Leave **Start Command** empty (uses Dockerfile CMD)

#### Option B: Using Nixpacks (No Dockerfile)

1. Go to **Settings** → **Root Directory**: `/backend`
2. Railway will auto-detect Node.js
3. Set **Start Command**: `npm run start`
4. Note: You may need to adjust build commands for monorepo structure

### Step 5: Configure Backend Environment Variables

In the backend service, go to **Variables** and add:

#### Required Variables:
```bash
# Node Environment
NODE_ENV=production

# Server Configuration
WC_PORT=4005
WC_HTTPS=false

# Database (use Railway MongoDB connection string)
WC_DB_URI=<your-railway-mongodb-connection-string>
WC_DB_SSL=false
WC_DB_DEBUG=false

# Security
WC_COOKIE_SECRET=<generate-a-random-32-char-string>
WC_JWT_SECRET=<generate-a-random-32-char-string>
WC_JWT_EXPIRE_AT=86400
WC_TOKEN_EXPIRE_AT=86400
WC_AUTH_COOKIE_DOMAIN=<your-railway-domain>.railway.app

# SMTP Configuration (for emails)
WC_SMTP_HOST=<your-smtp-host>
WC_SMTP_PORT=587
WC_SMTP_USER=<your-smtp-username>
WC_SMTP_PASS=<your-smtp-password>
WC_SMTP_FROM=<your-email@example.com>

# CDN Paths (use Railway volume or external storage)
WC_CDN_ROOT=/var/www/cdn
WC_CDN_USERS=/var/www/cdn/lebobeautyco/users
WC_CDN_TEMP_USERS=/var/www/cdn/lebobeautyco/users/temp
WC_CDN_CATEGORIES=/var/www/cdn/lebobeautyco/categories
WC_CDN_TEMP_CATEGORIES=/var/www/cdn/lebobeautyco/categories/temp
WC_CDN_PRODUCTS=/var/www/cdn/lebobeautyco/products
WC_CDN_TEMP_PRODUCTS=/var/www/cdn/lebobeautyco/products/temp

# Hosts (will be set after deployment)
WC_ADMIN_HOST=<your-admin-url>.railway.app
WC_FRONTEND_HOST=<your-frontend-url>.railway.app

# Defaults
WC_DEFAULT_LANGUAGE=en
WC_DEFAULT_CURRENCY=$
WC_DEFAULT_STRIPE_CURRENCY=USD

# Payment Gateways (optional)
WC_STRIPE_SECRET_KEY=<your-stripe-secret-key>
WC_PAYPAL_CLIENT_ID=<your-paypal-client-id>
WC_PAYPAL_CLIENT_SECRET=<your-paypal-secret>
WC_PAYPAL_SANDBOX=false

# Website Name
WC_WEBSITE_NAME=lebobeautyco

# Optional
WC_ADMIN_EMAIL=<admin@example.com>
WC_RECAPTCHA_SECRET=<your-recaptcha-secret>
WC_IPINFO_API_KEY=<your-ipinfo-key>
WC_ENABLE_SENTRY=false
```

### Step 6: Deploy Frontend Service

1. In Railway dashboard, click **"+ New"** → **"GitHub Repo"**
2. Select your repository
3. Configure the frontend service:

#### Option A: Using Dockerfile (Recommended)

1. Go to **Settings** → **Build**
2. Set **Dockerfile Path** to `frontend/Dockerfile.railway`
3. Leave **Root Directory** empty (Railway uses repo root by default)
4. Go to **Settings** → **Deploy**
5. Leave **Start Command** empty (uses Dockerfile CMD)

#### Option B: Using Nixpacks (No Dockerfile)

1. Go to **Settings** → **Root Directory**: `/frontend`
2. Railway will auto-detect Node.js/Next.js
3. Set **Start Command**: `next start -H 0.0.0.0 -p $PORT`
4. Note: You may need to adjust build commands for monorepo structure

### Step 7: Configure Frontend Environment Variables

In the frontend service, go to **Variables** and add:

#### Required Variables:
```bash
# Node Environment
NODE_ENV=production

# Base URL (will be your Railway frontend URL)
NEXT_PUBLIC_BASE_URL=https://<your-frontend-service>.railway.app

# API Hosts (use Railway backend service URL)
NEXT_PUBLIC_WC_SERVER_API_HOST=https://<your-backend-service>.railway.app
NEXT_PUBLIC_WC_CLIENT_API_HOST=https://<your-backend-service>.railway.app

# Website Configuration
NEXT_PUBLIC_WC_WEBSITE_NAME=lebobeautyco
NEXT_PUBLIC_WC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_WC_PAGE_SIZE=30
NEXT_PUBLIC_WC_ORDERS_PAGE_SIZE=4

# CDN URLs (use Railway backend URL or external CDN)
NEXT_PUBLIC_WC_CDN_ROOT=https://<your-backend-service>.railway.app/cdn
NEXT_PUBLIC_WC_CDN_PRODUCTS=https://<your-backend-service>.railway.app/cdn/products
NEXT_PUBLIC_WC_CDN_CATEGORIES=https://<your-backend-service>.railway.app/cdn/categories
NEXT_PUBLIC_WC_CDN_LOGO=https://<your-backend-service>.railway.app/cdn/logo

# Payment Gateway
NEXT_PUBLIC_WC_PAYMENT_GATEWAY=stripe
NEXT_PUBLIC_WC_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
NEXT_PUBLIC_WC_PAYPAL_CLIENT_ID=<your-paypal-client-id>
NEXT_PUBLIC_WC_PAYPAL_DEBUG=false

# Social Login (optional)
NEXT_PUBLIC_WC_FB_APP_ID=<your-facebook-app-id>
NEXT_PUBLIC_WC_GG_APP_ID=<your-google-app-id>
NEXT_PUBLIC_WC_APPLE_ID=<your-apple-app-id>

# Google Analytics (optional)
NEXT_PUBLIC_WC_GOOGLE_ANALYTICS_ENABLED=false
NEXT_PUBLIC_WC_GOOGLE_ANALYTICS_ID=<your-ga-id>

# reCAPTCHA (optional)
NEXT_PUBLIC_WC_RECAPTCHA_ENABLED=false
NEXT_PUBLIC_WC_RECAPTCHA_SITE_KEY=<your-recaptcha-site-key>

# Contact Email
NEXT_PUBLIC_WC_CONTACT_EMAIL=<contact@example.com>

# EmailJS (optional, for contact forms)
NEXT_PUBLIC_WC_EMAILJS_SERVICE_ID=<your-emailjs-service-id>
NEXT_PUBLIC_WC_EMAILJS_TEMPLATE_ID=<your-emailjs-template-id>
NEXT_PUBLIC_WC_EMAILJS_PUBLIC_KEY=<your-emailjs-public-key>
```

### Step 8: Set Up Custom Domains (Optional)

1. In each service (backend/frontend), go to **Settings** → **Networking**
2. Click **"Generate Domain"** to get a Railway domain
3. Or add your custom domain:
   - Click **"Custom Domain"**
   - Enter your domain
   - Follow DNS configuration instructions

### Step 9: Update Environment Variables with Actual URLs

After deployment, Railway will provide URLs for each service. Update:

**Backend:**
- `WC_ADMIN_HOST` = your admin URL (if deploying admin)
- `WC_FRONTEND_HOST` = your frontend URL
- `WC_AUTH_COOKIE_DOMAIN` = your Railway domain (without protocol)

**Frontend:**
- `NEXT_PUBLIC_BASE_URL` = your frontend URL
- `NEXT_PUBLIC_WC_SERVER_API_HOST` = your backend URL
- `NEXT_PUBLIC_WC_CLIENT_API_HOST` = your backend URL

### Step 10: Set Up Persistent Storage (for CDN)

Railway provides ephemeral storage by default. For file uploads (products, categories, etc.):

**Option 1: Use Railway Volumes**
1. In backend service, go to **Settings** → **Volumes**
2. Create a volume for `/var/www/cdn`
3. Mount it to your backend service

**Option 2: Use External Storage (Recommended)**
- AWS S3
- Cloudinary
- Railway's built-in storage
- Update CDN paths in environment variables accordingly

### Step 11: Deploy Admin Panel (Optional)

If you want to deploy the admin panel:

1. Create a new service for admin
2. Use similar configuration as frontend
3. Set admin-specific environment variables
4. Point `WC_ADMIN_HOST` to admin service URL

## Important Notes

### Port Configuration

Railway automatically sets the `PORT` environment variable. Your applications need to be configured:

**Backend:**
Your backend code has been updated to automatically check Railway's `PORT` environment variable first, then fall back to `WC_PORT` or default 4005. You don't need to set `WC_PORT` unless you want a specific port.

**Frontend:**
Your frontend has been updated to use the PORT environment variable. The start script in `package.json` now uses `${PORT:-8006}`, which will use Railway's PORT if available, or default to 8006.

If you prefer using a shell script, you can use:
- Start Command: `sh start.sh` (uses the provided `frontend/start.sh` script)

### Database Connection

Railway MongoDB provides a connection string like:
```
mongodb://mongo:<password>@<host>:<port>/<database>?authSource=admin
```

Use this directly in `WC_DB_URI`.

### Build Optimization

The Dockerfiles provided are optimized for Railway:
- Multi-stage builds for smaller images
- Production-only dependencies
- Proper caching layers

### Monitoring

Railway provides:
- Logs: View in real-time in the dashboard
- Metrics: CPU, Memory, Network usage
- Alerts: Set up notifications for errors

## Troubleshooting

### Error: "Dockerfile `Dockerfile.railway` does not exist"

**Problem**: Railway is looking for a Dockerfile at the root, but your Dockerfiles are in subdirectories.

**Solution**: 
1. Go to your service → **Settings** → **Build**
2. Set **Dockerfile Path** to:
   - Backend: `backend/Dockerfile.railway`
   - Frontend: `frontend/Dockerfile.railway`
3. Leave **Root Directory** empty
4. Save and redeploy

See `RAILWAY_TROUBLESHOOTING.md` for more troubleshooting tips.

### Build Failures

1. Check build logs in Railway dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility
4. Check for TypeScript compilation errors

### Runtime Errors

1. Check service logs
2. Verify all environment variables are set
3. Ensure database connection string is correct
4. Check that ports are correctly configured

### Database Connection Issues

1. Verify MongoDB connection string format
2. Check if MongoDB service is running
3. Ensure network connectivity between services
4. Verify authentication credentials

### File Upload Issues

1. Check volume mounts (if using Railway volumes)
2. Verify CDN path permissions
3. Consider using external storage for production

## Cost Optimization

- Railway offers a free tier with $5 credit monthly
- Monitor usage in the dashboard
- Use Railway's sleep feature for development environments
- Consider using external MongoDB Atlas free tier if needed

## Next Steps

1. Set up CI/CD (Railway auto-deploys on git push)
2. Configure custom domains
3. Set up monitoring and alerts
4. Configure backups for MongoDB
5. Set up staging environment

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Your project logs: Available in Railway dashboard

## Quick Reference: Environment Variables Checklist

### Backend ✅
- [ ] NODE_ENV
- [ ] WC_DB_URI
- [ ] WC_COOKIE_SECRET
- [ ] WC_JWT_SECRET
- [ ] WC_SMTP_* (all 5)
- [ ] WC_CDN_* (all paths)
- [ ] WC_ADMIN_HOST
- [ ] WC_FRONTEND_HOST
- [ ] WC_AUTH_COOKIE_DOMAIN

### Frontend ✅
- [ ] NODE_ENV
- [ ] NEXT_PUBLIC_BASE_URL
- [ ] NEXT_PUBLIC_WC_SERVER_API_HOST
- [ ] NEXT_PUBLIC_WC_CLIENT_API_HOST
- [ ] NEXT_PUBLIC_WC_CDN_* (all URLs)
- [ ] Payment gateway keys (Stripe/PayPal)

---

**Happy Deploying! 🚀**

