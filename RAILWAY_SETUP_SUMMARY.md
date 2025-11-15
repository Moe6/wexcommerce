# Railway Deployment - Setup Summary

## Files Created/Modified

### New Files:
1. **`backend/Dockerfile.railway`** - Railway-optimized Dockerfile for backend
2. **`frontend/Dockerfile.railway`** - Railway-optimized Dockerfile for frontend
3. **`railway.json`** - Railway project configuration (optional)
4. **`RAILWAY_DEPLOYMENT.md`** - Comprehensive deployment guide
5. **`RAILWAY_QUICK_START.md`** - Quick start guide
6. **`RAILWAY_SETUP_SUMMARY.md`** - This file

### Modified Files:
1. **`backend/src/config/env.config.ts`** - Updated to check Railway's PORT env var first
2. **`frontend/package.json`** - Updated start script to use PORT environment variable

## Key Changes Made

### Backend Port Configuration
- Updated `env.config.ts` to check `process.env.PORT` first (Railway's standard)
- Falls back to `WC_PORT` or default 4005
- This ensures Railway's dynamically assigned port is used

### Frontend Port Configuration  
- Updated `package.json` start script to use `${PORT:-8006}`
- Uses Railway's PORT if available, otherwise defaults to 8006
- Ensures compatibility with Railway's port assignment

## Deployment Checklist

### Before Deployment:
- [ ] Review all environment variables needed (see RAILWAY_DEPLOYMENT.md)
- [ ] Prepare MongoDB connection string (or use Railway MongoDB)
- [ ] Prepare SMTP credentials
- [ ] Prepare payment gateway keys (Stripe/PayPal)
- [ ] Generate secure secrets (cookie secret, JWT secret)

### During Deployment:
- [ ] Create Railway project
- [ ] Add MongoDB database
- [ ] Deploy backend service
- [ ] Configure backend environment variables
- [ ] Deploy frontend service
- [ ] Configure frontend environment variables
- [ ] Get service URLs and update cross-references
- [ ] Redeploy services with updated URLs

### After Deployment:
- [ ] Test backend API endpoints
- [ ] Test frontend application
- [ ] Verify file uploads work (or configure external storage)
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring/alerts
- [ ] Set up backups

## Environment Variables Quick Reference

### Backend (Required)
```
NODE_ENV=production
WC_PORT=$PORT (or remove, code now handles PORT automatically)
WC_DB_URI=<mongodb-connection-string>
WC_COOKIE_SECRET=<random-32-chars>
WC_JWT_SECRET=<random-32-chars>
WC_SMTP_HOST, WC_SMTP_PORT, WC_SMTP_USER, WC_SMTP_PASS, WC_SMTP_FROM
WC_CDN_* (all 6 paths)
WC_ADMIN_HOST, WC_FRONTEND_HOST, WC_AUTH_COOKIE_DOMAIN
```

### Frontend (Required)
```
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=<frontend-url>
NEXT_PUBLIC_WC_SERVER_API_HOST=<backend-url>
NEXT_PUBLIC_WC_CLIENT_API_HOST=<backend-url>
NEXT_PUBLIC_WC_CDN_* (all CDN URLs)
```

## Deployment Methods

### Method 1: Dockerfile (Recommended)
- Uses `backend/Dockerfile.railway` and `frontend/Dockerfile.railway`
- More control over build process
- Better for monorepo structure
- Set Dockerfile Path in Railway settings

### Method 2: Nixpacks (Auto-detect)
- Railway auto-detects Node.js
- Simpler setup
- May need custom start commands
- Set Root Directory to `/backend` or `/frontend`

## Important Notes

1. **Port Configuration**: Code has been updated to automatically use Railway's PORT. You don't need to set WC_PORT anymore (unless you want a specific port).

2. **Monorepo Structure**: The Dockerfiles handle the shared packages correctly. If using Nixpacks, you may need to adjust build commands.

3. **File Storage**: Railway uses ephemeral storage. For production, consider:
   - Railway Volumes (persistent but limited)
   - External storage (S3, Cloudinary, etc.)
   - Railway's storage service

4. **Environment Variables**: Some variables reference other services. Deploy services first, get URLs, then update variables and redeploy.

5. **Database**: Railway MongoDB is recommended for simplicity. Connection string is automatically provided.

## Next Steps

1. Read `RAILWAY_QUICK_START.md` for step-by-step instructions
2. Follow the deployment process
3. Refer to `RAILWAY_DEPLOYMENT.md` for detailed information
4. Test your deployment thoroughly
5. Set up monitoring and backups

## Support Resources

- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app

---

**Ready to deploy?** Start with `RAILWAY_QUICK_START.md`!

