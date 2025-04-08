import prisma from "../prisma";
import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/authUtils";
import { generateToken } from "../services/authService";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, name } = req.body;

  try {
    // Verifica se o e-mail já está em uso
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "Email is already in use" });
      return;
    }
    // aguarda a senha ser criptografada
    const hashedPassword = await hashPassword(password);
    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    res.status(201).json({ message: "User created successfully", user });
    return;
  } catch (err) {
    res.status(500).json({ error: "Error creating user" });
    return;
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken({
      userId: user.id,
      name: user.name,
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Error during login" });
  }
};
