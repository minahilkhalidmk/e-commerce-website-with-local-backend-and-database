🍡 Mochi Store
Mochi Store is a premium, full-stack e-commerce web application featuring a stunning glassmorphic UI, robust inventory management, and a secure authentication system.

The project is split into two primary components:

Frontend: A highly polished React application built with Vite, TailwindCSS, and Framer Motion.
Backend: A secure ASP.NET Core Web API using Entity Framework Core, SQL Server, and JWT Authentication.
✨ Features
Frontend (React + Vite)
Cinematic UI/UX: Implements a glassmorphic design system with modern typography and sleek framer-motion page transitions.
E-Commerce Flow: Complete shopping cart functionality, product browsing, and checkout processes.
Admin Dashboard: Dedicated portal for inventory management (CRUD operations on products) and order tracking.
Responsive Design: Fully mobile-optimized layouts using Tailwind CSS.
Backend (ASP.NET Core Web API)
JWT Authentication: Secure login and registration utilizing ASP.NET Core Identity.
Role-Based Authorization: Distinct access levels for regular Users and Admins.
Entity Framework Core: Code-first database migrations using SQL Server.
RESTful Endpoints: Clean, documented endpoints (via Swagger) for Products, Orders, Cart, and Authentication.
🛠️ Tech Stack
Frontend

React 18
Vite
Tailwind CSS
Framer Motion
React Router DOM
Axios
Lucide React (Icons)
Backend

C# / .NET 8.0
ASP.NET Core Web API
Entity Framework Core
SQL Server (LocalDB/Express)
ASP.NET Core Identity
Swagger / OpenAPI
🚀 Getting Started
Prerequisites
Node.js (v18+)
.NET 8.0 SDK
SQL Server Express or LocalDB
1. Setting up the Backend
Open the backend project (forgot.password-API) in Visual Studio or VS Code.
Ensure your appsettings.json has the correct SQL Server connection string:
json

"ConnectionStrings": {
  "DefaultConnection": "Server=.\\SQLEXPRESS;Database=AuthAPI_DB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
Open the Package Manager Console or Terminal and run the database migrations:
bash

dotnet ef database update
Run the application:
bash

dotnet run
(The backend runs on http://localhost:5273 or http://localhost:7088 depending on your launchSettings.json)
Note on Admin Access: On its first run, the API automatically seeds the database with dummy products and assigns the Admin role to minahilkhalid09mk@gmail.com.

2. Setting up the Frontend
Open a new terminal and navigate to the frontend directory (auth-frontend).
Install the dependencies:
bash

npm install
Ensure src/api/axiosConfig.js is pointing to your running backend port:
javascript

baseURL: 'http://localhost:5273/api' // Change to match your backend port!
Start the development server:
bash

npm run dev
Open your browser and navigate to http://localhost:5173.
🔐 Default Accounts
For testing the local environment, you can register a new account on the frontend or use the automatically seeded Admin account:

Admin Dashboard: Accessible only if your JWT token possesses the Admin role.
Standard User: Can browse the collection, add items to the cart, and checkout.
📂 Project Structure Highlights
Frontend
/src/pages - Contains the main views (Home.jsx, AdminDashboard.jsx, Checkout.jsx, etc.)
/src/components - Reusable UI elements (Navbar.jsx, ProductGrid.jsx)
/src/context - React Context providers (CartContext.jsx)
/src/api - Axios interceptors and configuration.
Backend
/Controllers - API route definitions (AuthController.cs, OrderController.cs, ProductController.cs)
/Models - Entity Framework database schemas.
/Data/AppDbContext.cs - Database context and relationship configurations.
Program.cs - Dependency injection, JWT validation setup, and automatic DB seeding.
📝 License
This project is for educational and portfolio purposes. Feel free to fork and modify!
