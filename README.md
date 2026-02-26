# 🌾 AgriContract — Digitizing Contract Farming Agreements

> A web-based platform that bridges the gap between **farmers** and **factories** through secure, transparent, and enforceable digital farming contracts.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Functionality](#pages--functionality)
  - [Landing Page](#1-landing-page-indexhtml)
  - [Farmer Dashboard](#2-farmer-dashboard-farmerhtml)
  - [Factory Dashboard](#3-factory-dashboard-factoryhtml)
- [Data Flow & Architecture](#data-flow--architecture)
- [How It Works](#how-it-works)
- [Styling & Theming](#styling--theming)
- [Future Scope / Roadmap](#future-scope--roadmap)
- [Getting Started](#getting-started)

---

## Overview

**AgriContract** is a frontend prototype for a contract farming platform. It allows factories to post crop procurement contracts and farmers to browse and apply to those contracts. Factories can then review, approve, or reject farmer applications — all through a clean, responsive web interface. Data persists across sessions using the browser's `localStorage`.

---

## Problem Statement

Traditional farming agreements suffer from several critical issues:

| Challenge               | Description                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| **Price Uncertainty**    | Fluctuating market rates create financial instability for farmers.          |
| **Payment Delays**       | Manual processing leads to unpredictable cash flows.                       |
| **Informal Agreements**  | Verbal contracts offer no legal protection for either party.               |
| **Lack of Transparency** | Opacity in grading and quality checks breeds mistrust.                     |

AgriContract aims to solve these by providing a digital platform for creating, managing, and tracking farming contracts.

---

## Features

### 🏭 Factory Portal
- **Create Contracts** — Post new contracts with crop name, quantity (tons), price per unit (₹), duration (months), and description.
- **View My Contracts** — See all created contracts with application counts.
- **Manage Applications** — Review farmer applications with **Approve** / **Reject** actions.

### 🧑‍🌾 Farmer Portal
- **Browse Available Contracts** — View all open contracts with crop images, details, and factory information.
- **Apply to Contracts** — One-click application to any available contract.
- **Track Applications** — View application status (Under Review / Approved / Rejected) in a tabular format.
- **Dashboard Stats** — At-a-glance cards showing Active Contracts, Pending Applications, and Available Contracts.

### 🌐 Landing Page
- **Hero Section** — Call-to-action with navigation to both portals.
- **Problem Section** — Highlights challenges in traditional farming.
- **Solution Section** — Showcases platform capabilities (Digital Contracts, Smart Payments, Quality Analytics, Dispute Resolution).
- **Workflow Section** — Visual 4-step process (Post → Apply → Sign → Track & Pay).
- **Future Scope Section** — Roadmap items (Escrow, Insurance, Analytics, Compliance).
- **Responsive Navbar** — Desktop navigation + collapsible mobile menu.

### 🔔 General
- **Toast Notifications** — Contextual feedback messages on user actions.
- **Persistent Data** — All contracts and applications survive page refreshes via `localStorage`.
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile devices.
- **Duplicate Application Prevention** — Farmers cannot apply to the same contract twice.

---

## Tech Stack

| Technology               | Usage                                                      |
|--------------------------|------------------------------------------------------------|
| **HTML5**                | Page structure and semantic markup                         |
| **Tailwind CSS (CDN)**   | Utility-first styling for `index.html` and `farmer.html`  |
| **Custom CSS**           | Component-based styles for `factory.html` (`css/style.css`)|
| **Vanilla JavaScript**   | All application logic and DOM manipulation (`js/script.js`)|
| **Google Fonts**         | Inter (landing + farmer pages), Poppins (factory page)     |
| **Material Symbols**     | Google's icon library for UI iconography                   |
| **localStorage**         | Client-side data persistence                               |

> **No build tools, frameworks, or backend required** — simply open in a browser.

---

## Project Structure

```
contractualfarming/
├── index.html          # Landing / marketing page
├── farmer.html         # Farmer dashboard (browse & apply to contracts)
├── factory.html        # Factory dashboard (create contracts & manage applications)
├── README.md           # Project documentation
├── css/
│   └── style.css       # Custom stylesheet for factory dashboard
└── js/
    └── script.js       # Core application logic (shared across pages)
```

---

## Pages & Functionality

### 1. Landing Page (`index.html`)

The public-facing marketing page built with **Tailwind CSS**.

| Section          | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| **Navbar**        | Sticky header with navigation links and Factory/Farmer login buttons. Includes a responsive mobile hamburger menu. |
| **Hero**          | Main headline, description, CTA buttons, and a hero image with a live "Contract Active" progress card overlay. |
| **Problem**       | 4 animated hover cards describing challenges: Price Uncertainty, Payment Delays, Informal Agreements, Lack of Transparency. |
| **Solution**      | 2-column layout with 4 feature cards (Digital Contracts, Smart Payments, Quality Analytics, Dispute Resolution) and a benefits checklist. |
| **Workflow**      | Visual 4-step process with a connecting line on desktop: Factory Posts → Farmer Applies → Approval & Sign → Track & Pay. |
| **Future Scope**  | Roadmap grid: Escrow Services, Crop Insurance, Predictive Analytics, Govt Compliance. |
| **CTA Banner**    | Full-width green call-to-action section with account creation and demo buttons. |
| **Footer**        | Links to Privacy Policy, Terms of Service, and Contact Support. |

### 2. Farmer Dashboard (`farmer.html`)

A full dashboard interface built with **Tailwind CSS**, featuring a fixed sidebar navigation.

| Component                | Description                                                           |
|--------------------------|-----------------------------------------------------------------------|
| **Sidebar**               | Fixed left sidebar with logo, navigation links (Dashboard, Available Contracts, My Applications, Home, Factory Portal), and user profile card (Rajesh Kumar / Kumar Farms). |
| **Mobile Header**         | Collapsible hamburger menu for mobile viewports.                     |
| **Stats Cards**           | 3 metric cards — Active Contracts, Pending Applications, Available Contracts — updated dynamically. |
| **Available Contracts**   | Grid of rich contract cards with crop images, tags, details (quantity, price, duration), and "Apply Now" buttons. |
| **My Applications**       | Responsive data table showing applied contracts with crop thumbnail, factory name, quantity, price, and status badge (Under Review / Approved / Rejected). |
| **Empty States**          | Informative messages when no contracts or applications exist.        |

### 3. Factory Dashboard (`factory.html`)

A functional dashboard built with **custom CSS** (`css/style.css`) and Poppins font.

| Component                | Description                                                           |
|--------------------------|-----------------------------------------------------------------------|
| **Navbar**                | Top navigation bar with links to Home, Farmer, and Factory pages.    |
| **Create Contract Form**  | Form with fields: Crop Name, Quantity (tons), Price per Unit (₹), Duration (months), Description. Validates required fields. |
| **My Contracts**          | Card grid displaying all contracts with details and application counts. |
| **Farmer Applications**   | Card grid showing farmer applications with status badges and Approve/Reject action buttons. Decided applications show a disabled status button. |

---

## Data Flow & Architecture

### Data Model

```
Contract {
  id: Number,
  crop: String,
  quantity: Number,          // in tons
  pricePerUnit: Number,      // in Rs.
  duration: Number,          // in months
  description: String,
  createdBy: String          // factory name
}

Application {
  id: Number,
  contractId: Number,        // references Contract.id
  farmerName: String,
  status: "Applied" | "Approved" | "Rejected"
}
```

### Persistence Layer

- All data is stored in `localStorage` under two keys:
  - `agricontract_contracts` — Array of contract objects
  - `agricontract_applications` — Array of application objects
- On first load, 4 **mock contracts** are seeded (Wheat, Rice, Sugarcane, Cotton) from well-known factories.
- IDs are auto-incremented based on the maximum existing ID.

### Page Detection

The shared `script.js` auto-detects the current page on `DOMContentLoaded` by checking for the presence of specific DOM element IDs:
- `farmerContractsList` → renders farmer dashboard
- `factoryContractsList` → renders factory dashboard

### Crop Configuration

Each crop has a visual configuration mapping for the Tailwind-based farmer cards:

| Crop       | Tag Color  | Image       |
|------------|------------|-------------|
| Wheat      | Orange     | Wheat field |
| Rice       | Green      | Rice paddy  |
| Sugarcane  | Yellow     | Sugarcane   |
| Cotton     | Purple     | Cotton      |
| (Fallback) | Gray       | Default     |

---

## How It Works

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Factory    │         │   localStorage   │         │     Farmer      │
│  Dashboard   │         │                  │         │   Dashboard     │
├─────────────┤         ├──────────────────┤         ├─────────────────┤
│ Create       │──save──▶│ contracts[]      │◀──load──│ Browse          │
│ Contract     │         │                  │         │ Contracts       │
│              │         │                  │         │                 │
│ Review       │◀──load──│ applications[]   │◀──save──│ Apply to        │
│ Applications │         │                  │         │ Contract        │
│              │         │                  │         │                 │
│ Approve /    │──save──▶│ status updated   │◀──load──│ Track           │
│ Reject       │         │                  │         │ Application     │
└─────────────┘         └──────────────────┘         └─────────────────┘
```

1. **Factory creates a contract** → saved to `localStorage`.
2. **Farmer opens dashboard** → loads contracts from `localStorage`, displays available ones.
3. **Farmer applies** → application saved with status `"Applied"`, contract removed from available list.
4. **Factory reviews** → loads applications, clicks Approve/Reject.
5. **Status updates** → saved back, reflected on both dashboards.

---

## Styling & Theming

### Color Palette

| Token               | Value       | Usage                          |
|----------------------|-------------|--------------------------------|
| `primary`            | `#11d411`   | Brand green (buttons, accents) |
| `primary-dark`       | `#0ea60e`   | Hover states                   |
| `primary-light`      | `#e7f3e7`   | Light green backgrounds        |
| `background-light`   | `#f6f8f6`   | Page background                |
| `text-dark`          | `#0d1b0d`   | Primary text                   |
| `--green-dark`       | `#1b5e20`   | Factory page dark green        |
| `--green-medium`     | `#2e7d32`   | Factory page buttons           |

### CSS Architecture

- **Landing + Farmer pages**: Tailwind CSS via CDN with custom `tailwind.config` extending colors, fonts, and border-radius.
- **Factory page**: Traditional CSS with BEM-like naming, CSS custom properties (variables), and component classes (`.card`, `.btn`, `.status-badge`, `.form-group`).
- **Responsive breakpoints**: `768px` (tablet) and `480px` (mobile) in custom CSS; Tailwind's `sm:`, `md:`, `lg:` in utility pages.

---

## Future Scope / Roadmap

| Feature                  | Description                                                              |
|--------------------------|--------------------------------------------------------------------------|
| 🏦 **Escrow Services**    | Hold funds securely until contract terms are met.                        |
| 🛡️ **Crop Insurance**     | Integrated insurance against weather and pest risks.                     |
| 📊 **Predictive Analytics**| AI-driven insights on crop yields and market trends.                    |
| 📜 **Govt Compliance**    | Automated reporting for government subsidies and regulations.            |
| 🔐 **Authentication**     | User login/signup with role-based access (farmer vs factory).            |
| 💾 **Backend Integration** | REST API with database for production-grade data persistence.           |
| 📱 **Mobile App**         | Native or PWA version for on-the-go access.                             |
| ⛓️ **Blockchain**         | Immutable contract records on-chain for maximum trust.                   |

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- No installations, dependencies, or build steps required

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/contractualfarming.git
   cd contractualfarming
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser, or use a local server:
   # Option A: Python
   python3 -m http.server 8000

   # Option B: Node.js (if npx available)
   npx serve .

   # Option C: VS Code Live Server extension
   ```

3. **Navigate to** `http://localhost:8000` (or just open `index.html` directly)

### Quick Test Flow

1. Go to **Factory Dashboard** → Create a new contract.
2. Go to **Farmer Dashboard** → Apply to the contract.
3. Go back to **Factory Dashboard** → Approve or reject the application.
4. Check **Farmer Dashboard** → See the updated status.

### Reset Data

To clear all saved data, open the browser console and run:
```js
localStorage.removeItem('agricontract_contracts');
localStorage.removeItem('agricontract_applications');
location.reload();
```

---

## License

This project is for educational / prototype purposes.

---

<p align="center">
  Made with 💚 for Indian Agriculture
</p>
