# Quick Start Guide - Simple Todo App

## 🚀 Get Started in 3 Steps

### Step 1: Configure Environment

Create `.env.local` with your values:

```bash
# Copy from example
cp .env.local.example .env.local

# Generate a secret
openssl rand -base64 32
```

Edit `.env.local`:
```bash
CONVEX_DEPLOYMENT=dev:reliable-cormorant-601  # Already set by convex dev
NEXT_PUBLIC_CONVEX_URL=https://reliable-cormorant-601.convex.cloud  # Already set

BETTER_AUTH_SECRET=<paste-your-generated-secret>
SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 2: Start Development

```bash
# Terminal 1: Start Convex backend
npm run convex:dev

# Terminal 2: Start Next.js frontend
npm run web:dev
```

### Step 3: Open App

Navigate to **http://localhost:3000**

1. Click "Sign Up" tab
2. Create an account
3. Start creating todos! ✨

## 📚 What You Can Do

### Create Todos
- Click "Create Todo" button
- Set title, description, priority, and due date
- Todo appears instantly in the list

### Manage Todos
- Toggle between Active and Completed tabs
- Click "Complete" to mark done
- Click "Delete" to remove

### See Stats
- View total, active, completed, and high priority counts
- Stats update in real-time

### Test Real-time Sync
- Open app in two browser windows
- Create/update in one
- See instant update in the other! ⚡

## 🏗️ Architecture

```
Frontend (Next.js)
    ↓
Endpoint Layer (Business Logic + Auth + Rate Limiting)
    ↓
Database Layer (CRUD Operations)
    ↓
Helper Layer (Validation + Constants)
```

**Key Principle**: Only the database layer touches `ctx.db` directly!

## 📂 Key Files

| File | Purpose |
|------|---------|
| `convex/schema.ts` | Database schema (todos table) |
| `convex/db/todos.ts` | Todo CRUD operations |
| `convex/endpoints/todos.ts` | Todo business logic |
| `convex/helpers/validation.ts` | Input validation |
| `convex/rateLimiter.ts` | Rate limit config |
| `apps/web/app/page.tsx` | Main app page |
| `apps/web/components/todo-list.tsx` | Todo UI |
| `apps/web/components/auth-form.tsx` | Auth UI |

## 🔧 Development Tips

### Check Convex Dashboard
Visit: https://dashboard.convex.dev/d/reliable-cormorant-601

- View all todos in the database
- Run queries in the console
- Monitor function performance

### View Rate Limits
Try creating 10+ todos rapidly to see rate limiting in action:
- Limit: 10 per minute with burst of 3
- Error message shows retry-after time

### Add More Features

**Add a search:**
1. Update `convex/db/todos.ts` with search function
2. Add search query to `convex/endpoints/todos.ts`
3. Add search input to `apps/web/components/todo-list.tsx`

**Add categories:**
1. Add `category: v.string()` to schema
2. Update database layer CRUD functions
3. Update endpoint validators
4. Add category dropdown to UI

## 🎨 Design System

All components use the shared design system:
- **Primary**: Indigo (#6366f1)
- **Secondary**: Cyan (#0ea5e9)
- **Accent**: Orange (#f97316)
- **Tone**: Neutral
- **Density**: Balanced

Customize by editing:
- `planning/theme.json` (source of truth)
- `packages/design-tokens/src/theme.css` (CSS variables)

## 🐛 Troubleshooting

**"Not authenticated" error:**
- Make sure you're signed in
- Check Better Auth is configured in `.env.local`

**Rate limit error:**
- Wait 1 minute between burst operations
- Check `convex/rateLimiter.ts` for limits

**Todos not syncing:**
- Check Convex backend is running (`npm run convex:dev`)
- Check browser console for errors
- Verify `NEXT_PUBLIC_CONVEX_URL` is set

**TypeScript errors:**
- Run `npm run convex:dev` to regenerate types
- Restart your IDE

## 📖 Learn More

- [Convex Docs](https://docs.convex.dev)
- [Better Auth Docs](https://better-auth.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Full Implementation Details](./IMPLEMENTATION.md)

## 🎉 You're Ready!

Your ultra-simple todo app with real-time sync, authentication, and rate limiting is ready to use.

Start creating todos and experience the power of Convex! 🚀
