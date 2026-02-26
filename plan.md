🌾 AgriContract MVP Implementation Plan (HTML + CSS + JS)
🎯 Objective

Build a fully working MVP that includes:

Role-based authentication (Farmer / Factory)

Protected dashboards

Contract creation

Contract application

Approval / Rejection workflow

Persistent session management

localStorage-based data persistence

No backend.
No frameworks.
No external database.

🏗 1️⃣ Architecture Overview
Data Stored in localStorage
users: []
contracts: []
applications: []
currentUser: {}
👤 2️⃣ Authentication System
User Model
{
  id: number,
  name: string,
  email: string,
  password: string, // plain text for MVP
  role: "farmer" | "factory"
}
Required Pages
login.html
register.html
farmer.html
factory.html
Authentication Logic

Register user

Save to localStorage

Login user

Save currentUser in localStorage

On dashboard load:

Check if currentUser exists

Check role

Redirect if unauthorized

🔒 3️⃣ Route Protection Logic

Inside every protected page:

const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user || user.role !== "farmer") {
    window.location.href = "login.html";
}

Same logic for factory.

📄 4️⃣ Contract System
Contract Model
{
  id: number,
  crop: string,
  quantity: number,
  price: number,
  duration: number,
  description: string,
  factoryId: number,
  status: "open" | "closed"
}
📝 5️⃣ Application Model
{
  id: number,
  contractId: number,
  farmerId: number,
  status: "Applied" | "Approved" | "Rejected"
}
🔁 6️⃣ Workflow Logic

Factory:

Creates contract

Stored in contracts[]

Visible to farmers

Farmer:

Applies

Stored in applications[]

Prevent duplicate apply

Factory:

Approves / Rejects

Update application status

Update contract if needed

🧠 7️⃣ Session Flow

Login →
Set currentUser →
Redirect based on role →

Logout →
Remove currentUser →
Redirect to login

🎨 8️⃣ UI Adjustments Needed

Add:

Login button in navbar

Logout button in dashboards

User name display

Role display

Error messages for wrong login

agricontract/
│
├── index.html
├── login.html
├── register.html
├── farmer.html
├── factory.html
│
├── css/
│   └── style.css
│
└── js/
    ├── auth.js
    ├── contracts.js
    └── main.js