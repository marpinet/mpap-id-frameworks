# Authentication Troubleshooting Guide

## Issue: Authentication and Sign Up Not Working

### Root Cause
By default, Supabase requires email confirmation before users can sign in. This creates a poor demo/prototype experience.

### Solution Steps

#### Step 1: Disable Email Confirmation in Supabase (REQUIRED)

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Navigate to**: Authentication → Providers → Email
4. **Find**: "Confirm email" setting
5. **Toggle OFF**: Disable "Confirm email"
6. **Save changes**

**This is the most critical step!** Without this, users cannot sign in immediately after creating an account.

#### Step 2: Verify Environment Variables

Make sure your `.env` file exists and has valid credentials:

```bash
# Check if .env file exists
ls -la .env

# Should contain (with actual values, not placeholders):
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

Get these values from: Supabase Dashboard → Project Settings → API

#### Step 3: Test the Setup

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Open browser**: http://localhost:3000

3. **Test signup**:
   - Click "Sign Up"
   - Enter name, email, password
   - Submit
   - Should see: "🎉 Account created successfully! You're now logged in."
   - Page should reload and show user menu

4. **Test login**:
   - Log out
   - Click "Log In"
   - Enter email and password
   - Should be logged in immediately

### How It Works Now

#### Code Flow:

1. **User submits signup form** (`auth.js` line ~180)
2. **Calls `auth.signUp()`** (`supabase.js` line ~24)
3. **Supabase creates account**:
   - If email confirmation is **disabled** → Session created automatically ✅
   - If email confirmation is **enabled** → No session, code attempts auto sign-in
4. **Auto sign-in fallback** (line ~40):
   - If no session exists, calls `signInWithPassword()`
   - Creates session manually
5. **Success callback** (`auth.js` line ~187):
   - Close modal
   - Show success message
   - Reload page to update UI

### Common Issues

#### Issue 1: "Email not confirmed" error
**Cause**: Email confirmation is still enabled in Supabase
**Fix**: Disable "Confirm email" in Supabase Dashboard (see Step 1)

#### Issue 2: Sign up succeeds but user not logged in
**Cause**: Session not being created or auth state not updating
**Fix**: Code now includes auto sign-in fallback (see `supabase.js` line ~40)

#### Issue 3: Environment variables not loading
**Cause**: Missing or incorrectly named .env file
**Fix**: 
```bash
# Copy example file
cp .env.example .env

# Edit with actual values
nano .env  # or open in VS Code
```

#### Issue 4: Button stays disabled after error
**Cause**: Error in try/catch block
**Fix**: Code now properly resets button in `finally` block

### Demo Mode Alternative

If you can't access Supabase settings, users can still use **Demo Mode**:

1. Click "🎭 Continue as Guest (Demo Mode)"
2. All features work with localStorage
3. Data saved locally, not synced to cloud

### Verification Checklist

- [ ] ✅ "Confirm email" disabled in Supabase Dashboard
- [ ] ✅ `.env` file exists with valid credentials
- [ ] ✅ Dev server running without errors
- [ ] ✅ Can create new account
- [ ] ✅ Automatically logged in after signup
- [ ] ✅ Can log out and log back in
- [ ] ✅ User menu appears when logged in

### Need More Help?

**Check browser console** (F12 → Console tab):
- Look for red error messages
- Check for "Sign up error:" or "Auto sign-in failed:"
- Screenshot and share error messages

**Check Supabase logs**:
- Go to Supabase Dashboard → Logs
- Look for authentication errors
- Check if signup requests are succeeding

**Test connection**:
```javascript
// In browser console
import { supabase } from './src/js/supabase.js';
const { data, error } = await supabase.auth.getSession();
console.log('Current session:', data);
```
