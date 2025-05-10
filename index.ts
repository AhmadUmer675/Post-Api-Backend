import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./Routes/authroutes";
// import postRoutes from "./Routes/postroutes";
import { syncDatabase } from "./Models/index";

dotenv.config();

const app: Application = express();
// Middleware
app.use(cors());

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/post", postRoutes);

// Parse PORT and fall back to 3000
const PORT: number = parseInt(process.env.PORT ?? "3000", 10);

// Sync database then start server
syncDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error("Database sync failed:", err);
    process.exit(1);
  });

export default app;
