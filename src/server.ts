import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connection } from "./dbConnection";
import { denunciaRouter } from "./routes/denunciasRouter";
import { usuarioRouter } from "./routes/usuarioRouter";
import { departamentoRouter } from "./routes/departamentoRouter";
import { tipoDenunciaRouter } from "./routes/tipoDenunciaRouter";

dotenv.config();

console.log('JWT_KEY carregado?', process.env.JWT_KEY ? 'SIM' : 'NÃO');
console.log('JWT_KEY valor:', process.env.JWT_KEY);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/denuncias", denunciaRouter);
app.use("/usuarios", usuarioRouter);
app.use("/departamentos", departamentoRouter);
app.use("/tipo-denuncia", tipoDenunciaRouter);

app.get("/", (req, res) => {
    res.json({ message: "API Prefeitura Plus rodando!" });
});

app.listen(port, async () => {
    try {
        await connection.raw("SELECT 1");
        console.log("Conectado ao banco de dados!");
    } catch (error) {
        console.error("Erro ao conectar ao banco:", error);
    }
    console.log(`Servidor rodando na porta ${port}`);
});