# Environment Variables Setup Guide

## 🎯 Quick Setup

### Local Development

1. **Create `.env.local` file** in the `frontend` directory:
   ```bash
   cd frontend
   touch .env.local
   ```

2. **Add this content** to `frontend/.env.local`:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

3. **Restart your dev server**:
   ```bash
   npm run dev
   ```

### Production (Render)

1. **Open Render Dashboard** → Your Frontend Service

2. **Go to Settings** → **Environment** (left sidebar)

3. **Click "Add Environment Variable"**

4. **Fill in:**
   - **Key:** `NEXT_PUBLIC_API_BASE_URL`
   - **Value:** `https://deadstock-management-portal-wzlp.onrender.com`

5. **Click "Save Changes"**

6. **Redeploy:** Click "Manual Deploy" → "Deploy latest commit"

⚠️ **Important:** Environment variables are only applied after redeploy!

## ✅ How It Works

The API client (`frontend/lib/api.ts`) automatically uses:
- **Local:** `http://localhost:8000` (from `.env.local`)
- **Production:** Your Render backend URL (from Render Dashboard env vars)

## 🔍 Verify It's Working

Add this temporarily to any component:
```typescript
console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
```

**Expected output:**
- Local: `http://localhost:8000`
- Production: `https://deadstock-management-portal-wzlp.onrender.com`

## ❌ Common Mistakes to Avoid

1. ❌ **Setting env var in backend service** (should be in frontend service)
2. ❌ **Forgetting `NEXT_PUBLIC_` prefix** (won't be accessible in browser)
3. ❌ **Not redeploying** after adding env vars in Render
4. ❌ **Using wrong variable name** (must be `NEXT_PUBLIC_API_BASE_URL`)

## 📝 Notes

- Only variables starting with `NEXT_PUBLIC_` are accessible in the browser
- `.env.local` is gitignored (won't be committed)
- See `frontend/.env.example` for reference template

