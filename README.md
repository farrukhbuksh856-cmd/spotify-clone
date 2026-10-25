# Musicly

> A modern, responsive web music streaming platform built as a portfolio learning project.

🔗 **Live Demo:** [https://spotify-clone-farrukh.netlify.app](https://spotify-clone-farrukh.netlify.app)

---

## ⚠️ Disclaimer

> **Demo project for learning. Not affiliated with Spotify. Do not enter your real Spotify or any real password.**
>
> *Musicly - portfolio project by Farrukh. Not affiliated with Spotify.*

This project was built solely for educational and portfolio demonstration purposes. All branding, logos, and original visual elements are custom and non-affiliated with any third-party streaming services.

---

## 🚀 Features

- **User Authentication:** Secure JWT-based registration and login with role selection (Listener / Artist).
- **Music Player:** Full-featured audio player bar with play/pause, next/previous tracks, seek bar, time display, and volume control.
- **Browse & Discovery:** Browse songs, albums, and curated track listings with instant client-side search.
- **Artist Studio:** Dedicated interface for artists to upload music files (MP3/audio) and organize tracks into custom albums.
- **Responsive Dark Mode UI:** Tailored dark aesthetics, mobile navigation drawer, and fluid transitions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express 5](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **File & Media Storage:** [ImageKit](https://imagekit.io/) & `multer`
- **Deployment:** Netlify Functions (`serverless-http`)

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/farrukhbuksh856-cmd/spotify-clone.git
cd spotify-clone
```

### 2. Install dependencies
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### 3. Environment Variables
Create `.env` inside `Backend/` following `.env.example`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint
```

### 4. Run the development servers
```bash
# Run backend
cd Backend && npm run dev

# In another terminal, run frontend
cd Frontend && npm run dev
```

### 5. Production Build
```bash
npm run build
```

---

## 📄 License & Attribution

Musicly - portfolio project by Farrukh. Not affiliated with Spotify.
Licensed under ISC.
