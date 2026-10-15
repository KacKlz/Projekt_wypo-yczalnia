const express = require("express");
const mongoose = require("mongoose");
const dns = require("dns");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");

require("dotenv").config();

const PORT = process.env.PORT || 3001;

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

if (!process.env.MONGO_URI) {
    console.error("Blad: brak MONGO_URI w pliku .env");
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error("Blad: brak JWT_SECRET w pliku .env");
    process.exit(1);
}

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Polaczono z MongoDB Atlas");
    })
    .catch((error) => {
        console.error("Blad polaczenia z MongoDB:", error);
        process.exit(1);
    });

app.get("/api", (req, res) => {
    res.json({ message: "Backend dziala" });
});

app.listen(PORT, (error) => {
    if (error) {
        console.error("Blad uruchomienia serwera:", error.message);
        process.exit(1);
    }
    console.log(`Serwer dziala na porcie ${PORT}`);
});