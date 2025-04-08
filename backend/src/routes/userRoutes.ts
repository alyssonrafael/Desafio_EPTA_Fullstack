import { Router } from "express";
import { getUser } from "../controllers/userController";
import { autenticarToken } from "../middlewares/authMiddleware";

const router = Router();
// rota para mostrar dados do usuario que esta logado o id
// vem do midleware de autenticaçao uma vez que o token foi validado
router.get("/get-user", autenticarToken, getUser);


export default router;
