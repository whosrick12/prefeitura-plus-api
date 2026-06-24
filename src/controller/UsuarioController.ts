import { Response, Request, NextFunction } from "express";
import { UsuarioBusiness } from "../business/UsuarioBusiness";

export class UsuarioController {
  userBusiness = new UsuarioBusiness();

  register = async (req: Request, res: Response) => {
    try {
      const { nome, email, senha } = req.body;
      if (!nome || !email || !senha) {
        return res
          .status(400)
          .send({ error: "Um dos campos não foi inserido!" });
      } else {
        const newUser = await this.userBusiness.postarNovoUsuario(
          nome,
          email,
          senha
        );
        res.status(201).send(newUser);
      }
    } catch (error: any) {
      if (error.message.includes("Email já vinculado em um usuário")) {
        res.status(409).send({ message: error.message });
      } else {
        res.status(500).send({ error: error.message });
      }
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        return res
          .status(400)
          .send({ error: "Um dos campos não foi inserido!" });
      }
      const token = await this.userBusiness.login(email, senha);
      res.status(200).send(token);
    } catch (error: any) {
      console.error("ERRO NO LOGIN:", error);
      if (error.message.includes("Email não existe")) {
        res.status(404).send({ error: error.message });
      } else if (error.message.includes("Senha inválida")) {
        res.status(401).send({ error: error.message });
      } else {
        res.status(500).send({ error: error.message });
      }
    }
  };

  public getProfile = async (req: Request, res: Response) => {
    try {
      const userPayload = (req as any).usuario;
      if (!userPayload) {
        return res.status(500).send({ error: "Payload não existe!" });
      }
      res.status(200).send(userPayload);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  };
}