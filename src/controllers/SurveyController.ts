import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";

class SurveyController {
	
	async create(req: Request, res: Response) {
		const { title, description } = req.body;
		
		const surveys = getCustomRepository(SurveysRepository);
		
		// const emailAlreadyExists = await users.findOne({ email });
		
		
		const survey = surveys.create({
			title, description
		})
		
		await surveys.save(survey);
		
		return res.status(201).json(survey);
		
	}
	
	async listAll(req: Request, res: Response) {
		
		const surveys = getCustomRepository(SurveysRepository);
		
		const all = await surveys.find();
		
		return res.json(all);
		
	}
}

export { SurveyController }