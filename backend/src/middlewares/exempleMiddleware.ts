import { Request, Response, NextFunction } from 'express';

export const exemploMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('Middleware executado!');
  next();
};