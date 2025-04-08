import express from 'express';
import exemploRoutes from './routes/exampleRouter';

const app = express();
const port = 3333;

app.use(express.json());

// Rotas
app.use('/api', exemploRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});