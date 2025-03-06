import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
dotenv.config();

import sequelize from "./src/data/db.js";
import dummyData from "./src/data/dummy-data.js";

import userRouter from "./src/routers/userRouter.js";
app.use("/auth", userRouter);
import adminRouter from "./src/routers/adminRouter.js";
app.use("/admin", adminRouter);
import waiterRouter from "./src/routers/waiterRouter.js";
app.use("/waiter", waiterRouter);
import cashRegisterRouter from "./src/routers/cashRegisterRouter.js";
app.use("/cashRegister", cashRegisterRouter);

// async function connseq() {
//   await sequelize.sync({ alter: true });
//   await dummyData();
// }
// connseq();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("PORT   ->   ", PORT);
});
