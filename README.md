# Task Lingo 📝🌐  
_A multilingual AI-powered task management application._

---

## 🔗 Live Links

- 🚀 **Live App**: [https://task-lingo-tan.vercel.app/](https://task-lingo-tan.vercel.app/)
- 💻 **GitHub Repository**: [https://github.com/Suraj-Sharma-NeoSoft/task-lingo](https://github.com/Suraj-Sharma-NeoSoft/task-lingo)

---

## 📌 Project Overview

**Task Lingo** is an AI-powered to-do application built using **Next.js**, **Supabase**, and **Llama 4-based translation (via Groq Cloud)**. It enables users to manage personal task lists with CRUD functionality, while offering the ability to translate tasks into widely-used global languages. The application supports authenticated multi-user access, ensuring data privacy and secure operations.

---

## ✨ Key Features

- **User Authentication**
  - Secure sign-up, login, and logout via email & password
  - Email verification support using Supabase's built-in templates

- **Task Management**
  - Create, read, update, and delete tasks
  - Mark tasks as complete
  - Inline task editing with autosave 

- **AI Translation**
  - Translate tasks to multiple languages using Llama (via Groq Cloud API)
  - Supported languages: Spanish, French, German, Hindi, Japanese

- **Multi-User Support**
  - User-specific task visibility using Supabase Row-Level Security (RLS)
  - Session-based logout handling

- **UI/UX Enhancements**
  - Toast notifications for user feedback
  - Responsive design with Tailwind CSS
  - Profile modal for future user preferences or password reset

---

## 🛠 Tech Stack

| Tool/Service    | Role                                   |
|-----------------|----------------------------------------|
| **Next.js**     | Frontend framework with App Router     |
| **Supabase**    | Auth, Database, RLS, email verification |
| **TailwindCSS** | Component styling                      |
| **Groq (LLaMA 4)**| LLM-powered task translation           |
| **React Hot Toast** | Real-time user feedback            |

---

## 📂 Project Structure

```bash

task-lingo/
├── lib/
│   └── supabaseClient.ts
├── src/
│   └── app/
│       ├── api/
│       │   └── translate/
│       │       └── route.ts
│       ├── auth/
│       │   └── page.tsx
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── .env.local
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── package-lock.json
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
```
---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Suraj-Sharma-NeoSoft/task-lingo.git
cd task-lingo
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

---

## 🔐 Supabase Configuration

1. Enable **email authentication** under `Authentication → Sign in / Providers`.
2. Configure **email templates** for verification under `Authentication → Emails`.
3. Apply **Row-Level Security (RLS)** on the `todos` table:

```sql
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own todos"
ON todos FOR ALL
USING (auth.uid() = user_id);
```

---

## 🚀 Deployment

This app is fully compatible with **Vercel**:

```bash
vercel --prod
```

Make sure your environment variables are added under Vercel project settings.

---

## 📷 Screenshot

<img width="960" height="486" alt="image" src="https://github.com/user-attachments/assets/74e315e6-55b1-4c82-ae3d-d3edaeda28dd" />

---

## 👤 Author

**Suraj Sharma**
Developed during a technical assessment at **NeoSOFT Technologies**.

---

## 📄 License

This project is licensed under the MIT License.
