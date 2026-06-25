import { UsuarioData } from "../data/UsuarioData";
import { TipoUsuario, User } from "../types/types";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_KEY || "RicardoSAlmeida";

export class UsuarioBusiness {
  private usuarioData: UsuarioData;

  constructor(usuarioData?: UsuarioData) {
    this.usuarioData = usuarioData || new UsuarioData();
  }

  public async postarNovoUsuario(nome: string, email: string, senha: string) {
    try {
      const emailVinculado = await this.usuarioData.pegarUsuarioPeloEmailNoBD(email);
      if (emailVinculado) {
        throw new Error("Email já vinculado em um usuário");
      }
      const senhaHash = await bcrypt.hash(senha, 10);
      const tipo: TipoUsuario = "cidadao";
      const newUser = await this.usuarioData.criarUsuarioNoBancoDeDados(
        nome,
        email,
        senhaHash,
        tipo
      );
      return newUser;
    } catch (error: any) {
      throw new Error(error.message || "Erro inesperado");
    }
  }

  public async login(email: string, senha: string) {
    try {
      const emailVinculado = await this.usuarioData.pegarUsuarioPeloEmailNoBD(email);
      if (emailVinculado) {
        const senhaValida = await bcrypt.compare(senha, emailVinculado.senha_hash);
        if (senhaValida) {
          const payload = {
            id: emailVinculado.id,
            papel: emailVinculado.papel,
          };
          const token = jsonwebtoken.sign(payload, JWT_SECRET);
          return token;
        } else {
          throw new Error("Senha inválida!");
        }
      } else {
        throw new Error("Email não existe! Por favor crie uma nova conta.");
      }
    } catch (error: any) {
      throw new Error(error.message || "Erro inesperado");
    }
  }
}