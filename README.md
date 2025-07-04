# 🚀 SmartNav Supermarket Suite 

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-13.5+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
</div>

> **A next-generation, AI-powered smart shopping platform for seamless, delightful, and efficient in-store experiences.**

---

## ✨ Vision

**Magic Shopping Assistant** reimagines the in-store shopping journey. By blending AI, real-time navigation, and personalized recommendations, it empowers shoppers to save time, discover new products, and enjoy a magical, stress-free experience—every visit, every aisle.

---

## 🖼️ Demo

![Store Map Demo](https://via.placeholder.com/800x400?text=Store+Map+Demo)
![Recommendations Demo](https://via.placeholder.com/800x400?text=Recommendations+Demo)


---

## 🖼️ Flowchart

![Flow](https://via.placeholder.com/800x400?text=Flowchart)


---

## 🔥 Why Magic Shopping Assistant?
- **AI-Driven Personalization:** Tailored product recommendations based on your preferences and habits.
- **Intelligent Store Navigation:** Visual, interactive maps with real-time pathfinding that avoids obstacles and shelves.
- **Seamless List Management:** Effortlessly add, remove, and track items as you shop.
- **Modern, Responsive UI:** Beautiful, accessible design with instant theme switching.
- **Built for Scale:** Modular, maintainable codebase ready for real-world deployment.

---

## 🌟 Features

- **Interactive Store Map:**
  - Realistic aisles, departments, and obstacles
  - Click to set start/destination; see optimal path
  - Hover tooltips, clear legend, and beautiful gradients
- **Personalized Recommendations:**
  - Trending, deals, favorites, and new products
  - Ratings, discounts, aisle locations, and quick add-to-list
- **Shopping List:**
  - Add/remove items, track progress, and sync with recommendations
- **AI Assistant:**
  - Smart suggestions and contextual help
- **Theme Toggle:**
  - One-click light/dark mode, fully theme-aware
- **Camera Scanner (Demo):**
  - Scan products for instant lookup
- **Mobile-First & Accessible:**
  - Responsive layouts, keyboard navigation, and ARIA support

---

## 🛠️ Tech Stack

**Frontend:**
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

**Backend:**
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)

**AI Services:**
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?logo=tensorflow&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white)

---

## 🚦 Quick Start

### Prerequisites
- Node.js (v16+ recommended)
- npm 

### Installation
```sh
git clone <YOUR_GIT_URL>
cd SmartNav
npm install 
```

### Running Locally
```sh
npm run dev 
```
Visit [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🧭 Usage Guide

- **Theme Toggle:** Click the sun/moon icon in the header to switch themes. Your choice is remembered.
- **Store Map:**
  - Click to set your position and destination.
  - Aisles (A1, A2, ...) and walkable paths are clearly marked.
  - Hover for tooltips; legend explains all symbols.
- **Recommendations:**
  - Filter by All, Trending, Deals, Favorites, or New.
  - Add products to your list or view details.
- **Shopping List:**
  - Add/remove items and track your progress.

---

## 📁 Project Structure

```
SmartNav/
├── public/                # Static assets
├── src/
│   ├── components/        # UI components (StoreMap, ProductRecommendations, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components (Index, NotFound, API)
│   ├── App.tsx            # Main app shell
│   └── main.tsx           # App entry point
├── tailwind.config.ts     # Tailwind CSS config
├── package.json           # Project metadata and scripts
└── ...
```

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---


## 📄 License
[MIT](LICENSE)

