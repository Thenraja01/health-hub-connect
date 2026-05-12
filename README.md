# 🏥 Health Hub — Doctop

<div align="center">

### Modern Full-Stack Telemedicine & Healthcare Management Platform

A scalable healthcare ecosystem connecting **patients**, **doctors**, and **administrators** through secure digital healthcare services.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-ISC-green?style=flat-square" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" />
</p>

</div>

---

## 📌 Overview

**Health Hub (Doctop)** is a modern telemedicine and healthcare management platform designed to streamline digital healthcare services.

The platform provides:

* 👨‍⚕️ Doctor discovery & appointment booking
* 📹 Video, audio, and chat consultations
* 💳 Secure Stripe-based payment processing
* 📄 Digital prescriptions with PDF export
* 📊 Wellness tracking and analytics
* 💼 Doctor earnings & wallet management
* 🛡️ Admin moderation and KYC workflows
* 🔔 Real-time notifications and updates

The ecosystem supports three major user roles:

| Role        | Responsibilities                                          |
| ----------- | --------------------------------------------------------- |
| **Patient** | Book appointments, manage health records, consult doctors |
| **Doctor**  | Manage schedules, prescriptions, patients, and earnings   |
| **Admin**   | Moderate the platform, verify KYC, monitor analytics      |

---

# ✨ Features

## 🩺 Patient Features

* Search and filter doctors by specialization & location
* Real-time appointment booking
* Secure online payments with Stripe Checkout
* Prescription viewing and PDF download
* Wellness score tracking
* Notifications & appointment reminders
* Doctor ratings and reviews
* Consultation history management

---

## 👨‍⚕️ Doctor Features

* Professional onboarding workflow
* Schedule & availability management
* Leave and break management
* Patient consultation dashboard
* Prescription generation with e-signature
* Earnings dashboard & payouts
* Stripe Connect wallet integration
* KYC verification workflow
* Follow-up task management

---

## 🛡️ Admin Features

* Platform-wide analytics dashboard
* User & doctor management
* Revenue tracking
* Doctor approval workflows
* Audit logs & monitoring
* Platform activity tracking

---

## 🔒 Security & Infrastructure

* JWT Authentication + Refresh Tokens
* OTP Email Verification
* Role-Based Access Control (RBAC)
* API Rate Limiting
* Helmet Security Headers
* Request Logging with Winston + Morgan
* Real-Time Communication via Socket.IO
* Secure File Uploads with Multer

---

# 🛠️ Tech Stack

## ⚙ Backend — `health-hub/`

| Technology       | Purpose                     |
| ---------------- | --------------------------- |
| Node.js          | Runtime Environment         |
| Express 5        | REST API Framework          |
| Prisma ORM       | Database Toolkit            |
| MongoDB          | Primary Database            |
| JWT              | Authentication              |
| bcrypt.js        | Password Encryption         |
| Stripe           | Payment Gateway             |
| Socket.IO        | Real-Time Communication     |
| PDFKit           | PDF Prescription Generation |
| Winston + Morgan | Logging                     |
| Helmet           | Security Middleware         |
| Joi              | Request Validation          |
| Multer           | File Upload Handling        |
| Swagger UI       | API Documentation           |

---

## 🎨 Frontend — `health-hub-connect/`

| Technology      | Purpose                  |
| --------------- | ------------------------ |
| React 19        | Frontend Library         |
| TypeScript      | Type Safety              |
| Vite 7          | Build Tool               |
| TailwindCSS 4   | Styling Framework        |
| Redux Toolkit   | Global State Management  |
| Zustand         | Lightweight UI State     |
| React Query     | Server State Management  |
| React Hook Form | Form Handling            |
| Zod             | Schema Validation        |
| Radix UI        | Accessible UI Components |
| Recharts        | Data Visualization       |
| Stripe React    | Payment Components       |

---

# 🏗️ System Architecture

```txt
Client (React + Vite + Tailwind)
                │
                ▼
      REST API + WebSocket
                │
                ▼
      Express Server + Socket.IO
                │
 ┌──────────────┼──────────────┐
 │              │              │
 ▼              ▼              ▼
Auth      Appointments      Payments
Doctors   Prescriptions     Wellness
Admin     Notifications     Reviews
                │
                ▼
         Prisma ORM
                │
                ▼
            MongoDB
                │
                ▼
 External Services (Stripe, SMTP)
```

---

