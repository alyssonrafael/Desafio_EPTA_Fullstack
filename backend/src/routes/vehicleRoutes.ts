import { Router } from "express";
import {
  archiveVehicle,
  deleteVehicle,
  editVehicle,
  getallVehicles,
  registerVehicle,
  unarchiveVehicle,
} from "../controllers/vehicleController";
import { autenticarToken } from "../middlewares/authMiddleware";
import {
  validateVehicleIdQuery,
  validateVehicleInput,
} from "../middlewares/VehicleMiddleware";

const router = Router();
//cada rota esta com seus middlewares necessarios e todas
// com o de validaçao do token para garantir que so quem esta logado consiga acessar elas
//rota de criaçao de um novo veiculo
router.post(
  "/register",
  autenticarToken,
  validateVehicleInput,
  registerVehicle
);
//rota para recuperar todos os veiculos
router.get(
    "/get-all",
    autenticarToken,
    getallVehicles
);
//rota para atualizar um veiculo especifico
router.put(
  "/update",
  autenticarToken,
  validateVehicleIdQuery,
  validateVehicleInput,
  editVehicle
);
//rota para arquivar um veiculo
router.put(
    "/archive",
    autenticarToken,
    validateVehicleIdQuery,
    archiveVehicle
);
//rota para des-arquivar um veiculo
router.put(
  "/unarchive",
  autenticarToken,
  validateVehicleIdQuery,
  unarchiveVehicle
);
//rota para deleçao permanete de um veiculo
router.delete(
  "/delete",
  autenticarToken,
  validateVehicleIdQuery,
  deleteVehicle
);

export default router;
