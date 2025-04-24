import { Router } from "express";
import LocationController from "../controllers/locationController";

const locationRouter = Router();

locationRouter.get("/list", LocationController.getAllLocations);
locationRouter.get("/list/:id", LocationController.getLocationById);
locationRouter.post('/add', LocationController.addLocation);
locationRouter.put('/update/:id', LocationController.updateLocation);
locationRouter.delete("/delete/:id", LocationController.deleteLocation);
  
export default locationRouter;
