import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { SurveyController } from "./controllers/SurveyController";

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();

router.post("/users", userController.create);
router.get("/users", userController.listAll);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.listAll);

export { router };