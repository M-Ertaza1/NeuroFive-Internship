# Sales Dashboard — Charts + Filters

Week 4, Task 2 for the NeuroFive Solutions Full Stack Web Development
internship: a responsive analytics dashboard with 4 visualizations (3 chart
types + stat cards), fed by server-side aggregated data, with interactive
filters.

## Live demo
- Frontend: [Add your deployed frontend URL here]
- Backend API: [Add your deployed backend URL here]

## Visualizations (4, more than the required 3)
1. **Stat cards** — Total Revenue, Total Orders, Avg. Order Value
2. **Line chart** — revenue over time (monthly)
3. **Bar chart** — revenue by category
4. **Doughnut chart** — revenue by region

## Data & aggregation
Sample sales data (400 records, ~9 months, 5 categories × 4 regions) is
seeded into MongoDB. All aggregation happens **server-side** via a single
MongoDB `$facet` aggregation pipeline (`routes/sales.js`) — the database
computes totals, monthly sums, category sums, and region sums in one query,
rather than the frontend fetching raw rows and summing them in JavaScript.
This is the pattern real dashboards use once data volume grows past what's
reasonable to ship to the browser.

## Interactive filters
- **Category** dropdown
- **Region** dropdown
- **Date range** (from / to)

Changing any filter re-queries the backend with those parameters and all
four visualizations update together. A "Clear filters" link appears once
any filter is active.

## Responsiveness
Charts sit in a CSS grid that collapses from 2 columns to 1 below the `lg`
breakpoint, and every chart uses Chart.js's `responsive: true` +
`maintainAspectRatio: false` inside a fixed-height container, so charts
resize with their container instead of overflowing or becoming unreadable
on narrow screens.

## Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose aggregation pipeline)
- **Frontend**: React (Vite), Chart.js + react-chartjs-2, Tailwind CSS

## Project structure
```
server/
  models/Sale.js        — date, category, region, amount
  seed.js                 — generates 400 sample sales records
  routes/sales.js         — /meta (filter options) + /summary (aggregation)
client/src/
  chartSetup.js            — Chart.js component registration
  api.js
  App.jsx                  — owns filters state, fetches on filter change
  components/
    Filters.jsx
    StatCards.jsx / StatCardsSkeleton.jsx
    RevenueLineChart.jsx
    RevenueBarChart.jsx
    RevenueDoughnutChart.jsx
    ChartsSkeleton.jsx
```

## Running locally

### 1. Backend
```bash
cd server
cp .env.example .env
# paste your MongoDB connection string into .env
npm install
npm run seed   # populates sample data — run this once
npm run dev
```

### 2. Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Testing (for your demo video)
- Load the dashboard — confirm skeleton loaders show briefly before charts
  render
- Change the **Category** filter — confirm all 4 visualizations update
  together (stat cards recalculate, charts re-render)
- Set a narrow **date range** — confirm the line chart shows fewer points
  and totals shrink accordingly
- Resize your browser to a narrow width (or use DevTools mobile view) —
  confirm charts shrink into a single column and stay readable, not
  squished or overflowing
- Pick a filter combination with zero matching records — confirm charts
  show a clean "No data for this filter" message instead of breaking

## Deploying
Render/Railway for the backend (`MONGODB_URI`, `PORT` env vars — remember to
run `npm run seed` once against the deployed database too), Vercel/Netlify
for the frontend (`VITE_API_URL` pointing at the deployed backend).
