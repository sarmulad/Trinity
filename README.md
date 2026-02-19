# Trinity Energy - Production Monitoring Platform

Enterprise-grade oil & gas production monitoring and analytics dashboard built with Next.js 16, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Real-time Production Monitoring** - Live dashboards for oil & gas production metrics
- **Well Management** - Comprehensive well status tracking and management
- **Alert System** - Critical alerts and notifications for operational issues
- **Data Visualization** - AG Charts integration
- **Dark Mode** - Professional dark theme optimized for 24/7 operations centers
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Type Safety** - Full TypeScript coverage with strict mode
- **Tago.io Integration** - Ready for IoT sensor data integration

## 📁 Project Structure

```
├── app/
│   ├── (dashboard)/           # Dashboard route group
│   │   ├── layout.tsx         # Dashboard shell with sidebar
│   │   └── dashboard/         # Dashboard pages
│   │       ├── page.tsx       # Main overview
│   │       └── wells/         # Wells management
│   ├── layout.tsx             # Root layout
│   ├── globals.css            # Global styles & theme
│   └── providers.tsx          # App providers
│
├── components/
│   ├── layout/                # Layout components
│   │   ├── sidebar.tsx        # Navigation sidebar
│   │   ├── top-bar.tsx        # Top navigation bar
│   │   └── page-header.tsx    # Page header component
│   ├── dashboard/             # Dashboard components
│   │   ├── metric-card.tsx    # Metric display cards
│   │   ├── data-table.tsx     # Data table with sorting
│   │   └── empty-state.tsx    # Empty state placeholder
│   ├── charts/                # Chart components
│   │   └── base-chart.tsx     # Chart wrapper (AG Charts ready)
│   └── ui/                    # shadcn/ui components
│
├── lib/
│   ├── utils.ts               # Utility functions
│   ├── formatters.ts          # Data formatting utilities
│   ├── constants.ts           # App constants
│   └── tago.ts                # Tago.io integration
│
├── types/
│   └── index.ts               # TypeScript type definitions
│
└── hooks/                     # Custom React hooks
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.7 (Strict Mode)
- **Styling:** Tailwind CSS 3.4
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Tables:** TanStack Table
- **Theme:** next-themes
- **Charts:** Ready for AG Charts React

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd trinity-energy-dashboard
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

```

Built with ❤️ for Trinity Energy
```
