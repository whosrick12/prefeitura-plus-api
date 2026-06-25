import { Response, Request, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const chaveSecreta = process.env.JWT_KEY || "RicardoSAlmeida";

export const checkLogin = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authheader = req.headers.authorization;

        if (!authheader) {
            return res.status(401).send({ error: "token não fornecido" });
        }

        const partes = authheader.split(" ");

        if (partes.length !== 2) {
            return res.status(401).send({ error: "token mal formado" });
        }

        const token = partes[1];

        const payload = jsonwebtoken.verify(token, chaveSecreta);

        (req as any).usuario = payload;

        next();

    } catch (error: any) {
        res.status(401).send({ error: "Token inválido ou expirado" });
    }
}

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    const usuarioPayLoad = (req as any).usuario;

    if (!usuarioPayLoad) {
        return res.status(401).send({ error: "usuario não encontrado" });
    }

    if (usuarioPayLoad.papel !== 'funcionario' && usuarioPayLoad.papel !== 'admin') {
        return res.status(403).send({ error: "Acesso negado. Rota restrita a funcionários." });
    }

    next();
}