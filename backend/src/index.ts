import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import chatRoutes from "./routes/chat.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();

  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
