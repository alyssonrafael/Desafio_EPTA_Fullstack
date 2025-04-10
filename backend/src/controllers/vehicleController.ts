import { Request, Response } from "express";
import prisma from "../prisma";
//registra novo veiculo
export const registerVehicle = async (req: Request, res: Response) => {
  try {
    const { name, plate } = req.body;
    const userId = req.usuario?.userId;
    const normalizedPlate = plate.toUpperCase(); //noramalizando a placa em maiusculo


    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    //verifica se o veiculo com a placa solicitada ja existe se sim retorna erro 409 conflito
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { plate: normalizedPlate },
    });

    if (existingVehicle) {
      res.status(409).json({ error: "Vehicle already registered" });
      return;
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        plate: normalizedPlate,
        userId,
      },
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: "error creating vehicle" });
  }
};
//resgatar todos os veiculos do usuario logado
export const getallVehicles = async (req: Request, res: Response) => {
  // usuario que criou o veiculo
  const userId = req.usuario?.userId;
  try {
    // retorna os veiculos do usuario logado
    const vehicles = await prisma.vehicle.findMany({
      where: {
        userId: userId 
      },
    });

    res.status(200).json(vehicles);
    return;
  } catch (error) {
    res.status(400).json({ error: "error fetching vehicles" });
    return;
  }
};
//ediatar veiculo
export const editVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.query;
    const { name, plate } = req.body;
    const id = Number(vehicleId); // garantindo que seja numero ja que req.query é sempre string

    const normalizedPlate = plate.toUpperCase(); //noramalizando a placa em maiusculo

    //verifica se o veiculo ja existe com base na placa normalizada
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        plate: normalizedPlate,
        NOT: { id },
      },
    });

    if (existingVehicle) {
      res.status(409).json({ error: "Vehicle already registered" });
      return;
    }

    const vehicleExists = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicleExists) {
      res.status(404).json({ error: "Vehicle not found" });
      return;
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        name,
        plate: normalizedPlate,
      },
    });

    res.status(200).json(vehicle);
    return;
  } catch (error) {
    res.status(400).json({ error: "Error updating vehicle" });
    return;
  }
};
//arquivar veiculo
export const archiveVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.query;
    const id = Number(vehicleId); // garantindo que seja numero ja que req.query é sempre string

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      res.status(404).json({ error: "Vehicle not found" });
      return;
    }

    if (!vehicle.isActive) {
      res.status(400).json({ error: "Vehicle is already archived" });
      return;
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: { isActive: false },
    });

    res.status(200).json({
      message: "Vehicle archived successfully",
      vehicle: updatedVehicle,
    });
    return;
  } catch (error) {
    res.status(400).json({ error: "Error archiving vehicle" });
    return;
  }
};
//desarquivar veiculo
export const unarchiveVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.query;
    const id = Number(vehicleId); // garantindo que seja numero ja que req.query é sempre string

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      res.status(404).json({ error: "Vehicle not found" });
      return;
    }

    if (vehicle.isActive) {
      res.status(400).json({ error: "Vehicle is already active" });
      return;
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: { isActive: true },
    });

    res.status(200).json({
      message: "Vehicle unarchived successfully",
      vehicle: updatedVehicle,
    });
    return;
  } catch (error) {
    res.status(400).json({ error: "Error unarchiving vehicle" });
    return;
  }
};
//Deletar veiculo
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.query;
    const id = Number(vehicleId); // garantindo que seja numero ja que req.query é sempre string

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      res.status(404).json({ error: "Vehicle not found" });
      return;
    }

    await prisma.vehicle.delete({ where: { id } });

    res.status(200).json({ message: "Vehicle deleted successfully" });
    return;
  } catch (error) {
    res.status(400).json({ error: "Error deleting vehicle" });
    return;
  }
};
