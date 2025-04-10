# 🧾 Finhood

**Finhood** is a simple, elegant expense tracker built for early-career professionals to help manage personal budgets with clarity and ease.

![Finhood Logo](/logo.png) <!-- Logo from public directory -->

---

## ✨ Features

- ✅ Sign up / Sign in with email or Google authentication
- ✅ Secure user authentication and session management
- ✅ Add, view, and manage expenses
- ✅ Data securely stored using [Supabase](https://supabase.io)
- ✅ Responsive and clean UI with plain CSS
- ✅ User-specific data access using Supabase RLS

---

## 🚀 Tech Stack

- **Frontend:** React + Vite
- **Authentication:** Supabase Auth
- **Backend as a Service:** Supabase
- **Styling:** Plain CSS
- **Data Storage:** Supabase Database with Row Level Security
- **Deployment:** Vercel / Netlify / GitHub Pages (your choice)

---

## 📦 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/kavyahp/Finhood.git
   cd finhood
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your environment variables**
   Create a `.env` file and add:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the app locally**
   ```bash
   npm run dev
   ```

## 🛠️ Project Structure
```bash
src/
├── components/      # Reusable components like Navbar, ExpenseForm
├── pages/           # Page components like Home, Dashboard, SignUp
├── styles/          # Plain CSS files
├── utils/           # Supabase setup
└── main.jsx         # Entry point
```

## 🔒 Security

All user data is protected using Supabase Row-Level Security (RLS).

Only authenticated users can access their own data.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.
