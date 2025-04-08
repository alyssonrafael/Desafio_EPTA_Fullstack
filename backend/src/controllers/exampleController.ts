import { Request, Response } from 'express';

export const exemploController = {
  getExemplo: (req: Request, res: Response) => {
    res.send('Exemplo de controlador funcionando!');
  }
};