# Deployment Guide — web-learning-e1

## Prerequisites

- Node.js `>=20.x`
- npm `>=10.x`
- `OPENAI_API_KEY`

Local quality gate:

```bash
npm run validate
npm run build
```

## Environment Variables

Required:

- `OPENAI_API_KEY`

Runtime defaults (usually set by platform):

- `NODE_ENV=production`
- `PORT=3000`

## Docker (Local/Server)

```bash
cp .env.example .env
# add OPENAI_API_KEY
npm run check:docker-config
docker compose up --build
```

Health check:

```bash
curl http://localhost:3000/api/health
```

Expected:

```json
{
  "status": "ok",
  "service": "web-learning-e1",
  "timestamp": "..."
}
```

## Container Notes

- `next.config.js` uses `output: "standalone"`.
- Runtime image is non-root user (`nextjs`).
- Docker healthcheck targets `/api/health`.
- Security scanning policy is managed with `.trivyignore`.

## Platform Quick Start

### Vercel

```bash
vercel
vercel env add OPENAI_API_KEY
vercel --prod
```

### Heroku

```bash
heroku create <app-name>
heroku config:set OPENAI_API_KEY=sk-...
git push heroku main
```

### Railway

```bash
railway init
railway variables set OPENAI_API_KEY=sk-...
railway up
```

## Post-Deploy Verification

```bash
curl https://<app>/api/health
```

Optional API probes:

```bash
curl -X POST https://<app>/api/chat-completion \
  -H "Content-Type: application/json" \
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"اختبار\"}]}"

curl -X POST https://<app>/api/text-completion \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hello\"}"
```

## Troubleshooting

- **500 + API key errors**: verify `OPENAI_API_KEY` exists in runtime env.
- **Startup crash around config**: keep `next.config.js` (not TypeScript runtime config).
- **Audio endpoint fails**: ensure request sends `FormData` key `file`.
- **Security scan findings**: review `.trivyignore` and dependency/Next upgrades.
