# Deployment Guide - Vercel

This guide will help you deploy the MPAP Frameworks website to Vercel.

## Prerequisites

1. GitHub account with this repository
2. Vercel account (free tier works fine)
3. Supabase project set up with credentials

## Step 1: Prepare Your Repository

Make sure all changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. **Import** your GitHub repository (`mpap-id-frameworks`)
4. Vercel will auto-detect it's a Vite project

**Configure the project:**
- **Framework Preset**: Vite
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

5. **Add Environment Variables** (CRITICAL):
   Click on "Environment Variables" and add:
   
   ```
   VITE_SUPABASE_URL = your_supabase_project_url
   VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```
   
   Make sure to add them for all environments (Production, Preview, Development)

6. Click **"Deploy"**

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? mpap-frameworks (or your choice)
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your Supabase anon key when prompted

# Deploy to production
vercel --prod
```

## Step 3: Configure Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

## Step 4: Verify Deployment

1. Visit your deployed URL (e.g., `mpap-frameworks.vercel.app`)
2. Test the following:
   - ✅ Homepage loads correctly
   - ✅ Dark mode toggle works
   - ✅ Sign up/Login modals work
   - ✅ Create an account
   - ✅ Open a framework and fill in sections
   - ✅ Save framework (check it appears in profile)
   - ✅ Visit profile page
   - ✅ Delete a framework

## Step 5: Update Supabase URL Redirects

After deployment, update your Supabase authentication settings:

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel deployment URL to:
   - **Site URL**: `https://your-project.vercel.app`
   - **Redirect URLs**: Add `https://your-project.vercel.app/**`

## Automatic Deployments

Vercel automatically deploys your site whenever you push to GitHub:

- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment
- Pull requests → Preview deployment with unique URL

## Troubleshooting

### Build Fails

**Check build logs** in Vercel dashboard for errors.

Common issues:
- Missing environment variables
- Node version mismatch
- Dependency installation failures

### Environment Variables Not Working

Make sure:
- Variables are prefixed with `VITE_`
- They're added to all environments (Production, Preview, Development)
- You redeploy after adding variables

### Supabase Connection Fails

1. Check environment variables are correct
2. Verify Supabase project is active
3. Check browser console for errors
4. Ensure RLS policies are set up correctly

### 404 Errors on Refresh

Vercel should handle this automatically with the `vercel.json` configuration. If issues persist:

1. Check `vercel.json` exists in root directory
2. Verify it has the correct routing configuration
3. Redeploy

## Monitoring and Analytics

Enable Vercel Analytics (optional):

1. Go to project settings in Vercel
2. Navigate to **Analytics**
3. Enable **Web Analytics**
4. This gives you page views, visitor metrics, etc.

## Performance Optimization

Your site is already optimized with:
- ✅ Vite build optimizations
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Minification
- ✅ Tree shaking

**Edge Network**: Vercel automatically serves your site from their global CDN.

## Security

- ✅ Environment variables are secure (not exposed to client)
- ✅ HTTPS enabled by default
- ✅ Supabase RLS policies protect user data
- ✅ `.env` file in `.gitignore`

## Cost

**Vercel Free Tier includes:**
- Unlimited deployments
- 100GB bandwidth per month
- Automatic HTTPS
- Preview deployments
- Analytics (basic)

**Supabase Free Tier includes:**
- 500MB database space
- 1GB file storage
- 50,000 monthly active users
- Unlimited API requests

Both should be sufficient for initial deployment!

## Next Steps

After successful deployment:

1. **Test thoroughly** on production
2. **Share with users** and gather feedback
3. **Monitor analytics** to understand usage
4. **Implement real AI features** when ready (requires API keys and backend)

---

## Quick Deploy Checklist

- [ ] All code committed and pushed to GitHub
- [ ] Supabase tables created
- [ ] Supabase storage buckets created
- [ ] Environment variables ready
- [ ] Connected GitHub repo to Vercel
- [ ] Added environment variables in Vercel
- [ ] Deployed successfully
- [ ] Tested signup/login
- [ ] Tested framework creation
- [ ] Updated Supabase redirect URLs
- [ ] Verified all features work on production

🎉 Your site is live!
