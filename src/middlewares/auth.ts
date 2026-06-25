import { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_KEY || "RicardoSAlmeida";

export const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send({ error: "Token não encontrado" });
    }
    const decoded = jsonwebtoken.verify(token, JWT_SECRET);
    (req as any).usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Token inválido" });
  }
};