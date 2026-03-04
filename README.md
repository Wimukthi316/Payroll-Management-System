<div align="center">

# 🏢 PayrollPro

### Enterprise-Grade HR, Payroll & Asset Management System

> A full-stack web application built for modern organizations — manage your workforce, automate payroll calculations, and track every company asset through its complete lifecycle.

<br/>

<!-- Replace with your actual screenshot -->
![Hero Screenshot](https://placehold.co/1200x600/050810/22d3ee?text=PayrollPro+Dashboard&font=montserrat)

<br/>

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

![License](https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-22d3ee?style=for-the-badge)

</div>

---

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Environment Variables](#️-environment-variables)
- [📁 Folder Structure](#-folder-structure)
- [📡 API Endpoints](#-api-endpoints)
- [📜 License](#-license)
- [🤝 Contributing](#-contributing)

---

## ✨ Key Features

### 👥 Employee Management
- Full **Create / Read / Update / Delete** operations on employee records
- Role-based assignment — `Admin`, `HR`, `Accountant`
- Department & contact tracking (email, phone, date joined)
- Real-time search, multi-column sorting, and role filtering
- Inline validation with per-field error feedback

### 💰 Payroll Processing
- **Automated payslip generation** — enter Employee ID + Hours Worked and the system computes everything
- Transparent, regulation-compliant salary breakdown:
  - `Basic Salary` + `Overtime Pay` → **Gross Pay**
  - `EPF Deduction` (8% — employee contribution)
  - `Tax Deduction` (PAYE — automatically calculated)
  - `ETF Contribution` (3% — **employer only**, never deducted from take-home)
  - → **Net Pay**
- Historical payroll ledger with searchable records
- Aggregate payroll analytics surfaced on the Dashboard

### 🖥️ Asset Management — Full Lifecycle
| Module | Capability |
|---|---|
| **Asset Registry** | Register, edit, and search all company assets with categorization, cost, depreciation, and responsible-person tracking |
| **Maintenance** | Schedule and log preventive or corrective maintenance with service providers and costs |
| **Transfers** | Record inter-department or inter-location asset transfers with approval trails |
| **Disposals** | Log asset disposals (Sale, Scrap, Donation) with disposal value and reason |

### 📊 Analytics Dashboard
- Live **KPI cards** — total employees, total assets, net payroll disbursed
- **Interactive bar charts** (Recharts) — payroll trends over time
- Recent activity feeds for employees and payroll

### 🎨 UI / UX
- **Deep dark theme** with glassmorphism cards and gradient accents
- **Fully responsive** — tested across 320 px mobile, tablet, and 1440 px desktop
- React Portal modals — overlays escape any CSS containing block and sit perfectly centered over the full viewport
- Skeleton loaders, toast notifications, and animated tab navigation

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | UI library |
| [Vite](https://vitejs.dev/) | 6 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 3 | Utility-first styling |
| [React Router DOM](https://reactrouter.com/) | 7 | Client-side routing |
| [Axios](https://axios-http.com/) | 1 | HTTP client |
| [Recharts](https://recharts.org/) | 3 | Data visualization |
| [Lucide React](https://lucide.dev/) | 0.57 | Icon library |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Animations |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | ≥ 18 | Runtime |
| [Express](https://expressjs.com/) | 5 | REST API framework |
| [MongoDB](https://www.mongodb.com/) | — | Document database |
| [Mongoose](https://mongoosejs.com/) | 9 | ODM / schema modeling |
| [dotenv](https://github.com/motdotla/dotenv) | 17 | Environment config |
| [cors](https://github.com/expressjs/cors) | 2 | Cross-origin handling |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org/)
- **npm** v9 or higher (bundled with Node.js)
- **MongoDB** — a local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

---

### 1 · Clone the Repository

```bash
git clone https://github.com/your-username/payroll-management-system.git
cd payroll-management-system
```

---

### 2 · Set Up the Backend

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create your environment file (see Environment Variables section below)
cp .env.example .env
# — then edit .env with your MongoDB URI —

# Start the development server (with hot-reload via nodemon)
npm run dev
```

The API will be running at **`http://localhost:5000`**.

---

### 3 · Set Up the Frontend

Open a **new terminal window** and run:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The application will be available at **`http://localhost:5173`**.

---

### 4 · Build for Production

```bash
# From the frontend directory
npm run build

# Preview the production build locally
npm run preview
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory. Use the template below:

```env
# ─── Server ───────────────────────────────────────────────
PORT=5000

# ─── Database ─────────────────────────────────────────────
# Local MongoDB instance:
MONGO_URI=mongodb://localhost:27017/payrollpro

# — OR — MongoDB Atlas connection string:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/payrollpro?retryWrites=true&w=majority
```

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 📁 Folder Structure

```
payroll-management-system/
│
├── backend/                        # Node.js / Express REST API
│   ├── config/                     # Database connection setup
│   ├── controllers/                # Business logic for each module
│   │   ├── employeeController.js
│   │   ├── payrollController.js
│   │   ├── assetController.js
│   │   ├── assetMaintenanceController.js
│   │   ├── assetTransferController.js
│   │   └── assetDisposalController.js
│   ├── models/                     # Mongoose schemas
│   │   ├── Employee.js
│   │   ├── Payroll.js
│   │   ├── Asset.js
│   │   ├── AssetMaintenance.js
│   │   ├── AssetTransfer.js
│   │   └── AssetDisposal.js
│   ├── routes/                     # Express route definitions
│   ├── .env                        # ← you create this (not committed)
│   ├── server.js                   # Entry point
│   └── package.json
│
└── frontend/                       # React / Vite SPA
    ├── public/
    └── src/
        ├── components/             # Shared layout components
        │   ├── Header.jsx
        │   ├── Sidebar.jsx
        │   └── Layout.jsx
        ├── context/                # React context providers
        │   └── AuthContext.jsx
        ├── pages/                  # Full page views
        │   ├── Dashboard.jsx
        │   ├── Employees.jsx
        │   ├── Assets.jsx
        │   ├── Payroll.jsx
        │   ├── Landing.jsx
        │   ├── SignIn.jsx
        │   └── SignUp.jsx
        ├── services/
        │   └── api.js              # Axios API service layer
        ├── App.jsx
        └── main.jsx
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/employees` | List all employees |
| `POST` | `/api/employees` | Create a new employee |
| `PUT` | `/api/employees/:id` | Update an employee |
| `DELETE` | `/api/employees/:id` | Delete an employee |
| `GET` | `/api/assets` | List all assets |
| `POST` | `/api/assets` | Register a new asset |
| `PUT` | `/api/assets/:id` | Update an asset |
| `DELETE` | `/api/assets/:id` | Delete an asset |
| `GET` | `/api/payroll` | List all payroll records |
| `POST` | `/api/payroll/generate` | Auto-generate a payslip |
| `POST` | `/api/payroll` | Manually create a payroll entry |
| `GET` | `/api/asset-maintenance` | List maintenance records |
| `POST` | `/api/asset-maintenance` | Create a maintenance record |
| `GET` | `/api/asset-transfers` | List transfer records |
| `POST` | `/api/asset-transfers` | Record an asset transfer |
| `GET` | `/api/asset-disposals` | List disposal records |
| `POST` | `/api/asset-disposals` | Record an asset disposal |

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for full details.

---

## 🤝 Contributing

Contributions are welcome and appreciated!

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request**

Please follow the existing code style and ensure your changes don't break the build (`npm run build`) before submitting.

---

<div align="center">

Made with tears, ☕, and continuous "It works on my machine" validations.

⭐ **Star this repo** if you found it useful (or if you feel my pain)!

</div>