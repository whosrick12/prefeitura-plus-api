import { Response, Request } from "express";
import { UsuarioBusiness } from "../business/UsuarioBusiness";

export class UsuarioController {
  userBusiness = new UsuarioBusiness();

  register = async (req: Request, res: Response) => {
    try {
      const { nome, email, senha } = req.body;
      if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Um dos campos não foi inserido!" });
      }
      const newUser = await this.userBusiness.postarNovoUsuario(nome, email, senha);
      res.status(201).json(newUser);
    } catch (error: any) {
      if (error.message.includes("Email já vinculado")) {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        return res.status(400).json({ error: "Um dos campos não foi inserido!" });
      }
      const token = await this.userBusiness.login(email, senha);
      res.status(200).json({ token });
    } catch (error: any) {
      if (error.message.includes("Email não existe")) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes("Senha inválida")) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  public getProfile = async (req: Request, res: Response) => {
    try {
      const userPayload = (req as any).usuario;
      if (!userPayload) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }
      res.status(200).json(userPayload);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public getUsuarioPorId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const usuario = await this.userBusiness.pegarUsuarioPeloId(Number(id));
      
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      
      res.status(200).json({ 
        id: usuario.id, 
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}