require("dotenv").config();
const express = require("express");
const documentsRoutes = require("./routes/documents.routes");

const app = express();
app.use(express.json());

app.use("/documents", documentsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Time-Travel DB running on port ${PORT}`);
});
