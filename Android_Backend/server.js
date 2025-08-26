import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reportRoutes from "./routes/report-routes.js";
import caltrackRoutes from "./routes/caltrack-route.js";
import chatRoute from "./routes/chat-route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "100mb" }));

app.use("/api", chatRoute);
app.use("/api", reportRoutes);

app.use("/api", caltrackRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
