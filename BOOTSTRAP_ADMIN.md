# 🚀 Bootstrap Admin User Guide

You're getting redirected to login because you need to be authenticated to access protected routes. Here's how to create your first admin user:

## 🎯 **Quick Solution (Recommended)**

### Option 1: Use the Bootstrap API Endpoint

1. **Open your browser or use curl to create the admin user:**

```bash
curl -X POST http://localhost:3000/api/bootstrap/admin
```

Or visit in your browser: `http://localhost:3000/api/bootstrap/admin` (POST request)

2. **This will create an admin user with:**
   - **Email:** `admin@filmplatform.com`
   - **Password:** `admin123`
   - **Role:** `ADMIN`

3. **Login to your application:**
   - Go to: `http://localhost:3000/login`
   - Use the credentials above
   - **IMPORTANT:** Change your password after first login!

4. **Now you can access all protected routes:**
   - `/admin` - Admin dashboard
   - `/profile/edit` - Edit your profile
   - `/submit` - Submit works (after promoting to CREATOR)

### Option 2: Use the Node.js Script

```bash
cd apps/web
node scripts/create-admin.js
```

## 🔍 **Why This Happened**

The authentication middleware is working correctly:

1. **Routes like `/admin`, `/profile`, `/submit` require authentication**
2. **You weren't logged in** (no `auth-token` cookie)
3. **The middleware redirected you to `/login`** (as designed)
4. **You need an admin user to access admin features**

## 🎯 **Next Steps After Login**

1. **Change your password** - Go to profile settings
2. **Update your profile** - Add your name and bio
3. **Create other users** - Use the admin panel to promote users
4. **Test the work submission** - You may need to promote yourself to CREATOR role first

## 🛡️ **Security Notes**

- The bootstrap endpoint only works when **no admin users exist**
- After creating the first admin, the endpoint will return a 409 error
- Always change default credentials after first login
- The system uses JWT tokens with httpOnly cookies for security

## 🐛 **Troubleshooting**

If you still can't access pages after login:

1. **Clear browser cookies** - Remove old auth tokens
2. **Check the terminal** - Look for authentication errors
3. **Verify login response** - Check if JWT token is being set
4. **Try incognito mode** - Rule out browser caching issues

---

**Your application is working perfectly! This is just the initial setup process.** 🎉

# 🧪 **QA CRITICAL FIX: Missing Root Middleware**

## **🚨 IMMEDIATE SOLUTION:**

**The server is running from the root directory but looking for middleware there. You need to create a simple middleware file in the root.**

### **EXECUTE THESE COMMANDS:**

```bash
<code_block_to_apply_changes_from>
```

## **🎯 WHAT THIS FIXES:**

- ✅ **Creates missing root middleware** - Stops the "Cannot find middleware module" error
- ✅ **Creates missing .env.local** - Fixes Firebase network request failed
- ✅ **Clears cache** - Ensures clean startup
- ✅ **Proper server startup** - No more middleware errors

## **📊 EXPECTED RESULTS:**

After running these commands:
1. **Server starts cleanly** without middleware errors
2. **Firebase initializes properly** with environment variables
3. **Login page loads** without network request failures
4. **Ready for Firebase Console setup**

**Run these commands in your terminal to fix both the middleware error and the network request failure!** 🔥

---
*QA Emergency Middleware Fix by Quinn* 🧪
