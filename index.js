import express, { json } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/studentMentorMangement.js";

const app = express();
dotenv.config();

//connect database, here mongodb, the database is in the mongodb atlas
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error in connecting Database", error));

//middlewares
app.use(cors());
app.use(json());
app.use(morgan("dev"));

//route middleware
app.use("/api", router);

//listening the app on the server on port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running at ${port}`));
