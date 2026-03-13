# MAGI EVA Tribute UI

A mobile-first MAGI-inspired decision console tribute.  
This project is for personal and non-commercial fan sharing.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Vitest + React Testing Library

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Scripts

```bash
npm test
npm run lint
npm run build
```

## Simplified Project Structure

```text
src/
  app/           # app shell, tabs, UI state
  lib/           # classify/simulate/audio logic
  styles/        # global theme and layout styles
public/
  sounds/        # runtime mp3 assets
ops/
  nginx/         # static web serving config
  k8s/           # deployment manifests
```

## Docker Compose Operations

Build and run:

```bash
docker compose up -d --build
```

Visit `http://localhost:8080`.

Stop:

```bash
docker compose down
```

## Kubernetes Operations

1. Build and push image:

```bash
docker build -t ghcr.io/your-org/magi-web:latest .
docker push ghcr.io/your-org/magi-web:latest
```

2. Update image path in:

- `ops/k8s/deployment.yaml`

3. Apply manifests:

```bash
kubectl apply -f ops/k8s/deployment.yaml
kubectl apply -f ops/k8s/service.yaml
kubectl apply -f ops/k8s/ingress.yaml
```

## Publish to Public Domain

### Option A (Recommended): Cloudflare Pages / Vercel / Netlify

1. Push repository to GitHub.
2. Connect repo in hosting platform.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add custom domain in platform settings.
6. Create DNS records at your domain provider:
- Subdomain: `CNAME` -> platform target
- Root domain: use `A/ALIAS` as required by platform
7. Enable HTTPS (usually automatic).

### Option B: Self-hosted (VPS + Docker)

1. Deploy with `docker compose`.
2. Place Nginx/Traefik in front.
3. Point DNS `A` record to VPS IP.
4. Issue TLS with Let's Encrypt.

## Audio Sources (Mixkit Alerts)

- Urgent simple tone loop (processing)
- Electric fence alert (rejected)
- Game success alert (approved)

Source catalog: https://mixkit.co/free-sound-effects/alerts/  
License: https://mixkit.co/license/
