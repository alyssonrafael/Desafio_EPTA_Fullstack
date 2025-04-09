import { Request, Response, NextFunction } from "express";

export const validateVehicleInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, plate } = req.body;

  // Verifica se name e plate foram enviados
  if (!name || !plate) {
    res.status(400).json({ error: "Name and plate are required" });
    return;
  }

  // Converte a placa para maiúsculas para fazer validaçao
  const normalizedPlate = plate.toUpperCase();

  // Validação do formato da placa (padrão antigo ou Mercosul)
  const plateRegex = /^[A-Z]{3}\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/;
  if (!plateRegex.test(normalizedPlate)) {
    res.status(400).json({ error: "Invalid plate format" });
    return;
  }

  next();
};

export const validateVehicleIdQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { vehicleId } = req.query;

  if (!vehicleId || isNaN(Number(vehicleId))) {
    res.status(400).json({ error: "Invalid vehicle ID" });
    return;
  }

  next();
};
