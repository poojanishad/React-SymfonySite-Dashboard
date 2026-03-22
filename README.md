# React Dashboard — Frontend

React 18 + Vite frontend for the Symfony Site Dashboard. Displays 100k+ site records in a paginated table with filtering, sorting, and live stats.

---
## Requirements

- Node.js 18+
- npm
---

## Setup

### 1. Go to frontend folder

```bash
cd react-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API proxy

In `vite.config.js`, the proxy is already set up:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
    }
  }
}
```

> ⚠️ Make sure Symfony backend is running on port **8000** before starting frontend.

---

## Start Dev Server

```bash
npm run dev
```

App available at: **http://localhost:5173**

---

## Available Scripts

| Command           | Description                    |
|-------------------|--------------------------------|
| `npm run dev`     | Start development server       |
| `npm run build`   | Build for production           |
| `npm run preview` | Preview production build       |

---


## Features

- 📊 **Paginated table** — 50 records per page
- 🔍 **Search** by site name or URL
- 🎛️ **Filter** by status, country, category
- 🔃 **Sort** by any column
- 📈 **Stats cards** — total sites, active, avg bounce rate
- ⚡ **Fast** — data served from Symfony cache layer

---

## API Connection

All requests go through Vite proxy to Symfony backend:

```
Frontend (5173) → Vite Proxy → Symfony (8000)
```

Example request made by the app:
```
GET /api/site-records?page=1&perPage=50&status=active
```
---
