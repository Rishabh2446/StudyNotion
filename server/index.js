const express = require("express");
const app = express();

// routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");


const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");

dotenv.config();
const PORT = process.env.PORT || 4000;

// database connect
database.connect();


//middleware
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "https://studynotion-opal-pi.vercel.app",  // your Vercel production URL
];
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow all dynamic Vercel preview URLs
  if (origin && origin.endsWith(".vercel.app")) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  // Allow fixed origins
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// clodinary connection
cloudinaryConnect();

//routes MOUNT
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);

// Stripe requires raw body
app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  require("./controllers/stripeWebhook").stripeWebhookHandler
);
//default route
app.get("/", (req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running..."
    });
})

// activate the server
app.listen(PORT, ()=>{
    console.log(`App is running on the ${PORT}`)
})