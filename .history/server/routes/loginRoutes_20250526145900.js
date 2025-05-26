import express from "express";
import jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ JWT middleware
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

// ✅ POST /login/login (protected)
router.post("/login", checkJWT, (req, res) => {
  console.log("🔐 Token verified. Got signal from frontend!");

  const { name, email } = req.body;

  res.json({
    message: "Login successful",
    user: {
      name,
      email,
    },
  });
});
router.post("/logout", checkJWT, (req, res) => {
  console.log("🔐 Token verified. Got signal from frontend!");
});

export default router;
