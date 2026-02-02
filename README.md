# Happy Root Dental — Voice Assistant Demo

A simple Next.js web app that lets users talk to the Happy Root Dental front-desk voice agent (powered by [VAPI](https://vapi.ai)).

## Prerequisites

- Node.js 18+
- A [VAPI](https://vapi.ai) account and an assistant (with your dental front-desk configuration)
- Your VAPI **Public Key** and **Assistant ID** from the [VAPI dashboard](https://dashboard.vapi.ai)

## Setup

1. **Clone and install**

   ```bash
   cd dental-voice-agent
   npm install
   ```

2. **Configure environment**

   Copy the example env file and add your VAPI credentials:

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and set:

   - `NEXT_PUBLIC_VAPI_PUBLIC_KEY` — your VAPI public key
   - `NEXT_PUBLIC_VAPI_ASSISTANT_ID` — the ID of the assistant users should talk to

3. **Run locally**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Use **Start call** to begin a voice conversation with the assistant.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build for production
- `npm run start` — run the production build
- `npm run lint` — run ESLint

## Hosting

Build and run in production:

```bash
npm run build
npm run start
```

When deploying (Vercel, Netlify, etc.), set the same environment variables in your project’s settings:

- `NEXT_PUBLIC_VAPI_PUBLIC_KEY`
- `NEXT_PUBLIC_VAPI_ASSISTANT_ID`

The app uses only these client-side env vars; no backend or API routes are required for the demo.

## Project structure

- `app/` — Next.js App Router (layout, page, styles)
- `components/` — `VapiVoiceDemo` client component (VAPI Web SDK integration)
- `system_prompt.txt` — reference for the dental front-desk agent behavior (configured in your VAPI assistant)
