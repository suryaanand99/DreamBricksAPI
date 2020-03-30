const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./Routes/userRoutes");
const propertyRouter = require("./Routes/propertyRoutes");

dotenv.config();
const { PORT } = process.env;
const app = express();
require("./db");

app.use(express.json());
//Router
app.use(userRouter);
app.use("/property", propertyRouter);

app.listen(PORT, () => {
  console.log("server running...");
});
