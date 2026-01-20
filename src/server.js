const express = require("express");
const documentsRoutes = require("./routes/documents.routes");
const queryRoutes = require("./routes/query.routes");
const dbLinkRoutes = require("./routes/dbLink.routes");
const trackingRoutes = require("./routes/tracking.routes");

const app = express();

app.use(express.json());

// 🔥 THIS LINE IS CRITICAL
app.use("/documents", documentsRoutes);

// 🔥 ADD THIS
app.use("/query", queryRoutes);

app.use("/link", dbLinkRoutes);
app.use("/track", trackingRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Time-Travel DB running on port ${PORT}`);
});
