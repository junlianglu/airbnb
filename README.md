# 🏡 Airbnb Clone – Vacation Rental Platform

A full-featured Airbnb-like vacation rental web application supporting property listing, booking, user authentication, and intelligent assistance. Built with a modern MERN stack and deployed on AWS.

## 🚀 Features

- 🔐 JWT-based user authentication (guest, host, admin)
- 📆 Custom calendar component for booking with dynamic date validation
- 🏠 Host dashboard for listing properties with image uploads
- 📍 Location autocomplete and embedded maps via Google Places API
- 🧠 AI-powered chatbot for property-related Q&A (OpenAI)
- 🔎 Full-text search and recommendations powered by AWS OpenSearch
- 💾 Image uploads to AWS S3, served via CloudFront
- 💳 Booking system with total price calculation, cancellation, and history
- 🔒 Role-based access control and secure route handling

## 🛠 Tech Stack

**Frontend**
- React 18
- React Router
- React Context API
- Custom Components (e.g., `AirbnbDatePicker`)

**Backend**
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT & bcrypt for authentication

**Cloud & APIs**
- AWS S3 + CloudFront (media storage & delivery)
- AWS OpenSearch (listing search)
- Google Places API (location autocomplete)
- OpenAI API (chatbot assistant)

## ⚙️ Setup

```bash
git clone https://github.com/junlianglu/airbnb.git
cd airbnb

# 1️⃣  Backend
cd backend
cp .env.example .env           # add your keys
npm install
npm start &                    # starts on http://localhost:8080
cd ..

# 2️⃣  Frontend
cd frontend
cp .env.example .env           # ensure REACT_APP_API_URL points to your backend
npm install
npm start                    # React server on http://localhost:3000
```

## 🌐 Live Demo

⚠️ Deployment available upon request to prevent abuse and stay within AWS free tier limits.

Feel free to reach out via [LinkedIn](https://linkedin.com/in/junliang-lu) or [email](mailto:junliang.lu.dev@gmail.com) for access.
