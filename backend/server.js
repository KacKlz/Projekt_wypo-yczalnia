const express = require("express");
const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]);

const app = express();

app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Polaczono z MongoDB Atlas");
    })
    .catch((error) => {
        console.error("Blad polaczenia z MongoDB:", error);
    });

app.get("/api", (req, res) => {
    res.json({ message: "Backend dziala" });
});

app.listen(process.env.PORT, () => {
    console.log(`Serwer dziala na porcie ${process.env.PORT}`);
});