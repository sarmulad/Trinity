# Trinity Energy - Production Monitoring Platform

Enterprise-grade oil & gas production monitoring and analytics dashboard built with Next.js 16, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Real-time Production Monitoring** - Live dashboards for oil & gas production metrics
- **Well Management** - Comprehensive well status tracking and management
- **Alert System** - Critical alerts and notifications for operational issues
- **Data Visualization** - Ready for AG Charts integration
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

Add your Tago.io credentials:
```env
TAGO_TOKEN=your_tago_token
TAGO_DEVICE_TOKEN=your_device_token
NEXT_PUBLIC_TAGO_API_URL=https://api.tago.io
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 Tago.io Integration

This platform is designed to work with Tago.io for real-time IoT data:

### Setup Steps:

1. Create a [Tago.io](https://tago.io) account
2. Create devices for your wells/sensors
3. Configure variables matching your data structure:
   - `oil_production` (bbl/d)
   - `gas_production` (mcf/d)
   - `pressure` (psi)
   - `temperature` (°F)
   - `status`

4. Add environment variables to your project
5. Use the provided utilities in `lib/tago.ts`

### Example Usage:

```typescript
import { fetchTagoData } from '@/lib/tago'

const data = await fetchTagoData('device-id', {
  variables: ['oil_production', 'gas_production'],
  qty: 100,
})
```

## 📈 AG Charts Integration

The platform includes placeholder components ready for AG Charts:

1. Install AG Charts:
```bash
pnpm add ag-charts-react ag-charts-community
```

2. Use the BaseChart component:
```tsx
import { AgCharts } from 'ag-charts-react'
import { BaseChart } from '@/components/charts/base-chart'

<BaseChart title="Production Trend">
  <AgCharts options={chartOptions} />
</BaseChart>
```

## 🎨 Customization

### Theme

Edit `app/globals.css` to customize colors:
- Dark mode optimized for industrial monitoring
- Blue accent color for primary actions
- Semantic color tokens for consistency

### Navigation

Edit `components/layout/sidebar.tsx` to modify navigation items.

### Dashboard Metrics

Edit `app/(dashboard)/dashboard/page.tsx` to add/modify metrics.

## 📝 TypeScript Types

Comprehensive types are defined in `types/index.ts`:

- `Well` - Well information and production data
- `Alert` - Alert/notification structure
- `ProductionData` - Production metrics
- `TagoDevice` & `TagoVariable` - Tago.io integration
- `AuthUser` & `Permission` - Authentication (ready for implementation)

## 🔒 Authentication

The boilerplate is structured for authentication integration:

1. User types and permissions defined
2. Protected route group pattern in place
3. User menu in TopBar component
4. Ready for integration with:
   - NextAuth.js
   - Supabase Auth
   - Custom auth solution

## 🧪 Best Practices

- **Server Components by Default** - Only use 'use client' when needed
- **Type Safety** - Strict TypeScript mode enabled
- **Accessibility** - ARIA labels and keyboard navigation
- **Performance** - Dynamic imports for heavy components
- **Code Quality** - Consistent formatting and naming conventions

## 📦 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
# Build
docker build -t trinity-energy .

# Run
docker run -p 3000:3000 trinity-energy
```

## 📄 License

MIT License - feel free to use this boilerplate for your projects.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📞 Support

For questions or issues, please open a GitHub issue or contact the maintainers.

---

Built with ❤️ for Trinity Energy
