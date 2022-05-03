import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRouters from "./route/web";
import connectDB from "./config/connectDB";

dotenv.config();
let app = express(); //
//config app

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
app.use(cors());
app.use(cookieParser());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
viewEngine(app);
initWebRouters(app);
connectDB();

let port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server start ${port}`);
});
