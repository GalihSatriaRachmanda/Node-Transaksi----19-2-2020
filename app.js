require("dotenv").config();
const express = require('express')
const app = express();
const userRouter = require("./api/users/user.router")
const barangRouter = require("./api/barang/barang.router")
const transaksiRouter = require("./api/transaksi/transaksi.router")

app.use(express.json())
app.use("/api/users", userRouter)
app.use("/api/barang", barangRouter)
app.use("/api/transaksi", transaksiRouter)


app.listen(process.env.APP_PORT, function(){
    console.log("running on port: "+process.env.APP_PORT)
})
