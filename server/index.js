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

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      // allow localhost
      if (origin === "http://localhost:3000") {
        return callback(null, true);
      }

      // allow ALL Vercel domains (prod + preview)
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 IMPORTANT: handle preflight correctly
app.options("/*", cors());

// clodinary connection
cloudinaryConnect();

//routes MOUNT
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);

// // Stripe requires raw body
// app.post(
//   "/api/v1/payment/webhook",
//   express.raw({ type: "application/json" }),
//   require("./controllers/stripeWebhook").stripeWebhookHandler
// );
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