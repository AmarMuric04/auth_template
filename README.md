# 🔐 Full Auth Template – Custom JWT + OTP + OAuth (Next.js + Prisma + Supabase)

A modern and secure **authentication template** built with **Next.js**, featuring:

- 🔑 **Custom credentials auth** using **passwordless OTP** (no passwords stored!)
- 🔐 **OAuth support** with **GitHub** and **Google** (via NextAuth)
- ⚙️ **Custom JWT-based system** for credentials auth
- 🧠 A custom-built **AI chatbot** integrated and ready to go
- 🎨 Fully responsive, modern UI
- 🧩 **Supabase** PostgreSQL database with **Prisma ORM**

Designed for scalability and security, this starter gives you everything you need to bootstrap a real-world auth system.

---

## 🚀 Features

- ✅ Passwordless authentication via OTP codes (email-based)
- 🔐 OAuth support with GitHub and Google via NextAuth
- 🔑 Custom credentials login with stateless JWT handling
- 🧠 Integrated AI chatbot (drop-in use or extendable)
- 📱 Fully responsive and mobile-friendly
- 💽 PostgreSQL + Supabase backend with Prisma ORM
- 🧰 Built with **Next.js App Router** and modular component design

---

## 🧱 Tech Stack

| Layer        | Tech            |
|--------------|-----------------|
| Frontend     | Next.js         |
| Backend      | Next.js (API)   |
| Auth (OAuth) | NextAuth        |
| Auth (OTP)   | Custom JWT + OTP |
| DB           | PostgreSQL via Supabase |
| ORM          | Prisma          |
| AI Chatbot   | Custom-built (plug-and-play) |

---

## 🔧 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/amarmuric04/auth-template.git
cd auth-template
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host:port/dbname

# JWT Secrets
JWT_SECRET=your_jwt_secret

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role

# NextAuth (for OAuth)
NEXTAUTH_SECRET=nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Set Up the Database

```bash
npx prisma generate
npx prisma db push
```

> ✅ Schema already included for user, OTP verification, sessions, and chatbot data.

### 5. Seed the Database (Optional)

Use mock data or your own:

```bash
npm run seed
```

### 6. Start the App

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧬 How Authentication Works

### 🔑 OTP-based Credentials (Passwordless)

- Users login with email
- An OTP code is emailed (or mocked in dev)
- OTP is verified and a **JWT** is issued
- Stateless auth: sessions are stored client-side via JWT

### 🧷 OAuth Login

- Handles GitHub and Google using **NextAuth**
- Session strategy can be configured (JWT or DB-based)

---

## 🤖 AI Chatbot

A smart, extendable chatbot built directly into the UI.

- Custom hook/API integration
- Chat log stored in Supabase
- UI is mobile-ready and responsive
- Great for onboarding or user help center

---

## 📁 Project Structure

``
/app                → Next.js App Router pages
/components         → UI and shared components
/lib                → Utilities (auth, jwt, helpers)
/prisma             → Prisma schema and client
/pages/api/auth     → Custom API for OTP + NextAuth
/styles             → Global CSS / Tailwind
/chatbot            → AI bot logic and UI
``

---

## 🔐 Security Notes

- Passwordless auth = more secure and lower friction
- OTP expires after X minutes (configurable)
- JWT is signed with server-only secret
- OAuth tokens never touch your DB directly
- Fully stateless login path with fallback to OAuth

---

## 🧪 Testing

Coming soon:
- Jest for unit tests
- Playwright for E2E
- Auth flow test harness

---

## 📦 Deployment

- One-click deploy to **Vercel**
- Add env variables in Vercel dashboard
- Works with Docker (optional)

---

## 📜 License

MIT

---

Built for modern apps that need secure, scalable, and flexible authentication + AI support.
