# Railway Quick Start Guide

This is a condensed version of the deployment guide. Follow these steps to get your app running on Railway quickly.

## Prerequisites Checklist
- [ ] Railway account created
- [ ] GitHub repository pushed
- [ ] MongoDB connection string ready (or use Railway MongoDB)
- [ ] SMTP credentials ready
- [ ] Payment gateway keys (Stripe/PayPal) ready

## Quick Deployment Steps

### 1. Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `wexcommerce` repository

### 2. Add MongoDB
1. Click **"+ New"** → **"Database"** → **"Add MongoDB"**
2. Copy the connection string (starts with `mongodb://`)

### 3. Deploy Backend

#### Option A: Using Dockerfile (Recommended)
1. Click **"+ New"** → **"GitHub Repo"** → Select your repo
2. Go to **Settings** → **Build**
   - **Dockerfile Path**: `backend/Dockerfile.railway`
   - **Root Directory**: `/` (leave empty or set to `/`)
3. Go to **Settings** → **Deploy**
   - **Start Command**: Leave empty (uses Dockerfile CMD)

#### Option B: Using Nixpacks (No Dockerfile)
1. Click **"+ New"** → **"GitHub Repo"** → Select your repo
2. Go to **Settings** → **Root Directory**: `/backend`
3. Railway will auto-detect Node.js

### 4. Configure Backend Environment Variables

In backend service → **Variables**, add these (replace placeholders):

```bash
# Core
NODE_ENV=production
WC_HTTPS=false
# Note: PORT is automatically handled by Railway and the code

# Database (use Railway MongoDB connection string)
WC_DB_URI=<railway-mongodb-connection-string>
WC_DB_SSL=false
WC_DB_DEBUG=false

# Security (generate random strings)
WC_COOKIE_SECRET=<random-32-chars>
WC_JWT_SECRET=<random-32-chars>
WC_JWT_EXPIRE_AT=86400
WC_TOKEN_EXPIRE_AT=86400

# SMTP (required)
WC_SMTP_HOST=<smtp.gmail.com>
WC_SMTP_PORT=587
WC_SMTP_USER=<your-email@gmail.com>
WC_SMTP_PASS=<your-app-password>
WC_SMTP_FROM=<your-email@gmail.com>

# CDN Paths
WC_CDN_ROOT=/var/www/cdn
WC_CDN_USERS=/var/www/cdn/lebobeautyco/users
WC_CDN_TEMP_USERS=/var/www/cdn/lebobeautyco/users/temp
WC_CDN_CATEGORIES=/var/www/cdn/lebobeautyco/categories
WC_CDN_TEMP_CATEGORIES=/var/www/cdn/lebobeautyco/categories/temp
WC_CDN_PRODUCTS=/var/www/cdn/lebobeautyco/products
WC_CDN_TEMP_PRODUCTS=/var/www/cdn/lebobeautyco/products/temp

# Hosts (update after deployment)
WC_ADMIN_HOST=<will-update-after-deployment>
WC_FRONTEND_HOST=<will-update-after-deployment>
WC_AUTH_COOKIE_DOMAIN=<your-backend-service>.railway.app

# Defaults
WC_DEFAULT_LANGUAGE=en
WC_DEFAULT_CURRENCY=$
WC_DEFAULT_STRIPE_CURRENCY=USD
WC_WEBSITE_NAME=lebobeautyco

# Payment (optional but recommended)
WC_STRIPE_SECRET_KEY=<your-stripe-secret>
WC_PAYPAL_CLIENT_ID=<your-paypal-client-id>
WC_PAYPAL_CLIENT_SECRET=<your-paypal-secret>
WC_PAYPAL_SANDBOX=false
```

### 5. Deploy Frontend

#### Option A: Using Dockerfile (Recommended)
1. Click **"+ New"** → **"GitHub Repo"** → Select your repo
2. Go to **Settings** → **Build**
   - **Dockerfile Path**: `frontend/Dockerfile.railway`
   - **Root Directory**: `/` (leave empty or set to `/`)
3. Go to **Settings** → **Deploy**
   - **Start Command**: Leave empty (uses Dockerfile CMD)

#### Option B: Using Nixpacks
1. Click **"+ New"** → **"GitHub Repo"** → Select your repo
2. Go to **Settings** → **Root Directory**: `/frontend`
3. Go to **Settings** → **Deploy** → **Start Command**:
   ```
   next start -H 0.0.0.0 -p $PORT
   ```

