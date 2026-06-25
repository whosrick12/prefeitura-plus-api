import express from "express";
import { DenunciaController } from "../controller/DenunciaController";
// Importa os guardiões de segurança que analisamos antes
import { checkLogin, checkAdmin } from "../middlewares/auth";

// Cria um "mini-aplicativo" de rotas isolado.
// Isso permite que no arquivo principal (index.ts/app.ts) você faça: app.use("/denuncias", denunciaRouter)
export const denunciaRouter = express.Router();

// Instancia o Controller para podermos usar seus métodos.
const denunciaController= new DenunciaController();

// GET /denuncias/
// Lista todas as denúncias.
denunciaRouter.get("/", denunciaController.getDenuncia);

// GET /denuncias/estatisticas
denunciaRouter.get(
    "/estatisticas", 
    checkLogin, // 1º Barreira: Tem token válido? (Autenticação)
    checkAdmin, // 2º Barreira: É funcionário? (Autorização/RBAC)
    denunciaController.getEstatisticas);// 3º Ação: Entrega os dados sensíveis.

// GET /denuncias/anonimas
// Lista denúncias sem revelar o autor.
denunciaRouter.get("/anonimas", denunciaController.getDenunciasAnonimas);

// GET /denuncias/fila
// Retorna a lista ordenada por gravidade (algoritmo de prioridade).
denunciaRouter.get("/fila", denunciaController.getFilaPrioridade);

// POST /denuncias/
denunciaRouter.post("/", denunciaController.postDenuncia);

// POST /denuncias/:id/confirmar
// O ":id" é uma variável de caminho (Path Variable).
// Ex: /denuncias/42/confirmar -> O id 42 vai para o req.params.id
denunciaRouter.post("/:id/confirmar",
     checkLogin, // Exige login, pois um "voto" precisa vir de alguém real.
     denunciaController.confirmarDenuncia);

// POST /denuncias/:id/comentarios
denunciaRouter.post("/:id/comentarios", 
    checkLogin, // Exige login para comentar (evita spam anônimo).
    denunciaController.postarComentario);

    denunciaRouter.patch("/:id/status", checkLogin, checkAdmin, denunciaController.atualizarStatus);



