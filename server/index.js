const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
dotenv.config();

const sequelize = require("./src/data/db")
const dummyData = require("./src/data/dummy-data")

const userRouter = require("./src/routers/userRouter");
app.use("/auth", userRouter);
const adminRouter = require("./src/routers/adminRouter");
app.use("/admin", adminRouter);

async function connseq (){
    await sequelize.sync({ force: true });
    await dummyData();
}connseq();


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("PORT   ->   ", PORT)
})