import dotenv from "dotenv";
dotenv.config(); // ⚠️ Doit être au tout début

import app from "./app";

const PORT = process.env.PORT || 3000;

console.log("🔧 Environment check:", {
  PGHOST: process.env.PGHOST,
  PGDATABASE: process.env.PGDATABASE,
  PGUSER: process.env.PGUSER,
  PGPORT: process.env.PGPORT,
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
