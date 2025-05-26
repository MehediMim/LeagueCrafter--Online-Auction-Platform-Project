import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const checkJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send('Missing Authorization header');

    const token = authHeader.split(' ')[1];

    const client = jwksRsa({
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    });

    const getKey = (header, cb) => {
        client.getSigningKey(header.kid, function (err, key) {
            const signingKey = key.getPublicKey();
            cb(null, signingKey);
        });
    };

    jwt.verify(token, getKey, {
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ['RS256'],
    }, (err, decoded) => {
        if (err) return res.status(401).send('Token invalid');
        req.user = decoded;
        next();
    });
};

app.get('/api/private', checkJWT, (req, res) => {
  res.json({
    message: 'Welcome to the protected route!',
    user: req.user,
  });
});

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});

