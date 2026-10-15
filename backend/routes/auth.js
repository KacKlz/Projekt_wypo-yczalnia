const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const { email, haslo: password } = req.body;

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                message: "Nieprawidlowe dane"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Nieprawidlowy adres email"
            });
        }

        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

        if (!hasUppercase || !hasSpecialCharacter) {
            return res.status(400).json({
                message: "Haslo musi zawierac wielka litere i znak specjalny"
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email jest juz zajety"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await User.create({
            email: normalizedEmail,
            hasloHash: passwordHash,
            role: "user"
        });

        return res.status(201).json({
            message: "Uzytkownik zostal utworzony"
        });

    } catch (error) {
        console.error("Blad rejestracji:", error);

        return res.status(500).json({
            message: "Blad serwera"
        });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, haslo: password } = req.body;

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                message: "Nieprawidlowe dane"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(401).json({
                message: "Nieprawidlowy email lub haslo"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.hasloHash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Nieprawidlowy email lub haslo"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.cookie("token", token, cookieOptions);

        return res.json({
            email: user.email,
            imie: user.imie,
            role: user.role
        });

    } catch (error) {
        console.error("Blad logowania:", error);

        return res.status(500).json({
            message: "Blad serwera"
        });
    }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });

    return res.json({
        message: "Wylogowano"
    });
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Brak autoryzacji"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId)
            .select("email imie role");

        if (!user) {
            return res.status(401).json({
                message: "Uzytkownik nie istnieje"
            });
        }

        return res.json({
            email: user.email,
            imie: user.imie,
            role: user.role
        });

    } catch (error) {
        return res.status(401).json({
            message: "Nieprawidlowy lub wygasly token"
        });
    }
});

module.exports = router;