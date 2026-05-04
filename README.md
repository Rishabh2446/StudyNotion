# 📚 StudyNotion

StudyNotion is a full-stack EdTech platform that enables users to create, consume, and rate educational content. It provides a seamless and interactive learning experience for students and a powerful content management system for instructors.

---

## 🚀 Features

### 👨‍🎓 For Students:
- Browse and enroll in courses  
- Secure authentication (login/signup)  
- Watch video lectures  
- Add courses to wishlist/cart  
- Rate and review courses  

### 👩‍🏫 For Instructors:
- Create and manage courses  
- Upload lectures and content  
- Track student enrollments  
- Edit/delete courses  

### 🔐 Authentication & Security:
- JWT-based authentication  
- Role-based access control (Student/Instructor/Admin)  
- Secure password hashing  

### 💳 Payment Integration:
- Integrated payment gateway for course purchases  

---

## 🛠️ Tech Stack

### Frontend:
- React.js  
- Tailwind CSS  
- Redux Toolkit  

### Backend:
- Node.js  
- Express.js  

### Database:
- MongoDB (Mongoose)  

### Other Tools:
- Cloudinary (for media storage)  
- Razorpay / Stripe (for payments)  
- JWT (Authentication)  

---

## 📂 Folder Structure

```
StudyNotion/
│
├── client/          # Frontend (React)
├── server/          # Backend (Node + Express)
├── config/          # Configuration files
├── controllers/     # Business logic
├── models/          # Database schemas
├── routes/          # API routes
└── utils/           # Helper functions
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Rishabh2446/StudyNotion.git
cd StudyNotion
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the server folder and add:

```
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run backend:
```bash
npm run dev
```

---

### 3. Setup Frontend
```bash
cd client
npm install
npm start
```

---

## 🌐 API Endpoints (Sample)

- `/api/auth/signup` → Register user  
- `/api/auth/login` → Login user  
- `/api/course` → Create/Get courses  
- `/api/payment` → Handle payments  

---

## 📸 Screenshots

*(Add screenshots of your UI here)*

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## 📧 Contact

**Rishabh Gupta**  
GitHub: https://github.com/Rishabh2446  

---

## ⭐ Acknowledgements

- Inspired by modern EdTech platforms  
- Built for learning and real-world practice  
