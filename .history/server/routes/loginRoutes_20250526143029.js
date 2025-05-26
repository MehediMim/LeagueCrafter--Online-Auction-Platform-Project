const express = require("express");
const jwt = require("jsonwebtoken");
const jwksRsa = require("jwks-rsa");
const dotenv = require("dotenv");


dotenv.config();

const router = express.Router();

const checkJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or malformed Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    const client = jwksRsa({
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    });

    const getKey = (header, callback) => {
        client.getSigningKey(header.kid, (err, key) => {
            if (err) return callback(err);
            const signingKey = key.getPublicKey();
            callback(null, signingKey);
        });
    };

    jwt.verify(
        token,
        getKey,
        {
            audience: process.env.AUTH0_AUDIENCE,
            issuer: `https://${process.env.AUTH0_DOMAIN}/`,
            algorithms: ["RS256"],
        },
        (err, decoded) => {
            if (err) {
                console.error("JWT error:", err);
                return res.status(401).json({ error: "Invalid or expired token" });
            }
            req.user = decoded;
            next();
        }
    );
};

router.get("/login", (req, res) => {
    console.log("Got Signal");
    const { name, email } = req.body;

    res.json({
        message: "Login successful",
        user: {
            name,
            email,
        },
    });
});


module.exports = router;