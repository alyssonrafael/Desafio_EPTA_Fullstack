import { Request, Response } from "express";
import prisma from "../prisma";

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
      //acessando o id do usuario que foi obtido na decodificação do token feita no middleware
      const userId = req.usuario?.userId; 
      //pesquisa se o usuario existe
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });
      //caso nao encontrar 404
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };