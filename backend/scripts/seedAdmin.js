const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dns = require("dns");

require("dotenv").config();

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]);

const User = require("../models/User");

async function seedAdmin() {
    try {
        if (!process.env.MONGO_URI) {
            console.error("Brak MONGO_URI w pliku .env");
            process.exit(1);
        }

        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            console.error("Brak ADMIN_EMAIL lub ADMIN_PASSWORD w pliku .env");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);

        const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
        const password = process.env.ADMIN_PASSWORD;

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("Konto admina juz istnieje");
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await User.create({
            email,
            hasloHash: passwordHash,
            imie: "Admin",
            role: "admin"
        });

        console.log("Konto admina zostalo utworzone");
        process.exit(0);

    } catch (error) {
        console.error("Blad podczas tworzenia admina:", error);
        process.exit(1);
    }
}

seedAdmin();