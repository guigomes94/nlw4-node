import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";

class UserController {
	
	async create(req: Request, res: Response) {
		const { name, email } = req.body;
		
		const users = getCustomRepository(UsersRepository);
		
		const emailAlreadyExists = await users.findOne({ email });
		
		if (emailAlreadyExists) {
			return res.status(400).json({
				error: "Email already in use!"
			});
		}
		
		const user = users.create({
			name, email
		})
		
		await users.save(user);
		
		return res.status(201).json(user);
		
	}
	
	async listAll(req: Request, res: Response) {
		
		const users = getCustomRepository(UsersRepository);
		
		const all = await users.find();
		
		return res.json(all);
		
	}
	
}

export { UserController }