# ⚡ Stream Engine – Video Management Platform

A high-performance, premium video management and streaming application built with the MERN stack, featuring real-time updates, cloud storage, and robust administrative controls.

---

## 📂 Project Structure

```text
/
├── backend/            # Express.js API
│   ├── src/            # Source code (routes, models, controllers)
│   ├── uploads/        # Local fallback storage
│   └── server.js       # Main entry point
├── frontend/           # React + Vite application
│   ├── src/            # Components, pages, layouts, contexts
│   └── tailwind.config.js
├── README.md           # Original documentation
└── README2.md          # Project summary (this file)
```

## ✨ Key Features
- **Sidebar & Nested Layout**: Collapsible sidebar navigation with real-time active link detection.
- **Multitenancy**: Data isolated by `organizationId`, only accessible by designated users within the same org.
- **Real-Time Storage Enforcement**:
  - Live usage bar on dashboard (Cyan → Orange → Red).
  - Explicit frontend & backend upload blocking at 100% capacity.
- **Admin Control Panel**:
  - Inline storage limit editor – Admins can set custom MB limits per user.
  - Role management, all-video monitoring, and detailed audit logging.
- **Video Processing Pipeline**: Handled via FFmpeg, with status updates via WebSockets.

## 🏁 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env (see README.md for variables)
npm run dev # Starts server on port 5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev # Starts development server on port 5173
```

## 🎨 Design Philosophy
- **Modern Aesthetics**: Premium "cyberpunk" dark mode with glassmorphism and neon accents.
- **Responsiveness**: Fully fluid layout with a dedicated mobile hamburger menu and collapsible sidebar.
- **UX Excellence**: Toast notifications via `react-hot-toast` and smooth CSS transitions.
