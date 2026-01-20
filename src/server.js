const express = require("express");
const documentsRoutes = require("./routes/documents.routes");
const queryRoutes = require("./routes/query.routes");

const app = express();

app.use(express.json());

// 🔥 THIS LINE IS CRITICAL
app.use("/documents", documentsRoutes);

// 🔥 ADD THIS
app.use("/query", queryRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Time-Travel DB running on port ${PORT}`);
});
