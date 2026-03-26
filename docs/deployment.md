# Deployment Guide — علمني (AI Learning Platform)

> **Purpose:** Complete deployment instructions for hosting علمني on various platforms.
> This guide focuses on Heroku deployment with alternatives for other platforms.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Environment Variables](#2-environment-variables)
3. [Docker Deployment](#3-docker-deployment)
4. [Heroku Deployment](#4-heroku-deployment)
5. [Alternative Platforms](#5-alternative-platforms)
6. [Post-Deployment](#6-post-deployment)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Prerequisites

### Local Development Setup

Ensure the project works locally before deploying:

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Run development server
npm run dev

# Run all tests
npm test

# Build for production (verify no errors)
npm run build

# Test production build locally
npm start
```

**Requirements:**
- Node.js >= 20.x
- npm >= 10.x
- OpenAI API Key (from https://platform.openai.com/api-keys)

---

## 2. Environment Variables

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `OPENAI_API_KEY` | OpenAI API authentication key | https://platform.openai.com/api-keys |

### Optional Variables (Heroku Auto-Configures)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port (Heroku sets automatically) |
| `NODE_ENV` | `production` | Environment mode |

### Setting Variables Locally

```bash
# .env file (not committed)
OPENAI_API_KEY=sk-proj-...your-key-here...
```

---

## 3. Heroku Deployment

## 3. Docker Deployment

### 3.1 Local run with Docker Compose

```bash
# 1. Create local env file
cp .env.example .env

# 2. Set required env var
# OPENAI_API_KEY=sk-...

# 3. Validate infra before build
npm run check:docker-config

# 4. Build and run
docker compose up --build
```

### 3.2 Health check

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "web-learning-e1"
}
```

### 3.3 CI/CD integration notes

- CI enforces quality gates in order: format check → lint → typecheck → tests → docker config check → Next.js production build.
- **Runtime image hardening:** the Dockerfile `runner` stage runs `apk upgrade --no-cache` before creating the non-root `nextjs` user so Alpine OS packages receive security fixes at build time (same pattern as hardened Next.js images in sibling repos).
- **Container scan pipeline:** after quality gates, the workflow uses Docker Buildx + `docker/build-push-action` to build a **local** image tag (`web-learning-e1:ci`) with GitHub Actions cache (`cache-from` / `cache-to` type=gha), then runs **`aquasecurity/trivy-action`** against that image (vulnerability scanner only, `HIGH,CRITICAL`, `ignore-unfixed`, `.trivyignore`). This replaces slower apt-based Trivy installs and keeps scan policy versioned with the repo.
- **Publish:** a second `build-push-action` step pushes to GHCR when triggered by tag `v*` (auto-publish) or manual `workflow_dispatch` with publish enabled, reusing GHA layer cache from the scan build where possible.

---

## 4. Heroku Deployment

### 3.1 Initial Setup

#### Install Heroku CLI

```bash
# Windows (via npm)
npm install -g heroku

# macOS (via Homebrew)
brew tap heroku/brew && brew install heroku

# Verify installation
heroku --version
```

#### Login to Heroku

```bash
heroku login
```

### 3.2 Create Heroku App

```bash
# Option 1: Let Heroku generate a name
heroku create

# Option 2: Specify a custom name
heroku create my-ai-learning-app

# Note the app URL: https://my-ai-learning-app.herokuapp.com
```

### 3.3 Configure Environment Variables

```bash
# Set OpenAI API Key (REQUIRED)
heroku config:set OPENAI_API_KEY=sk-proj-...your-key-here...

# Verify variables are set
heroku config
```

### 3.4 Deploy to Heroku

#### Method 1: Git Push (Recommended)

```bash
# Ensure you're on main branch with latest changes
git status
git log --oneline -5

# Deploy
git push heroku main

# If your branch is not 'main', use:
git push heroku your-branch:main
```

#### Method 2: GitHub Integration

1. Go to Heroku Dashboard → Your App → Deploy
2. Connect to GitHub repository
3. Enable Automatic Deploys (optional)
4. Click "Deploy Branch"

### 3.5 Post-Deployment

```bash
# Open the app in browser
heroku open

# View logs
heroku logs --tail

# Check app status
heroku ps

# Restart app (if needed)
heroku restart
```

---

## 4. Alternative Platforms

### 4.1 Vercel (Recommended for Next.js)

**Advantages:**
- Zero-config Next.js deployment
- Automatic HTTPS
- Global CDN
- Free tier generous

**Deployment Steps:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add OPENAI_API_KEY

# Deploy to production
vercel --prod
```

**Or use Vercel Dashboard:**
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add `OPENAI_API_KEY` in Environment Variables
4. Click Deploy

### 4.2 Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the app
npm run build

# Deploy
netlify deploy --prod
```

### 4.3 Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables
railway variables set OPENAI_API_KEY=sk-proj-...

# Deploy
railway up
```

### 4.4 Render

1. Go to https://render.com
2. Create a new Web Service
3. Connect GitHub repository
4. Set Build Command: `npm install && npm run build`
5. Set Start Command: `npm start`
6. Add Environment Variable: `OPENAI_API_KEY`
7. Click Create Web Service

### 4.5 Self-Hosted (VPS)

**Requirements:**
- Ubuntu 22.04+ or similar Linux distribution
- Node.js 20.x installed
- Nginx (for reverse proxy)
- SSL certificate (Let's Encrypt)

**Deployment:**

```bash
# On the server
git clone https://github.com/your-username/web-learning-e1.git
cd web-learning-e1

# Install dependencies
npm ci --production

# Set environment variables
echo "OPENAI_API_KEY=sk-proj-..." > .env

# Build
npm run build

# Install PM2 for process management
npm install -g pm2

# Start the app
pm2 start npm --name "ai-learning" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 5. Post-Deployment

### 5.1 Health Checks

Test all endpoints after deployment:

```bash
# Base URL (should return 200)
curl https://your-app.herokuapp.com

# Chat completion endpoint
curl -X POST https://your-app.herokuapp.com/api/chat-completion \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Test message"}'

# Text completion endpoint
curl -X POST https://your-app.herokuapp.com/api/text-completion \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Test prompt"}'
```

### 5.2 Monitoring

#### Heroku Logs

```bash
# Real-time logs
heroku logs --tail

# Filter by source
heroku logs --source app --tail

# Last 200 lines
heroku logs -n 200
```

#### Error Tracking

Consider adding error monitoring:
- **Sentry:** https://sentry.io
- **LogRocket:** https://logrocket.com
- **Datadog:** https://www.datadoghq.com

### 5.3 Performance Optimization

**Enable Compression (Heroku):**
Already enabled by Next.js automatically.

**CDN for Static Assets:**
Next.js handles this via `_next/static/` folder with long-term caching.

**Database Caching:**
Not applicable (this app has no database).

---

## 6. Troubleshooting

### 6.1 Build Failures

#### Issue: TypeScript compilation errors

```bash
# Locally test the build
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

**Fix:** Resolve TypeScript errors before deploying.

#### Issue: Missing dependencies

```bash
# Ensure package-lock.json is committed
git add package-lock.json
git commit -m "chore: add package-lock.json"
```

**Fix:** Always commit `package-lock.json` for reproducible builds.

### 6.2 Runtime Errors

#### Issue: OPENAI_API_KEY not set

**Symptoms:**
- API routes return 500 errors
- Logs show: `Error: OPENAI_API_KEY is not configured`

**Fix:**
```bash
# Heroku
heroku config:set OPENAI_API_KEY=sk-proj-...

# Vercel
vercel env add OPENAI_API_KEY

# Railway
railway variables set OPENAI_API_KEY=sk-proj-...
```

#### Issue: OpenAI API quota exceeded

**Symptoms:**
- API routes return 429 (rate limit) or 402 (quota exceeded)
- Logs show: `Rate limit reached` or `You exceeded your current quota`

**Fix:**
- Check OpenAI usage at https://platform.openai.com/usage
- Add billing information or upgrade plan
- Wait for rate limit reset (1 minute for free tier)

#### Issue: App crashes on startup

```bash
# Check Heroku logs
heroku logs --tail

# Common causes:
# - Missing start script in package.json
# - Port binding issues
# - Environment variable errors
```

**Fix:**
- Verify `"start": "next start"` exists in package.json
- Ensure app listens on `process.env.PORT || 3000`
- Check all environment variables are set

#### Issue: Heroku H10/H503 with `Cannot find module 'typescript'`

**Symptoms:**
- Heroku returns `503 Application Error`
- Logs include `H10 - App crashed`
- Runtime log shows: `Failed to load next.config.ts` and `Cannot find module 'typescript'`

**Root Cause:**
- App used `next.config.ts`
- Heroku production runtime installs `dependencies` only (not `devDependencies`)
- Next.js tries to transpile `next.config.ts` at startup and needs `typescript` runtime package

**Best-Practice Fix (Applied):**
- Replace `next.config.ts` with `next.config.js`
- Keep TypeScript as dev tool only
- Redeploy and confirm `heroku ps` status is `up`

```bash
# Verify after deploy
heroku logs --tail --app <your-app>
heroku ps --app <your-app>
```

### 6.3 Performance Issues

#### Issue: Slow API responses

**Symptoms:**
- Requests take >10 seconds
- Timeout errors

**Fix:**
- OpenAI API can be slow for complex prompts
- Consider implementing request timeouts
- Add loading indicators in UI
- Use streaming responses for chat (future enhancement)

#### Issue: Memory leaks

**Symptoms:**
- App restarts frequently
- Heroku shows R14/R15 errors (memory quota exceeded)

**Fix:**
- Upgrade Heroku dyno type (from `eco` to `basic` or `standard-1x`)
- Check for memory leaks in custom code

### 6.4 Debugging Tips

```bash
# Run production build locally
npm run build
npm start

# Set debug mode (locally)
DEBUG=* npm start

# Check Node.js version matches
node --version

# Verify all tests pass
npm test
```

---

## 7. Platform-Specific Notes

### 7.1 Heroku

**Free Tier Limitations (Eco Dynos):**
- App sleeps after 30 minutes of inactivity
- First request after sleep takes 10-30 seconds (cold start)
- 1000 free dyno hours/month (shared across all apps)

**Upgrade to Basic ($7/month) for:**
- No sleeping
- Custom domains with SSL
- Better performance

**Buildpacks:**
Heroku auto-detects Node.js and uses the official buildpack. No manual configuration needed.

### 7.2 Vercel

**Advantages for Next.js:**
- Optimized for Next.js (made by the same team)
- Edge functions support
- Automatic code splitting
- Image optimization

**Limitations:**
- 10-second timeout for API routes (hobby plan)
- Function size limit: 50MB
- Free tier: 100GB bandwidth/month

### 7.3 Railway

**Advantages:**
- Simple pricing: $5 usage credit/month (free)
- No cold starts
- PostgreSQL/Redis available (if needed in future)

**Limitations:**
- Less mature than Heroku
- Smaller community

---

## 8. Deployment Checklist

Before deploying to production:

- [ ] All tests pass locally (`npm test`)
- [ ] Production build works (`npm run build && npm start`)
- [ ] `.env.example` is up to date
- [ ] `OPENAI_API_KEY` is set on hosting platform
- [ ] Code is formatted (`npm run format:check`)
- [ ] No console.log statements in production code
- [ ] Error handling is in place for API routes
- [ ] README.md has deployment badge (optional)
- [ ] Git tags created for release versions (`v1.0.0`)

---

## 9. Continuous Deployment

### Option 1: GitHub Actions + Heroku

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Heroku

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.13.15
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
```

**Setup:**
1. Go to GitHub repo → Settings → Secrets
2. Add `HEROKU_API_KEY` (get from `heroku auth:token`)
3. Push to main branch — auto-deploys to Heroku

### Option 2: Vercel GitHub Integration

Automatically enabled when you connect GitHub repo to Vercel. Every push to main deploys to production.

---

## 10. Rollback Strategy

### Heroku

```bash
# View recent releases
heroku releases

# Rollback to previous release
heroku rollback v42

# Rollback to specific version
heroku releases:rollback v40
```

### Vercel

```bash
# List deployments
vercel ls

# Promote a previous deployment to production
vercel promote https://your-app-xyz.vercel.app
```

### Git-Based Rollback

```bash
# Revert last commit
git revert HEAD
git push heroku main

# Hard reset (use with caution)
git reset --hard HEAD~1
git push heroku main --force
```

---

## 11. Scaling

### Heroku

```bash
# Scale up to 2 dynos
heroku ps:scale web=2

# Scale down to 1 dyno
heroku ps:scale web=1

# Upgrade dyno type
heroku ps:type standard-1x
```

**When to scale:**
- Response times > 2 seconds
- CPU/memory usage consistently > 80%
- More than 100 concurrent users

### Load Testing

```bash
# Install k6 (load testing tool)
brew install k6

# Create test script (test.js)
# Then run:
k6 run test.js
```

---

## 12. Security Considerations

### Environment Variables

- ✅ **Never commit `.env` file**
- ✅ **Use `.env.example` for documentation**
- ✅ **Rotate API keys periodically**
- ✅ **Use different keys for dev/staging/production**

### API Rate Limiting

Consider adding rate limiting to prevent abuse:

```typescript
// Example: app/api/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const rateLimit = new Map<string, number[]>();

export function rateLimitMiddleware(req: NextRequest) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const requests = rateLimit.get(ip) || [];
  
  // Keep only requests from last minute
  const recentRequests = requests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= 20) {
    return NextResponse.json(
      { error: 'معدل الطلبات مرتفع جداً. يرجى المحاولة لاحقاً.' },
      { status: 429 }
    );
  }
  
  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  
  return null; // Continue to route handler
}
```

### CORS (if adding external frontends)

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## 13. Backup Strategy

### Code Backup

```bash
# GitHub (already handles this)
git push origin main

# Create release tags
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### Environment Variables Backup

```bash
# Export Heroku config
heroku config -s > heroku-env-backup.txt

# Keep this file secure (do NOT commit)
```

---

## 14. Cost Estimation

### Heroku Pricing

| Plan | Cost/Month | RAM | Dyno Hours | Use Case |
|------|------------|-----|------------|----------|
| Eco | $5 (shared) | 512MB | 1000 hrs (shared) | Development/Testing |
| Basic | $7 | 512MB | Unlimited | Small projects |
| Standard 1X | $25 | 512MB | Unlimited | Production apps |
| Standard 2X | $50 | 1GB | Unlimited | High traffic |

**Additional Costs:**
- Custom domains: Free
- SSL: Free (automatic)
- Add-ons: Variable (not needed for this app)

### Vercel Pricing

| Plan | Cost/Month | Bandwidth | Serverless Functions | Use Case |
|------|------------|-----------|---------------------|----------|
| Hobby | Free | 100GB | 100GB-hrs | Personal projects |
| Pro | $20 | 1TB | 1000GB-hrs | Professional use |

### Railway Pricing

- **Free:** $5 usage credit/month (enough for small apps)
- **Usage-based:** $0.000463/GB-second RAM, $0.000231/vCPU-second

**Typical cost for this app:** ~$5-10/month

---

## 15. Support & Resources

### Official Documentation

- Next.js Deployment: https://nextjs.org/docs/deployment
- Heroku Node.js: https://devcenter.heroku.com/articles/deploying-nodejs
- Vercel Deployment: https://vercel.com/docs/deployments/overview
- OpenAI API: https://platform.openai.com/docs

### Community

- Next.js GitHub: https://github.com/vercel/next.js
- Stack Overflow: Tag `next.js`, `heroku`, `openai-api`

### Project-Specific

- Report issues: GitHub Issues tab
- Documentation: `docs/` folder in this repository

---

**Version:** 1.0.0  
**Last Updated:** March 2, 2026  
**Maintained by:** Amr Abdelhalim
