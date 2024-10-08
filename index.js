const express = require("express");
const app = express();

const cors = require('cors');

app.use(cors({origin : 'https://s0cialize.onrender.com' }));


const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const path = require("path");

dotenv.config();

const mongoURI = process.env.Mongo_URL;

if (!mongoURI) {
  console.error('MongoDB connection string is not defined');
  process.exit(1);
}

mongoose.connect(mongoURI)
.then(()=> console.log("connected!"))
.catch(err => console.error("Failed to connect to MongoDB:", err));

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });

  const upload = multer({ storage: storage });

  app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      return res.status(200).json("File uploded successfully");
    } catch (error) {
      console.error(error);
    }
  });

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute)

// app.get("/",(req, res)=>{
//     res.send("welcome to homepage");
// })

// app.get("/users",(req, res)=>{
//     res.send("welcome to users page");
// })

app.listen(8800,()=>{
    console.log("Backend server is running!");
});