### 6. Configure Frontend Environment Variables

In frontend service → **Variables**, add these:

```bash
# Core
NODE_ENV=production

# URLs (update after deployment)
NEXT_PUBLIC_BASE_URL=https://<your-frontend-service>.railway.app
NEXT_PUBLIC_WC_SERVER_API_HOST=https://<your-backend-service>.railway.app
NEXT_PUBLIC_WC_CLIENT_API_HOST=https://<your-backend-service>.railway.app

# Website
NEXT_PUBLIC_WC_WEBSITE_NAME=lebobeautyco
NEXT_PUBLIC_WC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_WC_PAGE_SIZE=30
NEXT_PUBLIC_WC_ORDERS_PAGE_SIZE=4

# CDN URLs
NEXT_PUBLIC_WC_CDN_ROOT=https://<your-backend-service>.railway.app/cdn
NEXT_PUBLIC_WC_CDN_PRODUCTS=https://<your-backend-service>.railway.app/cdn/products
NEXT_PUBLIC_WC_CDN_CATEGORIES=https://<your-backend-service>.railway.app/cdn/categories
NEXT_PUBLIC_WC_CDN_LOGO=https://<your-backend-service>.railway.app/cdn/logo

# Payment
NEXT_PUBLIC_WC_PAYMENT_GATEWAY=stripe
NEXT_PUBLIC_WC_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
NEXT_PUBLIC_WC_PAYPAL_CLIENT_ID=<your-paypal-client-id>
NEXT_PUBLIC_WC_PAYPAL_DEBUG=false

# Contact
NEXT_PUBLIC_WC_CONTACT_EMAIL=<your-email@example.com>
```

### 7. Get Service URLs and Update Variables

After both services deploy:

1. **Backend Service**:
   - Go to backend service → **Settings** → **Networking**
   - Click **"Generate Domain"** or use custom domain
   - Copy the URL (e.g., `https://backend-production-xxxx.up.railway.app`)

2. **Frontend Service**:
   - Go to frontend service → **Settings** → **Networking**
   - Click **"Generate Domain"**
   - Copy the URL (e.g., `https://frontend-production-xxxx.up.railway.app`)

3. **Update Environment Variables**:

   **Backend:**
   - `WC_FRONTEND_HOST` = your frontend URL
   - `WC_ADMIN_HOST` = your admin URL (if deploying admin)
   - `WC_AUTH_COOKIE_DOMAIN` = your backend domain (without `https://`)

   **Frontend:**
   - `NEXT_PUBLIC_BASE_URL` = your frontend URL
   - `NEXT_PUBLIC_WC_SERVER_API_HOST` = your backend URL
   - `NEXT_PUBLIC_WC_CLIENT_API_HOST` = your backend URL
   - All `NEXT_PUBLIC_WC_CDN_*` = your backend URL + `/cdn/...`

4. **Redeploy** both services after updating variables

### 8. Verify Deployment

1. Check backend logs: Should see "server is running on port..."
2. Check frontend logs: Should see "Ready on..."
3. Visit frontend URL in browser
4. Test API: Visit `https://<backend-url>/api/health` (if endpoint exists)

## Common Issues & Solutions

### Issue: Build fails with "Cannot find module"
**Solution**: Ensure packages are installed. If using Dockerfile, it handles this. If using Nixpacks, you may need to add a build script.

### Issue: Port already in use
**Solution**: Make sure you're using `$PORT` in start commands, not hardcoded ports.

### Issue: Database connection fails
**Solution**: 
- Verify MongoDB connection string format
- Check if MongoDB service is running
- Ensure `WC_DB_URI` includes authentication

### Issue: Frontend can't reach backend
**Solution**:
- Verify `NEXT_PUBLIC_WC_SERVER_API_HOST` is set correctly
- Check CORS settings in backend
- Ensure backend URL doesn't have trailing slash

### Issue: File uploads not working
**Solution**: Railway uses ephemeral storage. Consider:
- Using Railway Volumes (Settings → Volumes)
- Using external storage (S3, Cloudinary)
- Using Railway's storage service

## Next Steps

- [ ] Set up custom domain
- [ ] Configure SSL (automatic with Railway)
- [ ] Set up monitoring/alerts
- [ ] Configure backups
- [ ] Set up staging environment

## Need Help?

- Full guide: See `RAILWAY_DEPLOYMENT.md`
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

---

**Estimated Time**: 15-30 minutes  
**Difficulty**: Intermediate

