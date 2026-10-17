# AgroShare — Agricultural Machinery Rental & Farm Management Platform

> **Share Equipment. Grow More.**

AgroShare is a modern, responsive web application connecting farmers across Africa (starting with Nigeria) who need affordable access to agricultural machinery with equipment owners who want to earn steady income from underutilized equipment. The platform also provides simple, intuitive tools for managing farm activities and expenses.

---

## 🚀 Key Features

### 1. Hyper-Local Machinery Discovery & Proximity Matching
- **Geographic Proximity Priority:** Equipment discovery is structured around African administrative divisions (**Country → State/Region → Local Government Area (LGA) / District**).
- **Logistics Cost Minimization:** Equipment located in the same Local Government Area (LGA) as the farmer is automatically prioritized in search results, helping reduce heavy haulage and transportation costs.
- **Multi-Parameter Search:** Real-time search across equipment name, machinery type, LGA, state, country, keywords, daily rates, and operator availability.

### 2. Comprehensive Marketplace & Equipment Details
- High-quality listings for tractors, combine harvesters, seed planters, power tillers, boom sprayers, irrigation pumps, and threshers.
- Transparent rental terms: daily/hourly/per-acre rates in Nigerian Naira (₦), Ghanaian Cedi (₵), and Kenyan Shilling (KSh).
- Detail pages featuring image galleries, operator inclusion, fuel/transport terms, technical specifications, and direct booking inquiry modals.

### 3. Role-Based Dashboards & Workflows
- **Farmer Dashboard (`/farmer/dashboard`):**
  - Welcome summary tailored to the farmer's registered community.
  - Active rental tracking with status badges (`Pending`, `Approved`, `In Progress`, `Completed`, `Cancelled`).
  - Farm plot records, activity timeline, and expense summaries.
- **Equipment Owner Dashboard (`/owner/dashboard`):**
  - Host metrics: listed machines, pending inquiries, active rentals, and demo earnings.
  - Instant decision controls to **Accept & Confirm** or **Decline** farmer requests.
  - One-click machine availability toggle (`Available` / `Paused`) and machinery publishing modal.

### 3. Unified Dual-Capability Accounts & Live Dashboard Switching
- **One Account, Full Versatility:** A single user can act as both a **Farmer** (renting machinery, logging farm records) and an **Equipment Owner** (listing machinery, accepting rental requests, collecting earnings) under a single login and unified profile.
- **Independent Capabilities:** Permissions are governed by granular capabilities (`canRentEquipment` and `canListEquipment`), rather than rigid single-role constraints.
- **Instant Workspace Switcher:** Users with dual capabilities can effortlessly toggle between **Farmer View 🌾** and **Owner View 🚜** directly from the desktop sidebar or mobile header without logging out or losing application state.
- **On-Demand Capability Activation:** Single-role accounts can instantly unlock the other capability with 1 click from their Profile page or in-dashboard prompt banners.

### 4. Farm Management & Expense Tracker (`/farmer/farm`)
- Plot tracking with acreage and crop types (Maize, Cassava, Rice, Yam, etc.).
- Activity logs for land preparation, ploughing, planting, fertilizer/pesticide application, and harvesting.
- Seasonal expense tracker with categorical breakdowns (Equipment Rental, Seeds, Fertilizer, Labour, Fuel).

### 5. Inclusive Access: Assisted Booking Service (`/assisted-booking`)
- Designed for rural farmers without smartphones or reliable internet connectivity.
- Farmers or cooperative agents can submit assistance requests for voice callback or field agent matching.

---

## 🔑 Demo Credentials (For Judges & Mentors)

The application is pre-seeded with local demo accounts. You can log in manually or use the **⚡ 1-Click Quick Demo Sign-in** buttons on the [Login page](http://localhost:5173/login):

| Persona | Email / Phone | Password | Capabilities | Default View | Sample Preloaded Data |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dual Farmer & Owner** | `dual@demo.com` *(or `08099887766`)* | `demo1234` | **Both** (Rent & Lease) | Farmer View *(Switchable)* | Owns 3-inch Water Pump, has active tractor booking, 12-acre farm plot |
| **Farmer (Only)** | `farmer@demo.com` *(or `08012345678`)* | `demo1234` | Rent Equipment | Farmer View | 2 rental requests, 8-acre Okonkwo family farm |
| **Equipment Owner (Only)** | `owner@demo.com` *(or `08087654321`)* | `demo1234` | List & Lease Equipment | Owner View | 8 machinery listings across Nigeria & Kenya, incoming booking requests |
| **Farmer (Ghana)** | `kwame@demo.com` *(or `+233244556677`)* | `demo1234` | Rent Equipment | Farmer View | Ashanti region farm setup (GHS ₵) |

> *Note: These are illustrative demo credentials for evaluation. No real passwords or sensitive personal data are processed.*

---

## 🛠️ Technology Stack & Architecture

- **Frontend:** React 19, Vite, JavaScript (JSX)
- **Styling & Design System:** Tailwind CSS with custom agricultural theme tokens (`forest green`, `leaf green`, `warm neutral`, `golden accent`)
- **Routing:** React Router DOM (v7) with `ProtectedRoute` and `RoleGuard`
- **Icons:** Lucide React
- **State Management:** React Context (`AuthContext` and `AppContext`)
- **Data & Service Layer:** **Axios adapter over localStorage** (`src/services/api.js`). Every CRUD operation (equipment, bookings, activities, expenses, user sessions) flows through Axios-compatible requests with realistic network latencies, allowing plug-and-play migration to a backend REST API.

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── layout/          # Navbar, Footer, Sidebar, ProtectedRoute, ScrollToTop
│   ├── shared/          # StatCard, EquipmentCard
│   └── ui/              # Button, Input, Select, Textarea, Modal, StatusBadge, EmptyState
├── context/
│   ├── AuthContext.jsx  # Authentication & session provider
│   └── AppContext.jsx   # Equipment, bookings, farm activities & expenses provider
├── data/
│   ├── africaGeo.js     # Hierarchical geographic data (Nigeria, Ghana, Kenya, etc.)
│   └── mockData.js      # Seed inventory, users, activities & sample bookings
├── layouts/
│   ├── PublicLayout.jsx # Public wrapper with responsive Navbar & Footer
│   └── DashboardLayout.jsx # Authenticated sidebar layout with mobile drawer
├── pages/
│   ├── auth/            # LoginPage, SignupPage
│   ├── equipment/       # EquipmentListPage, EquipmentDetailPage
│   ├── farmer/          # FarmerDashboard, FarmerBookingsPage, FarmManagementPage
│   ├── owner/           # OwnerDashboard, OwnerEquipmentPage, OwnerRequestsPage
│   ├── public/          # LandingPage, AssistedBookingPage, TermsPage, PrivacyPage
│   └── shared/          # ProfilePage
├── services/
│   └── api.js           # Axios-based persistence adapter
└── utils/
    ├── formatters.js    # Currency, dates, phone, initials
    ├── geo.js           # LGA/State/Country proximity scoring & filtering
    └── storage.js       # Safe localStorage wrapper
```

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized bundle will be created in the `dist/` directory.

---

## 🌾 Designed for the African Context
- **Currencies:** Built-in support for Nigerian Naira (₦), Ghanaian Cedi (₵), and Kenyan Shilling (KSh).
- **Proximity-First:** Eliminates prohibitive interstate logistics costs by surfacing machinery closest to the farm gate first.
- **Digital Literacy Inclusive:** High contrast typography, clear status indicators, and dedicated assisted-booking fallback.
