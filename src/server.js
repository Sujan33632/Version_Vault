const express = require("express");
const documentsRoutes = require("./routes/documents.routes");

const app = express();

app.use(express.json());

// 🔥 THIS LINE IS CRITICAL
app.use("/documents", documentsRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Time-Travel DB running on port ${PORT}`);
});
