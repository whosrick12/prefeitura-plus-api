import { connection } from "../dbConnection";
import { TipoUsuario, User } from "../types/types";

export class UsuarioData {
  async pegarUsuarios() {
    try {
      const users = await connection("usuarios").select();
      return users;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async criarUsuarioNoBancoDeDados(nome: string, email: string, senha_hash: string, tipo: TipoUsuario): Promise<Number> {
    try {
      const result = await connection("usuarios").insert({
        nome: nome,
        email: email,
        senha_hash: senha_hash,
        papel: tipo
      });
      return result[0];
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async pegarUsuarioPeloEmailNoBD(userEmail: string) {
    try {
      const userE: User = await connection("usuarios")
        .where({ email: userEmail })
        .first();
      return userE;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async pegarUsuarioPeloIdNoBD(id: number): Promise<User | undefined> {
    try {
      const user: User = await connection("usuarios")
        .where({ id })
        .first();
      return user;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}