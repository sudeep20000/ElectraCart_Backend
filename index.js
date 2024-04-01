const express = require("express");
const app = express();
require("dotenv").config();
require("express-async-errors");

const cors = require("cors");

const connectDB = require("./db/connect");

const authRoutes = require("./routes/auth");
const publicRoutes = require("./routes/public");
const privateRoutes = require("./routes/private");

const authenticateUser = require("./middleware/requireAuth");

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.status(200).json({
    serverTime: new Date(),
    serverName: "ElectraCart",
  });
});
app.use("/auth", authRoutes);
app.use("/v1", publicRoutes);
app.use("/verified", authenticateUser, privateRoutes);

app.use(errorMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
