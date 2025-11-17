# Railway Troubleshooting Guide

## Common Errors and Solutions

### Error: "Dockerfile `Dockerfile.railway` does not exist"

**Problem**: Railway is looking for a Dockerfile at the root, but your Dockerfiles are in subdirectories.

**Solution**: Configure the Dockerfile path in Railway settings:

1. Go to your service in Railway dashboard
2. Click **Settings** → **Build**
3. Set **Dockerfile Path** to:
   - For backend: `backend/Dockerfile.railway`
   - For frontend: `frontend/Dockerfile.railway`
4. Leave **Root Directory** empty (Railway uses repo root by default)
5. Save and redeploy

**Alternative**: If Railway auto-detects and creates a service, you can:
- Delete the auto-created service
- Create a new service manually
- Configure the Dockerfile path before first deploy

---

### Error: "Cannot find module" or "Module not found"

**Problem**: Shared packages aren't being installed or found.

**Solution**: 
- Ensure you're using the Railway Dockerfiles (`backend/Dockerfile.railway` or `frontend/Dockerfile.railway`)
- These Dockerfiles handle the monorepo structure correctly
- Check build logs to see if packages are being installed
- Make sure the shared packages are actually built before running `next build`. From the repo root run `npm run ts:build` or, inside the Dockerfile, keep the `npm run build` steps for every package.
- Verify the social login package really produced `packages/reactjs-social-login/dist/src/index.js`. The Dockerfile already has guard rails (`test -f dist/src/index.js`)—do the same locally if in doubt.
- If Railway still reports Turbopack build errors, set the following Railway variables so Next.js falls back to webpack:  
  `NEXT_PRIVATE_SKIP_TURBO=1`, `NEXT_SKIP_TURBO=1`, `TURBOPACK=0`
- Double-check `frontend/tsconfig.json` and `frontend/next.config.ts` both point `:reactjs-social-login` to `../packages/reactjs-social-login/dist/src`. Without the compiled output, Turbopack cannot resolve the entry point.

---

### Error: Port already in use

**Problem**: Application is trying to use a hardcoded port.

**Solution**:
- Backend: Code has been updated to use `PORT` env var automatically
- Frontend: Uses `start.cjs` which handles PORT correctly
- Ensure you're not setting `WC_PORT` unless needed
- Railway automatically sets `PORT` - don't override it

---

### Error: Database connection failed

**Problem**: MongoDB connection string is incorrect or database isn't accessible.

**Solutions**:
1. **Check connection string format**:
   ```
   mongodb://username:password@host:port/database?authSource=admin
   ```

2. **Railway MongoDB**: 
   - Go to MongoDB service → **Variables**
   - Copy the `MONGO_URL` or `MONGODB_URL` variable
   - Use it directly in `WC_DB_URI`

3. **External MongoDB (MongoDB Atlas)**:
   - Ensure IP whitelist includes Railway's IP ranges (or 0.0.0.0/0 for testing)
   - Check username/password are correct
   - Verify database name exists

4. **Network issues**:
   - Ensure backend and MongoDB are in the same Railway project
   - Check if MongoDB service is running

---

### Error: Frontend can't reach backend API

**Problem**: CORS errors or API calls failing.

**Solutions**:
1. **Check environment variables**:
   - `NEXT_PUBLIC_WC_SERVER_API_HOST` should be your backend URL
   - `NEXT_PUBLIC_WC_CLIENT_API_HOST` should be your backend URL
   - URLs should include `https://` protocol
   - No trailing slashes

2. **Verify backend is running**:
   - Check backend logs in Railway
   - Test backend URL directly: `https://your-backend.railway.app/api/...`

3. **CORS configuration**:
   - Backend should allow requests from frontend domain
   - Check backend CORS settings

---

### Error: Build fails with "Out of memory"

**Problem**: Next.js build requires more memory.

**Solution**: The Dockerfiles already set `NODE_OPTIONS=--max-old-space-size=2048`. If still failing:
- Railway free tier has memory limits
- Consider upgrading Railway plan
- Or optimize build (remove unused dependencies)

---

### Error: File uploads not working

**Problem**: Files aren't persisting or uploads fail.

**Solutions**:
1. **Railway uses ephemeral storage**:
   - Files are lost on redeploy
   - Use Railway Volumes (Settings → Volumes)
   - Or use external storage (S3, Cloudinary, etc.)

2. **Volume setup**:
   - Create volume in backend service
   - Mount to `/var/www/cdn`
   - Update `WC_CDN_*` paths accordingly

3. **External storage** (Recommended for production):
   - Set up AWS S3, Cloudinary, or similar
   - Update CDN URLs in environment variables
   - Modify backend code to upload to external storage

---

### Error: Environment variables not working

**Problem**: Variables aren't being read correctly.

**Solutions**:
1. **Check variable names**:
   - Backend: Use `WC_*` prefix
   - Frontend: Use `NEXT_PUBLIC_*` prefix for client-side vars

2. **Redeploy after changes**:
   - Environment variable changes require redeploy
   - Go to service → **Deployments** → **Redeploy**

3. **Check for typos**:
   - Variable names are case-sensitive
   - No spaces around `=`
   - Use quotes for values with spaces

---

### Error: Service keeps restarting

**Problem**: Application crashes on startup.

**Solutions**:
1. **Check logs**:
   - Go to service → **Logs**
   - Look for error messages
   - Check startup sequence

2. **Common causes**:
   - Missing environment variables
   - Database connection failing
   - Port conflicts
   - Build errors

3. **Debug steps**:
   - Check all required env vars are set
   - Verify database connection
   - Test locally first
   - Check Railway logs for specific errors

---

### Error: "Service not found" or 404 errors

**Problem**: Service isn't accessible or routes aren't working.

**Solutions**:
1. **Check service is deployed**:
   - Go to Railway dashboard
   - Verify service shows "Active" status
   - Check deployment succeeded

2. **Check domain**:
   - Go to Settings → Networking
   - Verify domain is generated/configured
   - Test the URL directly

3. **Check application routes**:
   - Backend: Test `/api/health` or similar endpoint
   - Frontend: Check Next.js routing configuration

---

## Getting Help

### Check Logs
1. Go to your service in Railway
2. Click **Logs** tab
3. Look for error messages
4. Check both build logs and runtime logs

### Railway Resources
- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app)

### Debug Checklist
- [ ] All environment variables set correctly
- [ ] Dockerfile path configured correctly
- [ ] Service is deployed and running
- [ ] Database is accessible
- [ ] Ports are configured correctly
- [ ] Build succeeded
- [ ] Logs show no errors

---

## Still Having Issues?

1. Check Railway status page for outages
2. Review Railway logs thoroughly
3. Test locally with same environment variables
4. Ask in Railway Discord with:
   - Error message
   - Service logs
   - Configuration details
   - Steps to reproduce

