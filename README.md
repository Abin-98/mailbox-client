# MailNest 📬

A full-featured web-based email client built with React, powered by Firebase and Redux Toolkit.

## 🚀 Live Demo

[mailbox-client-nu.vercel.app](https://mailbox-client-nu.vercel.app)

---

## ✨ Features

- **Google Sign-In** — Secure authentication via Firebase Auth
- **Compose & Send** — Rich text email editor (Draft.js / react-draft-wysiwyg) with support for multiple recipients
- **Real-time Inbox** — Inbox auto-refreshes every 5 seconds via Firebase Realtime Database
- **Search** — Filter through your inbox with a dedicated search slice
- **Responsive UI** — Built with MUI (Material UI) and React Bootstrap

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6 |
| State Management | Redux Toolkit |
| Auth & Database | Firebase Auth + Firebase Realtime Database |
| UI Components | MUI v6, React Bootstrap 5 |
| Rich Text Editor | Draft.js, react-draft-wysiwyg |
| Notifications | React Toastify |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── assets/          # Images and static files
├── Components/      # Reusable components (NavBar, MailEditor, InboxMail, MailContent)
├── Pages/           # Route-level pages (Home, Signup, Profile)
├── Store/
│   ├── reducers/    # Redux slices (auth, mail, search)
│   └── store.js     # Redux store config
├── App.js
└── FirebaseConfig.js
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js >= 16
- A Firebase project with Auth and Realtime Database enabled

### Installation

```bash
git clone https://github.com/Abin-98/mailbox-client.git
cd mailbox-client
npm install --legacy-peer-deps
```

### Environment Setup

Create a `.env` file in the root with your Firebase config:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Run Locally

```bash
npm start
```

### Build for Production

```bash
npm run build
```

---

## 🚢 Deployment

Deployed on **Vercel**. A `.npmrc` file with `legacy-peer-deps=true` is included to handle peer dependency resolution during build.

---

## 📄 License

MIT
