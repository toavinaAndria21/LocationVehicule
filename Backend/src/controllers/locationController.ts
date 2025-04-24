import { Request, Response } from "express";
import * as locationService from "../services/locationService";

class LocationController {
  
  static async getAllLocations(req: Request, res: Response) {
    try {
      const locations = await locationService.getLocation();
      res.status(200).json(locations);
    } catch (error) {
      res.status(500).json({ error: "Erreur de récupération" });
    }
  }

  static async getLocationById(req: Request, res: Response) {
    const num_loc = Number(req.params.id);
    if (isNaN(num_loc)) {
      return res.status(400).json({ error: "num_loc invalide" });
    }
    try {
      const location = await locationService.getLocationById(num_loc);
      if (!location) {
        return res.status(404).json({ error: "Location non trouvée" });
      }
      res.status(200).json(location);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur de récupération" });
    }
  }

  static async addLocation(req: Request, res: Response) {
    const { nom_loc, design_voiture, nombre_de_jours, taux_journalier } = req.body;
    try {
      const newLocation = await locationService.addLocation({
        nom_loc,
        design_voiture,
        nombre_de_jours,
        taux_journalier,
      });
      res.status(201).json(newLocation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur d'insertion" });
    }
  }

  static async updateLocation(req: Request, res: Response) {
    const num_loc = parseInt(req.params.id);
    const { nom_loc, design_voiture, nombre_de_jours, taux_journalier } = req.body;
    try {
      const updatedLocation = await locationService.updateLocation(num_loc, {
        nom_loc,
        design_voiture,
        nombre_de_jours,
        taux_journalier,
      });
      res.status(200).json(updatedLocation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur de mise à jour" });
    }
  }

  static async deleteLocation(req: Request, res: Response) {
    const num_loc = parseInt(req.params.id);
    try {
      const deleted = await locationService.deleteLocationById(num_loc);
      if (!deleted) {
        return res.status(404).json({ error: "Location non trouvée" });
      }
      res.status(200).json({ message: "Location supprimée avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la suppression" });
    }
  }
}

export default LocationController;
