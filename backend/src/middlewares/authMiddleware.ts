import { Request, Response, NextFunction } from "express";
import { console } from "inspector";
import { verify } from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

// Esta declaração modifica globalmente os tipos do Express
// para adicionar a propriedade 'usuario' ao objeto Request facilitando o acesso ao id do usuario 
declare global {
  namespace Express {
    // Estende a interface original Request do Express
    interface Request {
      // Adiciona a propriedade opcional chamada 'usuario' que:
      // - Contém todos os campos padrão de um JWT (JwtPayload)
      // - Mais um campo obrigatório 'userId' do tipo string para que
      // -seja possivel acessar o id do usuario senpre que o token for validado em uma req que use o middleware de autenticarToken
      usuario?: JwtPayload & { userId: string };
    }
  }
}

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

export const autenticarToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //Extração do token passado no header autorization
    //simplifica o token ja colocando o bearer na frete
    const token = req.headers.authorization?.replace("Bearer ", "");

    //se o token nao for fornecido já retorna erro
    if (!token) {
      res.status(401).json({
        error: "token not provided",
        code: "TOKEN_MISSING",
      });
      return;
    }

    // Verificação do token
    const decoded = verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload & { userId: string };

    // Validação do payload (verificando userId)
    if (typeof decoded !== "object" || !decoded.userId) {
      res.status(401).json({
        error: "Invalid token: incorrect payload",
        code: "INVALID_TOKEN_PAYLOAD",
      });
      return;
    }

    //Adiciona o usuário à requisição para que o id possa ser usado no proximo controller se passar pelo middleware
    req.usuario = {
      ...decoded,
      userId: decoded.userId, // Garantindo que userId está presente
    };

    next();
  } catch (error) {
    //validações de erro caso o token seja invalido ou expirado
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({
          error: "Token expired",
          code: "TOKEN_EXPIRED",
        });
        return;
      }

      if (error.name === "JsonWebTokenError") {
        res.status(401).json({
          error: "Invalid token",
          code: "INVALID_TOKEN",
        });
        return;
      }
    }
    // erro generico caso o erro nao esteja sendo tratado
    console.error("AUTHENTICATION ERROR:", error);
    res.status(500).json({
      error: "AUTHENTICATIONERROR",
      code: "AUTHENTICATION_ERROR",
    });
    return;
  }
};