# 📁 Project Structure

```bash
doctop-app/
│
├── health-hub/                    # Backend
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── events/
│   │   ├── jobs/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   ├── routes/
│   │   ├── storage/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── websocket/
│   │   ├── app.js
│   │   └── server.js
│   ├── docs/
│   ├── .env.example
│   └── package.json
│
├── health-hub-connect/            # Frontend
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

# 🚀 Getting Started

## 📋 Prerequisites

Make sure you have installed:

* Node.js >= 18
* npm >= 9
* MongoDB Atlas
* Stripe Account

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/doctop-app.git

cd doctop-app
```

---

## 2️⃣ Backend Setup

```bash
cd health-hub

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Generate Prisma Client
npx prisma generate

# Run development server
npm run dev
```

Backend server runs at:

```txt
http://localhost:5002
```

---

## 3️⃣ Frontend Setup

```bash
cd health-hub-connect

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start development server
npm run dev
```

Frontend server runs at:

```txt
http://localhost:5173
```

---

# 🔐 Environment Variables

## Backend `.env`

```env
DATABASE_URL=
PORT=5002
NODE_ENV=development

JWT_SECRET=
JWT_EXPIRES_IN=7d

STRIPE_SECRET_KEY=

FRONTEND_URL=http://localhost:5173

EMAIL_SERVICE=gmail
EMAIL_USER=
EMAIL_PASS=
```

---

## Frontend `.env`

```env
VITE_API_URL=http://localhost:5002/api
```

---

# 📡 API Reference

All API routes are prefixed with:

```txt
/api
```

| Module           | Endpoint             |
| ---------------- | -------------------- |
| Auth             | `/api/auth`          |
| Doctors          | `/api/doctors`       |
| Doctor Dashboard | `/api/doctor`        |
| Patients         | `/api/patients`      |
| Appointments     | `/api/appointments`  |
| Payments         | `/api/payments`      |
| Prescriptions    | `/api/prescriptions` |
| Hospitals        | `/api/hospitals`     |
| Reviews          | `/api/reviews`       |
| Notifications    | `/api/notifications` |
| Wellness         | `/api/wellness`      |
| Analytics        | `/api/analytics`     |
| Admin            | `/api/admin`         |

### Swagger Documentation

```txt
http://localhost:5002/api-docs
```

---

# 🗄 Database Design

### Core Models

* Users
* Doctors
* Patients
* Hospitals
* Appointments
* Payments
* Prescriptions
* Reviews
* Notifications
* Wellness
* Wallets
* Schedules

---

## Important Enums

| Enum              | Values                        |
| ----------------- | ----------------------------- |
| UserStatus        | ACTIVE, BLOCKED, DELETED      |
| AppointmentStatus | PENDING, CONFIRMED, COMPLETED |
| PaymentStatus     | PENDING, PAID, FAILED         |
| ConsultationType  | VIDEO, AUDIO, CHAT, IN_PERSON |
| ApprovalStatus    | PENDING, APPROVED, REJECTED   |

---

# 🔒 Security Features

* Secure JWT Authentication
* Refresh Token Rotation
* OTP Verification
* Password Hashing with bcrypt
* Role-Based Authorization
* Request Validation
* Rate Limiting
* Helmet Security Protection
* Audit Logging
* Secure Payment Processing

---

# 📊 Platform Modules

| Module         | Description                 |
| -------------- | --------------------------- |
| Authentication | User login/signup & OTP     |
| Doctors        | Doctor profiles & schedules |
| Patients       | Patient dashboard           |
| Appointments   | Slot booking & management   |
| Payments       | Stripe integration          |
| Prescriptions  | PDF prescription generation |
| Reviews        | Ratings & feedback          |
| Wellness       | Health tracking             |
| Analytics      | Admin insights              |
| Notifications  | Real-time alerts            |

---

# 🤝 Contributing

Contributions are welcome.

## Contribution Workflow

```bash
# Fork repository

# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git commit -m "Add new feature"

# Push branch
git push origin feature/your-feature
```

Then open a Pull Request 🚀

---

# 📄 License

This project is licensed under the **ISC License**.

See the `LICENSE` file for more information.

---

# 💙 Acknowledgements

Special thanks to all contributors and open-source technologies powering this platform.

---

<div align="center">

### ⭐ If you found this project useful, give it a star on GitHub!

Built with ❤️ for modern healthcare.

</div>
