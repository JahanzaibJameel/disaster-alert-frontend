# 🚨 Disaster Alert & Community SOS Platform

> **Frontend · Ready to save lives.**  
> A modern, real-time, offline-capable disaster response interface built with Next.js 16, TypeScript, Tailwind CSS, and MapLibre GL.

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![Status](https://img.shields.io/badge/status-active-brightgreen)]()

</div>


---

## ✨ Why This Project?

When disaster strikes, every second counts. This frontend delivers a **blazing-fast, accessible, and resilient** interface that:

- 🆘 Lets citizens **send an SOS** with one tap
- 🗺️ Visualizes **real-time alerts** on an interactive map
- 🤝 Supports **community help requests** and volunteer coordination
- 📡 Works **offline** by queuing SOS calls and syncing later
- 🌍 Supports **multiple languages** (i18n ready)
- ♿ Meets **WCAG 2.1 AA** accessibility standards

Built as a pure frontend, it's ready to connect to any backend (REST, WebSockets, Supabase, Firebase) with minimal effort.

---

# 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#-usage)
  - [Development](#development)
  - [Production Build](#production-build)
  - [Testing](#testing)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

# 🎯 Features

## 🆘 Emergency SOS Flow

- One-tap SOS floating action button (FAB)
- Multi-step wizard:
  - Select emergency type
  - Confirm location
  - Send request
- Optimistic UI updates
- "Help is on the way" confirmation
- Offline SOS queue using IndexedDB
- Automatic sync when connection returns

---

## 🗺️ Interactive Disaster Map

- Powered by **MapLibre GL**
- No API key required
- Real-time disaster markers
- Official emergency alerts
- Supercluster-based marker clustering
- Clickable markers with detailed popups
- Severity color indicators

---

## 📢 Live Alert Feed

- Real-time emergency alerts
- Severity badges
- Filter by:

  - Critical
  - High
  - Medium
  - Low

- Local timer simulation
- WebSocket-ready architecture
- Infinite scroll ready

---

## 🤝 Community Help Board

Users can request:

- 💧 Water
- 🏠 Shelter
- 🚑 Medical Aid
- 🚁 Rescue

Features:

- Status badges
- Geo-aware filtering
- Mock real-time chat
- Ready for Ably / Supabase integration

---

## 🌙 Dark Mode & Accessibility

- System theme detection
- Manual theme switch
- High contrast mode
- Keyboard navigation
- Proper ARIA attributes
- Screen reader friendly
- WCAG 2.1 AA compliant

---

## 📱 Offline & PWA

- Service Worker
- Cached assets
- IndexedDB offline storage
- Installable PWA
- Background sync ready

---

## 🌐 Internationalization

- Built with `next-intl`
- RTL support
- English default
- Easily expandable

---

## 🧪 Testing & Code Quality

- Vitest
- React Testing Library
- Playwright
- ESLint
- Pre-commit linting

---

# 🧰 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 16 (App Router) | SSR, SSG, Edge Runtime |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Modern UI |
| **State** | Zustand + TanStack Query | Client & server state |
| **Maps** | MapLibre GL + Supercluster | Interactive maps |
| **Realtime** | Mock (Ably/Supabase Ready) | Live alerts |
| **Authentication** | Mock UI / NextAuth Ready | Future auth |
| **Forms** | React Hook Form + Zod | Validation |
| **Offline** | Service Worker + Dexie.js | Offline queue |
| **Testing** | Vitest + RTL + Playwright | Full testing |
| **Deployment** | Vercel | Production hosting |

---

# 📁 Project Structure

```text
disaster-alert-frontend/
│
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── screenshot.png
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   ├── sos/
│   │   ├── alerts/
│   │   ├── community/
│   │   └── profile/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── map/
│   │   ├── sos/
│   │   ├── feed/
│   │   └── community/
│   │
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── stores/
│   ├── types/
│   └── utils/
│
├── .github/
│   └── workflows/
│
├── next.config.ts
├── tailwind.config.ts
├── vitest.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js **18+**
- npm **9+**

---

## Installation

```bash
git clone https://github.com/JahanzaibJameel/disaster-alert-frontend.git

cd disaster-alert-frontend

npm install
```

---

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_REALTIME_KEY=
```

All variables are optional.

The application works entirely with mock data.

---

# 💻 Usage

## Development

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Production Build

```bash
npm run build

npm start
```

---

## Testing

```bash
# Unit Tests
npm run test

# End-to-End Tests
npx playwright test
```

---

# 🗺️ Roadmap

| Phase | Focus | Status |
|------|-------|--------|
| Planning & Design | Wireframes, User Flows | ✅ Done |
| Foundation | Routing, Theming, Auth UI | ✅ Done |
| Core Features | SOS, Map, Alert Feed | ✅ Done |
| Community Features | Help Requests & Chat | 🟡 In Progress |
| Offline & PWA | Offline Queue, i18n, Accessibility | 🟡 In Progress |
| Testing | Unit, Integration, Lighthouse | 🟡 In Progress |
| Deployment | CI/CD, Monitoring, Analytics | 🔜 Coming Soon |

---

Backend integration is intentionally simple.

Replace mock APIs inside:

```text
src/lib/api.ts
```

with:

- REST API
- GraphQL
- Supabase
- Firebase
- WebSockets
- Ably

---

# 🤝 Contributing

Contributions are always welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

See the **LICENSE** file for more information.

---

# 🙏 Acknowledgements

Special thanks to the amazing open-source community.

- **shadcn/ui**
- **MapLibre GL**
- **Supercluster**
- **Zustand**
- **TanStack Query**
- **Dexie.js**
- **Playwright**
- **Vitest**
- **Vercel**

---

<p align="center">

### ❤️ Made for a Safer World

Built with passion for emergency response, resilient communities, and open-source collaboration.

**Built by the community. For the community.**

</p>
