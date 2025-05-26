import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import dotenv from 'dotenv';

dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());

const checkJWT=(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send('Missing Authorization header');

    const token = authHeader.split(' ')[1];
    const client = jwksRsa({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  });
}