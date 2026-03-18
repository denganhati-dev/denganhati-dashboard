# Dengan Hati Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Dashboard visualisasi data lingkungan interaktif untuk portofolio [denganhati.com](https://denganhati.com). Menyediakan data kualitas udara dan cuaca real-time untuk referensi media dan NGO.

## 🌟 Fitur

- **🗺️ Peta Interaktif** - Visualisasi kualitas udara dengan marker berwarna berdasarkan AQI
- **📊 Grafik Time Series** - Prakiraan suhu dan tren data lingkungan
- **🌤️ Data Cuaca** - Informasi cuaca real-time dari Open-Meteo
- **💨 Kualitas Udara** - Data AQI, PM2.5, PM10, O3 dari OpenAQ
- **📱 Responsive Design** - Optimized untuk desktop dan mobile
- **⚡ Caching** - 5-10 menit cache untuk performa optimal

## 🚀 Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Maps | Leaflet + React-Leaflet |
| API | OpenAQ, Open-Meteo |

## 📁 Struktur Proyek

```
src/
├── app/
│   ├── api/
│   │   ├── air-quality/     # Proxy API untuk OpenAQ
│   │   └── weather/         # Proxy API untuk Open-Meteo
│   ├── dashboard/           # Halaman dashboard utama
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── maps/               # Komponen peta
│   │   └── MapContainer.tsx
│   └── charts/             # Komponen grafik
│       └── TimeSeriesChart.tsx
├── lib/
│   └── api/                # API clients
│       ├── openaq.ts       # OpenAQ integration
│       └── openmeteo.ts    # Open-Meteo integration
└── types/                  # TypeScript definitions
    ├── air-quality.ts
    └── weather.ts
```

## 🛠️ Instalasi

### Prerequisites
- Node.js 18+
- npm atau yarn

### Setup

1. Clone repository:
```bash
git clone https://github.com/denganhati-dev/denganhati-dashboard.git
cd denganhati-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan development server:
```bash
npm run dev
```

4. Buka [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## 🔌 API Endpoints

### Air Quality
```
GET /api/air-quality?country=ID&city=Jakarta&limit=50
```

### Weather
```
GET /api/weather?lat=-6.2088&lon=106.8456&days=7
```

## 📊 Data Sources

| Data | Source | Update Frequency |
|------|--------|------------------|
| Air Quality | [OpenAQ](https://openaq.org/) | Real-time |
| Weather | [Open-Meteo](https://open-meteo.com/) | Hourly |

## 🎨 AQI Color Reference

| AQI | Category | Color |
|-----|----------|-------|
| 0-50 | Good | 🟢 Green |
| 51-100 | Moderate | 🟡 Yellow |
| 101-150 | Unhealthy for Sensitive | 🟠 Orange |
| 151-200 | Unhealthy | 🔴 Red |
| 201-300 | Very Unhealthy | 🟣 Purple |
| 300+ | Hazardous | 🟤 Maroon |

## 📝 Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint check
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch: `git checkout -b feature/nama-fitur`
3. Commit perubahan: `git commit -m 'feat: deskripsi fitur'`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Buat Pull Request

## 📄 License

MIT License - lihat [LICENSE](LICENSE) untuk detail.

## 🙏 Acknowledgments

- [OpenAQ](https://openaq.org/) - Data kualitas udara global
- [Open-Meteo](https://open-meteo.com/) - API cuaca gratis
- [Leaflet](https://leafletjs.com/) - Library peta interaktif
- [Recharts](https://recharts.org/) - Library grafik React

---

Dibuat dengan ❤️ oleh [Dengan Hati Team](https://denganhati.com)
