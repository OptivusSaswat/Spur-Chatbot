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
  // __dirname is backend/dist, go up twice to reach project root
  const frontendPath = path.join(__dirname, "..", "..", "frontend", "dist");

  app.use(express.static(frontendPath));

  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
