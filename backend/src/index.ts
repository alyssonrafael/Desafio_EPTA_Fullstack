import express from 'express';
import authRoutes from "./routes/authRoutes";
import prisma from "./prisma"; // Importando a instância do Prisma Client
import dotenv from "dotenv";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3333;

dotenv.config();

// configuraçao do CORS atualmente liberando todas as origens
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.use(express.json());
// Rotas
app.use('/api/auth', authRoutes );

// Função para testar a conexão
const testConnection = async () => {
  try {
    // Conectando ao banco
    await prisma.$connect();
    console.log("Conexão estabelecida com sucesso!");
    // Desconectando do banco
    await prisma.$disconnect();
    console.log("Desconectado do banco. Teste concluído!");
  } catch (err) {
    console.error("Erro ao conectar ou realizar operação no banco:", err);
  }
};

// Rodando o teste de conexão e operações
testConnection();

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});