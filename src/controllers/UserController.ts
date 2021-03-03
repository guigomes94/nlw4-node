import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import * as yup from "yup";
import { AppError } from "../errors/AppError";

class UserController {
	
	async create(req: Request, res: Response) {
		const { name, email } = req.body;

		const schema = yup.object().shape({
			name: yup.string().required(),
			email: yup.string().email().required()
		});

		if (!(await schema.isValid(req.body))) {
			throw new AppError("Validation Failed!!!");
		}
		
		const users = getCustomRepository(UsersRepository);
		
		const emailAlreadyExists = await users.findOne({ email });
		
		if (emailAlreadyExists) {
			throw new AppError("Email already in use!");
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