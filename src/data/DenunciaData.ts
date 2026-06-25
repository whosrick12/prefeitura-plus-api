import { connection } from "../dbConnection";

export class DenunciaData {
  async pegarDenuncias() {
    try {
      const denuncias = await connection("denuncias").select();
      return denuncias;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async contarTotalDenuncias() {
    const result = await connection("denuncias").count("* as total");
    return result[0].total;
  }

  async contarPorStatus() {
    const result = await connection("denuncias")
      .select("status")
      .count("* as contagem")
      .groupBy("status");
    return result;
  }

  async contarPorDepartamento() {
    const result = await connection("denuncias")
      .join("tipo_denuncia", "denuncias.tipo_denuncia_id", "tipo_denuncia.id")
      .join(
        "departamentos",
        "tipo_denuncia.departamento_id",
        "departamentos.id"
      )
      .select("departamentos.nome as nome_departamento")
      .count("denuncias.id as contagem")
      .groupBy("departamentos.nome");
    return result;
  }

  async criarDenuncia(denuncia: any) {
    try {
      const result = await connection("denuncias").insert({
        titulo: denuncia.titulo,
        descricao: denuncia.descricao,
        local: denuncia.endereco_denuncia || denuncia.local,
        cidade: denuncia.cidade || null,
        bairro: denuncia.bairro || null,
        rua: denuncia.rua || null,
        numero: denuncia.numero || null,
        status: denuncia.status || "pendente",
        gravidade: denuncia.gravidade || 1,
        usuario_id: denuncia.usuario_id || null,
        tipo_denuncia_id: denuncia.tipo_denuncia_id,
        departamento_id: denuncia.departamento_id || null,
        latitude: denuncia.latitude || null,
        longitude: denuncia.longitude || null,
        imagem_url: denuncia.imagem_url || null,
        anonimo: denuncia.anonimo === true
      });
      return result[0];
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async pegarDenunciaPorId(id: number) {
    try {
      const denuncia = await connection("denuncias").where({ id }).first();
      return denuncia;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async confirmarDenuncia(id: number, usuarioId: number) {
    try {
      const result = await connection("confirmacoes").insert({
        denuncia_id: id,
        usuario_id: usuarioId
      });
      return result[0];
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async postarComentario(denunciaId: number, usuarioId: number, texto: string) {
    try {
      const result = await connection("comentarios").insert({
        denuncia_id: denunciaId,
        usuario_id: usuarioId,
        texto: texto
      });
      return result[0];
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async deletarDenuncia(id: number) {
    try {
      await connection("denuncias").where({ id }).delete();
      return true;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}