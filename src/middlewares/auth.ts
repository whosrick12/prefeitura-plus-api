import { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_KEY || "RicardoSAlmeida";

export const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ error: "Token não encontrado" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({ error: "Token inválido" });
    }

    const decoded = jsonwebtoken.verify(token, JWT_SECRET);
    (req as any).usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Token inválido" });
  }
};

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuario = (req as any).usuario;
    if (!usuario) {
      return res.status(401).send({ error: "Usuário não autenticado" });
    }

    if (usuario.papel !== "admin" && usuario.papel !== "funcionario") {
      return res.status(403).send({ error: "Acesso negado. Apenas administradores podem acessar." });
    }

    next();
  } catch (error) {
    return res.status(500).send({ error: "Erro ao verificar permissões" });
  }
};