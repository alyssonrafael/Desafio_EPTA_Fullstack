import { Request, Response, NextFunction } from "express";

export const validateInputRegiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, name } = req.body;

  // Validações para garntir que estejam presente
  if (!email || !password || !name) {
    res.status(400).json({ error: "Email, password, and name are required" });
    return;
  }

  //validaçao para nome
  if (name.length < 3) {
    res.status(400).json({ error: "Name must be at least 3 characters long" });
    return;
  }

  if (typeof name !== "string") {
    res.status(400).json({ error: "Name must be a string" });
    return;
  }

  // Validação de e-mail simples
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "Invalid email format" });
    return;
  }

  // Validação de senha
  if (typeof password !== "string") {
    res.status(400).json({ error: "Password must be a string" });
  }
  //validaçao do tamanho da senha
  if (password.length < 6) {
    res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
    return;
  }

  next();
};

export const validateInputlogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  // Validações para garantir que estejam presentes
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  // Validação de e-mail simples
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "Invalid email format" });
    return;
  }

  // Validação de senha (mínimo de 6 caracteres)
  if (password.length < 6) {
    res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
    return;
  }

  next();
};
