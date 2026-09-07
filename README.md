<div align="center">

  # 🍡 Mochi Store

  **A Modern, High-Performance Full-Stack E-Commerce Web Application**

  [![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
  [![C#](https://img.shields.io/badge/C%23-12.0-239120?style=for-the-badge&logo=csharp&logoColor=white)](https://docs.microsoft.com/en-us/dotnet/csharp/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC292B?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

  <p align="center">
    Mochi Store delivers a premium, seamless online shopping experience featuring a sleek glassmorphic user interface, smooth page transitions, comprehensive catalog management, robust user authentication, and secure checkout capabilities.
  </p>

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Architecture](#-project-architecture)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup (.NET Core Web API)](#1-backend-setup-net-core-web-api)
  - [2. Frontend Setup (React + Vite)](#2-frontend-setup-react--vite)
- [🔌 API Endpoints](#-api-endpoints)
- [🔐 Authentication & Role-Based Access](#-authentication--role-based-access)
- [📜 License](#-license)

---

## 🌟 Overview

**Mochi Store** is built as a production-ready e-commerce solution architected around a decoupled SPA (Single Page Application) frontend and a RESTful backend API. 

- **Frontend Application**: Built with React 19, Vite, and Tailwind CSS v4, offering ultra-fast page rendering, glassmorphic visual aesthetics, dynamic cart state management, and responsive layouts across all device viewports.
- **Backend Service**: Powered by ASP.NET Core Web API with Entity Framework Core and SQL Server, enforcing role-based security via JWT tokens and managing complex transactional workflows for products, carts, orders, and user profiles.

---

## ✨ Key Features

### 🎨 Frontend Experience (React + Vite)
- **Cinematic Glassmorphism Design**: Modern, responsive UI engineered with Tailwind CSS v4 and Framer Motion micro-animations.
- **Dynamic Shopping Cart**: Real-time state persistence, quantity modification, price calculation, and modal cart previews.
- **Product Discovery**: High-definition image display, search filtering, category sorting, and detail views.
- **Interactive User Profile**: Personalized profile dashboards allowing users to view order history and update personal information.
- **Admin Portal**: Fully functional dashboard for managing store inventory (Create, Read, Update, Delete products) and reviewing user orders.

### 🛡️ Backend Capabilities (.NET 8 Web API)
- **JWT Authentication & ASP.NET Identity**: Secure token issuance, hashed passwords, token validation, and claim-based authorization.
- **Role-Based Authorization**: Fine-grained authorization tiers distinguishing regular shoppers from Store Administrators.
- **ORM & Data Persistence**: Entity Framework Core Code-First workflow paired with SQL Server for entity relationships.
- **Media File Management**: Dedicated file upload controller supporting product image asset uploads and local storage hosting.
- **OpenAPI / Swagger Documentation**: Interactive API exploration interface for endpoint testing and integration testing.

---

## 🛠️ Tech Stack

### Frontend Stack
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `v19.2.7` | UI Library & Component Architecture |
| **Vite** | `v8.1.1` | Lightning-fast Build Tool & Dev Server |
| **Tailwind CSS** | `v4.3.2` | Utility-first Modern Styling & Glassmorphic Utilities |
| **Framer Motion** | `v12.42.2` | Fluid Micro-animations & Page Transitions |
| **React Router** | `v7.18.1` | Single Page Application Routing |
| **Axios** | `v1.18.1` | HTTP Client with Request/Response Interceptors |
| **Lucide React** | `v1.23.0` | Modern SVG Icon Suite |

### Backend Stack
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **C# / .NET** | `.NET 8.0` | Core Application Framework & Language |
| **ASP.NET Core Web API**| `8.0` | REST API Architecture & HTTP Pipelines |
| **EF Core** | `8.0` | Database ORM & Code-First Migrations |
| **SQL Server** | `2019 / 2022 / LocalDB` | Relational Database Management System |
| **ASP.NET Core Identity**| `8.0` | Identity, Hashing, and JWT Token Management |
| **Swagger / OpenAPI** | `6.5+` | Interactive API Documentation Interface |

---

## 📁 Project Architecture

```
e-commerce-website-with-local-backend-and-database/
├── 📂 backend-ASP.NET/             # ASP.NET Core 8 Web API Solution
│   ├── 📂 Controllers/             # API Endpoints (Auth, Product, Cart, Order, etc.)
│   ├── 📂 Data/                    # AppDbContext & DB Initializers / Seeders
│   ├── 📂 DTO/                     # Data Transfer Objects for Request/Response Payload
│   ├── 📂 Migrations/              # Entity Framework Core Migrations
│   ├── 📂 Models/                  # Domain Entities (User, Product, CartItem, Order, OrderItem)
│   ├── 📂 Services/                # Business Logic & Utility Services
│   ├── 📜 Program.cs               # Middleware pipeline, Service Registration & CORS
│   └── 📜 appsettings.json         # Database Connection Strings & JWT Config
│
├── 📂 frontend-react/              # React + Vite Single Page Application
│   ├── 📂 public/                  # Static Public Assets
│   ├── 📂 src/
│   │   ├── 📂 api/                 # Axios Instances & API Client Wrappers
│   │   ├── 📂 components/          # Reusable Components (Navbar, ProductCard, Footer, Modal)
│   │   ├── 📂 context/             # Global Context Providers (CartContext, AuthContext)
│   │   ├── 📂 pages/               # Page Views (Home, Shop, Cart, Checkout, Admin, Profile)
│   │   ├── 📜 App.jsx              # Main App Routing & Providers Setup
│   │   └── 📜 main.jsx             # React Application Entry Point
│   ├── 📜 package.json             # NPM Dependencies & Build Scripts
│   └── 📜 vite.config.js           # Vite Server & Plugin Configuration
└── 📜 README.md                    # Project Documentation
```

---

## 🚀 Getting Started

Follow the instructions below to get a local copy up and running on your development machine.

### Prerequisites

Ensure you have the following installed locally:
- **[Node.js](https://nodejs.org/)** (v18.0.0 or higher) & **npm**
- **[.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)**
- **[SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)** (Express edition, LocalDB, or Developer edition)

---

### 1. Backend Setup (.NET Core Web API)

1. **Navigate to the backend directory**:
   ```bash
   cd backend-ASP.NET
   ```

2. **Configure Database Connection String**:
   Open `appsettings.json` and verify your local SQL Server instance connection string:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=.\\SQLEXPRESS;Database=MochiStoreDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
     }
   }
   ```

3. **Apply Database Migrations**:
   Update the database schema automatically using Entity Framework Core CLI:
   ```bash
   dotnet ef database update
   ```

4. **Launch the Web API**:
   ```bash
   dotnet run
   ```
   *The backend server will start running locally at `http://localhost:5273` (or `https://localhost:7088`). You can open `http://localhost:5273/swagger` to inspect the Swagger UI.*

---

### 2. Frontend Setup (React + Vite)

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend-react
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Verify API Configuration**:
   Ensure `src/api/axiosConfig.js` points to your active backend address:
   ```javascript
   import axios from 'axios';

   const API = axios.create({
     baseURL: 'http://localhost:5273/api',
   });

   export default API;
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Access Application**:
   Open your browser and navigate to `http://localhost:5173`.

---

## 🔌 API Endpoints

The Web API exposes clean REST endpoints structured as follows:

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new customer account | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |
| `GET` | `/api/products` | Retrieve all product items in catalog | Public |
| `GET` | `/api/products/{id}` | Retrieve specific product details | Public |
| `POST` | `/api/products` | Create a new product listing | Admin Only |
| `PUT` | `/api/products/{id}` | Update product details | Admin Only |
| `DELETE` | `/api/products/{id}` | Delete product item from store | Admin Only |
| `GET` | `/api/cart` | Get active user's cart contents | User / Admin |
| `POST` | `/api/cart/add` | Add product item to cart | User / Admin |
| `POST` | `/api/orders/checkout` | Process current cart into completed order | User / Admin |
| `GET` | `/api/orders/my-orders` | Fetch past order history for user | User / Admin |
| `POST` | `/api/upload` | Upload product image asset | Admin Only |

---

## 🔐 Authentication & Role-Based Access

- **Standard User**: Can browse products, view details, manage their cart, execute checkout, and view order history.
- **Admin User**: Possesses full administrative rights to add/edit/delete products in the inventory catalog, view all system orders, and upload media assets.
- **Token Handling**: JWT tokens are automatically stored in client state/localStorage and attached via Axios headers to authenticated requests (`Authorization: Bearer <token>`).

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

<div align="center">
  <sub>Built with ❤️ using React 19 & .NET 8</sub>
</div>
