import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";

const app = express();
const port = 8080;

dotenv.config();

mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
